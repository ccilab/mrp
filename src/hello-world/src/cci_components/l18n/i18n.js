import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// https://github.com/ccilab/i18next-browser-languageDetector
let langDetectorOpt = {
  // order and from where user language should be detected
  order: ['navigator', 'querystring', 'cookie', 'localStorage',  'htmlTag', 'path', 'subdomain'],
  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement
};

// https://www.i18next.com/overview/api
i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    ns:['commands','componentList', 'warning', 'component', 'inventoryRecords', 'operations'],  //name space localized json file names
    defaultNS: 'componentList',
    fallbackLng: 'en',
    debug: true,  // console log
    detection: langDetectorOpt,
    //load: 'languageOnly',  // skipping resion code US, -CN, -TW
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default, https://www.i18next.com/translation-function/interpolation
    },
    
    backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json"   //parent folder is public
      },
 });

export default i18n;