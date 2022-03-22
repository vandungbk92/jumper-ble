import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getBacsi(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.BACSI_QUERY.format(page, limit, '')}`, { params })
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

export function getBacsiTrangchu() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.BACSI_TRANGCHU}`)
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
