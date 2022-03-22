import { Linking, Platform } from 'react-native';

import { showToast } from '../epics-reducers/services/common';

export async function callPhone(phone) {
  try {
    const uri = `tel:${phone}`;
    const supported = await Linking.canOpenURL(uri);
    if (supported) {
      Linking.openURL(uri);
    } else {
      showToast('Thiết bị không thể gọi điện thoại');
    }
  } catch (error) {
    showToast('Thực hiện gọi điện thoại không thành công');
  }
}
