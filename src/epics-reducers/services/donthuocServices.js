import axios from 'axios';
import {COMMON_APP, API} from '../../constants';

export function getDonthuoc() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DONTHUOC_QUERY}`)
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

export function getGhiChuDonthuoc(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DONTHUOC_GHICHU_QUERY.format(id)}`)
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

export function postGhiChuDonthuoc(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DONTHUOC_GHICHU}`, data)
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

export function putGhiChuDonthuoc(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.DONTHUOC_GHICHU_ID.format(id)}`, data)
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
