const LOGO = require("../assets/logo.png");
const LOGO_HOME = require("../assets/logo.png");

const IMAGE_SLIDE_1 = require("../assets/slides/tclinic_1.jpeg");
const IMAGE_SLIDE_2 = require("../assets/slides/tclinic_2.jpeg");
const IMAGE_SLIDE_3 = require("../assets/slides/tclinic_3.jpeg");

const AVATAR_NAM = require("../assets/avatar.jpg");
const AVATAR_NU = require("../assets/avatar_nu.jpg");

export const CONSTANTS = {
    _CITIZEN_LOGIN_: "_CITIZEN_LOGIN_",
    CONFIRM: "CONFIRM",
    CANCEL: "CANCEL",
    DEF_LANGUAGE: "vi",
    PREF_LANGUAGE: "language",
    TIME_ZONE: "",
    PHONE_CARD_DETAIL: "PHONE_CARD_DETAIL",
    VOUCHER_DETAIL: "VOUCHER_DETAIL",
    BUILD: "2.0.0",
    VERSION: "2.0.0 (2018)",
    LIMIT_SIZE_OF_FILE: 10000000,
    NONE: "NONE",
    PHONE_NUMBER: "+84868609536",
    BIGGER: 25,
    LARGE: 20,
    NORMAL: 16,
    SMALL: 14,
    TINY: 10,
    STORAGE_KEY_WAITING: "STORAGE_WAITING_REQUEST",
    MY_REQUESTS: "MY_REQUESTS",
    REQUESTS: "REQUESTS",
    LIST: "LIST",
    GRID: "GRID",
    GUEST: "GUEST",
    LOGO: LOGO,
    LOGO_HOME: LOGO_HOME,
    IMAGE_SLIDE_1: IMAGE_SLIDE_1,
    IMAGE_SLIDE_2: IMAGE_SLIDE_2,
    IMAGE_SLIDE_3: IMAGE_SLIDE_3,
    AVATAR_NAM: AVATAR_NAM,
    AVATAR_NU: AVATAR_NU,
    SUCCESS: "success",
    INFO: "info",
    ERROR: "error",
    WARNING: "warning",
    CODE_ADMIN: "ADMIN",
    CODE_MANAGER: "MANAGER",
    CODE_STAFF: "STAFF",
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    VIEW: "VIEW",
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    RESTORE: "RESTORE",
    EXIT: "EXIT",
    CONTINUE: "CONTINUE",
    FIRST: "FIRST",
    LAST: "LAST",
    NEXT: "NEXT",
    PREV: "PREV",
    SHOW: "SHOW",
    HIDE: "HIDE",
    CONFIRMED: "CONFIRMED",
    PUBLIC: "PUBLIC",
    TEXT: "text",
    TEXT_AREA: "textarea",
    DATE_TIME: "DATE_TIME",
    NUMBER: "number",
    EMAIL: "email",
    REQUIRED: "required",
    PHONE: "phone",
    USERNAME: "username",
    PASSWORD: "password",
    SELECT: "select",
    TREE_SELECT: "tree-select",
    CHECKBOX: "checkbox",
    RADIO: "radio",
    DATE: "date",
    BLOCK: "block",
    PAGE: "page",
    SERVICE: "service",
    UNIT: "unit",
    DISTRICT: "district",
    CITIZEN: "citizen",
    FROM_DATE: "from_date",
    TO_DATE: "to_date",
    FILE_DROPZONE: "file_dropzone",
    IMAGE_DROPZONE: "image_dropzone",
    IMAGE_DROPZONE_THUMBNAILS: "image_dropzone_thumbnails",
    IMAGE_SELECT: "IMAGE_SELECT",
    FILE_SELECT: "FILE_SELECT",
    ITEM_PER_PAGE: 10,
    GOOGLE_API_KEY: "AIzaSyDyUiHgntKm-_c2BrI2Ov54xz6E2jtSxUM",
    GOOGLE_MAPS_URL:
        "https://maps.googleapis.com/maps/api/js?libraries=places&v=3.31&",
    DEFAULT_LAT: 19.807151,
    DEFAULT_LNG: 105.795327,
    DEFAULT_ZOOM: 17,
    GOOGLE_RECAPTCHA_KEY: "6Le3D1AUAAAAAEda06VLj4hw_UPF2A4ygQyqJ1yx",
    FACEBOOK_API_KEY: "770310276640580",
    DATE_FORMAT: "DD-MM-YYYY",
    DATE_FORMAT1: "DD/MM/YYYY",
    DATE_TIME_FORMAT: "DD-MM-YYYY HH:mm:ss",
    DATE_TIME_FORMAT1: "DD/MM/YYYY - HH:mm",
    DATE_FORMAT_YYY_MM_DD: "YYYY-MM-DD",
    DATE_TIME_FORMAT_YYY_MM_DD: "YYYY-MM-DD HH:mm:ss",
    WEEK: "WEEK",
    MONTH: "MONTH",
    YEAR: "YEAR",
    ASC: 1,
    DEC: -1,
    WAS_VALIDATED: "was-validated",
    SETTING: {
        item_per_page: "10",
        format_date: "DD-MM-YYYY",
        total_images: 5,
        total_files: 5,
        google_key: "",
    },
    MAX_LENGTH_DATA: "150",
    REJECT: "REJECT",
    ERROR_AUTHEN: "ERROR_AUTHEN",

    WARNING_SETTINGS: "WARNING_SETTINGS",
};

export const TRANGTHAI_DICHVU_ID = {
    CHO_XACNHAN: -1,
    TUCHOI: 0,
    DA_XACNHAN: 1,
    DA_HOANTHANH: 2,
};

export const TRANGTHAI_DICHVU = {
    [TRANGTHAI_DICHVU_ID.CHO_XACNHAN]: "Chờ xác nhận",
    [TRANGTHAI_DICHVU_ID.TUCHOI]: "Từ chối",
    [TRANGTHAI_DICHVU_ID.DA_XACNHAN]: "Đã xác nhận",
    [TRANGTHAI_DICHVU_ID.DA_HOANTHANH]: "Đã hoàn thành",
};

export const MOIQUANHE = [
    { _id: "Bố", name: "Bố" },
    { _id: "Mẹ", name: "Mẹ" },
    { _id: "Chồng", name: "Chồng" },
    { _id: "Vợ", name: "Vợ" },
    { _id: "Con trai", name: "Con trai" },
    { _id: "Con gái", name: "Con gái" },
    { _id: "Anh", name: "Anh" },
    { _id: "Chị", name: "Chị" },
    { _id: "Em trai", name: "Em trai" },
    { _id: "Em gái", name: "Em gái" },
    { _id: "Ông", name: "Ông" },
    { _id: "Bà", name: "Bà" },
    { _id: "Chú/Bác", name: "Chú/Bác" },
    { _id: "Cô/Dì", name: "Cô/Dì" },
    { _id: "Khác", name: "Khác" },
];
