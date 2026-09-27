import { test as base, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

// Every test fails on a console error or uncaught exception (CSP violations
// included) and warns about requests that leave the app's own origin.
const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    const errors = [];
    const origin = new URL(baseURL).origin;
    const external = new Set();
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const requestOrigin = new URL(request.url()).origin;
      if (requestOrigin !== origin && requestOrigin.startsWith("http")) external.add(requestOrigin);
    });
    await use(page);
    if (external.size) console.warn(`Requests to other origins: ${[...external].join(", ")}`);
    expect(errors, "console errors").toEqual([]);
  }
});

async function fillListing(page) {
  await page.fill("#title", "Building plot beside a forest");
  await page.fill("#location", "Warsaw, Mazovia");
  await page.fill("#area", "1208");
  await page.fill("#purpose", "Residential");
  await page.fill("#utilities", "Full utilities");
  await page.fill("#description", "Quiet street, level ground, gas and water at the boundary.");
  await page.fill("#phone", "+48 500 100 200");
  await page.setInputFiles("#photo", "public/icons/icon-512.png");
  await page.locator("#map-picker").click();
}

test("a complete listing is ready to print", async ({ page }) => {
  await page.goto("/");
  await fillListing(page);
  await page.fill("#redirect-url", "https://example.com/listing");

  await expect(page.locator("#qr-image")).toHaveAttribute("src", /^data:image\//);
  await expect(page.locator("#validation-title")).toHaveText("The leaflet is ready to print", { timeout: 20_000 });
  await expect(page.locator("#print-button")).toHaveAttribute("aria-disabled", "false");
  await expect(page.locator("#preview-tabs .leaflet-tab")).toHaveCount(20);
});

test("Firefox Android downloads a compact A4 PDF", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgent", {
      get: () => "Mozilla/5.0 (Android 16; Mobile; rv:156.0) Gecko/156.0 Firefox/156.0"
    });
  });
  await page.goto("/");
  await fillListing(page);
  await expect(page.locator("#validation-title")).toHaveText("The leaflet is ready to print", { timeout: 20_000 });
  await expect(page.locator("#print-button")).toContainText("Download A4 PDF");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#print-button").click()
  ]);
  expect(download.suggestedFilename()).toBe("Tearsheet.pdf");
  const pdf = await readFile(await download.path());
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  expect(pdf.length).toBeLessThan(5_000_000);
  await download.saveAs(testInfo.outputPath("firefox-android.pdf"));
  await expect(page.locator("#print-button")).toContainText("Download A4 PDF");
});

test("a genuinely clipped fact still blocks printing", async ({ page }) => {
  await page.goto("/");
  await fillListing(page);
  await expect(page.locator("#validation-title")).toHaveText("The leaflet is ready to print", { timeout: 20_000 });
  await page.fill("#purpose", "W".repeat(22));
  await expect(page.locator("#validation-list")).toContainText("the content does not fit on the page");
  await expect(page.locator("#print-button")).toHaveAttribute("aria-disabled", "true");
});

test("the focused field uses a neutral border even while an error is shown", async ({ page }) => {
  await page.goto("/");
  await page.fill("#phone", "123");
  await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#phone")).toHaveCSS("border-color", "rgb(97, 116, 142)");
  const colors = await page.locator("#phone").evaluate((input) => ({
    border: getComputedStyle(input).borderColor,
    accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
    focus: getComputedStyle(document.documentElement).getPropertyValue("--focus").trim()
  }));
  expect(colors.border).toBe("rgb(97, 116, 142)");
  expect(colors.focus).not.toBe(colors.accent);
});

test("the photograph can be zoomed and moved in both directions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#photo-zoom-control")).toBeHidden();
  await page.setInputFiles("#photo", "public/icons/icon-512.png");
  await expect(page.locator("#photo-zoom-control")).toBeVisible();
  const ratios = await page.evaluate(() => {
    const editor = document.getElementById("photo-dropzone");
    const print = document.getElementById("preview-photo").parentElement;
    return [editor.clientWidth / editor.clientHeight, print.clientWidth / print.clientHeight];
  });
  expect(Math.abs(ratios[0] - ratios[1])).toBeLessThan(0.05);
  await page.locator("#photo-zoom").fill("2");
  await expect(page.locator("#photo-zoom-value")).toHaveText("2×");

  const frame = await page.locator("#photo-dropzone").boundingBox();
  const centerX = frame.x + frame.width / 2;
  const centerY = frame.y + frame.height / 2;
  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX + 40, centerY + 20);
  await page.mouse.up();

  const crop = await page.locator("#upload-preview").evaluate((image) => {
    const [, x, y] = image.style.transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\)$/) || [];
    return { x: Number(x), y: Number(y), width: image.clientWidth };
  });
  expect(crop.x).toBeGreaterThan(0);
  expect(crop.y).toBeGreaterThan(0);
  expect(crop.width).toBeGreaterThan(frame.width);
  await expect(page.locator("#preview-photo")).toHaveAttribute("style", /translate\(-50%, -50%\) translate\([1-9]/);

  await page.click("#reset-crop");
  await expect(page.locator("#photo-zoom")).toHaveValue("1");
  await expect(page.locator("#photo-zoom-value")).toHaveText("1×");
  await expect(page.locator("#upload-preview")).toHaveAttribute("style", /translate\(0px, 0px\)/);
});

