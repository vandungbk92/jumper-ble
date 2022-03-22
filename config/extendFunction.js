import moment from "moment"
import axios from "axios"
import { LogBox } from "react-native";
import { showToast } from "../src/epics-reducers/services/common";
import {fetchLoading} from "../src/epics-reducers/fetch/fetch-loading.duck";
import I18n from "../src/utilities/I18n";
import {fetchLoginFailure} from "../src/epics-reducers/fetch/fetch-login.duck";
import {fetchUsersInfoFailure} from "../src/epics-reducers/fetch/fetch-users-info.duck";

export const extendFunction = (store) => {
  let apiReq = 0, apiRes = 0
  LogBox.ignoreAllLogs()
  axios.interceptors.request.use(function (config) {
    if (__DEV__) console.log(config.method, config.url, JSON.stringify(config.data))
    let isLoading = store.getState().isLoading
    if (!isLoading) {
      store.dispatch(fetchLoading(true))
    }

    apiReq++;
    
    let token = store.getState().loginRes.token
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token
    }
    config.timeout = 30000;
    return config;
  }, function (error) {
    return Promise.reject(error);
  })

  axios.interceptors.response.use(res => {
    // console.log(res.data, 'resresres')
    apiRes++
    let isLoading = store.getState().isLoading
    if (apiRes === apiReq && isLoading) {
      store.dispatch(fetchLoading(false))
    }

    if (apiRes === apiReq && res.data.success === false) {
      let message = res.data && res.data.message ? res.data.message : I18n.t("show_error")
      res.data = null
      showToast(message)
    }
    return res
  }, error => {
    // console.log(error, error.response, error.message, 'errorerrorerror')
    apiRes++
    let isLoading = store.getState().isLoading
    if (apiRes === apiReq && isLoading) {
      store.dispatch(fetchLoading(false))
    }

    if (error.response && error.response.status === 401) {
      store.dispatch(fetchLoginFailure({}))
      store.dispatch(fetchUsersInfoFailure({}))
    }

    let message = I18n.t("show_error")
    if (error.response && error.response.data && error.response.data.message) message = error.response.data.message
    showToast(message)

    return Promise.reject(error)
  })

  moment.updateLocale("en", {
    relativeTime: {
      future: I18n.t("in_s"),
      past: I18n.t("s_ago"),
      s: I18n.t("a_few_seconds"),
      ss: I18n.t("d_seconds"),
      m: I18n.t("a_minute"),
      mm: I18n.t("d_minutes"),
      h: I18n.t("an_hour"),
      hh: I18n.t("d_hours"),
      d: I18n.t("a_day"),
      dd: I18n.t("d_days"),
      M: I18n.t("a_month"),
      MM: I18n.t("d_months"),
      y: I18n.t("a_year"),
      yy: I18n.t("d_years"),
    }
  });

  if (!String.prototype.format) { // define format of string
    String.prototype.format = function () {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != "undefined"
          ? args[number]
          : match
          ;
      });
    };
  }
}
