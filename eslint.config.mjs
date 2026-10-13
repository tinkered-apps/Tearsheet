// ESLint's recommended rules, run by `npm test`. The app has no build step, so
// this is the only thing that reads every file before it ships.

import js from "@eslint/js";
import globals from "globals";

// The vendored libraries are loaded by plain <script> tags and each sets one global.
const vendored = { L: "readonly", html2canvas: "readonly", PDFLib: "readonly", qrcode: "readonly" };
// public/logic.js is a classic script too: it declares these for app.js, which loads after it.
const logic = {
  parseArea: "readonly", areaToSqMeters: "readonly", areaFromSqMeters: "readonly",
  isValidHttpUrl: "readonly", isValidPhone: "readonly", clamp: "readonly"
};

export default [
  // public/vendor/ is other people's code, copied in as released.
  { ignores: ["node_modules/", "test-results/", "playwright-report/", ".wrangler/", "public/vendor/"] },

  js.configs.recommended,
  {
    rules: {
      // An unused name in `catch (e)` and an empty `catch` block are how the app ignores a blocked localStorage.
      "no-unused-vars": ["error", { caughtErrors: "none" }],
      "no-empty": ["error", { allowEmptyCatch: true }]
    }
  },

  { files: ["public/**/*.js"], languageOptions: { sourceType: "script", globals: { ...globals.browser, ...vendored } } },
  { files: ["public/sw.js"], languageOptions: { globals: globals.serviceworker } },
  { files: ["public/app.js"], languageOptions: { globals: logic } },

  { files: ["scripts/**", "*.js", "*.mjs"], languageOptions: { globals: globals.node } },
  // Playwright specs run in Node and hand callbacks to the page.
  { files: ["test/**"], languageOptions: { globals: { ...globals.node, ...globals.browser } } }
];
