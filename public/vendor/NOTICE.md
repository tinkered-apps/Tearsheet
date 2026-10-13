# Vendored libraries

`npm audit` does not see these files, so check them by hand: compare the
version below with the project's latest release and its security advisories.
Each file is an unmodified copy; its SHA-256 matches the file in the npm package
named beside it (compared on 2026-10-13).

| File | Library and version | From | In the project since | Licence |
|---|---|---|---|---|
| `leaflet.js`, `leaflet.css` | [Leaflet](https://leafletjs.com) 1.9.4 | `dist/` of [leaflet@1.9.4](https://www.npmjs.com/package/leaflet/v/1.9.4) | 2026-07-24 | BSD-2-Clause, [LICENSE-leaflet.txt](LICENSE-leaflet.txt) |
| `qrcode.js` | [QR Code Generator](https://github.com/kazuhikoarase/qrcode-generator) 1.5.0 | `qrcode.js` of [qrcode-generator@1.5.0](https://www.npmjs.com/package/qrcode-generator/v/1.5.0); the file is the same in 1.4.4 | 2026-07-24 | MIT, [LICENSE-qrcode.txt](LICENSE-qrcode.txt) |
| `html2canvas.min.js` | [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 | `dist/` of [html2canvas@1.4.1](https://www.npmjs.com/package/html2canvas/v/1.4.1) | 2026-09-27 at the latest | MIT, [LICENSE-html2canvas.txt](LICENSE-html2canvas.txt) |
| `pdf-lib.min.js` | [pdf-lib](https://pdf-lib.js.org/) 1.17.1 | `dist/` of [pdf-lib@1.17.1](https://www.npmjs.com/package/pdf-lib/v/1.17.1) | 2026-09-27 at the latest | MIT, [LICENSE-pdf-lib.txt](LICENSE-pdf-lib.txt) |

For html2canvas and pdf-lib the copy date was not recorded; 2026-09-27 is the
first commit of this repository, which already holds them. Both load only on
Firefox for Android, where the app builds the PDF itself.

`leaflet.css` is here without Leaflet's `images/` folder: the app draws its own
map pin and has no layer switcher, so nothing asks for those files.

The Inter and Sora fonts in `fonts/` are Latin and Latin Extended subsets under
the SIL Open Font License 1.1 ([OFL-Inter.txt](fonts/OFL-Inter.txt),
[OFL-Sora.txt](fonts/OFL-Sora.txt)).

When replacing a library, copy the released file unchanged, update its row and
bump `APP_VERSION`.
