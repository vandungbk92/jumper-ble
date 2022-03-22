
const Colors = {
  appColor: "#2193D2",
  transparent: 'transparent',

  deepSkyblue: '#00bfff',
  darkBlue: '#00003c',
  blueGray: '#9999b1',
  deepSkyblue__2: '#006485',
  deepSkyblue__1: '#0085b2',
  deepSkyblue_2: '#66d8ff',
  deepSkyblue_1: '#32cbff',
  darkBlue__2: '#000000',
  darkBlue__1: '#000010',
  darkBlue_2: '#00005e',
  darkBlue_1: '#00007d',
  blueGray__2: '#525280',
  blueGray__1: '#747498',
  blueGray_2: '#c4c4d1',
  blueGray_1: '#ececef',

  statusWaitConfirm: '#9999b1',
  statusPublic: '#39b54a',
  statusReject: '#e53935',
  statusConfirmed: '#ffa807',

  border: "#f2f2f2",
  link: '#2e78b7',
  white: '#ffffff',
  disabled: '#9999b1',
  hiddenText: "#9999b1",
  primaryText: "#00003c",
  appText: "#00003c",
  labelText: '#9999b1',

  active: '#edf2fa',
  error: '#e53935',
  warning: '#ffc107',
  danger: '#dc3545',
  success: '#28a745',
  primary: '#007bff',
  info: '#17a2b8'
};

const Fonts = {
  SVN_Raleway_Bold: "SVN_Raleway_Bold",
  SVN_Raleway_Light: "SVN_Raleway_Light",
  SVN_Raleway_Italic: "SVN_Raleway_Italic",
  SVN_Raleway_Regular: "SVN_Raleway_Regular"
};

const FontBaseValue = 14;

export const KittenTheme = {
  name: "light",
  colors: {
    appColor: Colors.appColor,
    transparent: Colors.transparent,

    deepSkyblue: Colors.deepSkyblue,
    darkBlue: Colors.darkBlue,
    blueGray: Colors.blueGray,
    deepSkyblue__2: Colors.deepSkyblue__2,
    deepSkyblue__1: Colors.deepSkyblue__1,
    deepSkyblue_2: Colors.deepSkyblue_2,
    deepSkyblue_1: Colors.deepSkyblue_1,
    darkBlue__2: Colors.darkBlue__2,
    darkBlue__1: Colors.darkBlue__1,
    darkBlue_2: Colors.darkBlue_2,
    darkBlue_1: Colors.darkBlue_1,
    blueGray__2: Colors.blueGray__2,
    blueGray__1: Colors.blueGray__1,
    blueGray_2: Colors.blueGray_2,
    blueGray_1: Colors.blueGray_1,

    statusWaitConfirm: Colors.statusWaitConfirm,
    statusPublic: Colors.statusPublic,
    statusReject: Colors.statusReject,
    statusConfirmed: Colors.statusConfirmed,

    border: Colors.border,
    link: Colors.link,
    white: Colors.white,
    disabled: Colors.disabled,
    hiddenText: Colors.hiddenText,
    primaryText: Colors.primaryText,
    labelText: Colors.labelText,

    active: Colors.active,
    error: Colors.error,
    warning: Colors.warning,
    danger: Colors.danger,
    success: Colors.success,
    primary: Colors.primary,
    info: Colors.info
  },
  fonts: {
    sizes: {
      h0: 32,
      h1: 26,
      h2: 24,
      h3: 20,
      h4: 18,
      h5: 16,
      h6: 15,
      p1: 16,
      p2: 15,
      p3: 15,
      p4: 13,
      s1: 15,
      s2: 13,
      s3: 13,
      s4: 12,
      s5: 12,
      s6: 13,
      s7: 10,
    },
    family: {
      regular: Fonts.SVN_Raleway_Regular,
      italic: Fonts.SVN_Raleway_Italic,
      light: Fonts.SVN_Raleway_Light,
      bold: Fonts.SVN_Raleway_Bold,
      logo: Fonts.SVN_Raleway_Regular,
    },
  },
  border: {
    borderRadius: 5,
    borderColor: Colors.blueGray_2,
    borderWidth: 0.5
  }
};
