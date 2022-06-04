import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {
  getOximeterData, getOximeterDetail,
} from "../../../epics-reducers/services/oximeterServices";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
import {DETAIL_ANALYSIS_PAGE, DETAIL_OXIMETER_PAGE} from "../../../constants/router";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window");

export default function HistoryAnalysisScreen(props) {
  const [data, setData] = useState([]);
  useEffect(async () => {
    await onLoadMore();
  }, []);

  const onLoadMore = async () => {
    const newData = await getOximeterDetail();
    if (newData) setData(newData);
  };

  const renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginHorizontal: 8,
          marginTop: 8,
          padding: 8,
          flexDirection: "row",
          backgroundColor: 'white'
        }}
        onPress={() =>
          props.navigation.navigate(DETAIL_ANALYSIS_PAGE, {
            ...item
          })
        }
      >
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress
            value={item.avgSpO2}
            // progressValueColor={"#92BA92"}
            maxValue={100}
            valueSuffix={"%"}
            // inActiveStrokeColor={"#2ecc71"}
            inActiveStrokeOpacity={0.2}
            radius={screenWidth * 0.12}
            circleBackgroundColor={"white"}
            inActiveStrokeColor={"black"}
            progressValueColor={"#096dd9"}
            activeStrokeColor={'#ff7875'}
            activeStrokeSecondaryColor={'#40a9ff'}
          />
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            marginHorizontal: 8,
          }}
        >
          <RkText>
            {moment(item.measurementDate).format("dd DD MMMM YYYY HH:mm")}
          </RkText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItems}
        keyExtractor={(item, index) => index}
        // ListEmptyComponent={}
        refreshing={true}
      />
    </View>
  );
}

HistoryAnalysisScreen.navigationOptions = ({navigation}) => ({
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
  headerTitle: () => <RkText rkType="header4">{I18n.t("Phân tích SP02")}</RkText>,
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
