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
      return null;
    });
}

export function getOximeterData(page, limit, query) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER.format(page, limit, query)}`)
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

export function getOximeterDetail() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER_DETAL}`)
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

export function getHistory(date) {
  return axios.get(`${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}/1?date=${date}`).then(res => {
    if (res.data)
      return res.data.data
    else
      return null
  }).catch(err => {
    return null
  })
}

export function postFileDatav2(uri, date){
  console.log(`file://${uri}`, '11111111');
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"}
  }
  const path = `${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}`
  const formData = new FormData();
  formData.append("oximeter", {
    uri: `file://${uri}`,
    name: `data.txt`,
    type: 'text/plain',
  });
  return axios.post(path, formData, config).then(response => {
    const data = response.data;
    console.log(data, 'datadatadata')
    return data
  }).catch(error => {
    console.log(error, error.message, 'datadatadata')
    return null
  });
}

export function postFileData(uri, name, typeRecord) {
  const config = {
    headers: {"content-type": "multipart/form-data", "Content-Type": "multipart/form-data"},
    hiddenLoading: true
  }
  const path = `${COMMON_APP.HOST_API}${API.PULSE_OXIMETER}`
  const formData = new FormData();
  formData.append("oximeter", {
    uri: `file://${uri}`,
    name: name,
    type: 'text/plain',
  });
  //{"_parts":[["oximeter",{"uri":"file:///data/user/0/vn.thinklabs.thospital/files/202205241808.txt","name":3,"type":"text/plain"}]]}
  //{"_parts":[["oximeter",{"uri":"file:///data/user/0/vn.thinklabs.thospital/files/data.txt","name":"data.txt","type":"text/plain"}]]}
  //post http://192.168.1.10:8080/api/pulse-oximeter
  //"name": "202205241807.txt",
    //"path": "/data/user/0/vn.thinklabs.thospital/files/202205241807.txt",

  formData.append("typeRecord", typeRecord);
  return axios.post(path, formData, config).then(response => {
    const data = response.data;
    return data
  }).catch(error => {
    return null
  });
}