test("place search goes through the CSP and sets the marker", async ({ page }) => {
  await page.route("https://nominatim.openstreetmap.org/**", (route) => route.fulfill({
    json: [{ lat: "52.2297", lon: "21.0122", display_name: "Warsaw, Poland" }]
  }));
  await page.goto("/");
  await page.fill("#map-search", "Warsaw");
  await page.click("#search-button");
  await page.getByRole("button", { name: "Warsaw, Poland" }).click();
  await expect(page.locator("#coordinates-output")).toHaveText("52.229700, 21.012200");
});

test("switching to Polish translates the interface", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-language="pl"]');
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.locator('[data-i18n="printButton"]')).toHaveText("Sprawdź i drukuj");
  await expect(page.locator("#privacy-link")).toHaveAttribute("href", "privacy.html#pl");
});

test("area units are independent of language and convert the entered value", async ({ page }) => {
  await page.goto("/");
  await page.fill("#area", "0");
  await expect(page.locator("#area-error")).toHaveText("enter an area greater than zero");
  await page.fill("#area", "1208");
  await expect(page.locator("#area-error")).toBeEmpty();
  await expect(page.locator(".editor-panel")).not.toContainText("≈");
  await expect(page.locator("#preview-area")).toHaveText("1,208 m²");
  await page.selectOption("#area-unit", "ha");
  await expect(page.locator("#area")).toHaveValue("0.1208");
  await page.click('[data-language="pl"]');
  await expect(page.locator("#preview-area")).toHaveText("0,1208 ha");
  await page.click('[data-units="imperial"]');
  await expect(page.locator("#area-unit")).toHaveValue("ft2");
  await expect(page.locator("#preview-area")).toContainText("ft²");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await page.selectOption("#area-unit", "ac");
  await expect(page.locator("#preview-area")).toContainText("ac");
});

test("phone needs 7 to 15 digits and offers a numeric keyboard", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#phone")).toHaveAttribute("inputmode", "numeric");
  await page.fill("#phone", "123456");
  await expect(page.locator("#phone-error")).toHaveText("check the phone number format");
  await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true");
  await page.fill("#phone", "1234567");
  await expect(page.locator("#phone-error")).toBeEmpty();
  await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "false");
  await page.fill("#phone", "1234567a");
  await expect(page.locator("#phone-error")).toHaveText("check the phone number format");
});

test("text fields survive refresh but clear in a new browser session", async ({ page, context, browser }) => {
  await page.goto("/");
  await page.fill("#title", "Plot beside a forest");
  await page.fill("#area", "1208");
  await page.fill("#phone", "+48 500 100 200");
  await page.click('[data-units="imperial"]');
  await page.reload();
  await expect(page.locator("#title")).toHaveValue("Plot beside a forest");
  await expect(page.locator("#preview-title")).toHaveText("Plot beside a forest");
  await expect(page.locator("#preview-area")).toContainText("ft²");
  await expect(page.locator("#preview-phone")).toHaveText("+48 500 100 200");
  await expect(page.locator("#validation-list")).not.toContainText("enter a title");
  await expect(page.locator("#validation-list")).not.toContainText("enter the area");
  await expect(page.locator("#validation-list")).not.toContainText("enter a phone number");

  const freshContext = await browser.newContext({ storageState: await context.storageState() });
  try {
    const freshPage = await freshContext.newPage();
    await freshPage.goto("/");
    await expect(freshPage.locator("#title")).toBeEmpty();
    await expect(freshPage.locator("#area")).toBeEmpty();
    await expect(freshPage.locator('[data-units="imperial"]')).toHaveAttribute("aria-pressed", "true");
  } finally {
    await freshContext.close();
  }
});

test.describe("language choice", () => {
  test.use({ locale: "pl-PL" });

  test("starts in English even in a Polish browser, then remembers the choice", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await page.evaluate(() => localStorage.getItem("tearsheet.language"))).toBeNull();

    await page.click('[data-language="pl"]');
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");

    await page.click('[data-language="en"]');
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test("the footer credit shows the app version", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator(".app-footer");
  await expect(footer.locator("p")).toHaveText("Tearsheet v1.00 by Kuba · tinkered.app · Privacy");
  await expect(footer.getByRole("link", { name: "Kuba" })).toHaveAttribute("href", "mailto:kuba@tinkered.app");
  await expect(footer.getByRole("link", { name: "tinkered.app" })).toHaveAttribute("href", "https://tinkered.app");
  await expect(footer.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "privacy.html#en");
});

test("the footer opens the privacy page in the app's language", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-language="pl"]');
  await page.locator(".app-footer").getByRole("link", { name: "Prywatność" }).click();
  await expect(page).toHaveURL(/\/privacy#pl$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dane i prywatność");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");

  await page.click('[data-language="en"]');
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Data and privacy");
  await expect(page).toHaveURL(/\/privacy#en$/);

  await page.getByRole("link", { name: /Tearsheet/ }).click();
  await expect(page.locator("#leaflet-form")).toBeVisible();
});

test("the privacy page is sent with a noindex header", async ({ request }) => {
  for (const path of ["/privacy", "/privacy.html"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.headers()["x-robots-tag"], path).toBe("noindex");
  }
});

test("the preview stays fixed while the page scrolls on a full HD screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the preview is only sticky on wide screens");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  const panel = page.locator(".preview-panel");
  const top = async () => (await panel.boundingBox()).y;
  const before = await top();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  // Within half a pixel: the browser rounds the sticky offset at the scroll end.
  expect(await top()).toBeCloseTo(before, 0);
  const footer = await page.locator(".app-footer").boundingBox();
  const editor = await page.locator(".editor-panel").boundingBox();
  expect(footer.y).toBeGreaterThan(editor.y + editor.height);
  expect(footer.x + footer.width).toBeLessThanOrEqual(editor.x + editor.width + 1);
});

