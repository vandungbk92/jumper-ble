import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getDanhgia(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DICHVU_DANHGIA.format(id)}`)
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

export function getCanDanhgia(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DICHVU_CANDANHGIA.format(id)}`)
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

export function danhgiaDichvu(id, data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DICHVU_DANHGIA.format(id)}`, data)
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
