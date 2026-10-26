import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'migration-dist');
const oldOrigin = 'https://riabov2.github.io/novabot';

const routes = new Map([
  ['', 'https://novabotmu.com/'],
  ['index.html', 'https://novabotmu.com/'],
  ['mu', 'https://novabotmu.com/'],
  ['about', 'https://novabotmu.com/#overview'],
  ['character-list', 'https://novabotmu.com/#overview'],
  ['activities-settings', 'https://novabotmu.com/#events'],
  ['bot-settings-13', 'https://novabotmu.com/#character'],
  ['elf-minion-settings', 'https://novabotmu.com/#hunting'],
  ['get-coordinates', 'https://novabotmu.com/#hunting'],
  ['map', 'https://novabotmu.com/#hunting'],
  ['map-settings', 'https://novabotmu.com/#hunting'],
  ['grab-store', 'https://novabotmu.com/#inventory'],
  ['installation-download', 'https://novabotmu.com/#settings'],
  ['mu-bot-keys', 'https://novabotmu.com/#settings'],
  ['others-settings', 'https://novabotmu.com/#settings'],
  ['pvp', 'https://novabotmu.com/#pvp'],
  ['contact-us', 'https://novabotmu.com/#contact'],
  ['terms-and-conditions', 'https://novabotmu.com/']
]);

const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const redirectPage = target => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>NovaBot has moved</title>
  <link rel="canonical" href="${escapeHtml(target)}">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>NovaBot has moved to <a href="${escapeHtml(target)}">${escapeHtml(target)}</a>.</p>
</body>
</html>
`;

const resolvedOutput = resolve(output);
if (resolvedOutput !== join(root, 'migration-dist') || !resolvedOutput.startsWith(`${root}${sep}`)) {
  throw new Error('Unsafe migration output directory');
}
rmSync(resolvedOutput, { recursive: true, force: true });
mkdirSync(resolvedOutput, { recursive: true });

for (const [route, target] of routes) {
  const path = route === '' || route === 'index.html' ? join(resolvedOutput, route || 'index.html') : join(resolvedOutput, route, 'index.html');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, redirectPage(target), 'utf8');
}

writeFileSync(join(resolvedOutput, '404.html'), redirectPage('https://novabotmu.com/'), 'utf8');
writeFileSync(join(resolvedOutput, '.nojekyll'), '', 'utf8');
writeFileSync(join(resolvedOutput, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${oldOrigin}/sitemap.xml\n`, 'utf8');

const oldUrls = [...new Set([...routes.keys()].filter(route => route !== 'index.html').map(route => `${oldOrigin}/${route ? `${route}/` : ''}`))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${oldUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(resolvedOutput, 'sitemap.xml'), sitemap, 'utf8');

for (const [route] of routes) {
  const path = route === '' || route === 'index.html' ? join(resolvedOutput, route || 'index.html') : join(resolvedOutput, route, 'index.html');
  if (!existsSync(path)) throw new Error(`Missing generated redirect: ${route || '/'}`);
}

console.log(`Built ${routes.size} GitHub Pages migration redirects in migration-dist.`);
