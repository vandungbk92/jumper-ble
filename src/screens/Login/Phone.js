import React from 'react';

import * as Yup from 'yup';
import 'yup-phone';

import JwtDecode from 'jwt-decode';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { NavigationEvents } from 'react-navigation';

import { RkText } from 'react-native-ui-kitten';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { CONSTANTS } from '../../constants';
import {
  HOME_PAGE,
  LOGIN_PHONE_PAGE,
  PHONE_VERIFICATION_PAGE,
  REGISTER_PAGE,
  VERIFICATION_USER_PAGE
} from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { showToast } from '../../epics-reducers/services/common';

import { fetchLoginSuccess } from '../../epics-reducers/fetch/fetch-login.duck';
import {getUserInfo, verifyUserPhone} from '../../epics-reducers/services/userServices';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class LoginPhonePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.appColor}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.navigate('HOME_PAGE')}
        >
          <Ionicons
            name="ios-home"
            size={20}
            color={KittenTheme.colors.appColor}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        elevation: 0,
        shadowOffset: {
          height: 0,
        },
        borderBottomWidth: 0,
      },
      headerShown: true,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }

  navigationDidFocus = async () => {
    const { isVerified, userIdToken, verificationId } = this.props.navigation.state?.params || {};
    if (isVerified) {
      const data = await verifyUserPhone(userIdToken, verificationId);
      // Nếu chưa có tài khoản
      if (data && data.token && data.change) {
        showToast('Xác nhận số điện thoại thành công, bạn cần bổ sung thêm tài khoản đăng nhập');
        const thongtin = await getUserInfo(data.token);
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        // this.props.dispatch(fetchUsersInfoSuccess(thongtin));
        this.props.navigation.navigate(REGISTER_PAGE, { thongtin, token: data.token });
      }
      // nếu đã có tài khoán.
      else if (data && data.token) {
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        this.props.navigation.navigate(HOME_PAGE);
      }else if(data && data.multi){
        this.props.navigation.navigate(VERIFICATION_USER_PAGE, { tokenFirebase: userIdToken, verificationId: verificationId });
      }else{
        showToast('Số điện thoại không tồn tại, vui lòng kiểm tra và thử lại.');
      }
    }
  };

  navigationDidBlur = () => {
    this.props.navigation.setParams({ isVerified: false });
  };

  onFormSubmit = async () => {
    try {
      const phoneSchema = Yup.string()
        .label('Số điện thoại')
        .required('${path} không được để trống')
        .phone('VN', false, '${path} không đúng định dạng');
      const phone = await phoneSchema.validate(this.state.phone);
      this.props.navigation.navigate(PHONE_VERIFICATION_PAGE, { route: LOGIN_PHONE_PAGE, phone });
    } catch (error) {
      showToast(error.message);
    }
  };

  render() {
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <NavigationEvents
          onDidFocus={this.navigationDidFocus}
          onDidBlur={this.navigationDidBlur}
        />
        <KeyboardAwareScrollView contentContainerStyle={[tw.flex1, tw.p4]}>
          <View style={tw.flex1}>
            <View style={tw.pY4}>
              <Image
                style={[tw.wFull, tw.h32, tw.resizeContain]}
                source={CONSTANTS.LOGO_HOME}
              />
            </View>
            <View style={tw.pY4}>
              <View style={tw.itemsCenter}>
                <RkText rkType="header3">Đăng nhập qua sms</RkText>
                <RkText style={tw.mT1} rkType="disabled">
                  Vui lòng nhập số điện thoại mà bạn đã đăng ký qua hệ thống
                </RkText>
              </View>
              <View style={tw.mT4}>
                <FormGroup
                  id="phone"
                  type={CONSTANTS.TEXT}
                  value={this.state.phone}
                  editable={true}
                  required={true}
                  placeholder="Số điện thoại"
                  keyboardType="phone-pad"
                  onChangeText={(id, value) => this.setState({ [id]: value })}
                />
              </View>
            </View>
          </View>
          <GradientButton
            text="Tiếp tục"
            style={styleContainer.buttonGradient}
            onPress={this.onFormSubmit}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { loginRes } = state;
  return { loginRes };
}

export default connect(mapStateToProps)(LoginPhonePage);
