import AsyncStorage from '@react-native-async-storage/async-storage';

import { CONSTANTS } from '../constants';

export default class Preference {
  static async getLanguage() {
    let value = await AsyncStorage.getItem(CONSTANTS.PREF_LANGUAGE);
    if (!value) {
      value = CONSTANTS.DEF_LANGUAGE;
    }
    return value;
  }

  static setLanguage(value) {
    return AsyncStorage.setItem(CONSTANTS.PREF_LANGUAGE, value);
  }

  static clearLanguage() {
    return AsyncStorage.removeItem(CONSTANTS.PREF_LANGUAGE);
  }
}