// Import all translation
import en from './en';
import vi from './vi';

// Import necessary languages
import 'moment/locale/vi';

// List supported languages
export const supportedLocales = {
  en: {
    name: 'English',
    flag: '',
    translation: en
  },
  vi: {
    name: 'Tiếng Việt',
    flag: '',
    translation: vi
  }
};