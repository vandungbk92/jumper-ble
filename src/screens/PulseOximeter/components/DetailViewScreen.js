import {
  View,
  TouchableOpacity
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {tw} from 'react-native-tailwindcss';
import { WebView } from 'react-native-webview';
import {getOximeterDetail} from "../../../epics-reducers/services/oximeterServices";
import {COMMON_APP} from "../../../constants";

export default function DetailViewScreen(props) {

  const [data, setData] = useState([]);
  useEffect(async () => {
    await onGetData();
  }, []);

  const onGetData = async () => {
    const newData = await getOximeterDetail();
    console.log(newData, 'newDatanewData')
    if (newData) setData(newData);
  };
  
  return (
    <View style={tw.flex1}>
      <WebView
        source={{
          uri: `${COMMON_APP.HOST_API}/api/pulse-oximeter/phantich/${props?.navigation?.state?.params?.oximeter_id}`
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView error: ', nativeEvent);
        }}
        onLoad={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('1111')
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(
            'WebView received error status code: ',
            nativeEvent.statusCode,
          );
        }}
        renderError={(errorName) => console.log(errorName)}
        style={{ marginTop: 20 }}
      />
    </View>
  );
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
});
