import React from 'react';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import { LOGIN_PAGE, THONGBAO_CANHAN, THONGBAO_CONGDONG } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

class ThongbaoPage extends React.Component {
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
          {I18n.t('Thông báo')}
        </RkText>
    ),
  });

  navigateItem = (router) => () => {
    if (router === THONGBAO_CANHAN && !this.props.userInfoRes?._id) {
      this.props.navigation.navigate(LOGIN_PAGE);
    } else {
      this.props.navigation.navigate(router);
    }
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={tw.flexRow} onPress={this.navigateItem(item.router)}>
        <View style={[tw.w10, tw.h10, tw.roundedFull, tw.itemsCenter, tw.justifyCenter, item.iconStyle]}>
          <Ionicons name={item.icon} size={24} color="white" />
        </View>
        <View style={tw.w2} />
        <View style={tw.flex1}>
          <View style={[tw.flexRow, tw.justifyBetween]}>
            <RkText rkType="header4">
              {item.title}
            </RkText>
          </View>
          <RkText style={[tw.mT1, tw.textGray600, tw.textBase]}>
            {item.description}
          </RkText>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return <View style={[tw.mY3, tw.mL12, tw.hPx, tw.bgGray300]} />;
  };

  render() {
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <FlatList
          data={[
            {
              icon: 'notifications',
              title: 'Thông báo cá nhân',
              router: THONGBAO_CANHAN,
              iconStyle: tw.bgBlue400,
              description: 'Thông báo lịch hẹn, nhắc nhở uống thuốc',
            },
            {
              icon: 'newspaper',
              title: 'Thông báo cộng đồng',
              router: THONGBAO_CONGDONG,
              iconStyle: tw.bgOrange400,
              description: 'Thông báo, tin tức y tế',
            },
          ]}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => `item-${i}`}
          contentContainerStyle={tw.p4}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { userInfoRes } = state;
  return { userInfoRes };
}

export default connect(mapStateToProps)(ThongbaoPage);
