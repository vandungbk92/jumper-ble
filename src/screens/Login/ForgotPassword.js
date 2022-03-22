import React from 'react';

import * as Yup from 'yup';
import 'yup-phone';


import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { NavigationEvents } from 'react-navigation';

import { RkText } from 'react-native-ui-kitten';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import { RESET_PASSWORD_PAGE, FORGET_PASSWORD_PAGE, PHONE_VERIFICATION_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {verifyUserForgotPassword, verifyUserPhone} from '../../epics-reducers/services/userServices';


export default class ForgotPasswordPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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
    headerStyle: {
      elevation: 0,
      shadowOffset: {
        height: 0,
      },
      borderBottomWidth: 0,
    },
    headerShown: true,
  });

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }

  navigationDidFocus = async () => {
    const { isVerified, userIdToken, verificationId } = this.props.navigation.state?.params || {};
    if (isVerified) {
      const data = await verifyUserForgotPassword({token: userIdToken, verificationId: verificationId});
      if (data && data.token) {
        this.props.navigation.navigate(RESET_PASSWORD_PAGE, { token: data.token });
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
      this.props.navigation.navigate(PHONE_VERIFICATION_PAGE, { route: FORGET_PASSWORD_PAGE, phone });
    } catch (error) {
      if (error.name === 'ValidationError') {
        showToast(error.message);
      }
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
                <RkText rkType="header3">Khôi phục mật khẩu</RkText>
                <RkText style={tw.mT1} rkType="disabled">
                  Vui lòng nhập số điện thoại của bạn
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