test("the mobile print button settles beside the preview heading", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the print button is fixed only on narrow screens");
  await page.goto("/");
  const button = page.locator("#print-button");
  const toolbar = page.locator("#preview-toolbar");
  await expect(button).toHaveCSS("position", "fixed");

  await toolbar.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect(button).toHaveCSS("position", "static");
  const placement = await page.evaluate(() => {
    const toolbar = document.getElementById("preview-toolbar").getBoundingClientRect();
    const button = document.getElementById("print-button").getBoundingClientRect();
    return {
      toolbarTop: toolbar.top,
      buttonTop: button.top,
      buttonBottom: button.bottom,
      toolbarBottom: toolbar.bottom,
      scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight
    };
  });
  expect(placement.buttonTop).toBeGreaterThanOrEqual(placement.toolbarTop);
  expect(placement.buttonBottom).toBeLessThanOrEqual(placement.toolbarBottom + 1);
  expect(placement.scrollY).toBeLessThan(placement.maxScroll);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(button).toHaveCSS("position", "fixed");

  await page.setViewportSize({ width: 320, height: 640 });
  await toolbar.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect(button).toHaveCSS("position", "static");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("the app and privacy notice open offline", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".brand-name")).toHaveText("Tearsheet");
  await page.goto("/privacy.html#en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Data and privacy");
  await context.setOffline(false);
});

test("the leaflet prints on exactly one A4 landscape page", async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== "chromium", "PDF output needs Chromium");
  await page.goto("/");
  await fillListing(page);
  await expect(page.locator("#validation-title")).toHaveText("The leaflet is ready to print", { timeout: 20_000 });
  await page.emulateMedia({ media: "print" });
  const sheet = await page.locator("#leaflet-sheet").boundingBox();
  expect(sheet.x).toBeCloseTo(0, 0);
  expect(sheet.width).toBeGreaterThan(1100);
  expect(sheet.height).toBeGreaterThan(790);
  const pdf = await page.pdf({ width: "297mm", height: "210mm", printBackground: true, path: testInfo.outputPath("leaflet.pdf") });
  const pages = pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || [];
  expect(pages).toHaveLength(1);
  const size = pdf.toString("latin1").match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
  // Chromium reports 297 × 210 mm as 841.92 × 595.92 points.
  expect(Number(size[1])).toBeCloseTo(841.92, 1);
  expect(Number(size[2])).toBeCloseTo(595.92, 1);
});

test("large photos are sized for the leaflet before PDF export", async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== "chromium", "PDF output needs Chromium");
  await page.goto("/");
  await fillListing(page);
  await page.evaluate(async () => {
    const createObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      if (blob.type === "image/jpeg") window.printPhotoBytes = blob.size;
      return createObjectURL(blob);
    };
    const canvas = document.createElement("canvas");
    canvas.width = 3000;
    canvas.height = 2000;
    const context = canvas.getContext("2d");
    const pixels = context.createImageData(canvas.width, canvas.height);
    let seed = 1;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      pixels.data[i] = seed & 255;
      pixels.data[i + 1] = (seed >>> 8) & 255;
      pixels.data[i + 2] = (seed >>> 16) & 255;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const file = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
    const input = document.querySelector("#photo");
    const transfer = new DataTransfer();
    transfer.items.add(new File([file], "large-photo.jpg", { type: "image/jpeg" }));
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect.poll(() => page.locator("#preview-photo").evaluate((image) => image.naturalWidth)).toBe(1800);
  await expect(page.locator("#validation-title")).toHaveText("The leaflet is ready to print", { timeout: 20_000 });
  const photo = await page.locator("#preview-photo").evaluate((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
    bytes: window.printPhotoBytes
  }));
  expect(photo.width).toBe(1800);
  expect(photo.height).toBe(1200);
  expect(photo.bytes).toBeLessThan(2 * 1024 * 1024);
  const pdf = await page.pdf({ width: "297mm", height: "210mm", printBackground: true, path: testInfo.outputPath("large-photo.pdf") });
  expect(pdf.length).toBeLessThan(4 * 1024 * 1024);
});
