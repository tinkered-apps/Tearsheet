"use strict";

// Shown in the footer. Keep in step with CACHE in sw.js; npm test checks it.
const APP_VERSION = "1.02";

const MAP_PROVIDER = {
  tiles: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  geocoder: "https://nominatim.openstreetmap.org/search"
};

const LIMITS = {
  title: 65,
  location: 60,
  purpose: 22,
  utilities: 22,
  description: 430,
  phone: 20,
  badge: 20,
  "tear-one": 14,
  "tear-two": 14,
  "qr-caption": 55
};

const translations = {
  pl: {
    pageTitle: "Tearsheet · generator ulotek nieruchomości",
    brandDescriptor: "Ulotki nieruchomości A4",
    contentHeading: "Treść ogłoszenia",
    contentHint: "Pola oznaczone gwiazdką są wymagane.",
    titleLabel: "Tytuł *",
    titlePlaceholder: "Działka budowlana przy lesie",
    locationLabel: "Lokalizacja *",
    locationPlaceholder: "Warszawa, mazowieckie",
    areaLabel: "Powierzchnia *",
    areaPlaceholder: "1208",
    areaUnitLabel: "Jednostka powierzchni",
    purposeLabel: "Przeznaczenie *",
    purposePlaceholder: "Budowlana",
    utilitiesLabel: "Media *",
    utilitiesPlaceholder: "Pełne media",
    descriptionLabel: "Opis *",
    descriptionPlaceholder: "To, co przekona kupca: metraż, stan, mocne strony działki.",
    phoneLabel: "Telefon *",
    phonePlaceholder: "+48 500 100 200",
    photoHeading: "Zdjęcie nieruchomości",
    photoHint: "JPG, PNG lub WebP, maksymalnie 15 MB.",
    dropTitle: "Przeciągnij zdjęcie tutaj",
    dropOr: "lub kliknij, aby wybrać plik",
    cropHint: "Przesuń zdjęcie w dowolnym kierunku i użyj powiększenia, aby ustawić kadr.",
    zoomLabel: "Powiększenie",
    choosePhoto: "Wybierz zdjęcie",
    resetCrop: "Resetuj kadr",
    mapHeading: "Lokalizacja na mapie",
    mapHint: "Wyszukaj miejsce, a potem kliknij mapę lub przeciągnij pinezkę.",
    searchLabel: "Szukaj miejsca",
    searchPlaceholder: "Miejscowość, ulica lub adres",
    searchButton: "Szukaj",
    searchPrivacy: "Zapytanie wyszukiwania trafia do OpenStreetMap.",
    coordinates: "Współrzędne",
    optionalHeading: "Dodatki",
    optionalHint: "Dowolne z tych pól możesz zostawić puste.",
    badgeLabel: "Tekst na etykiecie",
    badgePlaceholder: "Domyślnie: Na sprzedaż",
    tearOneLabel: "Hasło na karteczce 1",
    tearOnePlaceholder: "Działka",
    tearTwoLabel: "Hasło na karteczce 2",
    tearTwoPlaceholder: "Warszawa",
    urlLabel: "Link do kodu QR",
    urlHint: "Kod QR powstaje lokalnie w przeglądarce i pojawi się po podaniu poprawnego linku.",
    qrCaptionLabel: "Tekst obok kodu QR",
    qrCaptionPlaceholder: "Zeskanuj i zobacz pełne ogłoszenie",
    defaultQrCaption: "Zeskanuj i zobacz pełne ogłoszenie",
    privacyTitle: "Prywatność",
    privacyText: "Pola tekstowe wracają po odświeżeniu tej karty, a przy nowym otwarciu strony są czyszczone. Zdjęcie znika po odświeżeniu. Dane nie są wysyłane. OpenStreetMap dostarcza mapę i wyszukiwarkę miejsc. Wybór motywu, języka i jednostek jest zapamiętywany.",
    privacyLink: "Informacja o prywatności",
    footerPrivacy: "Prywatność",
    previewHeading: "Wygenerowana ulotka",
    printButton: "Sprawdź i drukuj",
    downloadPdf: "Pobierz PDF A4",
    pdfPreparing: "Przygotowuję PDF…",
    pdfError: "Nie udało się przygotować PDF. Spróbuj ponownie.",
    pdfHelp: "PDF A4 w układzie poziomym zapisze się bezpośrednio na urządzeniu.",
    photoPlaceholder: "Zdjęcie nieruchomości",
    mapPlaceholder: "Mapa lokalizacji",
    leafletLocation: "Lokalizacja",
    leafletArea: "Powierzchnia",
    leafletPurpose: "Przeznaczenie",
    leafletUtilities: "Media",
    cutline: "oderwij i zadzwoń",
    printHelp: "W oknie drukowania wybierz A4, układ poziomy, brak marginesów i włącz grafikę tła.",
    defaultBadge: "Na sprzedaż",
    defaultMapLabel: "Lokalizacja",
    validationReady: "Ulotka jest gotowa do druku",
    validationNeedsWork: "Uzupełnij ulotkę przed drukiem",
    missingTitle: "podaj tytuł",
    missingLocation: "podaj lokalizację",
    missingArea: "podaj powierzchnię",
    invalidArea: "podaj powierzchnię większą od zera",
    missingPurpose: "podaj przeznaczenie",
    missingUtilities: "podaj media",
    missingDescription: "dodaj opis",
    missingPhone: "podaj telefon",
    invalidPhone: "sprawdź format telefonu",
    missingPhoto: "dodaj zdjęcie",
    photoProcessing: "poczekaj na przygotowanie zdjęcia",
    missingMarker: "zaznacz miejsce na mapie",
    invalidUrl: "link QR musi zaczynać się od http:// lub https://",
    layoutOverflow: "treść nie mieści się na stronie",
    mapLoading: "poczekaj na wczytanie mapy",
    searchEmpty: "Wpisz nazwę miejsca lub adres.",
    searchLoading: "Szukam…",
    searchNone: "Nie znaleziono miejsca. Przesuń mapę ręcznie i kliknij punkt.",
    searchError: "Wyszukiwanie jest teraz niedostępne. Nadal możesz wybrać punkt ręcznie.",
    searchRate: "Odczekaj chwilę przed kolejnym wyszukiwaniem.",
    searchResults: "Wybierz wynik:",
    photoTypeError: "Wybierz plik JPG, PNG lub WebP.",
    photoSizeError: "Zdjęcie jest większe niż 15 MB.",
    photoReadError: "Nie udało się odczytać zdjęcia.",
    mapTileError: "Nie udało się wczytać części mapy. Sprawdź połączenie i spróbuj ponownie.",
    localServerRequired: "Mapa działa tylko na stronie otwartej przez serwer WWW. Zamknij tę kartę i uruchom npm start.",
    printBlocked: "Popraw wskazane pola przed drukiem.",
    themeAuto: "Motyw: zgodny z systemem",
    themeLight: "Motyw: jasny",
    themeDark: "Motyw: ciemny",
    languageLabel: "Język",
    unitsLabel: "Jednostki powierzchni",
    metricUnits: "Jednostki metryczne",
    imperialUnits: "Jednostki imperialne",
    editorLabel: "Edytor ulotki",
    previewLabel: "Podgląd ulotki",
    sheetLabel: "Ulotka do druku",
    pickerLabel: "Interaktywna mapa lokalizacji nieruchomości",
    previewMapLabel: "Mapa lokalizacji na ulotce",
    qrAlt: "Kod QR"
  },
  en: {
    pageTitle: "Tearsheet · property leaflet generator",
    brandDescriptor: "A4 property leaflets",
    contentHeading: "Listing content",
    contentHint: "Fields marked with an asterisk are required.",
    titleLabel: "Title *",
    titlePlaceholder: "Building plot beside a forest",
    locationLabel: "Location *",
    locationPlaceholder: "Warsaw, Mazovia",
    areaLabel: "Area *",
    areaPlaceholder: "1208",
    areaUnitLabel: "Area unit",
    purposeLabel: "Intended use *",
    purposePlaceholder: "Residential",
    utilitiesLabel: "Utilities *",
    utilitiesPlaceholder: "Full utilities",
    descriptionLabel: "Description *",
    descriptionPlaceholder: "What makes this property worth a call: size, condition, standout features.",
    phoneLabel: "Phone *",
    phonePlaceholder: "+1 555 010 1234",
    photoHeading: "Property photograph",
    photoHint: "JPG, PNG or WebP, up to 15 MB.",
    dropTitle: "Drop a photograph here",
    dropOr: "or click to choose a file",
    cropHint: "Drag the photograph in any direction and use zoom to frame the crop.",
    zoomLabel: "Zoom",
    choosePhoto: "Choose photograph",
    resetCrop: "Reset crop",
    mapHeading: "Map location",
    mapHint: "Search for a place, then click the map or drag the marker.",
    searchLabel: "Search for a place",
    searchPlaceholder: "Town, street or address",
    searchButton: "Search",
    searchPrivacy: "Your search query is sent to OpenStreetMap.",
    coordinates: "Coordinates",
    optionalHeading: "Optional extras",
    optionalHint: "Leave any of these blank.",
    badgeLabel: "Badge text",
    badgePlaceholder: "Default: For sale",
    tearOneLabel: "Tear-off keyword 1",
    tearOnePlaceholder: "Plot",
    tearTwoLabel: "Tear-off keyword 2",
    tearTwoPlaceholder: "Warsaw",
    urlLabel: "QR code link",
    urlHint: "Generated locally in your browser. Appears once you enter a valid link.",
    qrCaptionLabel: "Text beside the QR code",
    qrCaptionPlaceholder: "Scan to view the full listing",
    defaultQrCaption: "Scan to view the full listing",
    privacyTitle: "Privacy",
    privacyText: "Text fields return when you refresh this tab and are cleared when you open the page anew. The photo is lost on refresh. Your details are not uploaded. OpenStreetMap serves the map and place search. Your theme, language and unit choices are remembered.",
    privacyLink: "Privacy notice",
    footerPrivacy: "Privacy",
    previewHeading: "Generated leaflet",
    printButton: "Review and print",
    downloadPdf: "Download A4 PDF",
    pdfPreparing: "Preparing PDF…",
    pdfError: "The PDF could not be prepared. Try again.",
    pdfHelp: "A landscape A4 PDF will be saved directly to your device.",
    photoPlaceholder: "Property photograph",
    mapPlaceholder: "Location map",
    leafletLocation: "Location",
    leafletArea: "Area",
    leafletPurpose: "Intended use",
    leafletUtilities: "Utilities",
    cutline: "tear off and call",
    printHelp: "In the print dialog choose A4, landscape, no margins, and enable background graphics.",
    defaultBadge: "For sale",
    defaultMapLabel: "Location",
    validationReady: "The leaflet is ready to print",
    validationNeedsWork: "Complete the leaflet before printing",
    missingTitle: "enter a title",
    missingLocation: "enter a location",
    missingArea: "enter the area",
    invalidArea: "enter an area greater than zero",
    missingPurpose: "enter the intended use",
    missingUtilities: "enter the utilities",
    missingDescription: "add a description",
    missingPhone: "enter a phone number",
    invalidPhone: "check the phone number format",
    missingPhoto: "add a photograph",
    photoProcessing: "wait for the photograph to be prepared",
    missingMarker: "mark the location on the map",
    invalidUrl: "the QR link must start with http:// or https://",
    layoutOverflow: "the content does not fit on the page",
    mapLoading: "wait for the map to load",
    searchEmpty: "Enter a place name or address.",
    searchLoading: "Searching…",
    searchNone: "No place was found. Move the map manually and click a point.",
    searchError: "Search is currently unavailable. You can still choose a point manually.",
    searchRate: "Please wait a moment before searching again.",
    searchResults: "Choose a result:",
    photoTypeError: "Choose a JPG, PNG or WebP file.",
    photoSizeError: "The photograph is larger than 15 MB.",
    photoReadError: "The photograph could not be read.",
    mapTileError: "Part of the map could not load. Check your connection and try again.",
    localServerRequired: "The map only works when the page is served by a web server. Close this tab and run npm start.",
    printBlocked: "Correct the listed fields before printing.",
    themeAuto: "Theme: follows your system",
    themeLight: "Theme: light",
    themeDark: "Theme: dark",
    languageLabel: "Language",
    unitsLabel: "Area units",
    metricUnits: "Metric units",
    imperialUnits: "Imperial units",
    editorLabel: "Leaflet editor",
    previewLabel: "Leaflet preview",
    sheetLabel: "Printable leaflet",
    pickerLabel: "Interactive property location map",
    previewMapLabel: "Leaflet location map",
    qrAlt: "QR code"
  }
};

