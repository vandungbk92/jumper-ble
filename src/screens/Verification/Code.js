import React from 'react';

import * as Yup from 'yup';
import * as firebase from 'firebase';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import I18n from '../../utilities/I18n';
import { CONSTANTS } from '../../constants';

import { showToast } from '../../epics-reducers/services/common';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {connect} from "react-redux";
import {smsConfirmOtp} from "../../epics-reducers/services/userServices";

class VerificationCodePage extends React.Component {
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
        {I18n.t('Xác nhận mã')}
      </RkText>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      verificationCode: '',
    };
  }

  onFormSubmit = async () => {
    try {
      const schema = Yup.string()
        .label('Mã xác nhận')
        .required('${path} không được để trống')
        .length(6, '${path} yêu cầu dài ${length} ký tự');
      const verificationCode = await schema.validate(this.state.verificationCode);

      this.setState({ loading: true });

      const verificationId = this.props.navigation.getParam('verificationId', '');

      let {thongtinchung} = this.props;
      if(thongtinchung.smsotp){
        let otpconfirm = await smsConfirmOtp({id: verificationId, otp: verificationCode});
        const route = this.props.navigation.getParam('route', '');
        if(otpconfirm){
          console.log(otpconfirm, route, 'otpconfirmotpconfirm');
          this.props.navigation.navigate(route, { isVerified: true,  verificationId: verificationId});
        }
      }else{
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );

        const { user } = await firebase.auth().signInWithCredential(credential);
        const userIdToken = await user.getIdToken();

        const route = this.props.navigation.getParam('route', '');
        this.props.navigation.navigate(route, { isVerified: true, userIdToken });
      }

    } catch (error) {
      console.log(error, 'errorerrorerrorerror')
      if (error.name === 'ValidationError') {
        showToast(error.message);
      } else if (error.code === 'auth/user-disabled') {
        showToast('Tài khoản người dùng số điện thoại này đã bị khoá');
      } else if (error.code === 'auth/invalid-verification-code') {
        showToast('Mã xác nhận không hợp lệ');
      } else if (error.code === 'auth/invalid-verification-id') {
        showToast('Không thể xác nhận số điện thoại này');
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <KeyboardAwareScrollView contentContainerStyle={[tw.flex1, tw.p4]}>
          <View style={tw.flex1}>
            <RkText style={tw.textCenter} rkType="disabled">
              Vui lòng kiểm tra tin nhắn được gửi về số điện thoại của bạn
            </RkText>
            <View style={tw.mT4}>
              <FormGroup
                id="verificationCode"
                type={CONSTANTS.TEXT}
                value={this.state.verificationCode}
                editable={true}
                required={true}
                maxLength={6}
                placeholder="Mã xác nhận"
                keyboardType="numeric"
                onChangeText={(id, value) => this.setState({ [id]: value })}
              />
            </View>
          </View>
          <GradientButton
            text="Xác nhận mã"
            style={styleContainer.buttonGradient}
            loading={this.state.loading}
            onPress={this.onFormSubmit}
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

export default connect(mapStateToProps)(VerificationCodePage);