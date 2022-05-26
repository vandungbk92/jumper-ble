import axios from 'axios';
import {API, COMMON_APP} from "../../constants";
import * as RNFS from "react-native-fs";

export function putSetting(data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.SETTING}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getSetting() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.SETTING}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
