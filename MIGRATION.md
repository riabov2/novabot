# NovaBot URL migration map

The previous public site used `https://riabov2.github.io/novabot/`. The production canonical origin is `https://novabotmu.com/`.

## Indexed URLs confirmed before launch

| Previous URL | New destination | Reason |
| --- | --- | --- |
| `/novabot/` | `https://novabotmu.com/` | Main NovaBot presentation |
| `/novabot/mu/` | `https://novabotmu.com/#overview` | Current MU automation overview |

## Other routes present in the previous repository

| Previous path | New destination |
| --- | --- |
| `/about/` | `/#overview` |
| `/character-list/` | `/#overview` |
| `/activities-settings/` | `/#events` |
| `/bot-settings-13/` | `/#character` |
| `/elf-minion-settings/` | `/#hunting` |
| `/get-coordinates/` | `/#hunting` |
| `/map/` | `/#hunting` |
| `/map-settings/` | `/#hunting` |
| `/grab-store/` | `/#market` |
| `/installation-download/` | `/#connect` |
| `/mu-bot-keys/` | `/#connect` |
| `/others-settings/` | `/#settings` |
| `/pvp/` | `/#pvp` |
| `/contact-us/` | `/#contact` |

These path redirects are implemented in `_redirects` for the new Cloudflare Pages origin. The old Terms & Conditions page has no equivalent in the current approved site and is intentionally not redirected to unrelated content.

## Old GitHub Pages hostname

Cloudflare cannot emit redirects for the `riabov2.github.io` hostname because Cloudflare does not control that origin. Before launch, keep GitHub Pages enabled long enough to point the old site to `https://novabotmu.com/`, or publish a minimal redirect-only branch there. Verify both the old GitHub Pages property and the new domain property in Google Search Console. Do not remove the old property until Google has processed the canonical migration.

Search Console data supplied before launch confirms that the previous property still has valuable impressions, clicks and first-page positions. Treat the old-host redirect as a launch gate: do not abandon the GitHub Pages origin or remove its Search Console property while Google is transferring signals to the new canonical domain.