const state = {
  language: "en",
  units: "metric",
  areaUnit: "m2",
  fields: {
    title: "",
    location: "",
    area: "",
    purpose: "",
    utilities: "",
    description: "",
    phone: "",
    badge: "",
    tearOne: "",
    tearTwo: "",
    redirectUrl: "",
    qrCaption: ""
  },
  photo: {
    url: "",
    loading: false,
    x: 0,
    y: 0,
    zoom: 1,
    width: 0,
    height: 0
  },
  map: {
    center: [52.0693, 19.4803],
    zoom: 6,
    marker: null,
    tilesReady: false,
    tileError: false,
    localFileBlocked: window.location.protocol === "file:"
  },
  lastSearchAt: 0
};

const elements = {};
let pickerMap;
let previewMap;
let pickerMarker;
let previewMarker;
let previewTileLayer;
let validationTimer;
let photoRequest = 0;
let pdfLibrariesPromise;
let exportingPdf = false;

const DIRECT_PDF = /Android/i.test(navigator.userAgent) && /Firefox\//i.test(navigator.userAgent);
const A4_LANDSCAPE = [841.89, 595.28];

const THEME_STORE = "tearsheet.theme";
const LANGUAGE_STORE = "tearsheet.language";
const UNITS_STORE = "tearsheet.units";
const FORM_STORE = "tearsheet.form";
const AREA_OPTIONS = { metric: ["m2", "a", "ha"], imperial: ["ft2", "ac"] };
const AREA_LABELS = { m2: "m²", a: "a", ha: "ha", ft2: "ft²", ac: "ac" };
const FIELD_MAP = {
  title: "title",
  location: "location",
  area: "area",
  purpose: "purpose",
  utilities: "utilities",
  description: "description",
  phone: "phone",
  badge: "badge",
  "tear-one": "tearOne",
  "tear-two": "tearTwo",
  "redirect-url": "redirectUrl",
  "qr-caption": "qrCaption"
};
const THEMES = ["auto", "light", "dark"];
const THEME_LABEL_KEY = { auto: "themeAuto", light: "themeLight", dark: "themeDark" };
const THEME_ICON = {
  auto: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18z" fill="currentColor"/><circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>',
  dark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.3a7 7 0 0 0 11 11.2z"/></svg>'
};
let theme = "auto";
try {
  const storedTheme = localStorage.getItem(THEME_STORE);
  if (THEMES.includes(storedTheme)) theme = storedTheme;
} catch (error) {
  /* localStorage unavailable */
}

