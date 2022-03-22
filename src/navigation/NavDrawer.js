import React from 'react';
import { connect } from 'react-redux';

import { tw, color } from 'react-native-tailwindcss';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RkText} from 'react-native-ui-kitten';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

import { DrawerItems } from 'react-navigation-drawer';

import { HOME_PAGE, LOGIN_PAGE, CANHAN_PAGE } from '../constants/router';

import { fetchLogoutRequest } from '../epics-reducers/fetch/fetch-login.duck';

const NavDrawer = (props) => (
  <SafeAreaView style={tw.flex1}>
    <TouchableOpacity
      style={[tw.flexRow, tw.p4, tw.itemsCenter]}
      onPress={() => {
        props.navigation.closeDrawer();
        if (props.userInfoRes?._id) {
          props.navigation.navigate(CANHAN_PAGE);
        } else {
          props.navigation.navigate(LOGIN_PAGE);
        }
      }}
    >
      <MaterialCommunityIcons
        name="account-circle"
        size={56}
        color="#2193D2"
      />
      {props.userInfoRes?._id ? (
        <View style={[tw.flex1, tw.pX2]}>
          <RkText rkType="header4">{props.userInfoRes?.hoten}</RkText>
          <RkText style={[tw.textBase, tw.textGray600]}>
            Thông tin cá nhân
          </RkText>
        </View>
      ) : (
        <View style={[tw.flex1, tw.pX2]}>
          <RkText rkType="header4">Đăng nhập</RkText>
        </View>
      )}
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={color.gray500}
      />
    </TouchableOpacity>
    <ScrollView>
      <DrawerItems {...props} />
      {props.userInfoRes?._id && (
        <TouchableOpacity
          style={[tw.flexRow, tw.pX4, tw.pY2]}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate(HOME_PAGE);
            props.dispatch(fetchLogoutRequest());
          }}
        >
          <RkText style={[tw.flex1, tw.textRed500]} rkType="bold">
            Đăng xuất
          </RkText>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={color.red500}
          />
        </TouchableOpacity>
      )}
    </ScrollView>
    <View style={[tw.p4, tw.itemsCenter]}>
      <RkText rkType="bold disabled">Thinklabs JSC</RkText>
    </View>
  </SafeAreaView>
);

function mapStateToProps(state) {
  const { userInfoRes } = state;
  return { userInfoRes };
}

export default connect(mapStateToProps)(NavDrawer);
