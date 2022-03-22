import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getDmPhai() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_PHAI.format(0, 0, '')}`)
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

export function getDmDantoc() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_DANTOC.format(0, 0, '')}`)
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

export function getDmQuoctich() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_QUOCTICH.format(0, 0, '')}`)
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

export function getDmNghenghiep() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_NGHENGHIEP.format(0, 0, '')}`)
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

export function getDmTinhthanh() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_TINHTHANH.format(0, 0, '')}`)
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

export function getDmQuanhuyen(matt) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_QUANHUYEN.format(0, 0, `&matt=${matt}`)}`)
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

export function getDmPhuongxa(maqh) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_PHUONGXA.format(0, 0, `&maqh=${maqh}`)}`)
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

export function getDmKhoakhambenh() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.DANHMUC_KHOAKHAMBENH}`)
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
