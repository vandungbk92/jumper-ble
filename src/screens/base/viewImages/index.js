import Gallery from "react-native-image-gallery";
import React, {Component} from "react";
import {View, TouchableOpacity, StyleSheet, Alert} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {RkText} from "react-native-ui-kitten";
import Ionicons from "@expo/vector-icons/Ionicons";
import {KittenTheme} from "../../../../config/theme";
import I18n from "../../../utilities/I18n";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default class ViewImageScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    let {params} = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.appColor}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4">{I18n.t("image")}</RkText>
      ),
      headerRight: () => (
        <RkText style={{paddingHorizontal: 20}}> {params && params.titleParams ? params.titleParams : ""}</RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      position: this.props.navigation.state.params.initialPage || 0
    }
    this.delImgFunc = this.delImgFunc.bind(this)
  }

  componentWillMount() {
    let {images} = this.props.navigation.state.params
    this.props.navigation.setParams({
      titleParams: this.state.position + 1 + "/" + images.length,
    })
  }

  handlePaceScroll(event) {
    let {images} = this.props.navigation.state.params
    if (event.position !== this.state.position)
      this.setState({position: event.position}, () => {
        this.props.navigation.setParams({
          titleParams: this.state.position + 1 + "/" + images.length,
        })
      })
  }

  delImgFunc() {
    Alert.alert(
      I18n.t("delete_data"),
      '',
      [
        {
          text: I18n.t("cancel"),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            let {images} = this.props.navigation.state.params
            let imgDel = images[this.state.position]

            let uri = imgDel.source.uri
            images.splice(this.state.position, 1);
            this.setState({position:  this.state.position ? this.state.position - 1 : this.state.position}, () => {
              this.props.navigation.setParams({
                titleParams: this.state.position + 1 + "/" + images.length,
                images: images
              })
              this.props.navigation.state.params.delImgFunc(uri)
            })

          }
        },
      ],
      {cancelable: false},
    );

  }

  render() {
    let {deleteImg, images} = this.props.navigation.state.params
    return (
      <View style={[styleContainer.containerContent, {flexDirection: 'column'}]}>
        {
          deleteImg && images && images.length ?
          <TouchableOpacity onPress={this.delImgFunc} style={styles.button}>
            <MaterialCommunityIcons size={50} color={KittenTheme.colors.appColor} name="delete-circle"/>
          </TouchableOpacity> : null
        }

        {!!images.length &&
        <View style={{flex: 1}}>
          <Gallery
            initialPage={this.state.position || 0}
            onPageScroll={(event) => this.handlePaceScroll(event)}
            style={{flex: 1, backgroundColor: "#fff"}}
            images={images}
          />
        </View>
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10
  },
});
