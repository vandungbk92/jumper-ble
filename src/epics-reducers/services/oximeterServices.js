import axios from 'axios';
import {API, COMMON_APP} from "../../constants";
import * as RNFS from "react-native-fs";

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
        console.log(res.data)
        if(res.data)
            return res.data.data
        else
            return null
    }).catch(err => {
        console.log(err)
        return null
    })
}

export function postFileData(uri, date){
    const config = {
        headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
    }
    const path = `${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}/1?date=${date}`
    const formData = new FormData();
    formData.append("oximeter", {
        uri: `file://${uri}`,
        name: `test.txt`,
        type: 'text/plain',
    });
    return axios.post(path, formData, config).then(response => {
        const data = response.data;
        return data
    }).catch(error => {
        console.log(error)
        return null
    });
}
