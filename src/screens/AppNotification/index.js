import React from 'react';
import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';
import { RkText } from 'react-native-ui-kitten';

import * as Notifications from 'expo-notifications';
import NotificationPopup from 'react-native-push-notification-popup';

import Navigator from '../../utilities/Navigator';

import {
  HUONGDAN_DETAIL,
  LICHHEN_DETAIL,
  LICHSU_DICHVU_DETAIL,
  LICHSUKHAM_DETAIL,
  TINTUC_DETAIL
} from '../../constants/router';

export default function AppNotification() {
  const popupRef = React.useRef(null);

  React.useEffect(() => {
    const notificationlistener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body, data } = notification.request.content || {};
        if(data.loaithongbao === 'TinTuc'){
          if (data && data._id) {
            popupRef.current?.show({ title, body, onPress: () => Navigator.navigate(TINTUC_DETAIL, { data: { _id: data._id } }) });
          }
        }
        else if(data.loaithongbao === 'HuongDan'){
          if (data && data._id) {
            popupRef.current?.show({ title, body, onPress: () => Navigator.navigate(HUONGDAN_DETAIL, { data: { _id: data._id } }) });
          }
        }
        else if(data.type === 'GOIDICHVU'){
          if (data && data._id) {
            popupRef.current?.show({ title, body, onPress: () => Navigator.navigate(LICHSU_DICHVU_DETAIL, { _id: data.push_link_id, reload: true }) });
          }
        }
        else if(data.type === 'LICHHEN'){
          if (data && data._id) {
            popupRef.current?.show({ title, body, onPress: () => Navigator.navigate(LICHHEN_DETAIL, { _id: data.push_link_id, reload: true }) });
          }
        }
        else{
          if (data && data._id) {
            const khambenh = {
              _id: data.push_link_id,
              tab_id: data.tab_id,
            };
            popupRef.current?.show({ title, body, onPress: () => Navigator.navigate(LICHSUKHAM_DETAIL, { khambenh }) });
          }
        }
      },
    );
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      async ({ notification }) => {
        const { title, body, data } = notification.request.content || {};
        if(data.loaithongbao === 'TinTuc'){
          if (data && data._id) {
            Navigator.navigate(TINTUC_DETAIL, { data: { _id: data._id } });
          }
        }else if(data.loaithongbao === 'HuongDan'){
          if (data && data._id) {
            Navigator.navigate(HUONGDAN_DETAIL, { data: { _id: data._id } });
          }
        }
        else if(data.type === 'GOIDICHVU'){
          if (data && data._id) {
            Navigator.navigate(LICHSU_DICHVU_DETAIL, { _id: data.push_link_id, reload: true });
          }
        }
        else if(data.type === 'LICHHEN'){
          if (data && data._id) {
            Navigator.navigate(LICHHEN_DETAIL, { _id: data.push_link_id, reload: true });
          }
        }
        else{
          if (data && data._id) {
            const khambenh = {
              _id: data.push_link_id,
              tab_id: data.tab_id,
            };
            Navigator.navigate(LICHSUKHAM_DETAIL, { khambenh });
          }
        }
      },
    );

    return () => {
      notificationlistener.remove();
      responseListener.remove();
    }
  }, []);

  return (
    <NotificationPopup
      ref={popupRef}
      renderPopupContent={({ title, body }) => (
        <View style={[ tw.pX4, tw.pY2, tw.shadow, tw.bgWhite, tw.roundedLg, { minHeight: 86 } ]}>
          <RkText rkType="bold">{title}</RkText>
          <RkText numberOfLines={3}>{body}</RkText>
        </View>
      )}
    />
  );
}
