import React, {Component} from "react";
import {View, ActivityIndicator, StyleSheet} from "react-native";
import {SCREEN_HEIGHT, STATUS_BAR_HEIGHT, DEVICE_WIDTH} from '../../../constants/variable'

import {KittenTheme} from "../../../../config/theme";
import {connect} from "react-redux"

class IsLoading extends Component {
  static navigationOptions = {
    headerShown: false
  };

  render() {
    let {isLoading} = this.props
    if(!isLoading) return null
    return <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: DEVICE_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: 'rgba(52, 52, 52, 0.5)',
      opacity: 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size="large" color={KittenTheme.colors.appColor}/>
    </View>
  }
}

const styles = StyleSheet.create({
  view404: {
    flexDirection: "column",
    marginHorizontal: 50,
    height: (SCREEN_HEIGHT - STATUS_BAR_HEIGHT) / 2,
    alignItems: "center",
    justifyContent: "center"
  },

  image: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },

  modal: {
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: DEVICE_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

function mapStateToProps(state) {
  const isLoading = state.isLoading
  return {isLoading}
}

export default connect(mapStateToProps)(IsLoading);
