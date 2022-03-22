import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RkText, RkButton, RkTextInput } from 'react-native-ui-kitten';
import GradientButton from '../base/gradientButton';
import { CONSTANTS } from '../../constants';
import { fetchLoginSuccess, fetchLoginFailure } from '../../epics-reducers/fetch/fetch-login.duck';
import { connect } from 'react-redux';
import { styleContainer } from '../../stylesContainer';
import { KittenTheme } from '../../../config/theme';
import { showToast, checkValidate } from '../../epics-reducers/services/common';
import { APP_NAVIGATOR, LOGIN_PAGE, LOGIN_PHONE_PAGE, REGISTER_PAGE, FORGET_PASSWORD_PAGE, PHONE_VERIFICATION_PAGE } from '../../constants/router';
import { DEVICE_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants/variable';
import I18n from '../../utilities/I18n';
import { userLogin, getUserInfo, verifyUserPhone } from '../../epics-reducers/services/userServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import {tw} from "react-native-tailwindcss";

class LoginPage extends React.Component {
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
      gestureEnabled: false,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '', // nguyendao
      password: '', // 123456
    };
  }

  navigationDidFocus = async () => {
    const { isVerified, userIdToken } = this.props.navigation.state?.params || {};
    if (isVerified) {
      const data = await verifyUserPhone(userIdToken);
      if (data && data.token) {
        const thongtin = await getUserInfo(data.token);
        showToast('Xác nhận số điện thoại thành công, bạn cần bổ sung thêm tài khoản đăng nhập');
        this.props.navigation.navigate(REGISTER_PAGE, { thongtin, token: data.token });
      }
    }
  };

  navigationDidBlur = () => {
    console.log('navigationDidBlur')
    this.props.navigation.setParams({ isVerified: false });
  };

  onFormPress = async () => {
    const dataValidate = [
      { type: 'username', value: this.state.username },
      { type: 'password', value: this.state.password },
    ];
    if (!checkValidate(dataValidate)) return;

    const dataRequest = {
      taikhoan: this.state.username,
      matkhau: this.state.password,
    };
    const data = await userLogin(dataRequest);
    if (data && data.token) {
      if (data.change) {
        this.props.navigation.navigate(PHONE_VERIFICATION_PAGE, { route: LOGIN_PAGE, phone1: data.dienthoai });
      } else {
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        this.props.navigation.goBack(null);
      }
    }
  }

  render() {
    const { loginRes } = this.props;

    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <NavigationEvents
          onDidFocus={this.navigationDidFocus}
          onDidBlur={this.navigationDidBlur}
        />
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.header}>
            <Image style={styles.image} source={CONSTANTS.LOGO_HOME} />
          </View>
          <View style={styles.content}>
            <View>
              <RkTextInput
                label={I18n.t('username')}
                value={this.state.username}
                labelStyle={{ width: 110 }}
                autoCapitalize="none"
                onChangeText={value => this.setState({ username: value })}
              />
              <RkTextInput
                label={I18n.t('password')}
                value={this.state.password}
                labelStyle={{ width: 110 }}
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={value => this.setState({ password: value })}
              />
              {loginRes && loginRes.token === CONSTANTS.ERROR_AUTHEN ? (
                <RkText rkType="danger">
                  {I18n.t('account_or_password_error')}
                </RkText>
              ) : null}
              <GradientButton
                text={I18n.t('login')}
                style={styleContainer.buttonGradient}
                onPress={this.onFormPress}
              />
            </View>
            <View style={styles.footer}>
              <View style={[styles.textRow, { justifyContent: 'space-between' }]}>
                <RkButton rkType="clear" onPress={() => this.props.navigation.navigate(REGISTER_PAGE)}>
                  <RkText rkType="italic" style={[tw.textLg]}>
                    Đăng ký
                  </RkText>
                </RkButton>
                <RkButton rkType="clear" onPress={() => this.props.navigation.navigate(LOGIN_PHONE_PAGE)}>
                  <RkText rkType="italic" style={[tw.textLg]}>
                    Đăng nhập SMS
                  </RkText>
                </RkButton>
              </View>
              <View style={[styles.textRow, { marginTop: 10, justifyContent: 'flex-end' }]}>
                <RkButton rkType="clear" onPress={() => this.props.navigation.navigate(FORGET_PASSWORD_PAGE)}>
                  <RkText rkType="italic" style={[tw.textLg]}>Quên mật khẩu</RkText>
                </RkButton>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: (DEVICE_HEIGHT - STATUS_BAR_HEIGHT) / 4,
  },
  content: {
    height: ((DEVICE_HEIGHT - STATUS_BAR_HEIGHT) * 2) / 3,
    marginHorizontal: 20,
  },
  image: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  logoText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderColor: KittenTheme.border.borderColor,
    backgroundColor: KittenTheme.colors.appColor,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  footer: {

  },
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  const { loginRes } = state;
  return { loginRes };
}

export default connect(mapStateToProps)(LoginPage);
