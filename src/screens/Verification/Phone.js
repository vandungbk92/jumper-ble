import React from 'react';
import * as firebase from 'firebase';

import * as Yup from 'yup';
import 'yup-phone';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import { VERIFICATION_CODE_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { FIREBASE_CONFIG } from '../../configureFirebase';

import {smsSentOtp, verifyUserPhone} from '../../epics-reducers/services/userServices';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import {connect} from "react-redux";

class PhoneVerificationPage extends React.Component {
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
    headerTitle: () => (
      <RkText rkType="header4">
        {I18n.t('Xác nhận số điện thoại')}
      </RkText>
    ),
  });

  constructor(props) {
    super(props);
    const phone = props.navigation.getParam('phone', '');
    this.state = {
      phone: phone,
      loading: false,
    };
    this.recaptchaVerifier = React.createRef();
  }

  onFormSubmit = async () => {
    try {
      const phoneSchema = Yup.string()
        .label('Số điện thoại')
        .required('${path} không được để trống')
        .phone('VN', false, '${path} không đúng định dạng');
      const phone = await phoneSchema.validate(this.state.phone);

      const route = this.props.navigation.getParam('route', '');
      const actionType = this.props.navigation.getParam('actionType', '');
      let extraData = this.props.navigation.getParam('extraData', {});

      if (actionType === 'UPDATE_USER') {
        const respData = await verifyUserPhone({ dienthoai: phone }, extraData.token);
        extraData = respData;
      }
      let {thongtinchung} = this.props;
      if(thongtinchung.smsotp){
        // thêm dữ liệu vào bảng otp sms.
        let sentOtp = await smsSentOtp({phone: phone});
        if(sentOtp){
          let verificationId = sentOtp._id
          console.log(sentOtp, 'sentOtp')
          this.props.navigation.navigate(VERIFICATION_CODE_PAGE, { route, actionType, extraData, verificationId });
        }
      }else{
        const phoneUtil = PhoneNumberUtil.getInstance();
        const phoneNumber = phoneUtil.format(
          phoneUtil.parseAndKeepRawInput(phone, 'VN'),
          PhoneNumberFormat.E164
        );

        this.setState({ loading: true });

        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          this.recaptchaVerifier.current,
        );
        this.props.navigation.navigate(VERIFICATION_CODE_PAGE, { route, actionType, extraData, verificationId });
      }

    } catch (error) {
      console.log(error)
      if (error.name === 'ValidationError') {
        showToast(error.message);
      } else if (error.code === 'auth/captcha-check-failed') {
        showToast('Phản hồi từ máy chủ quá hạn hoặc không hợp lệ');
      } else if (error.code === 'auth/invalid-phone-number') {
        showToast('Số điện thoại không đúng định dạng');
      } else if (error.code === 'ERR_FIREBASE_RECAPTCHA_CANCEL') {
      } else {
        showToast('Xác nhận số điện thoại không thành công');
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const phone1 = this.props.navigation.getParam('phone1', '');

    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <KeyboardAwareScrollView contentContainerStyle={[tw.flex1, tw.p4]}>
          <View style={tw.flex1}>
            <RkText style={tw.textCenter} rkType="disabled">
              Sử dụng số điện thoại của bạn để nhận mã xác nhận
            </RkText>
            <View style={tw.mT4}>
              {!!phone1 && (
                <RkText>
                  Xác nhận lại số điện thoại {phone1} được đăng ký cho tài khoản
                  này
                </RkText>
              )}
              <FormGroup
                id="phone"
                type={CONSTANTS.TEXT}
                value={this.state.phone}
                editable={true}
                required={true}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                containerStyle={tw.mT1}
                onChangeText={(id, value) => this.setState({ [id]: value })}
              />
            </View>
          </View>
          <GradientButton
            text="Gửi mã xác nhận"
            style={styleContainer.buttonGradient}
            loading={this.state.loading}
            onPress={this.onFormSubmit}
          />
          <FirebaseRecaptchaVerifierModal
            ref={this.recaptchaVerifier}
            cancelLabel="Huỷ bỏ"
            languageCode="vi"
            firebaseConfig={FIREBASE_CONFIG}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {thongtinchung} = state;
  return {thongtinchung};
}

export default connect(mapStateToProps)(PhoneVerificationPage);