function t(key) {
  return translations[state.language][key] || key;
}

function applyTheme() {
  if (theme === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;

  const label = t(THEME_LABEL_KEY[theme]);
  elements["theme-toggle"].innerHTML = THEME_ICON[theme];
  elements["theme-toggle"].setAttribute("aria-label", label);
  elements["theme-toggle"].title = label;
}

function cacheElements() {
  [
    "leaflet-form", "photo-dropzone", "photo", "upload-preview", "choose-photo",
    "reset-crop", "photo-zoom", "photo-zoom-value", "photo-zoom-control",
    "photo-error", "map-search", "search-button", "search-status",
    "search-results", "coordinates-output", "area", "area-unit", "area-error",
    "phone", "phone-error", "preview-stage", "sheet-scale",
    "leaflet-sheet", "preview-badge", "preview-photo",
    "preview-map-label", "preview-location", "preview-title", "preview-area",
    "preview-purpose", "preview-utilities", "preview-description", "preview-phone",
    "preview-cta", "qr-box", "qr-image", "qr-lead", "preview-qr-caption",
    "qr-caption-field", "preview-tabs", "print-button", "theme-toggle",
    "validation-panel", "validation-title", "validation-list", "preview-toolbar"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function initMaps() {
  const commonOptions = {
    zoomControl: true,
    attributionControl: true
  };

  pickerMap = L.map("map-picker", commonOptions).setView(state.map.center, state.map.zoom);

  previewMap = L.map("preview-map", {
    ...commonOptions,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
  }).setView(state.map.center, state.map.zoom);

  if (state.map.localFileBlocked) {
    elements["search-button"].disabled = true;
    showLocalFileNotices();
    scheduleValidation();
    return;
  }

  const tileOptions = {
    attribution: MAP_PROVIDER.attribution,
    maxZoom: 19,
    crossOrigin: true,
    // The page sends no referrer by default; the OSM tile policy requires one.
    referrerPolicy: "strict-origin-when-cross-origin"
  };

  L.tileLayer(MAP_PROVIDER.tiles, tileOptions).addTo(pickerMap);
  previewTileLayer = L.tileLayer(MAP_PROVIDER.tiles, tileOptions);

  previewTileLayer
    .on("loading", () => {
      state.map.tilesReady = false;
      scheduleValidation();
    })
    .on("load", () => {
      state.map.tilesReady = true;
      state.map.tileError = false;
      scheduleValidation();
    })
    .on("tileerror", () => {
      state.map.tileError = true;
      state.map.tilesReady = false;
      scheduleValidation();
    })
    .addTo(previewMap);

  pickerMap.on("click", (event) => setMarker(event.latlng, true));
  pickerMap.on("moveend zoomend", syncMapView);
}

function showLocalFileNotices() {
  ["map-picker", "preview-map"].forEach((id) => {
    const notice = document.createElement("div");
    notice.className = "map-file-notice";
    notice.dataset.localMapNotice = "";
    notice.textContent = t("localServerRequired");
    document.getElementById(id).appendChild(notice);
  });
}

function markerIcon() {
  return L.divIcon({
    className: "",
    html: '<div class="custom-map-pin"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
}

function setMarker(latlng, panPicker = false) {
  const point = L.latLng(latlng);
  state.map.marker = [point.lat, point.lng];

  if (!pickerMarker) {
    pickerMarker = L.marker(point, {
      draggable: true,
      icon: markerIcon(),
      title: t("defaultMapLabel")
    }).addTo(pickerMap);
    pickerMarker.on("dragend", (event) => setMarker(event.target.getLatLng()));
  } else {
    pickerMarker.setLatLng(point);
  }

  if (!previewMarker) {
    previewMarker = L.marker(point, {
      interactive: false,
      keyboard: false, // no tab stop or button role: the preview map is a picture
      icon: markerIcon()
    }).addTo(previewMap);
  } else {
    previewMarker.setLatLng(point);
  }

  if (panPicker) {
    pickerMap.panTo(point);
  }

  elements["coordinates-output"].textContent = `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`;
  scheduleValidation();
}

function syncMapView() {
  const center = pickerMap.getCenter();
  state.map.center = [center.lat, center.lng];
  state.map.zoom = pickerMap.getZoom();
  previewMap.setView(state.map.center, state.map.zoom, { animate: false });
  window.setTimeout(() => previewMap.invalidateSize(false), 0);
}

function bindForm() {
  const tabFields = new Set(["phone", "tearOne", "tearTwo"]);

  Object.entries(FIELD_MAP).forEach(([id, key]) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      state.fields[key] = input.value;
      updateCounter(id, input.value.length);
      if (tabFields.has(key)) renderTabs();
      saveForm();
      renderPreview();
    });
    updateCounter(id, 0);
  });

  elements["area-unit"].addEventListener("change", () => {
    const squareMeters = currentAreaSqMeters();
    state.areaUnit = elements["area-unit"].value;
    if (squareMeters !== null) {
      elements.area.value = areaFromSqMeters(squareMeters, state.areaUnit);
      state.fields.area = elements.area.value;
    }
    saveForm();
    renderPreview();
  });

  document.querySelectorAll(".units-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.units === state.units) return;
      const squareMeters = currentAreaSqMeters();
      setUnits(button.dataset.units);
      if (squareMeters !== null) {
        elements.area.value = areaFromSqMeters(squareMeters, state.areaUnit);
        state.fields.area = elements.area.value;
      }
      try {
        localStorage.setItem(UNITS_STORE, state.units);
      } catch (error) {
        /* localStorage unavailable */
      }
      saveForm();
      renderPreview();
    });
  });

  document.querySelectorAll(".language-button").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
      try {
        localStorage.setItem(LANGUAGE_STORE, button.dataset.language);
      } catch (error) {
        /* localStorage unavailable */
      }
    });
  });

  elements["theme-toggle"].addEventListener("click", () => {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    try {
      localStorage.setItem(THEME_STORE, theme);
    } catch (error) {
      /* localStorage unavailable */
    }
    applyTheme();
  });

  elements["choose-photo"].addEventListener("click", () => elements.photo.click());
  elements["photo-dropzone"].addEventListener("click", (event) => {
    if (event.target !== elements["upload-preview"]) elements.photo.click();
  });
  elements["photo-dropzone"].addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      elements.photo.click();
    }
  });
  elements.photo.addEventListener("change", () => {
    if (elements.photo.files[0]) handlePhoto(elements.photo.files[0]);
  });

  ["dragenter", "dragover"].forEach((name) => {
    elements["photo-dropzone"].addEventListener(name, (event) => {
      event.preventDefault();
      elements["photo-dropzone"].classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((name) => {
    elements["photo-dropzone"].addEventListener(name, (event) => {
      event.preventDefault();
      elements["photo-dropzone"].classList.remove("is-dragging");
    });
  });
  elements["photo-dropzone"].addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    if (file) handlePhoto(file);
  });

  elements["reset-crop"].addEventListener("click", () => {
    state.photo.x = 0;
    state.photo.y = 0;
    state.photo.zoom = 1;
    elements["photo-zoom"].value = "1";
    applyPhotoPosition();
  });
  elements["photo-zoom"].addEventListener("input", () => {
    state.photo.zoom = Number(elements["photo-zoom"].value);
    applyPhotoPosition();
  });
  bindCropDragging();

  elements["search-button"].addEventListener("click", searchLocation);
  elements["map-search"].addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchLocation();
    }
  });

  elements["print-button"].addEventListener("click", async () => {
    const issues = validate();
    if (issues.length) {
      elements["preview-toolbar"].scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (DIRECT_PDF) {
      exportingPdf = true;
      elements["print-button"].disabled = true;
      setPrintButtonLabel();
      try {
        await downloadPdf();
      } catch (error) {
        console.error("PDF export failed", error);
        window.alert(t("pdfError"));
      } finally {
        exportingPdf = false;
        elements["print-button"].disabled = false;
        setPrintButtonLabel();
      }
      return;
    }
    if (previewMap) previewMap.invalidateSize(false);
    window.print();
  });
}

