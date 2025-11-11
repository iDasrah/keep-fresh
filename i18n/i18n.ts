import commonEn from "@/i18n/locales/en/common.json";
import errorEn from "@/i18n/locales/en/error.json";
import commonFr from "@/i18n/locales/fr/common.json";
import errorFr from "@/i18n/locales/fr/error.json";
import {initReactI18next} from "react-i18next";
import i18n from "i18next";
import {getLocales} from "expo-localization";

export const defaultNS = "common";
export const resources = {
    en: {
        common: commonEn,
        error: errorEn,
    },
    fr: {
        common: commonFr,
        error: errorFr,
    },
} as const;

void i18n.use(initReactI18next).init({
    lng: getLocales()[0]?.languageCode ?? undefined,
    fallbackLng: "en",
    ns: ["common", "error"],
    resources,
    defaultNS,
});

export default i18n;