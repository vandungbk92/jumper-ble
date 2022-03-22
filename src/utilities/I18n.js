import moment from 'moment';
import i18next from 'i18next';
import { withNamespaces, I18nextProvider, NamespacesConsumer, initReactI18next } from 'react-i18next';
import Preference from './Preference';
import { supportedLocales } from '../constants/languages';

// Create instance I18n, use i18nInstance
const i18nInstance = i18next.createInstance();

// Create plugin to detect language
const languageDetector = {
  type: 'languageDetector',
  init: () => { },
  async: true,
  detect: async (callback) => {
    let language = await Preference.getLanguage();
    moment.locale(language);
    callback(language);
  },
  cacheUserLanguage: (language) => {
    moment.locale(language);
    Preference.setLanguage(language);
  }
};

const initialLanguage = 'vi';

export default class I18n {
  static getInstance() {
    return i18nInstance;
  }

  static init(options) {
    return new Promise((resolve, reject) => {
      options = {
        fallbackLng: initialLanguage,
        ...options,
        resources: supportedLocales
      };

      i18nInstance
        .use(languageDetector) // Detect user language
        .use(initReactI18next) // Pass the i18n instance
        .init(options, (error) => {
          if (!error) {
            resolve();
          }
          reject(error);
        });
    });
  }

  static get language() {
    if (i18nInstance.language) {
      return i18nInstance.language;
    }
    return initialLanguage;
  }

  static get languages() {
    return Object.keys(supportedLocales);
  }

  static getLanguage(locale = this.language) {
    let { name, ...args } = supportedLocales[locale];
    return { name, locale, ...args };
  }

  static getLanguages() {
    let languages = [];
    for (let locale in supportedLocales) {
      let language = this.getLanguage(locale);
      languages.push(language);
    }
    return languages;
  }

  static on(name, callback) {
    return i18nInstance.on(name, callback);
  }

  static off(name, callback) {
    return i18nInstance.off(name, callback);
  }

  static t(key, ...options) {
    return i18nInstance.t(key, ...options);
  }

  static tf(key, ...args) {
    let value = i18nInstance.t(key);

    if (args && args.length > 0) {
      value = value.replace(/{(\d+)}/g, (match, i) => {
        return typeof args[i] != 'undefined'
          ? args[i]
          : match
          ;
      });
    }

    return value;
  }

  static exists(key, options) {
    return i18nInstance.exists(key, options);
  }

  static changeLanguage(language, callback) {
    return i18nInstance.changeLanguage(language, callback);
  }
}

export const withI18n = withNamespaces;
export const I18nProvider = I18nextProvider;
export const I18nTranslate = NamespacesConsumer;