"use strict";

// The rules that need no page: area units, phone and link validation.
// Loaded before app.js as a classic script; test/logic.test.mjs runs it in Node.

/* exported parseArea, areaToSqMeters, areaFromSqMeters, isValidHttpUrl, isValidPhone, clamp */

const AREA_FACTORS = { m2: 1, a: 100, ha: 10000, ft2: 0.09290304, ac: 4046.8564224 };

// The typed area as a number, or null when it is empty, not a number or not above zero.
function parseArea(text) {
  const value = Number(text);
  return text.trim() && Number.isFinite(value) && value > 0 ? value : null;
}

function areaToSqMeters(value, unit) {
  return value * AREA_FACTORS[unit];
}

// Ten significant digits keep a round trip (m² to ha and back) from showing binary noise.
function areaFromSqMeters(squareMeters, unit) {
  return Number((squareMeters / AREA_FACTORS[unit]).toPrecision(10));
}

function isValidHttpUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function isValidPhone(value) {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");
  return /^\+?[0-9 ()-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
