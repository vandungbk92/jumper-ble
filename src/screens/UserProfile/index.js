import React from 'react';
import {connect} from 'react-redux';

import {tw} from 'react-native-tailwindcss';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {RkText} from 'react-native-ui-kitten';
import {View, ScrollView, SafeAreaView, TouchableOpacity, Text} from 'react-native';

import Avatar from '../base/avatar';
import I18n from '../../utilities/I18n';

import {CONSTANTS} from '../../constants';
import {
  LOGIN_PAGE,
  HOME_PAGE,
  HOTRO_PAGE,
  CANHAN_PAGE,
  THONGTIN_PAGE,
  LICHSUKHAM_PAGE,
  DONTHUOC_PAGE,
  DANHGIA_PAGE,
  KETQUAKHAM_PAGE,
  HUONGDAN_DETAIL,
  GIOITHIEU_PAGE,
  HOSOSUCKHOE_PAGE,
  MAIN_NAVIGATOR,
  DANGKY_DICHVU_PAGE,
  LICHSU_DICHVU_PAGE,
  REGISTER_PAGE,
  DANHMUC_DICHVU_PAGE, LIST_DICH_VU_PAGE,
} from '../../constants/router';

import {fetchLogoutRequest} from '../../epics-reducers/fetch/fetch-login.duck';

import {KittenTheme} from '../../../config/theme';
import {styleContainer} from '../../stylesContainer';

import DonthuocIcon from '../../assets/icons/donthuoc.svg';
import LichsukhamIcon from '../../assets/icons/lichsukham.svg';
import HosoSuckhoeIcon from '../../assets/icons/hososuckhoe.svg';
import TheodoiSuckhoeIcon from '../../assets/icons/theodoisuckhoe.svg';
import {NavigationActions, StackActions} from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {unregisterDevice} from "../../epics-reducers/services/userServices";

