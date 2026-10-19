"use strict";

// Privacy page: shows the article in the language passed in the hash (#en or #pl, set by the
// app's links), else in the language saved by the app, and keeps the header's language and
// theme controls working. Both choices are stored under the same keys the app uses.
(function () {
  const THEME_STORE = "tearsheet.theme";
  const LANGUAGE_STORE = "tearsheet.language";
  const THEMES = ["auto", "light", "dark"];
  const TEXT = {
    en: {
      title: "Data and privacy · Tearsheet",
      descriptor: "A4 property flyers",
      language: "Language",
      auto: "Theme: follows your system",
      light: "Theme: light",
      dark: "Theme: dark"
    },
    pl: {
      title: "Dane i prywatność · Tearsheet",
      descriptor: "Ulotki nieruchomości A4",
      language: "Język",
      auto: "Motyw: zgodny z systemem",
      light: "Motyw: jasny",
      dark: "Motyw: ciemny"
    }
  };
  // Same icons as the app's theme button (app.js).
  const THEME_ICON = {
    auto: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18z" fill="currentColor"/><circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.3a7 7 0 0 0 11 11.2z"/></svg>'
  };

  const themeButton = document.getElementById("theme-toggle");
  let language = "en";
  let theme = "auto";
  try {
    const stored = localStorage.getItem(THEME_STORE);
    if (THEMES.includes(stored)) theme = stored;
  } catch (error) {
    /* localStorage unavailable */
  }

  function languageFromHash() {
    if (location.hash === "#pl") return "pl";
    if (location.hash === "#en") return "en";
    return null;
  }

  function applyTheme() {
    if (theme === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    const label = TEXT[language][theme];
    themeButton.innerHTML = THEME_ICON[theme];
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
  }

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    document.title = TEXT[language].title;
    document.querySelectorAll("[data-locale]").forEach((article) => {
      article.hidden = article.dataset.locale !== language;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("[data-descriptor]").textContent = TEXT[language].descriptor;
    document.querySelector(".language-switch").setAttribute("aria-label", TEXT[language].language);
    applyTheme();
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
      try {
        localStorage.setItem(LANGUAGE_STORE, language);
      } catch (error) {
        /* localStorage unavailable */
      }
      history.replaceState(null, "", `#${language}`);
    });
  });

  themeButton.addEventListener("click", () => {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    try {
      localStorage.setItem(THEME_STORE, theme);
    } catch (error) {
      /* localStorage unavailable */
    }
    applyTheme();
  });

  window.addEventListener("hashchange", () => {
    const next = languageFromHash();
    if (next) setLanguage(next);
  });

  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem(LANGUAGE_STORE);
  } catch (error) {
    /* localStorage unavailable */
  }
  setLanguage(languageFromHash() || (TEXT[savedLanguage] ? savedLanguage : "en"));
})();
