import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {
  getOximeterData,
} from "../../../epics-reducers/services/oximeterServices";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
import {DETAIL_OXIMETER_PAGE} from "../../../constants/router";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window");

export default function HistoryScreen(props) {
  const [data, setData] = useState([]);
  useEffect(async () => {
    await onLoadMore();
  }, []);

  const onLoadMore = async () => {
    const newData = await getOximeterData();
    console.log(newData, 'newData')
    if (newData) setData(newData.docs);
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
          props.navigation.navigate(DETAIL_OXIMETER_PAGE, {
            date: item.date,
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
            progressValueColor={"#92BA92"}
            maxValue={100}
            valueSuffix={"%"}
            inActiveStrokeColor={"#2ecc71"}
            inActiveStrokeOpacity={0.2}
            radius={screenWidth * 0.12}
            circleBackgroundColor={"white"}
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

HistoryScreen.navigationOptions = ({navigation}) => ({
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
  headerTitle: () => <RkText rkType="header4">{I18n.t("Lịch sử")}</RkText>,
});
