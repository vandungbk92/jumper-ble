import axios from 'axios';
import {COMMON_APP, API} from '../../constants';
import {getDeviceToken} from '../../utilities/PushNotify';

export function userLogin(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_DANGNHAP}`, data)
    .then((res) => {
        console.log(res)
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

export function userRegister(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_DANGKY}`, data)
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

export function getUserInfo(token) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.USER_ME}`, token && {
      headers: {Authorization: `Bearer ${token}`}
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

export function updateUserInfo(data, token) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.USER_TAIKHOAN}`, data, {
      headers: {Authorization: `Bearer ${token}`}
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

export function registerDevice() {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_REGISTER_DEVICE}`, {deviceToken: getDeviceToken()})
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

export function unregisterDevice() {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_UNREGISTER_DEVICE}`, {deviceToken: getDeviceToken()})
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

export function verifyUserPhone(token, verificationId) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_VERIFY_PHONE}`, {token, verificationId, device_token: getDeviceToken()})
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export function verifyUserForgotPassword(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_VERIFY_FORGOT_PASSWORD}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export function verifyUser(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_VERIFY}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export function putUserInfoByToken(data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.PUT_USER_INFO}`, data)
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

export function userChangePhone(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USER_CHANGE_PHONE}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export function userForgetPassword(data, token) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.USER_FORGET_PASSWORD}`, data, {
      headers: {Authorization: `Bearer ${token}`}
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

export function userChangePassword(data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.USER_CHANGE_PASSWORD}`, data)
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

export function smsSentOtp(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.OTP_CREATE}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

export function smsConfirmOtp(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.OTP_CONFIRM}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}