function setPrintButtonLabel() {
  if (!DIRECT_PDF) return;
  elements["print-button"].querySelector('[data-i18n="printButton"]').textContent = t(exportingPdf ? "pdfPreparing" : "downloadPdf");
  document.querySelector('[data-i18n="printHelp"]').textContent = t("pdfHelp");
}

function loadPdfLibraries() {
  if (pdfLibrariesPromise) return pdfLibrariesPromise;
  pdfLibrariesPromise = Promise.all([
    ["vendor/html2canvas.min.js", "html2canvas"],
    ["vendor/pdf-lib.min.js", "PDFLib"]
  ].map(([src, globalName]) => new Promise((resolve, reject) => {
    if (window[globalName]) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      reject(new Error(`Could not load ${src}`));
    };
    document.head.appendChild(script);
  }))).catch((error) => {
    pdfLibrariesPromise = null;
    throw error;
  });
  return pdfLibrariesPromise;
}

async function downloadPdf() {
  await loadPdfLibraries();
  await document.fonts.ready;
  if (previewMap) previewMap.invalidateSize(false);

  // Keep loaded map tiles in the snapshot without fetching them again.
  const tileData = new Map();
  document.querySelectorAll("#preview-map .leaflet-tile-loaded").forEach((tile) => {
    if (!tile.naturalWidth || !tile.naturalHeight) return;
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = tile.naturalWidth;
    tileCanvas.height = tile.naturalHeight;
    tileCanvas.getContext("2d").drawImage(tile, 0, 0);
    tileData.set(tile.src, tileCanvas.toDataURL("image/png"));
  });

  const canvas = await html2canvas(elements["leaflet-sheet"], {
    backgroundColor: "#fff",
    scale: 2,
    useCORS: true,
    logging: false,
    onclone: (clonedDocument) => {
      clonedDocument.getElementById("leaflet-sheet").style.transform = "none";
      clonedDocument.querySelectorAll("#preview-map .leaflet-tile").forEach((tile) => {
        const data = tileData.get(tile.src);
        if (data) tile.src = data;
        else tile.remove();
      });
    }
  });
  const photo = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas encoding failed")), "image/jpeg", 0.84);
  });
  canvas.width = 0;
  canvas.height = 0;

  const pdf = await PDFLib.PDFDocument.create();
  pdf.setTitle("Tearsheet");
  pdf.setCreator("Tearsheet");
  const jpg = await pdf.embedJpg(await photo.arrayBuffer());
  const page = pdf.addPage(A4_LANDSCAPE);
  page.drawImage(jpg, { x: 0, y: 0, width: A4_LANDSCAPE[0], height: A4_LANDSCAPE[1] });
  const url = URL.createObjectURL(new Blob([await pdf.save()], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "Tearsheet.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function updateCounter(id, value) {
  const counter = document.querySelector(`[data-counter-for="${id}"]`);
  if (counter && LIMITS[id]) counter.textContent = `${value}/${LIMITS[id]}`;
}

function setUnits(units, areaUnit = AREA_OPTIONS[units]?.[0]) {
  if (!AREA_OPTIONS[units]) return;
  state.units = units;
  state.areaUnit = AREA_OPTIONS[units].includes(areaUnit) ? areaUnit : AREA_OPTIONS[units][0];
  elements["area-unit"].replaceChildren(...AREA_OPTIONS[units].map((unit) => {
    const option = document.createElement("option");
    option.value = unit;
    option.textContent = AREA_LABELS[unit];
    return option;
  }));
  elements["area-unit"].value = state.areaUnit;
  document.querySelectorAll(".units-button").forEach((button) => {
    const active = button.dataset.units === units;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function saveForm() {
  try {
    sessionStorage.setItem(FORM_STORE, JSON.stringify({ fields: state.fields, areaUnit: state.areaUnit }));
  } catch (error) {
    /* sessionStorage unavailable */
  }
}

function restoreForm() {
  const reload = performance.getEntriesByType("navigation")[0]?.type === "reload";
  let saved = null;
  try {
    if (reload) saved = JSON.parse(sessionStorage.getItem(FORM_STORE) || "null");
    else sessionStorage.removeItem(FORM_STORE);
  } catch (error) {
    /* sessionStorage unavailable */
  }

  if (!reload) elements["leaflet-form"].reset();
  if (saved?.fields && typeof saved.fields === "object") {
    Object.entries(FIELD_MAP).forEach(([id, key]) => {
      const value = saved.fields[key];
      if (typeof value !== "string") return;
      const input = document.getElementById(id);
      input.value = input.maxLength > 0 ? value.slice(0, input.maxLength) : value.slice(0, 2048);
    });
  }
  const areaUnit = saved?.areaUnit;
  setUnits(state.units, areaUnit);
  Object.entries(FIELD_MAP).forEach(([id, key]) => {
    const input = document.getElementById(id);
    state.fields[key] = input.value;
    updateCounter(id, input.value.length);
  });
  renderTabs();
  renderPreview();
}

function setLanguage(language) {
  if (!translations[language]) return;
  state.language = language;
  document.documentElement.lang = language;
  document.title = t("pageTitle");

  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  setPrintButtonLabel();
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = t(element.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-local-map-notice]").forEach((element) => {
    element.textContent = t("localServerRequired");
  });

  if (pickerMarker) pickerMarker.options.title = t("defaultMapLabel");
  document.getElementById("privacy-link").href = `privacy.html#${language}`;
  document.getElementById("footer-privacy").href = `privacy.html#${language}`;
  applyTheme();
  renderPreview();
}

function handlePhoto(file) {
  const request = ++photoRequest;
  state.photo.loading = false;
  scheduleValidation();
  elements["photo-error"].textContent = "";
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    elements["photo-error"].textContent = t("photoTypeError");
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    elements["photo-error"].textContent = t("photoSizeError");
    return;
  }

  state.photo.loading = true;
  scheduleValidation();
  const nextUrl = URL.createObjectURL(file);
  const probe = new Image();
  probe.onload = async () => {
    try {
      const scale = Math.min(1, 1800 / Math.max(probe.naturalWidth, probe.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(probe.naturalWidth * scale);
      canvas.height = Math.round(probe.naturalHeight * scale);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(probe, 0, 0, canvas.width, canvas.height);
      const photo = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
      if (!photo) throw new Error("Photo encoding failed");
      if (request !== photoRequest) return;

      const printUrl = URL.createObjectURL(photo);
      if (state.photo.url) URL.revokeObjectURL(state.photo.url);
      state.photo.url = printUrl;
      state.photo.loading = false;
      state.photo.x = 0;
      state.photo.y = 0;
      state.photo.zoom = 1;
      state.photo.width = canvas.width;
      state.photo.height = canvas.height;
      elements["photo-zoom"].value = "1";
      elements["photo-zoom-control"].hidden = false;
      elements["photo-dropzone"].classList.add("has-image");
      elements["upload-preview"].src = printUrl;
      elements["preview-photo"].src = printUrl;
      elements["reset-crop"].disabled = false;
      elements["preview-photo"].parentElement.classList.add("has-image");
      applyPhotoPosition();
      scheduleValidation();
    } catch (error) {
      if (request === photoRequest) {
        state.photo.loading = false;
        elements["photo-error"].textContent = t("photoReadError");
        scheduleValidation();
      }
    } finally {
      URL.revokeObjectURL(nextUrl);
    }
  };
  probe.onerror = () => {
    URL.revokeObjectURL(nextUrl);
    if (request === photoRequest) {
      state.photo.loading = false;
      elements["photo-error"].textContent = t("photoReadError");
      scheduleValidation();
    }
  };
  probe.src = nextUrl;
}

function bindCropDragging() {
  let drag = null;
  const image = elements["upload-preview"];

  image.addEventListener("pointerdown", (event) => {
    if (!state.photo.url) return;
    event.preventDefault();
    image.setPointerCapture(event.pointerId);
    image.classList.add("is-dragging");
    drag = {
      startX: event.clientX,
      startY: event.clientY,
      photoX: state.photo.x,
      photoY: state.photo.y
    };
  });

  image.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const { maxX, maxY } = photoPanLimits(image);
    state.photo.x = maxX ? clamp(drag.photoX + (event.clientX - drag.startX) / maxX, -1, 1) : 0;
    state.photo.y = maxY ? clamp(drag.photoY + (event.clientY - drag.startY) / maxY, -1, 1) : 0;
    applyPhotoPosition();
  });

  const stop = () => {
    drag = null;
    image.classList.remove("is-dragging");
  };
  image.addEventListener("pointerup", stop);
  image.addEventListener("pointercancel", stop);
}

function applyPhotoPosition() {
  elements["photo-zoom-value"].textContent = `${state.photo.zoom.toFixed(1).replace(/\.0$/, "")}×`;
  if (!state.photo.width || !state.photo.height) return;
  [elements["upload-preview"], elements["preview-photo"]].forEach((image) => {
    const { width, height, maxX, maxY } = photoPanLimits(image);
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    image.style.transform = `translate(-50%, -50%) translate(${state.photo.x * maxX}px, ${state.photo.y * maxY}px)`;
  });
}

function photoPanLimits(image) {
  const frameWidth = image.parentElement.clientWidth;
  const frameHeight = image.parentElement.clientHeight;
  if (!frameWidth || !frameHeight || !state.photo.width || !state.photo.height) {
    return { width: 0, height: 0, maxX: 0, maxY: 0 };
  }
  const scale = Math.max(frameWidth / state.photo.width, frameHeight / state.photo.height) * state.photo.zoom;
  const width = state.photo.width * scale;
  const height = state.photo.height * scale;
  return {
    width,
    height,
    maxX: (width - frameWidth) / 2,
    maxY: (height - frameHeight) / 2
  };
}

async function searchLocation() {
  if (state.map.localFileBlocked) {
    elements["search-status"].textContent = t("localServerRequired");
    return;
  }

  const query = elements["map-search"].value.trim();
  if (!query) {
    elements["search-status"].textContent = t("searchEmpty");
    return;
  }

  const now = Date.now();
  if (now - state.lastSearchAt < 1100) {
    elements["search-status"].textContent = t("searchRate");
    return;
  }
  state.lastSearchAt = now;
  elements["search-button"].disabled = true;
  elements["search-status"].textContent = t("searchLoading");
  elements["search-results"].replaceChildren();

  try {
    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      limit: "5",
      "accept-language": state.language
    });
    const response = await fetch(`${MAP_PROVIDER.geocoder}?${params}`, {
      headers: { Accept: "application/json" },
      // The page sends no referrer by default; Nominatim's usage policy asks for one.
      referrerPolicy: "strict-origin-when-cross-origin"
    });
    if (!response.ok) throw new Error("Search unavailable");
    const results = await response.json();
    if (!results.length) {
      elements["search-status"].textContent = t("searchNone");
      return;
    }
    elements["search-status"].textContent = t("searchResults");
    results.forEach((result) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      button.textContent = result.display_name;
      button.addEventListener("click", () => {
        const point = [Number(result.lat), Number(result.lon)];
        pickerMap.setView(point, 17);
        setMarker(point);
        elements["search-results"].replaceChildren();
        elements["search-status"].textContent = result.display_name;
      });
      elements["search-results"].appendChild(button);
    });
  } catch (error) {
    elements["search-status"].textContent = t("searchError");
  } finally {
    elements["search-button"].disabled = false;
  }
}

