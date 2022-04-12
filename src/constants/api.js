export const API = {
  USER_DANGKY: '/api/benhnhan/dang-ky',
  API_IMAGE: '/api/files/{0}',
  API_FILE: '/api/files/files/{0}',
  API_FILE_HISSYNC: '/files/hissync?fileNm={0}',
  USER_DANGNHAP: '/api/users/login',
  USER_TAIKHOAN: '/api/users/tai-khoan',

  USER_ME: '/api/users/me',
  PUT_USER_INFO: '/api/benhnhan/info',
  OTP_CREATE: '/api/otp/create',
  OTP_CONFIRM: '/api/otp/confirm',

  USER_FORGET_PASSWORD: '/api/benhnhan/reset-password',
  USER_CHANGE_PASSWORD: '/api/benhnhan/change-password',

  USER_VERIFY_PHONE: '/api/benhnhan/xac-thuc-dien-thoai',
  USER_VERIFY_FORGOT_PASSWORD: '/api/benhnhan/xac-thuc-quen-mat-khau',
  USER_VERIFY: '/api/benhnhan/xac-thuc-ma-benh-nhan',
  USER_CHANGE_PHONE: '/api/benhnhan/thay-doi-dien-thoai',

  USER_REGISTER_DEVICE: '/api/benhnhan/register-device',
  USER_UNREGISTER_DEVICE: '/api/benhnhan/unregister-device',

  BACSI_QUERY: '/api/dmnhanvien?page={0}&limit={1}{2}',
  BACSI_TRANGCHU: '/api/dmnhanvien/trangchu',

  CAUHOI_QUERY: '/api/benhnhan/hoidap?page={0}&limit={1}{2}',
  CAUHOI_CREATE: '/api/hoidap',

  THONGTIN_CHUNG: '/api/thong-tin-chung',
  THONGTIN_UNGDUNG: '/api/thong-tin-ung-dung',

  DICHVU_DANHGIA: '/api/kham-benh/{0}/danh-gia-dich-vu',
  DICHVU_CANDANHGIA: '/api/kham-benh/{0}/dich-vu-can-danh-gia',

  DANHGIA_DICHVU_QUERY: '/api/benhnhan/luot-danh-gia?page={0}&limit={1}{2}',
  DANHGIA_DICHVU_CHITIET: '/api/benhnhan/luot-danh-gia/{0}',
  DANHGIA_DICHVU: '/api/benhnhan/danh-gia-dich-vu',

  THONGBAO: '/api/benhnhan/thongbao',
  THONGBAO_ID: '/api/thong-bao/{0}',
  THONGBAO_QUERY: '/api/benhnhan/thongbao?page={0}&limit={1}{2}',
  THONGBAOCHUNG_QUERY: '/api/thong-bao-chung?page={0}&limit={1}{2}',

  HOTRO_QUERY: '/api/cau-hoi-thuong-gap?page={0}&limit={1}{2}',
  TINTUC_QUERY: '/api/tintuc?page={0}&limit={1}{2}',
  TINTUC_ID: '/api/tintuc/{0}',
  HUONGDAN_QUERY: '/api/huongdankhambenh?page={0}&limit={1}{2}',
  HUONGDAN_ID: '/api/huongdankhambenh/{0}',

  LICHSU_KHAMBENH: '/api/benhnhan/dangky',
  CHITIET_KHAMBENH: '/api/dangky/{0}/chitiet',
  CHITIET_HENKHAM: '/api/dangky/{0}/henkham',
  CHITIET_KHAMSUCKHOE: '/api/dangky/{0}/ksk',
  DANGKY_ID: '/api/dangky/{0}',
  ANH_CDHA: '/api/anhcdha',

  DONTHUOC_QUERY: '/api/benhnhan/donthuoc',
  KETQUAKHAM_QUERY: '/api/benhnhan/ketquacls',
  DONTHUOC_GHICHU_QUERY: '/api/donthuoc/{0}/ghichu',
  DONTHUOC_GHICHU: '/api/ghichu-donthuoc',
  DONTHUOC_GHICHU_ID: '/api/ghichu-donthuoc/{0}',

  DANHMUC_PHAI: '/api/dmphai?page={0}&limit={1}{2}',
  DANHMUC_DANTOC: '/api/dmdantoc?page={0}&limit={1}{2}',
  DANHMUC_QUOCTICH: '/api/dmquoctich?page={0}&limit={1}{2}',
  DANHMUC_NGHENGHIEP: '/api/dmnghenghiep?page={0}&limit={1}{2}',

  DANHMUC_TINHTHANH: '/api/dmtinhthanh?page={0}&limit={1}{2}',
  DANHMUC_QUANHUYEN: '/api/dmquanhuyen?page={0}&limit={1}{2}',
  DANHMUC_PHUONGXA: '/api/dmphuongxa?page={0}&limit={1}{2}',

  DANHMUC_KHOAKHAMBENH: '/api/dmphong/khoa-kham-benh',

  LICHHEN_QUERY: '/api/benhnhan/lich-hen?page={0}&limit={1}{2}',
  HENKHAM_QUERY: '/api/benhnhan/henkham',
  LICHHEN_ID: '/api/benhnhan/lich-hen/{0}',
  LICHHEN: '/api/lich-hen',

  LICHHEN_BACSY_QUERY: '/api/benhnhan/lichhen-bacsy?page={0}&limit={1}{2}',
  LICHHEN_BACSY_ID: '/api/benhnhan/lichhen-bacsy/{0}',
  LICHHEN_BACSY: '/api/lichhen-bacsy',

  DICHVU: '/api/goi-dich-vu',
  DICHVU_ID: '/api/goi-dich-vu/{0}',
  DANHMUC_DICHVU: '/api/dmgoidichvu',
  DANHMUC_DICHVU_ID: '/api/dmgoidichvu/{0}',

  DANGKY_DICHVU: '/api/dang-ky-goi-dich-vu',
  LICHSU_DICHVU: '/api/benhnhan/goi-dich-vu',
  LICHSU_DICHVU_ID: '/api/benhnhan/goi-dich-vu/{0}',

  QL_THOI_GIAN: '/api/quan-ly-thoi-gian',
  QL_THOI_GIAN_QUERY: '/api/quan-ly-thoi-gian?page={0}&limit={1}{2}',
  QL_THOI_GIAN_ID: '/api/quan-ly-thoi-gian/{0}',

  QL_LICH_LAM_VIEC: '/api/quan-ly-lich-lam-viec',
  LICHKHAMCT: '/api/lichkhamct',
  LICHPHAUTHUATCT: '/api/lichphauthuatct',

  DIUNG: '/api/di-ung',
  DIUNG_ID: '/api/di-ung/{0}',
  DIUNG_QUERY: '/api/benhnhan/diung?page={0}&limit={1}{2}',

  HOSONGUOITHAN: '/api/ho-so-nguoi-than',
  HOSONGUOITHAN_ID: '/api/ho-so-nguoi-than/{0}',
  HOSONGUOITHAN_QUERY: '/api/benhnhan/hosonguoithan?page={0}&limit={1}{2}',

  PHAUTHUATCAYGHEP: '/api/phau-thuat-cay-ghep',
  PHAUTHUATCAYGHEP_ID: '/api/phau-thuat-cay-ghep/{0}',
  PHAUTHUATCAYGHEP_QUERY: '/api/benhnhan/phauthuatcayghep?page={0}&limit={1}{2}',

  KETQUAKHAMBENH: '/api/ket-qua-kham',
  KETQUAKHAMBENH_ID: '/api/ket-qua-kham/{0}',
  KETQUAKHAMBENH_QUERY: '/api/benhnhan/ketquakham?page={0}&limit={1}{2}',
};
