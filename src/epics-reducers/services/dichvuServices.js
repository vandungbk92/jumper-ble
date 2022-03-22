import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getDanhmucDichvu() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_DICHVU}`)
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

export function getDanhSachDichvu() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DICHVU}`, {params: {page: 1, limit: 0}})
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

export function getDanhmucDichvuById(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_DICHVU_ID.format(id)}`, {params: {goidichvu: true}})
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

export function getDichvuById(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DICHVU_ID.format(id)}`)
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

export function createDichvu(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DICHVU}`, data)
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

export function dangkyDichvu(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DANGKY_DICHVU}`, data)
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

export function getLichsuDichvu() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHSU_DICHVU}`)
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

export function getChiTietDichvu(id) {
    return axios
        .get(`${COMMON_APP.HOST_API}${API.LICHSU_DICHVU_ID.format(id)}`)
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
