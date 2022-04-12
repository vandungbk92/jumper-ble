import axios from 'axios';
const URL = `http://10.10.20.21:8080/api/pulse-oximeter`

export function postOximeterData(data) {
    return axios
        .post(URL, data)
        .then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return null;
            }
        })
        .catch((error) => {
            console.log(error)
            return null;
        });
}
