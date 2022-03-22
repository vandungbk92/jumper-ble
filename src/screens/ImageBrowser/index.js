import React, { Component } from "react";
import {TouchableOpacity, BackHandler} from "react-native";
import {CONSTANTS} from "../../constants/constants";
import {RkText} from "react-native-ui-kitten";
import {styleContainer} from "../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import ImageBrowser from "./components/ImageBrowser";
import I18n from '../../utilities/I18n';

export default class ImageBrowserScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.appColor} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4">
          {navigation.state.params && navigation.state.params.title ? navigation.state.params.title : I18n.t("select_photos_from_the_device")}
        </RkText>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.state.params.prepareCallback && navigation.state.params.prepareCallback()}
        >
          <Ionicons name="md-checkmark" size={20} color={KittenTheme.colors.appColor} />
        </TouchableOpacity>
      )
    }
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.setParams({
      prepareCallback: () => this.prepareCallback()
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.state.params.onGoBack(CONSTANTS.REJECT);
    });
  }

  componentWillUnmount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.state.params.onGoBack(CONSTANTS.REJECT);
    });
  }

  prepareCallback() {
    if (this.imgBrowser) this.imgBrowser.prepareCallback();
  }

  onImageCallback = (callback) => {
    this.props.navigation.state.params.onGoBack(callback);
    this.props.navigation.goBack(null);
  }

  onImageSelected = (selected) => {
    let selectedCount = Object.keys(selected).length;
    let headerText = I18n.t("number_image_selected").format(selectedCount)
    let {max, total_exits} = this.props.navigation.state.params
    if(!total_exits) total_exits = 0
    if ((selectedCount + total_exits) === this.props.navigation.state.params.max) headerText = headerText + I18n.t("maximum_number_image").format(selectedCount);
    this.props.navigation.setParams({ title: headerText });
  }

  render() {
    let {max, total_exits} = this.props.navigation.state.params
    if(!max) max = 5
    if(!total_exits) total_exits = 0
    return (
      <ImageBrowser
        ref={(c) => this.imgBrowser = c}
        max={this.props.navigation.state.params && this.props.navigation.state.params.max ? (max - total_exits) : Infinity}
        callback={this.onImageCallback}
        onSelectImage={this.onImageSelected}
      />
    )
  }
}
