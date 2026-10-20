import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const checkOnly = process.argv.includes('--check');
const publicEntries = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'assets'];
const requiredFiles = [...publicEntries, 'package.json'];

const fail = message => {
  throw new Error(message);
};

for (const entry of requiredFiles) {
  if (!existsSync(join(root, entry))) fail(`Required source is missing: ${entry}`);
}

const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const full = join(directory, entry.name);
  if (entry.isDirectory()) return walk(full);
  return [full];
});

const repositoryFiles = readdirSync(root, { withFileTypes: true })
  .filter(entry => !['.git', 'dist', 'node_modules'].includes(entry.name))
  .flatMap(entry => entry.isDirectory() ? walk(join(root, entry.name)) : [join(root, entry.name)]);

const forbiddenNames = /(^|[\\/])\.env(?:\.|$)|\.(?:pem|key|p12|pfx)$/i;
for (const file of repositoryFiles) {
  if (forbiddenNames.test(relative(root, file))) fail(`Sensitive file must not be committed: ${relative(root, file)}`);
}

const publishableFiles = publicEntries.flatMap(entry => {
  const full = join(root, entry);
  return statSync(full).isDirectory() ? walk(full) : [full];
});

const textExtensions = new Set(['.html', '.css', '.js', '.xml', '.txt', '']);
const forbiddenContent = [
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["'][^"']{8,}["']/i,
  /(?:localhost|127\.0\.0\.1|file:\/\/|[A-Z]:\\Users\\)/i
];

for (const file of publishableFiles) {
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbiddenContent) {
    if (pattern.test(content)) fail(`Forbidden production content in ${relative(root, file)}: ${pattern}`);
  }
}

const resolvePublicReference = (sourceFile, reference) => {
  const clean = reference.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return join(root, 'index.html');
  return clean.startsWith('/') ? join(root, clean.slice(1)) : resolve(dirname(sourceFile), clean);
};

const htmlNames = publishableFiles
  .filter(file => extname(file).toLowerCase() === '.html')
  .map(file => relative(root, file));
const indexableCanonicals = new Set();
const indexableTitles = new Set();

for (const htmlName of htmlNames) {
  const htmlFile = join(root, htmlName);
  const html = readFileSync(htmlFile, 'utf8');
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]));
  if (htmlName !== '404.html') {
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1].trim();
    const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1].trim();
    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1].trim();
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1].trim();
    const h1Count = [...html.matchAll(/<h1(?:\s|>)/gi)].length;
    if (!title || !description || !canonical || !ogUrl) fail(`Incomplete SEO metadata in ${htmlName}`);
    if (!canonical.startsWith('https://novabotmu.com/')) fail(`Unexpected canonical origin in ${htmlName}`);
    if (canonical !== ogUrl) fail(`Canonical and og:url differ in ${htmlName}`);
    if (h1Count !== 1) fail(`Expected one H1 in ${htmlName}, found ${h1Count}`);
    if (indexableTitles.has(title)) fail(`Duplicate SEO title in ${htmlName}`);
    if (indexableCanonicals.has(canonical)) fail(`Duplicate canonical URL in ${htmlName}`);
    indexableTitles.add(title);
    indexableCanonicals.add(canonical);
  }
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference)) continue;
    if (reference.startsWith('#')) {
      if (!ids.has(reference.slice(1))) fail(`Missing anchor ${reference} in ${htmlName}`);
      continue;
    }
    const target = resolvePublicReference(htmlFile, reference);
    if (!existsSync(target)) fail(`Broken local reference in ${htmlName}: ${reference}`);
  }
  for (const match of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    const reference = match[1];
    if (/^(?:https?:|data:)/i.test(reference)) continue;
    const target = resolvePublicReference(htmlFile, reference);
    if (!existsSync(target)) fail(`Broken inline CSS asset reference in ${htmlName}: ${reference}`);
  }
}

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
for (const canonical of indexableCanonicals) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail(`Canonical URL is absent from sitemap.xml: ${canonical}`);
}

const cssFile = join(root, 'assets', 'presentation.css');
const css = readFileSync(cssFile, 'utf8');
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const reference = match[1];
  if (/^(?:https?:|data:)/i.test(reference)) continue;
  const target = resolve(dirname(cssFile), reference.split('?')[0]);
  if (!existsSync(target)) fail(`Broken CSS asset reference: ${reference}`);
}

const index = readFileSync(join(root, 'index.html'), 'utf8');
const jsonLd = index.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
if (!jsonLd) fail('JSON-LD block is missing from index.html');
JSON.parse(jsonLd);
const jsonLdHash = createHash('sha256').update(jsonLd).digest('base64');
const headers = readFileSync(join(root, '_headers'), 'utf8');
if (!headers.includes(`'sha256-${jsonLdHash}'`)) fail('CSP hash does not match the JSON-LD block');

for (const specialFile of ['_headers', '_redirects']) {
  const content = readFileSync(join(root, specialFile));
  if (content.includes(13)) fail(`${specialFile} must use LF line endings`);
}

const redirectLines = readFileSync(join(root, '_redirects'), 'utf8').split('\n')
  .map(line => line.trim()).filter(line => line && !line.startsWith('#'));
for (const line of redirectLines) {
  const parts = line.split(/\s+/);
  if (parts.length !== 3 || parts[2] !== '301') fail(`Invalid permanent redirect: ${line}`);
}

if (!checkOnly) {
  const resolvedDist = resolve(dist);
  if (resolvedDist !== join(root, 'dist') || !resolvedDist.startsWith(`${root}${sep}`)) fail('Unsafe output directory');
  rmSync(resolvedDist, { recursive: true, force: true });
  mkdirSync(resolvedDist, { recursive: true });
  for (const entry of publicEntries) cpSync(join(root, entry), join(resolvedDist, entry), { recursive: true });
}

const totalBytes = publishableFiles.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`${checkOnly ? 'Validated' : 'Built'} ${publishableFiles.length} public files (${totalBytes} bytes).`);
