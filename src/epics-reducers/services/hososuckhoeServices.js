import axios from 'axios';
import {COMMON_APP, API} from '../../constants';

// dị ứng
export function createDiUng(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.DIUNG}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function updateDiUng(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.DIUNG_ID.format(id)}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function getDiUng(page, limit) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DIUNG_QUERY.format(page, limit)}`)
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

//danh bạ khẩn cấp
export function createHoSo(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.HOSONGUOITHAN}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}
export function updateHoSo(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.HOSONGUOITHAN_ID.format(id)}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function getHoSo(page, limit) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.HOSONGUOITHAN_QUERY.format(page, limit)}`)
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

// Phẩu thuật cấy ghép

export function createPTCG(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.PHAUTHUATCAYGHEP}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function updatePTCG(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.PHAUTHUATCAYGHEP_ID.format(id)}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function getPTCG(page, limit) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.PHAUTHUATCAYGHEP_QUERY.format(page, limit)}`)
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

// kết quả khám bệnh

export function createKetQuaKhamBenh(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.KETQUAKHAMBENH}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}
export function updateKetQuaKhamBenh(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.KETQUAKHAMBENH_ID.format(id)}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch(() => {
      return null;
    });
}

export function getKetQuaKhamBenh(page, limit) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.KETQUAKHAMBENH_QUERY.format(page, limit)}`)
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
