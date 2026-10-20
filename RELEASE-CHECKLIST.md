# NovaBot two-phase release checklist

## Phase 1: staging only

- [x] Production build has an explicit public allowlist.
- [x] Local build, syntax, metadata, sitemap, redirect map, secret scan, desktop and mobile checks pass.
- [x] Customer Hub target returns HTTP 200.
- [x] GitHub Pages redirect-only artifact builds separately from the production site.
- [ ] Push the reviewed `redesign-2026` commit to the private GitHub repository.
- [ ] Create or connect a Cloudflare Pages project without a custom domain.
- [ ] Set build command `npm run build`, output `dist`, root `/`, no environment variables.
- [ ] Disable automatic production branch deployments.
- [ ] Allow preview builds only from `redesign-2026`.
- [ ] Enable Cloudflare Access for preview deployments.
- [ ] Confirm the preview response includes `X-Robots-Tag: noindex`.
- [ ] Test `/`, the `/mu-immortal-bot/` 301 redirect, `/404.html`, all assets and Customer Hub links on the immutable preview URL.
- [ ] Record the tested commit SHA and preview URL.

Do not state `READY FOR GO LIVE` until every unchecked Phase 1 item above has been verified on the real staging deployment.

## Phase 2: only after the owner says GO LIVE

- [ ] Confirm the staging SHA is unchanged and approved.
- [ ] Deploy that SHA as the Cloudflare Pages production deployment.
- [ ] Test the Pages production URL before attaching the domain.
- [ ] Attach only `novabotmu.com`; preserve `app.novabotmu.com` and `api.novabotmu.com`.
- [ ] Verify HTTPS, headers, status codes, canonicals, sitemap and 404 behavior.
- [ ] Publish `migration-dist/` as the redirect-only GitHub Pages source.
- [ ] Verify every old mapped URL reaches its final new destination.
- [ ] Submit the new sitemap in Search Console and begin migration monitoring.
- [ ] Create a release tag for the verified commit.

## Rollback trigger

Rollback if the production domain has TLS errors, a failed root route, missing assets, incorrect canonical URLs, broken Hub links or unexpected indexing headers.

## Rollback action

Restore the previous verified Cloudflare Pages deployment or detach the newly attached apex domain if this is the first deployment. If the new domain is unavailable, restore the previous GitHub Pages commit so the indexed old URLs do not redirect visitors into an outage. Database, Customer Hub, API and Gateway services are outside this marketing release and must not be changed.
