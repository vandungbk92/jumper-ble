import React from 'react';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import {CHANGE_PHONE_PAGE, CHANGE_PASSWORD_PAGE, MAIN_NAVIGATOR} from '../../constants/router';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { putUserInfoByToken } from '../../epics-reducers/services/userServices';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { fetchUsersInfoSuccess } from '../../epics-reducers/fetch/fetch-users-info.duck';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {fetchLogoutRequest} from "../../epics-reducers/fetch/fetch-login.duck";
import {NavigationActions, StackActions} from "react-navigation";

class CanhanPage extends React.Component {
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
        {I18n.t('Hồ sơ cá nhân')}
      </RkText>
    ),
    headerRight: () => (
      <TouchableOpacity
        style={styleContainer.headerButton}
        onPress={navigation.getParam('onFormSubmit')}
      >
        <RkText rkType="link">Lưu</RkText>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    const data = props.userInfoRes;
    this.state = {
      taikhoan: data?.username || '',

      hoten: data?.full_name || '',
      ngaysinh: data?.birthday || '',
      dienthoai: data?.phone || '',
      email: data?.email || ''
    };
    props.navigation?.setParams({ onFormSubmit: this.onFormSubmit });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.userInfoRes?.dienthoai !== this.props.userInfoRes?.dienthoai
      && this.props.userInfoRes?.dienthoai !== this.state.dienthoai
    ) {
      this.setState({ dienthoai: this.props.userInfoRes?.dienthoai });
    }
  }

  onFormSubmit = async () => {
    const dataValidate = [
      {value: this.state.hoten, type: CONSTANTS.REQUIRED, alert: I18n.t('full_name')},
      {value: this.state.dienthoai, type: CONSTANTS.REQUIRED, alert: I18n.t('phone')},
      {value: this.state.dienthoai, type: CONSTANTS.PHONE},
      {value: this.state.email, type: CONSTANTS.EMAIL},
    ];
    if (!checkValidate(dataValidate)) return;

    const dataRequest = {
      hoten: this.state.hoten,
      ngaysinh: this.state.ngaysinh,
      email: this.state.email,
    };

    const benhnhan = await putUserInfoByToken(dataRequest);
    if (benhnhan) {
      showToast(I18n.t('Cập nhật thông tin thành công'));
      this.props.dispatch(fetchUsersInfoSuccess(benhnhan));
    }
  };

  userLogout = async  () => {
    await this.props.dispatch(fetchLogoutRequest());

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: MAIN_NAVIGATOR })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <KeyboardAwareScrollView>
          <View style={tw.p4}>
            <FormGroup
              id="taikhoan"
              type={CONSTANTS.TEXT}
              value={this.state.taikhoan}
              editable={false}
              disabled={true}
              placeholder={I18n.t('username')}
              autoCapitalize="none"
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
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
              editable={true}
              required={true}
              placeholder={I18n.t('Ngày sinh')}
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <FormGroup
              type={CONSTANTS.BLOCK}
              editable={true}
              required={true}
              placeholder={I18n.t('phone')}
            >
              <View style={[tw.flexRow, tw.pY1, tw.justifyBetween]}>
                <RkText>{this.state.dienthoai}</RkText>
                <TouchableOpacity onPress={() => this.props.navigation.navigate(CHANGE_PHONE_PAGE)}>
                  <RkText rkType="link">Thay đổi SĐT</RkText>
                </TouchableOpacity>
              </View>
            </FormGroup>
            <FormGroup
              id="email"
              type={CONSTANTS.TEXT}
              value={this.state.email}
              editable={true}
              placeholder={I18n.t('email')}
              autoCapitalize="none"
              onChangeText={(id, value) => this.setState({[id]: value})}
            />
            <GradientButton
              text="Thay đổi mật khẩu"
              style={[tw.mT2]}
              onPress={() => this.props.navigation.navigate(CHANGE_PASSWORD_PAGE)}
            />
            <GradientButton
              text="Đăng xuất"
              style={styleContainer.buttonGradient}
              onPress={this.userLogout}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

function mapStateToProps(state) {
  const { userInfoRes } = state;
  return { userInfoRes };
}

export default connect(mapStateToProps)(CanhanPage);
