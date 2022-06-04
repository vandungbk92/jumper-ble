import {
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {tw} from 'react-native-tailwindcss';
import {WebView} from 'react-native-webview';
import {getHtml, getReport} from "../../../epics-reducers/services/oximeterServices";
import {COMMON_APP} from "../../../constants";

const RNFS = require("react-native-fs");
import PDFReader from 'rn-pdf-reader-js';
import Pdf from 'react-native-pdf';


export default function DetailViewScreen(props) {

  const [data, setData] = useState(null);
  useEffect(async () => {
    await onGetData();
  }, []);

  const onGetData = async () => {
    let oximeter_id = props?.navigation?.state?.params?.oximeter_id
    let path = RNFS.DocumentDirectoryPath + `/${oximeter_id}.pdf`;
    let fileExist = await RNFS.exists(path);
    if (fileExist) {
      setData({uri: `file://${path}`, cache: true})
    } else {
      /*RNFS.downloadFile({fromUrl:url, toFile: path}).promise.then(res => {
        this.setState({ downloaded: true });
      });*/
      RNFS.downloadFile({
        fromUrl: `${COMMON_APP.HOST_API}/api/pulse-oximeter/phantich/${oximeter_id}`,
        toFile: path,
        cacheable: false
      }).promise.then((res) => {
        if(res){
          setData({uri: `file://${path}`, cache: true})
        }
      });

      // console.log(fileDownload?.jobId, fileDownload?.statusCode, 'fileDownloadfileDownload')
    }
  };
  if(!data) return <View style={[tw.flex1, tw.justifyCenter]}>
    <ActivityIndicator size="small" color="#0000ff" />
  </View>
  return (
    <View style={[tw.bgBlue200, tw.flex1]}>
      <Pdf
        source={data}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={[tw.flex1]}
      />
    </View>
  )

  if (!data) return null
}

DetailViewScreen.navigationOptions = ({navigation}) => ({
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
  headerTitle: () => <RkText rkType="header4">{I18n.t("Chi tiết")}</RkText>,
  headerRight: () => (
    <TouchableOpacity
      style={styleContainer.headerButton}
      onPress={() => navigation.navigate('HOME_PAGE')}
    >
      <Ionicons
        name="ios-home"
        size={20}
        color={KittenTheme.colors.appColor}
      />
    </TouchableOpacity>
  ),
});
