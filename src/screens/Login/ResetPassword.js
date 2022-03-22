import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import { LOGIN_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { userForgetPassword } from '../../epics-reducers/services/userServices';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ResetPasswordPage extends React.Component {
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
      password: '',
      repassword: '',
    };
  }

  onFormSubmit = async () => {
    const dataValidate = [
      { value: this.state.password, type: CONSTANTS.PASSWORD },
      { value: this.state.repassword, type: CONSTANTS.PASSWORD },
    ];
    if (!checkValidate(dataValidate)) return;

    if (this.state.password !== this.state.repassword) {
      showToast(I18n.t('re_enter_the_password_incorrectly'));
      return;
    }

    const token = this.props.navigation.getParam('token', '');
    const dataRequest = {
      matkhau: this.state.password,
    };
    const data = await userForgetPassword(dataRequest, token);
    if (data && data.success) {
      showToast('Vui lòng sử dụng mật khẩu đã thay đổi để đăng nhập');
      this.props.navigation.navigate(LOGIN_PAGE);
    }
  };

  render() {
    return (
      <SafeAreaView style={styleContainer.containerContent}>
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
                <RkText rkType="header3">Tạo mới mật khẩu</RkText>
                <RkText style={tw.mT1} rkType="disabled">
                  Vui lòng nhập mật khẩu của bạn
                </RkText>
              </View>
              <View style={tw.mT4}>
                <FormGroup
                  id="password"
                  type={CONSTANTS.TEXT}
                  value={this.state.password}
                  editable={true}
                  required={true}
                  placeholder={I18n.t('password')}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(id, value) => this.setState({ [id]: value })}
                />
                <FormGroup
                  id="repassword"
                  type={CONSTANTS.TEXT}
                  value={this.state.repassword}
                  editable={true}
                  required={true}
                  placeholder={I18n.t('re_password')}
                  autoCapitalize="none"
                  secureTextEntry={true}
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
