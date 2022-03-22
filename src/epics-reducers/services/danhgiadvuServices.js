import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getDanhgiaDvu(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHGIA_DICHVU_QUERY.format(page, limit, '')}`, { params })
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

export function getChiTietDanhGia(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHGIA_DICHVU_CHITIET.format(id)}`)
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

export function getDvuDanhgia(makcb) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHGIA_DICHVU}`, {params: {makcb: makcb}})
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

export function danhgiaDichvu(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DANHGIA_DICHVU}`, data)
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
