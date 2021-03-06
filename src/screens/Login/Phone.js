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
      // N???u ch??a c?? t??i kho???n
      if (data && data.token && data.change) {
        showToast('X??c nh???n s??? ??i???n tho???i th??nh c??ng, b???n c???n b??? sung th??m t??i kho???n ????ng nh???p');
        const thongtin = await getUserInfo(data.token);
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        // this.props.dispatch(fetchUsersInfoSuccess(thongtin));
        this.props.navigation.navigate(REGISTER_PAGE, { thongtin, token: data.token });
      }
      // n???u ???? c?? t??i kho??n.
      else if (data && data.token) {
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        this.props.navigation.navigate(HOME_PAGE);
      }else if(data && data.multi){
        this.props.navigation.navigate(VERIFICATION_USER_PAGE, { tokenFirebase: userIdToken, verificationId: verificationId });
      }else{
        showToast('S??? ??i???n tho???i kh??ng t???n t???i, vui l??ng ki???m tra v?? th??? l???i.');
      }
    }
  };

  navigationDidBlur = () => {
    this.props.navigation.setParams({ isVerified: false });
  };

  onFormSubmit = async () => {
    try {
      const phoneSchema = Yup.string()
        .label('S??? ??i???n tho???i')
        .required('${path} kh??ng ???????c ????? tr???ng')
        .phone('VN', false, '${path} kh??ng ????ng ?????nh d???ng');
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
                <RkText rkType="header3">????ng nh???p qua sms</RkText>
                <RkText style={tw.mT1} rkType="disabled">
                  Vui l??ng nh???p s??? ??i???n tho???i m?? b???n ???? ????ng k?? qua h??? th???ng
                </RkText>
              </View>
              <View style={tw.mT4}>
                <FormGroup
                  id="phone"
                  type={CONSTANTS.TEXT}
                  value={this.state.phone}
                  editable={true}
                  required={true}
                  placeholder="S??? ??i???n tho???i"
                  keyboardType="phone-pad"
                  onChangeText={(id, value) => this.setState({ [id]: value })}
                />
              </View>
            </View>
          </View>
          <GradientButton
            text="Ti???p t???c"
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
