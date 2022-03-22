import { Dimensions, Platform, StatusBar, PixelRatio } from "react-native";
import { Header } from 'react-navigation-stack'

let window = Dimensions.get('window')

export const DEVICE_WIDTH = window.width
export const DEVICE_HEIGHT = window.height
export const STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? 0 : StatusBar.currentHeight
// export const HEADER_HEIGHT = Header.HEIGHT

export const PLATFORM_IOS = (Platform.OS === 'ios')
export const PLATFORM_ANDROID = (Platform.OS === 'android')
export const IS_IPAD = Platform.isPad;
export const ASPECT_RATIO  = window.width / window.height
export const CRYPTR_KEY  = 'DICHBENHCOVID19';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const IS_TABLET = (() => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = DEVICE_WIDTH * pixelDensity;
  const adjustedHeight = DEVICE_HEIGHT * pixelDensity;

  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return true;
  } else {
    return false;
  }
})()
