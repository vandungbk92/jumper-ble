import React from 'react';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import { HOME_PAGE } from '../../constants/router';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { fetchLogoutRequest } from '../../epics-reducers/fetch/fetch-login.duck';
import { userChangePassword } from '../../epics-reducers/services/userServices';

import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";

class ChangePasswordPage extends React.Component {
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
        {I18n.t('Thay đổi mật khẩu')}
      </RkText>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      oldpassword: '',
      password: '',
      repassword: '',
    };
  }

  onFormSubmit = async () => {
    const dataValidate = [
      { value: this.state.oldpassword, type: CONSTANTS.PASSWORD },
      { value: this.state.password, type: CONSTANTS.PASSWORD },
      { value: this.state.repassword, type: CONSTANTS.PASSWORD },
    ];
    if (!checkValidate(dataValidate)) return;

    if (this.state.password !== this.state.repassword) {
      showToast(I18n.t('re_enter_the_password_incorrectly'));
      return;
    }
    
    const dataRequest = {
      old_password: this.state.oldpassword,
      new_password: this.state.password,
    };


    const data = await userChangePassword(dataRequest);
    if (data) {
      showToast('Vui lòng sử dụng mật khẩu đã thay đổi để đăng nhập');
      await AsyncStorage.removeItem(CONSTANTS._CITIZEN_LOGIN_);
      await this.props.dispatch(fetchLogoutRequest());
      this.props.navigation.navigate(HOME_PAGE);
    }
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <KeyboardAwareScrollView>
          <View style={tw.p4}>
            <FormGroup
              id="oldpassword"
              type={CONSTANTS.TEXT}
              value={this.state.oldpassword}
              editable={true}
              required={true}
              placeholder={I18n.t('password')}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(id, value) => this.setState({ [id]: value })}
            />
            <FormGroup
              id="password"
              type={CONSTANTS.TEXT}
              value={this.state.password}
              editable={true}
              required={true}
              placeholder="Mật khẩu mới"
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
            <GradientButton
              text="Xác nhận"
              style={styleContainer.buttonGradient}
              onPress={this.onFormSubmit}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

export default connect()(ChangePasswordPage);
