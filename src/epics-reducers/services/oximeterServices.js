import axios from 'axios';
import {API, COMMON_APP} from "../../constants";

export function postOximeterData(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.log(error)
      return null;
    });
}