class UserProfile extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  userLogout = async  () => {
    try{
      console.log('userLogoutuserLogoutuserLogout')
      // await unregisterDevice();
      await AsyncStorage.removeItem(CONSTANTS._CITIZEN_LOGIN_);

      let userToken = await AsyncStorage.getItem(
        CONSTANTS._CITIZEN_LOGIN_
      );
      console.log(userToken, 'userLogoutuserLogout')
      await this.props.dispatch(fetchLogoutRequest());
      /*const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: MAIN_NAVIGATOR })],
      });
      this.props.navigation.dispatch(resetAction);*/
    }catch (e) {
      console.log(e)
    }
  };

  preventBeforeLogin = (routeName) => {
    if (this.props.userInfoRes?._id) {
      let {userInfoRes, loginRes} = this.props;
      // nếu đã có tài khoản
      if(routeName === DANHMUC_DICHVU_PAGE){
        let {thongtinchung} = this.props;
        if(thongtinchung.giaodiengoikham){
          this.props.navigation.navigate(LIST_DICH_VU_PAGE, {item: null});
        }
        else this.props.navigation.navigate(routeName);
      }
      else if(routeName !== CANHAN_PAGE || (routeName === CANHAN_PAGE && userInfoRes.taikhoan)){
        this.props.navigation.navigate(routeName);
      }
      else this.props.navigation.navigate(REGISTER_PAGE, { thongtin: userInfoRes, token: loginRes.token });
    } else {
      this.props.navigation.navigate(LOGIN_PAGE);
    }
  };

  render() {
    const {userInfoRes} = this.props;

    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <ScrollView contentContainerStyle={tw.pY4}>
          <TouchableOpacity
            style={[tw.flexRow, tw.p4, tw.itemsCenter]}
            onPress={() => this.preventBeforeLogin(CANHAN_PAGE)}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={56}
              color="#2193D2"
            />
            {userInfoRes?._id ? (
              <View style={[tw.flex1, tw.mX2]}>
                <RkText rkType="header3">{userInfoRes?.hoten}</RkText>
                <RkText style={[tw.textBase, tw.textGray600]}>Thông tin cá nhân</RkText>
              </View>
            ) : (
              <View style={[tw.flex1, tw.mX2]}>
                <RkText rkType="header3">Đăng nhập</RkText>
                <RkText style={[tw.textBase, tw.textGray600]}>Đăng nhập tài khoản cá nhân</RkText>
              </View>
            )}
            <MaterialCommunityIcons name="chevron-right" size={20}/>
          </TouchableOpacity>
          <View style={[tw.h4, tw.bgGray200]}/>
          <View style={[tw.flexRow, tw.flexWrap, tw.p4, tw._m1]}>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(LICHSUKHAM_PAGE)}
              >
                <LichsukhamIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Lịch sử khám</RkText>
              </TouchableOpacity>
            </View>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(DONTHUOC_PAGE)}
              >
                <DonthuocIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Đơn thuốc</RkText>
              </TouchableOpacity>
            </View>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(KETQUAKHAM_PAGE)}
              >
                <HosoSuckhoeIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Kết quả cận lâm sàng</RkText>
              </TouchableOpacity>
            </View>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(DANHGIA_PAGE)}
              >
                <TheodoiSuckhoeIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Đánh giá dịch vụ</RkText>
              </TouchableOpacity>
            </View>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(DANHMUC_DICHVU_PAGE)}
              >
                <LichsukhamIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Gói dịch vụ</RkText>
              </TouchableOpacity>
            </View>
            <View style={[tw.p1, tw.w1_2]}>
              <TouchableOpacity
                style={[tw.flex1, tw.p4, tw.roundedLg, tw.bgBlue200]}
                onPress={() => this.preventBeforeLogin(HOSOSUCKHOE_PAGE)}
              >
                <DonthuocIcon fill={KittenTheme.colors.appColor}/>
                <RkText style={[tw.mT1, tw.textLg, {fontWeight: '700'}]}>Hồ sơ sức khỏe</RkText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[tw.h4, tw.bgGray200]}/>
          <View style={tw.pX4}>
            <TouchableOpacity
              style={[tw.flexRow, tw.pY4, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(HOTRO_PAGE)}
            >
              <View
                style={[
                  tw.p1,
                  tw.roundedFull,
                  {backgroundColor: KittenTheme.colors.appColor},
                ]}
              >
                <MaterialCommunityIcons
                  name="headset"
                  size={24}
                  color="white"
                />
              </View>
              <RkText style={[tw.flex1, tw.mX2, tw.textLg]}>Trung tâm hỗ trợ</RkText>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                style={tw.mX1}
              />
            </TouchableOpacity>
            <View style={[tw.hPx, tw.bgGray300]}/>
            <TouchableOpacity
              style={[tw.flexRow, tw.pY4, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(THONGTIN_PAGE)}
            >
              <View
                style={[
                  tw.p1,
                  tw.roundedFull,
                  {backgroundColor: KittenTheme.colors.appColor},
                ]}
              >
                <MaterialCommunityIcons
                  name="contacts"
                  size={24}
                  color="white"
                />
              </View>
              <RkText style={[tw.flex1, tw.mX2, tw.textLg]}>Thông tin liên hệ</RkText>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                style={tw.mX1}
              />
            </TouchableOpacity>
            <View style={[tw.hPx, tw.bgGray300]}/>
            <TouchableOpacity
              style={[tw.flexRow, tw.pY4, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(GIOITHIEU_PAGE)}
            >
              <View
                style={[
                  tw.p1,
                  tw.roundedFull,
                  {backgroundColor: KittenTheme.colors.appColor},
                ]}
              >
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color="white"
                />
              </View>
              <RkText style={[tw.flex1, tw.mX2, tw.textLg]}>Giới thiệu bệnh viện</RkText>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                style={tw.mX1}
              />
            </TouchableOpacity>
            <View style={[tw.hPx, tw.bgGray300]}/>
            {userInfoRes?._id && (
              <TouchableOpacity
                style={[tw.flexRow, tw.pY4, tw.itemsCenter]}
                onPress={this.userLogout}
              >
                <View
                  style={[
                    tw.p1,
                    tw.roundedFull,
                    {backgroundColor: KittenTheme.colors.appColor},
                  ]}
                >
                  <MaterialCommunityIcons name="arrow-right-thick" size={24} color="white"/>
                </View>
                <RkText style={[tw.flex1, tw.mX2, tw.textLg]}>Đăng xuất 111</RkText>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  style={tw.mX1}
                />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const {loginRes, userInfoRes, thongtinchung} = state;
  return {loginRes, userInfoRes, thongtinchung};
}

export default connect(mapStateToProps)(UserProfile);
