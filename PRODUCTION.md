# NovaBot production launch

## Architecture

- Static HTML5 pages: homepage, MU Immortal landing page and custom 404.
- Styling: one local CSS file plus Google Fonts.
- Client behavior: one dependency-free JavaScript file for navigation state and presentation controls.
- Public assets: local PNG, JPG and WebP files under `assets/`.
- Backend: none in this repository.
- Authentication and live product functions: external Customer Hub at `https://app.novabotmu.com/novabot/`.
- Environment variables: none.
- Production host: Cloudflare Pages. Workers and Pages Functions are unnecessary.

The build script copies only the public allowlist into `dist/`. Repository documentation, scripts, Git metadata and local files are not published.

## Local commands

```powershell
npm run check
npm run build
npm run build:migration
python -m http.server 4173 --directory dist
```

Open `http://127.0.0.1:4173/` for the production-output preview. `dist/` is generated and ignored by Git.

## GitHub

- Existing remote: `https://github.com/riabov2/novabot.git`
- Reviewed remote production branch: `main`
- Prepared changes branch: `redesign-2026`
- No push or merge is performed during preparation.

After review, publish through a pull request from `redesign-2026` into `main`. Cloudflare Git integration will deploy every accepted push to `main`; other branches receive preview deployments.

Future update commands:

```powershell
git checkout redesign-2026
git pull --ff-only origin redesign-2026
npm run check
npm run build
git status
git add --all
git commit -m "Describe the website update"
git push origin redesign-2026
```

Review the Cloudflare preview, then merge the pull request into `main`.

## Cloudflare Pages settings

| Setting | Value |
| --- | --- |
| Repository | `riabov2/novabot` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | `/` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variables | None |

### Phase 1 preview controls

- Keep **automatic production branch deployments disabled**.
- Set preview branch control to **Custom branches** and include only `redesign-2026`.
- Do not attach `novabotmu.com`, `www`, `app` or `api` to this Pages project during Phase 1.
- Enable the Pages preview Access policy before sharing the preview URL.
- `_headers` explicitly returns `X-Robots-Tag: noindex` for `*.pages.dev` and versioned preview hosts; Cloudflare also applies this header to preview deployments by default.
- Test the immutable commit URL, then record that commit SHA as the release candidate.

If an existing project was created with Direct Upload, do not try to convert it to Git integration. Create a separate Git-integrated Pages project for the marketing site or continue using controlled Direct Upload; Cloudflare does not support switching a project from Git integration to Direct Upload later.

Attach `novabotmu.com` as the Pages custom domain only after the preview deployment passes. Cloudflare provisions HTTPS automatically. Keep Always Use HTTPS enabled. `_headers` supplies security and browser-cache policy; `_redirects` supplies permanent path migration.

## DNS

The domain already delegates to Cloudflare nameservers. At launch, use the Pages **Custom domains** flow for `novabotmu.com`; it creates or validates the required proxied apex record. Its target is the actual Pages project hostname assigned by Cloudflare, so do not invent it in advance.

If `www.novabotmu.com` is required, attach it as a second Pages custom domain and create a Cloudflare Redirect Rule from `www` to the apex. Do not modify the existing `app` and `api` hostnames used by the Customer Hub and Gateway.

## Google Search Console

1. Add a Domain property for `novabotmu.com`.
2. Add the Google-provided DNS TXT verification record in Cloudflare DNS.
3. Submit `https://novabotmu.com/sitemap.xml`.
4. Inspect and request indexing for `https://novabotmu.com/`.
5. Keep the previous GitHub Pages property verified during migration.
6. Confirm that Google sees the canonical URL, Open Graph metadata and HTTP 301 path redirects.

No verification token is stored in this repository. DNS verification keeps the token outside the public frontend.

## Manual authorization still required

1. Review the local diff and production build.
2. Push `redesign-2026` and open/merge the pull request into `main`.
3. Connect `riabov2/novabot` to Cloudflare Pages.
4. Configure the old GitHub Pages origin for the hostname migration described in `MIGRATION.md`. Existing Search Console traffic makes this a launch gate.
5. Attach `novabotmu.com` and allow the Pages custom-domain flow to create the DNS record.
6. Add the Search Console verification TXT record and submit the sitemap.

No GitHub push, Cloudflare project creation, DNS change or production deployment is performed by the preparation work.

## Controlled GO LIVE sequence

1. Confirm the exact tested commit SHA and immutable Cloudflare preview URL.
2. Confirm that the Pages production build uses `npm run build` and publishes `dist` with no environment variables.
3. Enable one production deployment for the approved SHA while the custom domain remains detached.
4. Verify the Pages production URL, headers, routes and assets.
5. Attach `novabotmu.com` through Pages Custom domains; do not modify `app.novabotmu.com` or `api.novabotmu.com`.
6. Verify HTTPS, canonical metadata, sitemap, 404 handling and Customer Hub links on the public domain.
7. Generate `migration-dist/` from the same release commit and publish only that folder to the GitHub Pages source branch.
8. Verify every old mapped URL reaches its final new destination and no full duplicate site remains.
9. Submit the new sitemap and begin the Search Console monitoring procedure in `MIGRATION.md`.
10. Tag the released commit only after the public smoke test succeeds.

## Rollback

If the marketing deployment fails, use Cloudflare Pages deployment history to roll back the production alias to the last verified deployment or detach the new custom domain record if this is the first release. Keep the GitHub Pages redirect release unchanged until the new domain is healthy again; if the new domain is unavailable during the initial cutover, restore the previous GitHub Pages commit so users are not sent to a broken destination. Do not change the Customer Hub, API or Gateway DNS records.

## Production routes

| Route | Purpose |
| --- | --- |
| `/` | Main NovaBot platform presentation |
| `/mu-immortal-bot/` | Permanent redirect to `/` |
| `/404.html` | Branded not-found page, excluded from indexing |

Do not add MU Monarch or MU Ascension pages until current support is confirmed. The historical query risk and redirect method are documented in `SEO-AUDIT.md` and `MIGRATION.md`.
