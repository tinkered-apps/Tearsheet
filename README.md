# Tearsheet

Tearsheet builds a real-estate leaflet on one landscape A4 sheet: a photo, a
map pin, the key facts, an optional QR code, and 20 tear-off phone tabs along
the bottom edge. It works in English and Polish, installs as a PWA, and opens
offline once loaded.

On Firefox for Android, the app downloads a landscape A4 PDF directly because
its system print dialog scales the leaflet down. Other browsers use printing.

Live at <https://tearsheet.tinkered.app>

## Data

The app stores nothing on a server. Cloudflare, the host, keeps request records
with IP addresses for up to 7 days. Text fields stay in this tab's sessionStorage
through a refresh and are cleared when the page is opened anew. The photo stays
in memory and is lost on refresh. Theme, language and unit choices stay in
localStorage after you use their controls. The service worker caches the app's
own files.

Two OpenStreetMap services receive requests: the tile server draws the map, and
Nominatim answers place searches, only when you press Search. The
[privacy notice](https://tearsheet.tinkered.app/privacy) lists what each recipient gets.

## Restore

The app holds no user data, so restoring it means deploying the code again:
check out the repository and run the deploy command from [AGENTS.md](AGENTS.md),
which also has the commands, conventions and file layout.

## Credits

- [Leaflet](https://leafletjs.com), BSD-2-Clause
- [QR Code Generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase, MIT
- [html2canvas](https://html2canvas.hertzen.com/), MIT
- [pdf-lib](https://pdf-lib.js.org/), MIT
- Inter and Sora fonts, SIL Open Font License 1.1
- Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

The licence texts ship in `public/vendor/`, and
[NOTICE.md](public/vendor/NOTICE.md) there records the version and source of
each library.

Made by Kuba (kuba@tinkered.app).
