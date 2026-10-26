# NovaBot SEO migration: GitHub Pages to novabotmu.com

The previous indexed site is `https://riabov2.github.io/novabot/`. The only production canonical origin after launch will be `https://novabotmu.com/`.

## Verified search value

Owner-supplied Google Search Console data for the previous site reports about 1,600 clicks, 8,470 impressions, 18.8% CTR and average position 4.5 over three months. The top queries include `mu immortal bot`, `mu monarch bot`, `bot key mu monarch`, `mu monarch bot key`, `bot mu immortal`, `mu bot`, `mu monarch bot key free`, `bot para mu immortal`, `mu monarch sea bot` and `mu online bot`.

Because the old property still receives traffic, the redirect-only GitHub Pages release is a launch gate. Do not disable the old Pages site or replace it with a second copy of the new website.

## Complete old-to-new URL map

| Previous URL | New destination |
| --- | --- |
| `/novabot/` and `/novabot/index.html` | `https://novabotmu.com/` |
| `/novabot/mu/` | `https://novabotmu.com/` |
| `/novabot/about/` | `https://novabotmu.com/#overview` |
| `/novabot/character-list/` | `https://novabotmu.com/#overview` |
| `/novabot/activities-settings/` | `https://novabotmu.com/#events` |
| `/novabot/bot-settings-13/` | `https://novabotmu.com/#character` |
| `/novabot/elf-minion-settings/` | `https://novabotmu.com/#hunting` |
| `/novabot/get-coordinates/` | `https://novabotmu.com/#hunting` |
| `/novabot/map/` | `https://novabotmu.com/#hunting` |
| `/novabot/map-settings/` | `https://novabotmu.com/#hunting` |
| `/novabot/grab-store/` | `https://novabotmu.com/#inventory` |
| `/novabot/installation-download/` | `https://novabotmu.com/#settings` |
| `/novabot/mu-bot-keys/` | `https://novabotmu.com/#settings` |
| `/novabot/others-settings/` | `https://novabotmu.com/#settings` |
| `/novabot/pvp/` | `https://novabotmu.com/#pvp` |
| `/novabot/contact-us/` | `https://novabotmu.com/#contact` |
| `/novabot/terms-and-conditions/` | `https://novabotmu.com/` until owner-approved legal content exists on the new domain |

The source list was checked against the files in `origin/main`. `_redirects` implements the equivalent path redirects when those paths are requested on the new Cloudflare origin.

## GitHub Pages limitation and prepared solution

Cloudflare cannot return an HTTP redirect for `riabov2.github.io` because that hostname is served by GitHub. GitHub Pages is static hosting and the current project-site arrangement does not provide per-route server-side 301 rules.

The local command below builds a minimal redirect-only Pages artifact:

```powershell
npm run build:migration
```

`migration-dist/` contains one small page for every mapped old route. Each page has:

- a canonical URL on `novabotmu.com`;
- an instant `meta refresh` to the final destination;
- a JavaScript `location.replace` fallback;
- a normal link for users without scripting;
- an old-origin sitemap for migration monitoring.

Google documents instant `meta refresh` as a permanent redirect signal when server-side redirects are unavailable. It remains a fallback to a real 301, so the migration must be monitored carefully. Do not configure `novabotmu.com` as a GitHub Pages custom domain because production remains on Cloudflare Pages.

At launch, publish only the contents of `migration-dist/` to the branch selected as the GitHub Pages source. Never publish the full new site on both hostnames.

## Search Console procedure

1. Keep the existing `https://riabov2.github.io/novabot/` URL-prefix property verified.
2. Verify the `novabotmu.com` Domain property using the DNS TXT value provided by Google.
3. Deploy and validate the new Cloudflare site before changing the old Pages content.
4. Submit `https://novabotmu.com/sitemap.xml` in the new property.
5. Publish the generated redirect-only artifact to GitHub Pages and submit `https://riabov2.github.io/novabot/sitemap.xml` in the old property for migration monitoring.
6. Inspect the old root, old `/mu/`, new root and the `/mu-immortal-bot/` redirect.
7. Compare clicks, impressions, queries, indexing and crawl errors weekly for at least 12 weeks.
8. Keep the redirects for at least one year and preferably indefinitely.

The Change of Address tool is not expected to apply: the old property is a project path under the shared `github.io` domain rather than a domain-level site that the owner controls. Use URL mapping, redirect signals, canonicals and sitemaps instead.

## Product support limitation

The previous site claimed MU Monarch and MU Ascension support, and several high-performing queries concern MU Monarch. The current verified product and Hub content describe MU Immortal. No MU Monarch or MU Ascension landing page is created until the owner confirms that the current product still supports those games and supplies accurate capabilities. Launching without that confirmation may reduce rankings for those queries, but publishing unsupported claims would be misleading.