function renderPreview() {
  const fields = state.fields;
  elements["preview-badge"].textContent = fields.badge.trim() || t("defaultBadge");
  elements["preview-map-label"].textContent = fields.location.trim() || t("defaultMapLabel");
  elements["preview-location"].textContent = fields.location.trim() || "—";
  elements["preview-title"].textContent = fields.title.trim() || "—";
  const area = numericArea();
  elements["preview-area"].textContent = area === null ? "—" :
    `${new Intl.NumberFormat(state.language === "pl" ? "pl-PL" : "en-US", { maximumFractionDigits: 4 }).format(area)} ${AREA_LABELS[state.areaUnit]}`;
  elements["preview-purpose"].textContent = fields.purpose.trim() || "—";
  elements["preview-utilities"].textContent = fields.utilities.trim() || "—";
  elements["preview-description"].textContent = fields.description.trim() || "—";
  elements["preview-phone"].textContent = fields.phone.trim() || "—";
  elements["preview-qr-caption"].textContent = fields.qrCaption.trim() || t("defaultQrCaption");
  elements["qr-caption-field"].hidden = !fields.redirectUrl.trim();

  renderQr(fields.redirectUrl.trim());
  scheduleValidation();
}

function numericArea() {
  return parseArea(state.fields.area);
}

