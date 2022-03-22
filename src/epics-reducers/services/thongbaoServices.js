import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getThongbaoChung(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.THONGBAOCHUNG_QUERY.format(page, limit, '')}`, { params })
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

export function getThongbao(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.THONGBAO_QUERY.format(page, limit, '')}`, { params })
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

export function updateThongbao(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.THONGBAO_ID.format(id)}`, data)
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

export function deleteThongbao(id) {
  return axios
    .delete(`${COMMON_APP.HOST_API}${API.THONGBAO_ID.format(id)}`)
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

export function readAllThongbao() {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.THONGBAO}`)
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

export function removeAllThongbao() {
  return axios
    .delete(`${COMMON_APP.HOST_API}${API.THONGBAO}`)
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
