# NovaBot production launch

## Architecture

- Static HTML5 presentation: `index.html` and `404.html`.
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