function currentAreaSqMeters() {
  const value = numericArea();
  return value === null ? null : areaToSqMeters(value, state.areaUnit);
}

function renderQr(value) {
  const valid = isValidHttpUrl(value);
  elements["qr-box"].hidden = !valid;
  elements["qr-lead"].hidden = !valid;
  elements["preview-cta"].classList.toggle("has-qr", valid);

  if (!valid) {
    elements["qr-image"].removeAttribute("src");
    return;
  }

  try {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    elements["qr-image"].src = qr.createDataURL(6, 0);
  } catch (error) {
    elements["qr-box"].hidden = true;
    elements["qr-lead"].hidden = true;
  }
}

function renderTabs() {
  const fragment = document.createDocumentFragment();
  const words = [state.fields.tearOne.trim(), state.fields.tearTwo.trim()].filter(Boolean);

  for (let i = 0; i < 20; i += 1) {
    const tab = document.createElement("div");
    tab.className = "leaflet-tab";

    const tags = document.createElement("div");
    tags.className = "tear-tags";
    words.forEach((word) => {
      const tag = document.createElement("span");
      tag.className = "tear-tag";
      tag.textContent = word;
      tags.appendChild(tag);
    });

    const phoneWrap = document.createElement("div");
    phoneWrap.className = "tear-phone-wrap";
    const phone = document.createElement("span");
    phone.className = "tear-phone";
    phone.textContent = state.fields.phone.trim() || "—";
    phoneWrap.appendChild(phone);
    tab.append(tags, phoneWrap);
    fragment.appendChild(tab);
  }

  elements["preview-tabs"].replaceChildren(fragment);
}

