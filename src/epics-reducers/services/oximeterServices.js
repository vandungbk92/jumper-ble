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

export function getOximeterData() {
    return axios
        .get(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}`)
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

export function getHistory(date){
    return axios.get(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}/1?date=${date}`).then(res => {
        if(res.data)
            return res.data
        else
            return null
    }).catch(err => {
        console.log(err)
        return null
    })
}
