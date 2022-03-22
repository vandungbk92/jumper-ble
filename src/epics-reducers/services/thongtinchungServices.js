import axios from 'axios';
import { COMMON_APP, API } from '../../constants';
import { getDeviceToken } from '../../utilities/PushNotify';

export function getThongtinchung() {
  const params = { device_token: getDeviceToken() };

  return axios
    .get(`${COMMON_APP.HOST_API}${API.THONGTIN_CHUNG}`, { params })
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

export function getThongTinUngDung() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.THONGTIN_UNGDUNG}`)
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
