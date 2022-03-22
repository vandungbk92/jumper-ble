import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getKetquakham() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.KETQUAKHAM_QUERY}`)
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
