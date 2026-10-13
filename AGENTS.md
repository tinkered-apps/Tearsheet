# AGENTS.md

[README.md](README.md) covers what the app is, what data it keeps, how to
restore it, and credits. Commands and conventions live here.

## Commands

- `npm install`: installs the pinned Wrangler, Playwright and axe. On a new machine,
  also run `npx playwright install chromium` once.
- `npm start`: `wrangler dev` at `http://127.0.0.1:8765/`, serving `public/`
  with the production headers from `public/_headers`.
- `npm test`: `scripts/check.mjs`. Checks syntax, that EN and PL have the same
  translation keys, that every file in `SHELL` and the manifest exists, that
  `APP_VERSION` matches the cache name, and that no page has an inline script.
- `npm run test:e2e`: Playwright on desktop and mobile Chromium against
  `npm start`. Fails on console errors (CSP violations included) and warns about
  requests to other origins. Includes an axe scan of the form, a complete
  listing and the privacy notice in both themes, and an offline run on a fresh
  install. Not part of the deploy gate; run it locally before shipping a UI
  change.
- `npm run deploy`: `npm test && wrangler deploy` to the `tearsheet` Worker on
  `tearsheet.tinkered.app`. One environment only: no stored data, no migrations.

Workers Builds settings, once the repository is connected: production branch
`main`, empty build command, deploy command `npm run deploy`, and `npm test` as
the deploy command for other branches.

`allowScripts` in `package.json` pins the `esbuild` and `workerd` versions whose
install scripts npm may run. Update it when a Wrangler upgrade changes those
versions.

There is no build step. Third-party libraries and fonts are vendored in
`public/vendor/` with their licence texts; add new ones the same way.

## Files

Only `public/` is served:

- `index.html`: the interface and the printable leaflet template.
- `app.js`: form handling, map, photo, QR code, validation, translations, and
  `APP_VERSION`.
- `styles.css`: app styling, leaflet layout, and print rules.
- `theme-init.js`: applies the saved theme before first paint.
- `privacy.html`, `privacy.js`: the privacy notice and licence credits, in English
  and Polish. Built from the shared tinkered.app template (`../.tinkered-legal/privacy-template.html`, outside this repository); keep the
  shared sections as they are there and edit only the Tearsheet parts (lead,
  OpenStreetMap, browser storage table, licences). The language comes from the
  link's hash (`#en`, `#pl`), else the saved choice, else English.
- `sw.js`, `manifest.webmanifest`, `favicon.svg`, `icons/`: offline cache and PWA
  files.
- `vendor/`: Leaflet, the QR code generator, html2canvas, pdf-lib, the Inter and
  Sora fonts, and their licence texts.
- `_headers`: security headers, `no-cache` on `sw.js`, and `noindex` on the
  privacy notice and licence texts.

Repo-only: `scripts/check.mjs`, `test/e2e/`, `playwright.config.js`,
`wrangler.jsonc`, `package.json`.

## Conventions

- Versioning: `APP_VERSION` in `public/app.js` fills the footer, and `CACHE` in
  `public/sw.js` is `tearsheet-v<APP_VERSION>`. Bump both on a user-visible
  release and whenever `SHELL` or the caching rules change. The privacy notice
  names the cache by its prefix, so a bump needs no edit there.
- Every file the app needs at runtime goes into `SHELL` in `public/sw.js`. The
  shell lists `./` and `privacy`, not `index.html` and `privacy.html`, because
  the host redirects the latter to the former and a redirected response cannot
  serve a page navigation offline. `npm test` rejects `.html` entries.
- Link preview: the `og:*` tags in `public/index.html` point to
  `public/icons/social-card.png` (1200×630), with absolute URLs because
  crawlers do not run scripts. The image is not in `SHELL`; no page loads it.
- Every user-facing string ships in English and Polish; see the translation
  tables in `public/app.js`. A feature isn't done if it only has one language.
  User-facing text has no em dashes. The `—` in the preview is the marker for an
  empty field, not punctuation.
- No backend, no accounts, no analytics. Text form fields and the selected area
  unit stay in `sessionStorage` through a refresh of the same tab and are cleared
  when the page is opened anew. The uploaded photo stays in memory only and is
  lost on refresh. The browser also stores the theme (`tearsheet.theme`),
  language (`tearsheet.language`, English until the visitor picks PL), and unit
  system (`tearsheet.units`, metric by default) in `localStorage`, written only
  on click, plus the service worker's app-shell cache.
- Footer credit: "Tearsheet vX.XX by Kuba · tinkered.app", with the tinkered.app
  logo inline (never hotlinked).
- The on-screen preview must stay print-accurate. Check layout changes against
  real print output (A4 landscape, no margins, background graphics on). The
  e2e print test checks that the leaflet fills exactly one A4 landscape page.

## Third-party requests and the CSP

`public/_headers` carries the standard baseline. Every exception is for
OpenStreetMap, which the privacy notice covers:

- `img-src https://tile.openstreetmap.org`: map tiles.
- `connect-src https://nominatim.openstreetmap.org`: place search, sent only
  when the user presses Search.
- `img-src blob:`: the uploaded photo, shown through an object URL. It never
  leaves the browser.
- The page sends `Referrer-Policy: no-referrer`. The tile layer and the
  Nominatim fetch set `strict-origin-when-cross-origin` on their own requests,
  because both OpenStreetMap usage policies require a referrer.

A new third-party origin needs the author's approval first, then a privacy
notice entry, and a CSP change for that origin only, recorded here.
