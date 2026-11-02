import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";
import gu from "./locales/gu.json";

const supportedLanguages = new Set(["en", "hi", "mr", "gu"]);
const storedLanguage = (() => {
  if (typeof window === "undefined") return "en";
  const value = window.localStorage.getItem("kirana_language");
  return value && supportedLanguages.has(value) ? value : "en";
})();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    gu: { translation: gu },
  },
  lng: storedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined" && supportedLanguages.has(language)) {
    window.localStorage.setItem("kirana_language", language);
  }
});

export default i18n;
