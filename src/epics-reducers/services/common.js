import {AlertIOS, Platform, ToastAndroid, Alert} from "react-native";
import moment from "moment";
import {COMMON_APP, API, CONSTANTS} from "../../constants";

import {styleContainer} from "../../stylesContainer";
import I18n from "../../utilities/I18n"
import {KittenTheme} from "../../../config/theme";

let isToasting = false
function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (Platform.OS === 'ios') {
    if (!isToasting) {
      isToasting = true;
      Alert.alert(
        I18n.t(""),
        I18n.t(message),
        [
          {
            text: I18n.t("close"), onPress: () => {
              isToasting = false;
              // if (store) store.dispatch(fetchShowToast(false))
              // return null
            }
          }
        ],
        {cancelable: false},
      );
    }
  }
}

function isEmpty(obj) {
  if (!obj) return !obj
  return (Object.getOwnPropertyNames(obj).length === 0);
}

function search(nameKey, myValue, myArray) {
  return myArray.find(o => o[nameKey] === myValue);
}

function clone(object) {
  return JSON.parse(JSON.stringify(object))
}

function getStartDate(type) {
  let d = new Date();
  switch (type) {
    case "WEEK":
      let day = d.getDay();
      return moment(new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "MONTH":
      return moment(new Date(d.getFullYear(), d.getMonth(), 1)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "QUARTER":
      let quarter = Math.floor((d.getMonth() / 3));
      return moment(new Date(d.getFullYear(), quarter * 3, 1)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "YEAR":
      return moment(new Date(new Date().getFullYear(), 0, 1)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
  }
}

function getDueDate(type) {
  let d = new Date();
  switch (type) {
    case "WEEK":
      let day = d.getDay();
      return moment(new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "MONTH":
      return moment(new Date(d.getFullYear(), d.getMonth() + 1, 0)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "QUARTER":
      let quarter = Math.floor((d.getMonth() / 3));
      let firstDate = new Date(d.getFullYear(), quarter * 3, 1);
      return moment(new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
    case "YEAR":
      return moment(new Date(new Date().getFullYear(), 11, 31)).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD);
      break
  }
}

function convertFiles(files) {

  if (!files) return []
  let _filesData = []
  files.map(file => {
    if (file) {
      let _file = {
        name: file.name ? file.name : file,
        download: file.uri ? file.uri : COMMON_APP.HOST_API + API.API_FILE.format(file),
        isUpload: file.name ? true : false
      }
      _filesData.push(_file)
    }
  })
  return _filesData
}

function convertImages(images) { // hiển thị trực tiếp
  if (!images) return []
  let _imagesData = []
  images.filter(image => {
    if (image) {
      let _image = {
        preview: image.uri ? image.uri : (image.file ? image.file : COMMON_APP.HOST_API + API.API_IMAGE.format(image)),
        //name: image.md5 ? image.md5 : image
      }
      _imagesData.push(_image)
    }
  })
  return _imagesData
}

function convertImagesGallery(images, origin) { // hiển thị trên gallery
  if (!images) return []
  let _imageData = []
  images.filter(image => {
    if (image) {
      let _image = {
        source: {uri: (image.uri ? image.uri : (image.file ? image.file : COMMON_APP.HOST_API + API.API_IMAGE.format(image)))},
      }
      if (origin) _image.name = image
      _imageData.push(_image)
    }
  })
  return _imageData
}

function truncateText(data, maxLength) {
  if (data.length > maxLength) {
    data = data.substr(0, maxLength) + "...";
  }
  return data;
}

function convertDataSelected(data, dataId) {
  return [dataId]

  if (!dataId) return null
  let dataSelected = {}
  data.map(service => {
    if (service._id === dataId) {
      dataSelected = {
        value: service._id,
        label: service.name ? service.name : service.full_name
      }
    }
  })
  return dataSelected
}

function convertDataSelectLevelOne(data) {
  let dataRes = [{
    name: "DATA",
    _id: -3,
    display: CONSTANTS.NONE,
    children: []
  }]

  data.map(item => {
    item.full_name ? (item.name = item.full_name) : (item.name = item.name)
    dataRes[0].children.push(item)
  })

  return dataRes
}

function convertDataService(services, typeService) {
  let dataRes = [{
    name: "DATA",
    _id: -3,
    display: CONSTANTS.NONE,
    children: []
  }]
  if (typeService) {

    services.filter(item => {
      let listTypeService = item.type ? item.type : []
      if (listTypeService.indexOf(typeService) >= 0) {
        dataRes[0].children.push(item)
      }
    })
  } else {
    dataRes.children = services
  }

  return dataRes
}

function convertDataSelectLevelTwo(parent, children, nameKey) {
  let dataRes = []
  parent.map(item => {
    let _temp = item
    _temp.children = []
    children.map(child => {
      if (child[nameKey]._id === _temp._id)
        _temp.children.push(child)
    })
    dataRes.push(_temp)
  })
  return dataRes
}

function convertStatusData(status, type) {
  let _status, statusConst;
  switch (type) {
    case CONSTANTS.REQUESTS:
      _status = [{
        name: "DATA",
        _id: -3,
        display: CONSTANTS.NONE,
        children: []
      }]
      status.map(item => {
        if (item._id !== '0' && item._id !== -1)
          _status[0].children.push(item)
      })
      return _status

    case CONSTANTS.MY_REQUESTS:
      _status = [{
        name: "DATA",
        _id: -3,
        display: CONSTANTS.NONE,
        children: []
      }]
      status.map(item => {
        _status[0].children.push(item)
      })
      return _status

    default:
      _status = [{_id: -2, name: I18n.t("all_status"), className: "none"}];
      statusConst = status.filter(item => {
        return item._id !== '0' && item._id !== -1
      })
      _status = _status.concat(statusConst)
      return _status
  }

}

function statusDataFnc() {
  return [
    {_id: -1, name: I18n.t("wait_for_reception"), color: KittenTheme.colors.statusWaitConfirm},
    {_id: '0', name: I18n.t("refuse_to_process"), color: KittenTheme.colors.statusReject},
    {_id: 1, name: I18n.t("processing"), color: KittenTheme.colors.statusConfirmed},
    {_id: 2, name: I18n.t("processed"), color: KittenTheme.colors.statusPublic}
  ]
}

function checkStatusRequest(confirmed, isPublic) {
  if (isPublic) return statusDataFnc()[3]
  if (confirmed === -1) return statusDataFnc()[0]
  if (confirmed === 0) return statusDataFnc()[1]
  if (confirmed === 1) return statusDataFnc()[2]
}

function setColorForStatus(rowData) {
  if (rowData.isPublic) return styleContainer.statusPublic
  switch (rowData.confirmed) {
    case -1:
      return styleContainer.statusWaitConfirm
    case 0:
      return styleContainer.statusReject
    default:
      return styleContainer.statusConfirmed
  }
}

function checkValidate(data) {
  let checkValidate = true
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (item.type === CONSTANTS.EMAIL) {
      checkValidate = item.value ? validateEmail(item.value) : checkValidate
      /*if (!item.value || !item.value.trim()) {
        showToast(I18n.t("please_enter_email"))
        break
      }*/
      if (item.value && !validateEmail(item.value)) {
        showToast(I18n.t("email_invalidate"))
        break
      }
    } else if (item.type === CONSTANTS.PHONE) {
      checkValidate = item.value ? validatePhone(item.value) : checkValidate
      if (item.value && !validatePhone(item.value)) {
        showToast(I18n.t("phone_number_is_incorrect"))
        break
      }
    }
    if (item.type === CONSTANTS.REQUIRED) {
      checkValidate = item.value && (typeof item.value === 'string' ? item.value.trim() : true)
      if (!checkValidate) {
        showToast(I18n.t("please_enter_full_information_text").format(item.alert))
        break
      }
    } else if (item.type === CONSTANTS.NUMBER) {
      checkValidate = !(!item.value || !item.value.toString().trim() || !checkNumber(parseFloat(item.value)))
      if (!item.value || !item.value.toString().trim()) {
        showToast(I18n.t("please_enter_full_information_text").format(item.alert))
        break
      }
      if (!checkValidate) {
        showToast(I18n.t("text_must_be_a_positive_integer").format(item.alert))
        break
      }
    } else if (item.type === CONSTANTS.USERNAME) {
      checkValidate = !(!item.value || !item.value.trim() || item.value.trim().length < 5 || item.value.length < 5 || hasWhiteSpace(item.value))
      if (!item.value || !item.value.trim()) {
        showToast(I18n.t("please_enter_an_username"))
        break
      }
      if (!checkValidate) {
        showToast(I18n.t("username_has_at_least_5_characters_does_not_include_blank_characters"))
        break
      }
    } else if (item.type === CONSTANTS.PASSWORD) {
      checkValidate = !(!item.value || !item.value.trim()) //|| item.value.trim().length < 8 || item.value.length < 8 || hasWhiteSpace(item.value)
      if (!item.value || !item.value.trim()) {
        showToast(I18n.t("please_enter_a_password"))
        break
      }
      if (!checkValidate) {
        showToast(I18n.t("password_has_at_least_8_characters_does_not_include_blank_characters"))
        break
      }
    }
  }
  return checkValidate
}

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  //var re = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  //return re.test(String(phone).toLowerCase());
  return (isNaN(phone) === false && phone.length > 1 && phone.length < 15)
}

function checkRangeOfDateTime(startDate, endDtate) {
  if (!startDate || !endDtate) {
    return true
  } else {
    if ((new Date(startDate)).getTime() > (new Date(endDtate)).getTime()) {
      showToast(I18n.t("inappropriate_time_please_check_back"))
      return false
    } else {
      return true
    }
  }
}

function ingredientData() {
  return [{
    name: "DATA",
    _id: 0,
    display: "NONE",
    children: [
      {_id: "1", name: I18n.t("citizen")},
      {_id: "2", name: I18n.t("enterprise")}
    ]
  }]
}

function convertUnitData(units, service) {
  let dataRes = [{
    name: "DATA",
    _id: -3,
    display: CONSTANTS.NONE,
    children: []
  }]
  dataRes[0].children = units

  return dataRes
}

function formatString(str) {
  if (!str) return;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\s+/g, '_');
  return str;
}

export {
  showToast,
  isEmpty,
  search,
  getStartDate,
  getDueDate,
  convertFiles,
  convertImagesGallery,
  convertImages,
  clone,
  truncateText,
  convertDataSelected,
  convertStatusData,
  checkValidate,
  checkStatusRequest,
  setColorForStatus,
  validatePhone,
  checkRangeOfDateTime,
  convertDataSelectLevelOne,
  convertDataSelectLevelTwo,
  statusDataFnc,
  ingredientData,
  convertUnitData,
  convertDataService,
  formatString
}
