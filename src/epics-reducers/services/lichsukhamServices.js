import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getLichsukham(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHSU_KHAMBENH.format(page, limit, '')}`, { params })
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

export function getChitietKham(makcb) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.CHITIET_KHAMBENH.format(makcb)}`)
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

export function getChitietHenKham(makcb) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.CHITIET_HENKHAM.format(makcb)}`)
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

export function getKhamSucKhoe(makcb) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.CHITIET_KHAMSUCKHOE.format(makcb)}`)
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

export function getPhieuKham(makcb, loaiphieu) {
  return axios
    .get(`${COMMON_APP.HOST_API}/api/kham-suc-khoe?makcb=${makcb}&loaiphieu=${loaiphieu}`)
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

export function getChitietDangKy(makcb) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANGKY_ID.format(makcb)}`)
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

export function getAnhCDHA(mathanhtoan, mahh) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.ANH_CDHA}`, {params: {mathanhtoan, mahh}})
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