function validate() {
  const fields = state.fields;
  const issues = [];
  const required = [
    ["title", "missingTitle"],
    ["location", "missingLocation"],
    ["purpose", "missingPurpose"],
    ["utilities", "missingUtilities"],
    ["description", "missingDescription"],
    ["phone", "missingPhone"]
  ];

  required.forEach(([field, message]) => {
    if (!fields[field].trim()) issues.push(t(message));
  });

  if (!fields.area.trim() && !elements.area.validity.badInput) issues.push(t("missingArea"));
  else if (numericArea() === null) issues.push(t("invalidArea"));
  if (fields.phone.trim() && !isValidPhone(fields.phone)) {
    issues.push(t("invalidPhone"));
  }
  if (state.photo.loading) issues.push(t("photoProcessing"));
  else if (!state.photo.url) issues.push(t("missingPhoto"));
  if (!state.map.marker) issues.push(t("missingMarker"));
  if (fields.redirectUrl.trim() && !isValidHttpUrl(fields.redirectUrl.trim())) {
    issues.push(t("invalidUrl"));
  }
  if (state.map.localFileBlocked) {
    issues.push(t("localServerRequired"));
  } else if (!state.map.tilesReady || state.map.tileError) {
    issues.push(state.map.tileError ? t("mapTileError") : t("mapLoading"));
  }
  if (hasLayoutOverflow()) issues.push(t("layoutOverflow"));
  return [...new Set(issues)];
}

