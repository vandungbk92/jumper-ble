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

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import {HOME_PAGE, VERIFICATION_CODE_PAGE} from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import {verifyUser} from '../../epics-reducers/services/userServices';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {fetchLoginSuccess} from "../../epics-reducers/fetch/fetch-login.duck";
import {connect} from "react-redux";

class MaBenhNhanVerificationPage extends React.Component {
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
        {I18n.t('Xác nhận mã bệnh nhân')}
      </RkText>
    ),
  });

  constructor(props) {
    super(props);
    const tokenFirebase = props.navigation.getParam('tokenFirebase', '');
    this.state = {
      tokenFirebase: tokenFirebase,
      loading: false,
      mabenhnhan: ''
    };
  }

  onFormSubmit = async () => {
    try {
      const mabenhnhanSchema = Yup.string()
        .label('Mã bệnh nhân')
        .required('${path} không được để trống');
      const mabenhnhanVerify = await mabenhnhanSchema.validate(this.state.mabenhnhan);

      const { tokenFirebase, verificationId } = this.props.navigation.state?.params || "";

      this.setState({ loading: true });

      const data = await verifyUser({mabenhnhan: this.state.mabenhnhan, token: tokenFirebase, verificationId: verificationId});
      if (data && data.token) {
        this.props.dispatch(fetchLoginSuccess({ token: data.token }));
        this.props.navigation.navigate(HOME_PAGE);
      }
    } catch (error) {
      console.log(error, 'error')
      // showToast('Xác nhận mã bệnh nhân không thành công');
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
              Nhiều tài khoản có chung số điện thoại, vui lòng xác nhận mã bệnh nhân của bạn để đăng nhập
              (Nếu bạn không nhớ mã bệnh nhân, vui lòng liên hệ bệnh viện để được cung cấp).
            </RkText>
            <View style={tw.mT4}>
              <FormGroup
                id="mabenhnhan"
                type={CONSTANTS.TEXT}
                value={this.state.mabenhnhan}
                editable={true}
                required={true}
                placeholder="Mã bệnh nhân"
                containerStyle={tw.mT1}
                onChangeText={(id, value) => this.setState({ [id]: value })}
              />
            </View>
          </View>
          <GradientButton
            text="Gửi mã bệnh nhân"
            style={styleContainer.buttonGradient}
            loading={this.state.loading}
            onPress={this.onFormSubmit}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default connect()(MaBenhNhanVerificationPage)
