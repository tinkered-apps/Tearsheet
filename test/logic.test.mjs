// Unit tests for public/logic.js. Run: node --test test/*.test.mjs
// logic.js is a classic browser script, so it is run in a fresh context and
// its functions are read back from it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../public/logic.js", import.meta.url), "utf8");
const names = ["AREA_FACTORS", "parseArea", "areaToSqMeters", "areaFromSqMeters", "isValidHttpUrl", "isValidPhone", "clamp"];
const logic = vm.runInNewContext(`${source}\n({ ${names.join(", ")} })`, { URL });
const { AREA_FACTORS, parseArea, areaToSqMeters, areaFromSqMeters, isValidHttpUrl, isValidPhone, clamp } = logic;

test("parseArea accepts a positive number and nothing else", () => {
  assert.equal(parseArea("1208"), 1208);
  assert.equal(parseArea(" 0.5 "), 0.5);
  assert.equal(parseArea("1e3"), 1000);
  for (const text of ["", "   ", "0", "-3", "abc", "12 m", "1,5", "Infinity", "NaN"]) {
    assert.equal(parseArea(text), null, `"${text}"`);
  }
});

test("area units convert through square metres", () => {
  assert.equal(areaToSqMeters(1, "ha"), 10000);
  assert.equal(areaToSqMeters(12, "a"), 1200);
  assert.equal(areaFromSqMeters(1208, "ha"), 0.1208);
  assert.equal(areaFromSqMeters(1208, "a"), 12.08);
  // International foot and acre: 1 ft = 0.3048 m, 1 ac = 43,560 ft².
  assert.equal(AREA_FACTORS.ft2, 0.3048 ** 2);
  assert.equal(areaFromSqMeters(areaToSqMeters(1, "ac"), "ft2"), 43560);
  assert.equal(areaFromSqMeters(4046.8564224, "ac"), 1);
});

test("a value survives a trip through every other unit", () => {
  const units = Object.keys(AREA_FACTORS);
  for (const value of [1208, 0.1208, 7, 43560, 0.333]) {
    for (const from of units) {
      for (const to of units) {
        const there = areaFromSqMeters(areaToSqMeters(value, from), to);
        const back = areaFromSqMeters(areaToSqMeters(there, to), from);
        assert.ok(Math.abs(back - value) <= value * 1e-9, `${value} ${from} -> ${to} -> ${back}`);
      }
    }
  }
});

test("a converted value carries no binary noise", () => {
  // 1208 / 10000 * 10000 style arithmetic would otherwise show 0.12080000000000002.
  assert.equal(String(areaFromSqMeters(areaToSqMeters(0.1208, "ha"), "m2")), "1208");
  assert.equal(String(areaFromSqMeters(areaToSqMeters(1208, "m2"), "ha")), "0.1208");
});

test("phone needs 7 to 15 digits", () => {
  assert.equal(isValidPhone("123456"), false);
  assert.equal(isValidPhone("1234567"), true);
  assert.equal(isValidPhone("123456789012345"), true);
  assert.equal(isValidPhone("1234567890123456"), false);
});

test("phone allows a leading plus, spaces, brackets and hyphens only", () => {
  for (const phone of ["+48 500 100 200", "(22) 555-01-23", "  500100200  ", "+1 (415) 555-0132"]) {
    assert.equal(isValidPhone(phone), true, phone);
  }
  for (const phone of ["", "1234567a", "48+500100200", "500.100.200", "500 100 200 ext 5", "+ + 1234567"]) {
    assert.equal(isValidPhone(phone), false, phone);
  }
});

test("the QR link must be an http or https URL", () => {
  assert.equal(isValidHttpUrl("https://example.com/listing?id=7"), true);
  assert.equal(isValidHttpUrl("http://example.com"), true);
  for (const value of ["", "example.com", "ftp://example.com", "javascript:alert(1)", "mailto:a@example.com", "https://"]) {
    assert.equal(isValidHttpUrl(value), false, value);
  }
});

test("clamp keeps a value inside its range", () => {
  assert.equal(clamp(0.4, -1, 1), 0.4);
  assert.equal(clamp(-3, -1, 1), -1);
  assert.equal(clamp(3, -1, 1), 1);
});
