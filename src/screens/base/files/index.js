import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Alert
} from 'react-native';
import {RkText} from 'react-native-ui-kitten';
import Space from '../space';
import {KittenTheme} from '../../../../config/theme';

import * as WebBrowser from 'expo-web-browser';

import {styleContainer} from '../../../stylesContainer';
import {showToast} from '../../../epics-reducers/services/common';
import I18n from "../../../utilities/I18n";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export class Files extends React.Component {

  constructor(props) {
    super(props);
  }

  async downLoadFile(file) {

    if (file.isUpload) {
      showToast(I18n.t("the_file_has_not_been_uploaded"))
      return
    }

    await WebBrowser.openBrowserAsync(file.download);
  }

  deleteFileFunc(file){

    Alert.alert(
      I18n.t("delete_data"),
      '',
      [
        {
          text: I18n.t("cancel"),
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.props.deleteFileFunc(file)},
      ],
    );

    //this.props.deleteFileFunc(file)
  }

  render = () => {
    let {files, deleteFile} = this.props
    if (!files || !files.length)
      return (
        <View></View>
      )
    return (
      <View style={[styles.container, styleContainer.boxShadow, this.props.containerStyle]}>
        <View style={styles.group}>
          <RkText rkType="primary2">{I18n.t("file")}<Space/></RkText>
          {files.map((file, index) => {
            return (

              <View key={index} style={index !== (files.length - 1) ? styles.listItems : styles.lastItem}>
                <TouchableOpacity onPress={() => this.downLoadFile(file)} style={{flex: 5}}>
                  <RkText rkType="link">{file.name}</RkText>
                </TouchableOpacity>
                {
                  deleteFile &&
                  <TouchableOpacity onPress={() => this.deleteFileFunc(file)} style={{flex: 1}}>
                    <MaterialCommunityIcons size={50} color={KittenTheme.colors.appColor} name="delete-circle"/>
                  </TouchableOpacity>
                }

              </View>
            )
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    marginBottom: 5,
  },
  group: {
    flexDirection: 'column',
    backgroundColor: KittenTheme.colors.white,
    borderRadius: KittenTheme.border.borderRadius,
    padding: 5,
  },
  listItems: {
    borderBottomWidth: 0.5,
    borderColor: KittenTheme.border.borderColor,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  lastItem: {
    paddingVertical: 5,
    flexDirection: 'row'

  },
});
