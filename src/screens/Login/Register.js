import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { RkButton, RkText, RkTextInput } from 'react-native-ui-kitten';
import GradientButton from '../base/gradientButton'
import { CONSTANTS } from '../../constants';
import {LOGIN_PAGE, REGISTER_PAGE, PHONE_VERIFICATION_PAGE, HOME_PAGE} from '../../constants/router';
import { styleContainer } from '../../stylesContainer';
import { showToast, checkValidate } from '../../epics-reducers/services/common';
import { userRegister, updateUserInfo } from '../../epics-reducers/services/userServices';
import FormGroup from '../base/formGroup';
import I18n from '../../utilities/I18n';
import { KittenTheme } from '../../../config/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDmPhai } from '../../epics-reducers/services/danhmucServices';
import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import {fetchUsersInfoSuccess} from "../../epics-reducers/fetch/fetch-users-info.duck";
import {connect} from "react-redux";

class RegisterPage extends React.Component {
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
  });

  constructor(props) {
    super(props);
    const data = props.navigation.getParam('thongtin', {});
    this.state = {
      taikhoan: '',
      matkhau: '',
      matkhau1: '',
      
      hoten: data?.hoten || '',
      ngaysinh: data?.ngaysinh || '',
      maphai: data?.maphai?._id || '',
      dienthoai: data?.dienthoai || '',
      email: data?.email || '',

      dmphai: [],
    };
  }

  async componentDidMount() {
    const tasks = [getDmPhai()];
    const [dmphai] = await Promise.all(tasks);
    this.setState({ dmphai: dmphai?.docs || [] });
  }

  navigationDidFocus = async () => {
    const { isVerified } = this.props.navigation.state?.params || {};
    if (isVerified) {
      const dataRequest = {
        taikhoan: this.state.taikhoan,
        matkhau: this.state.matkhau,
        hoten: this.state.hoten,
        ngaysinh: this.state.ngaysinh,
        dienthoai: this.state.dienthoai,
        email: this.state.email,
        maphai: this.state.maphai,
      };
      const data = await userRegister(dataRequest);
      if (data && data._id) {
        showToast(I18n.t('sign_up_for_a_successful_account'));
        this.props.navigation.navigate(HOME_PAGE);
      }
    }
  };

  navigationDidBlur = () => {
    this.props.navigation.setParams({ isVerified: false });
  };

  onFormSubmit = async () => {
    const dataValidate = [
      { value: this.state.taikhoan, type: CONSTANTS.USERNAME },
      { value: this.state.matkhau, type: CONSTANTS.PASSWORD },
      { value: this.state.matkhau1, type: CONSTANTS.PASSWORD },
      { value: this.state.hoten, type: CONSTANTS.REQUIRED, alert: I18n.t('full_name') },
      { value: this.state.dienthoai, type: CONSTANTS.PHONE },
      { value: this.state.email, type: CONSTANTS.EMAIL },
      { value: this.state.maphai, type: CONSTANTS.REQUIRED, alert: I18n.t('Giới tính') },
    ];
    if (!checkValidate(dataValidate)) return;

    if (this.state.matkhau !== this.state.matkhau1) {
      showToast(I18n.t('re_enter_the_password_incorrectly'));
      return;
    }
 
    const dataRequest = {
      taikhoan: this.state.taikhoan,
      matkhau: this.state.matkhau,
      hoten: this.state.hoten,
      ngaysinh: this.state.ngaysinh,
      dienthoai: this.state.dienthoai,
      email: this.state.email,
      maphai: this.state.maphai,
    };
    const token = this.props.navigation.getParam('token');
    if (token) {
      const data = await updateUserInfo(dataRequest, token);
      if (data && data._id) {
        showToast(I18n.t('Cập nhật thông tin thành công'));
        this.props.dispatch(fetchUsersInfoSuccess(data));
        this.props.navigation.navigate(HOME_PAGE);
      }
    } else {
      const phone = dataRequest.dienthoai;
      this.props.navigation.navigate(PHONE_VERIFICATION_PAGE, { route: REGISTER_PAGE, phone });
    }
  };

  render() {
    const data = this.props.navigation.getParam('thongtin', {});
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <NavigationEvents
          onDidFocus={this.navigationDidFocus}
          onDidBlur={this.navigationDidBlur}
        />
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image style={styles.image} source={CONSTANTS.LOGO_HOME} />
            <RkText rkType="disabled" style={styles.logoText}>
              {I18n.t('please_enter_the_information_below')}
            </RkText>
          </View>
          <View style={styles.content}>
            <FormGroup
              id="hoten"
              type={CONSTANTS.TEXT}
              value={this.state.hoten}
              editable={true}
              required={true}
              placeholder={I18n.t('full_name')}
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <FormGroup
              id="ngaysinh"
              type={CONSTANTS.DATE_TIME}
              value={this.state.ngaysinh}
              maximumDate={new Date()}
              required={true}
              editable={true}
              placeholder={I18n.t('Ngày sinh')}
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <FormGroup
              id="taikhoan"
              type={CONSTANTS.TEXT}
              value={this.state.taikhoan}
              editable={true}
              required={true}
              placeholder={I18n.t('username')}
              autoCapitalize="none"
              onChangeText={(id, value) => this.setState({ [id]: value })}
            />
            <FormGroup
              id="matkhau"
              type={CONSTANTS.TEXT}
              value={this.state.matkhau}
              editable={true}
              required={true}
              placeholder={I18n.t("password")}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(id, value) => this.setState({ [id]: value })}
            />
            <FormGroup
              id="matkhau1"
              type={CONSTANTS.TEXT}
              value={this.state.matkhau1}
              editable={true}
              required={true}
              placeholder={I18n.t('re_password')}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={(id, value) => this.setState({ [id]: value })}
            />
            <FormGroup
              id="dienthoai"
              type={CONSTANTS.TEXT}
              value={this.state.dienthoai}
              editable={(!(data && data._id))}
              required={true}
              placeholder={I18n.t('phone')}
              keyboardType="phone-pad"
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <FormGroup
              id="email"
              type={CONSTANTS.TEXT}
              value={this.state.email}
              editable={true}
              placeholder={I18n.t("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={tw.flex1}
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <FormGroup
              id="maphai"
              type={CONSTANTS.RADIO}
              data={this.state.dmphai}
              value={this.state.maphai}
              required={true}
              displayKey="tenphai"
              placeholder={I18n.t('Giới tính')}
              onChange={(id, selected) => this.setState({[id]: selected._id})}
            />
            <GradientButton
              text={I18n.t('register')}
              style={styleContainer.buttonGradient}
              onPress={this.onFormSubmit}
            />

            {
              !data._id && <View style={styles.footer}>
                <View style={styles.textRow}>
                  <RkButton rkType="clear" onPress={() => this.props.navigation.navigate(LOGIN_PAGE)}>
                    <RkText rkType="primary1">
                      {I18n.t('already_have_an_account_?_log_in')}
                    </RkText>
                  </RkButton>
                </View>
              </View>
            }
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  content: {
    marginHorizontal: 20,
    marginBottom: 16,
    flex: 3
  },
  image: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  logoText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10
  },
  footer: {},
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
export default connect()(RegisterPage);