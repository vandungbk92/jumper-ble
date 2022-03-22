import axios from 'axios';
import {COMMON_APP, API} from '../../constants';

export function getLichHen(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.LICHHEN_QUERY.format(page, limit, '')}`, {params})
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

export function getHenKham(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.HENKHAM_QUERY}`)
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
    .get(`${COMMON_APP.HOST_API}${API.LICHHEN_ID.format(id)}`)
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
    .post(`${COMMON_APP.HOST_API}${API.LICHHEN}`, data)
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

export function getGioiHanThoiGian() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.QL_LICH_LAM_VIEC}/gioi-han-ngay`)
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

export function getThoiGian(query) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.QL_LICH_LAM_VIEC}/thoi-gian` + query)
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

export function thanhtoanFunc(amount, orderDescription) {
  return axios
    .post(`${COMMON_APP.HOST_API}/api/payment/create-payment-url`, {
      orderType: 'billpayment',
      amount: amount,
      bankCode: '',
      orderDescription: orderDescription,
      language: 'vn'
    })
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