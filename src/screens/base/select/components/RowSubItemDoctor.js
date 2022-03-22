import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KittenTheme } from '../../../../../config/theme';
import { RkText } from 'react-native-ui-kitten';
import { tw } from 'react-native-tailwindcss';
import {COMMON_APP, CONSTANTS} from '../../../../constants';
import { BACSI_DETAIL } from '../../../../constants/router';

class RowSubItemDoctor extends Component {
  onCLoseSelect() {
    const { _cancelSelection } = this.props.props;
    _cancelSelection && _cancelSelection();
  }

  onBacsiDetail(navigation, bacsi) {
    this.onCLoseSelect();
    navigation.navigate(BACSI_DETAIL, { bacsi: bacsi });
  }

  render() {
    const { subItem, displayKey, navigation } = this.props.props;
    let avatar = CONSTANTS.AVATAR_NAM
    if(subItem.hinhanh) avatar = {uri: COMMON_APP.HOST_API + '/api/files/' + subItem.hinhanh}
    else if(subItem?.maphai === 2) avatar = CONSTANTS.AVATAR_NU

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={[tw.wFull, tw.hFull]}
            source={avatar}
          />
        </View>

        <View style={styles.infoContainer}>
          <RkText rkType='header5'>{subItem[displayKey]}</RkText>
          {
            subItem.email && <View style={[tw.flexRow, tw.mT2, tw.itemsStart]}>
              <View style={[tw.flexRow, tw.mR1, tw.itemsCenter]}>
                <Ionicons name='mail' size={16} />
              </View>
              <RkText style={tw.flex1}>{subItem.email}</RkText>
            </View>
          }


          <View style={[tw.mT2]}>
            <RkText numberOfLines={4} ellipsizeMode={'tail'}>
              {subItem.gioithieu}
            </RkText>
          </View>

          <View style={[tw.flexRow, tw.justifyCenter]}>
            <View style={styles.button}>
              <RkText style={styles.buttonTitle}>Đặt khám</RkText>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onBacsiDetail(navigation, subItem)}
            >
              <RkText style={styles.buttonTitle}>Chi tiết BS</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
        </View>
      </View>
    );
  }
}
export default RowSubItemDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  imageContainer: {
    height: '60%',
    width: 3 * 25,
    backgroundColor: KittenTheme.colors.blueGray,
  },
  button: {
    margin: 5,
    padding: 5,
    backgroundColor: KittenTheme.colors.appColor,
    borderRadius: 5,
  },
  buttonTitle: {
    color: 'white',
  },
  separator: {
    marginBottom: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: KittenTheme.colors.appColor,
  },
});
