import axios from 'axios';
import {COMMON_APP, API} from '../../constants';

export function getLichHen(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHHEN_BACSY_QUERY.format(page, limit, '')}`, {params})
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

export function getLichHenById(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHHEN_BACSY_ID.format(id)}`)
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

export function createLichHen(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.LICHHEN_BACSY}`, data)
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

export function getGioiHanThoiGianLK() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHKHAMCT}/gioi-han-ngay`)
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

export function getThoiGianLK(query) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHKHAMCT}/thoi-gian` + query)
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

export function getGioiHanThoiGianPT() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHPHAUTHUATCT}/gioi-han-ngay`)
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

export function getThoiGianPT(query) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHPHAUTHUATCT}/thoi-gian` + query)
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