function hasLayoutOverflow() {
  const description = elements["preview-description"];
  // Font metrics differ between engines. A partial line-height discrepancy is
  // harmless, while an extra clipped line remains a print blocker.
  const verticalTolerance = 12;
  const horizontalTolerance = 4;
  const monitored = [
    description,
    elements["preview-title"],
    elements["preview-phone"],
    ...document.querySelectorAll(".fact-value")
  ];
  return monitored.some((element) => (
    element.scrollHeight > element.clientHeight + verticalTolerance ||
    element.scrollWidth > element.clientWidth + horizontalTolerance
  ));
}

function scheduleValidation() {
  window.clearTimeout(validationTimer);
  validationTimer = window.setTimeout(updateValidation, 80);
}

function updateValidation() {
  const issues = validate();
  const ready = issues.length === 0;
  const phoneInvalid = Boolean(state.fields.phone.trim()) && !isValidPhone(state.fields.phone);
  elements.phone.setAttribute("aria-invalid", String(phoneInvalid));
  elements["phone-error"].textContent = phoneInvalid ? t("invalidPhone") : "";
  const areaInvalid = Boolean(state.fields.area.trim() || elements.area.validity.badInput) && numericArea() === null;
  elements.area.setAttribute("aria-invalid", String(areaInvalid));
  elements["area-error"].textContent = areaInvalid ? t("invalidArea") : "";
  elements["validation-panel"].classList.toggle("is-valid", ready);
  elements["validation-title"].textContent = ready ? t("validationReady") : t("validationNeedsWork");
  elements["validation-list"].replaceChildren();
  issues.forEach((issue) => {
    const item = document.createElement("li");
    item.textContent = issue;
    elements["validation-list"].appendChild(item);
  });
  elements["print-button"].setAttribute("aria-disabled", String(!ready));
}

function scalePreview() {
  const stage = elements["preview-stage"];
  const sheet = elements["leaflet-sheet"];
  const sheetScale = elements["sheet-scale"];
  if (!stage || !sheet || !sheetScale) return;

  const widthScale = stage.clientWidth / sheet.offsetWidth;
  const heightScale = stage.clientHeight / sheet.offsetHeight;
  const scale = Math.min(1, widthScale, heightScale);

  sheet.style.transform = `scale(${scale})`;
  sheetScale.style.width = `${sheet.offsetWidth * scale}px`;
  sheetScale.style.height = `${sheet.offsetHeight * scale}px`;
  if (previewMap) window.setTimeout(() => previewMap.invalidateSize(false), 0);
}

function dockPrintButton() {
  const button = elements["print-button"];
  const toolbar = elements["preview-toolbar"];
  const docked = toolbar.getBoundingClientRect().top <= window.innerHeight - button.offsetHeight - 16;
  button.classList.toggle("is-docked", docked);
}

function init() {
  cacheElements();
  if (DIRECT_PDF) {
    elements["print-button"].querySelector(".button-icon").innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-4-4 4 4 4-4M4 18v3h16v-3"/></svg>';
  }
  document.getElementById("app-version").textContent = `v${APP_VERSION}`;
  bindForm();
  initMaps();
  let savedLanguage = null;
  let savedUnits = null;
  try {
    savedLanguage = localStorage.getItem(LANGUAGE_STORE);
    savedUnits = localStorage.getItem(UNITS_STORE);
  } catch (error) {
    /* localStorage unavailable */
  }
  setUnits(AREA_OPTIONS[savedUnits] ? savedUnits : "metric");
  restoreForm();
  setLanguage(translations[savedLanguage] ? savedLanguage : "en");
  scalePreview();

  dockPrintButton();
  window.addEventListener("scroll", dockPrintButton, { passive: true });
  window.addEventListener("resize", dockPrintButton);

  const resizeObserver = new ResizeObserver(scalePreview);
  resizeObserver.observe(elements["preview-stage"]);
  window.addEventListener("resize", scalePreview);
  window.addEventListener("resize", applyPhotoPosition);
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  window.addEventListener("beforeunload", () => {
    if (state.photo.url) URL.revokeObjectURL(state.photo.url);
  });
  window.addEventListener("beforeprint", () => {
    applyPhotoPosition();
    if (previewMap) previewMap.invalidateSize(false);
  });
  window.addEventListener("afterprint", () => {
    // The browser hasn't always finished reverting layout from the print
    // stylesheet by the time this fires, so measuring immediately can pick
    // up print-sized dimensions and scale the sheet to its full, unfit size.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scalePreview();
        applyPhotoPosition();
        if (previewMap) previewMap.invalidateSize(false);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
