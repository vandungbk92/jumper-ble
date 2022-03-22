import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RkText, RkCard, RkButton } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import Space from '../space';
import { checkStatusRequest } from '../../../epics-reducers/services/common';
import { styleContainer } from '../../../stylesContainer';
import { IS_TABLET, IS_IPAD } from '../../../constants/variable';

export default function CardCustom(props) {

  let statusString = (checkStatusRequest(props.confirmed, props.isPublic)).name
  let statusColor = (checkStatusRequest(props.confirmed, props.isPublic)).color

  return (
    <View style={[styles.container, styleContainer.boxShadow]}>
      <TouchableOpacity onPress={props.onPress} style={[styles.touchableOpacity, styleContainer.boxShadow]} >
        <RkCard rkType='blog' style={IS_TABLET || IS_IPAD ? styles.cardTablet : styles.card}>
          {IS_TABLET || IS_IPAD ? <Image style={[{ flex: 1, height: 350 }, styles.image]} source={props.source} /> : <Image style={styles.image} rkCardImg source={props.source} />}
          <View style={{ flex: 1 }}>
            <View rkCardHeader style={styles.content}>
              <RkText numberOfLines={2} style={styles.section} rkType='primary1'>{props.title}</RkText>
            </View>
            <View rkCardContent>
              <View>
                <RkText rkType='' numberOfLines={IS_TABLET || IS_IPAD ? 8 : 3}>{props.content}</RkText>
              </View>
            </View>
            {/*<View rkCardFooter>
              <View style={styles.footer}>
                <Ionicons name="ios-clock" size={20} color={KittenTheme.colors.disabled} />
                <RkText rkType='light'><Space />{props.time}</RkText>
              </View>
            </View>*/}
            <View rkCardFooter={true}>
              <RkButton rkType='clear link'>
                <Ionicons style={styles.buttonIcon} name="ios-clock" size={20} color={KittenTheme.colors.disabled}></Ionicons>
                <RkText rkType='accent'>{' ' + props.time}</RkText>
              </RkButton>
              <RkButton rkType='clear link'>
                <RkText rkType='hint'>{props.indexRow}</RkText>
              </RkButton>
            </View>
          </View>
        </RkCard>
        <View style={[styles.status, { backgroundColor: statusColor }]}>
          <RkText rkType='' style={styles.textStatus}>{statusString}</RkText>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10

  },
  touchableOpacity: {
    backgroundColor: KittenTheme.colors.white,
    borderRadius: KittenTheme.border.borderRadius,
  },
  card: {
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
  },
  image: {
    borderRadius: KittenTheme.border.borderRadius,
  },
  cardTablet: {
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    flexDirection: 'row'
  },
  footer: {
    flexDirection: 'row'
  },
  status: {
    position: 'absolute',
    top: 15,
    left: 15,
    borderRadius: KittenTheme.border.borderRadius,
    padding: 5
  },
  textStatus: {
    color: KittenTheme.colors.white
  }
})
