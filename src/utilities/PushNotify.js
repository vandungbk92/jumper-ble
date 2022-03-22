import { Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

let deviceToken = '';

/**
 * Get device push token
 */
export function getDeviceToken() {
  return deviceToken;
}

/**
 * Set number displayed in app icon's badge
 */
export async function setBadgeNumber(number) {
  if (Platform.OS === 'ios') {
    Notifications.setBadgeCountAsync(number);
  }
}

/**
 * Register to receive Push Notifications
 */
export async function registerPushNotifications() {
  // Get the token that uniquely identifies this device
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return '';
    }
    
    const expoPushToken = await Notifications.getExpoPushTokenAsync();
    deviceToken = expoPushToken.data;
  }

  // Create a Notification channel on Android 8.0+
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('notification', {
      name: 'Thông báo',
      showBadge: true,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return deviceToken;
}
