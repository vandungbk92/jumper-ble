import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions, Text, ImageBackground, ScrollView, StyleSheet,
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {AntDesign, FontAwesome5, Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {HISTORY_ANALYSIS_PAGE, HISTORY_PAGE, LOGIN_PAGE} from "../../../constants/router";
import moment from "moment";
import CircularProgress from "react-native-circular-progress-indicator";
import {tw} from 'react-native-tailwindcss';
import Slider from "react-native-slider";
import GradientButton from "../../base/gradientButton";
const {width: screenWidth, height: screenHeight} = Dimensions.get("window");


export default function DetailAnalysisScreen(props) {
  const item = props?.navigation?.state?.params || {};

  console.log(item, 'itemitemitem')
  return (
    <View style={tw.flex1}>
      <ImageBackground
        source={require("../../../assets/bg.jpg")}
        style={{
          width: screenWidth,
          height: screenHeight * 0.25,
          flex: 1,
        }}
        resizeMode={"cover"}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: screenWidth * 0.1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{color: "white"}}>Nhật ký giấc ngủ</Text>
            <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={{color: "white", fontSize: 18}}>
                {moment(item?.measurementDate).format("dd DD MMMM YYYY")}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: screenWidth * 0.5,
              height: screenWidth * 0.5,
              backgroundColor: "white",
              borderRadius: 100,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              value={item?.avgSpO2}
              title={'SP02 trung bình'}
              titleStyle={{fontSize: 10}}
              maxValue={100}
              valueSuffix={"%"}
              inActiveStrokeOpacity={0.2}
              radius={screenWidth * 0.25 - 5}
              inActiveStrokeColor={"#2ecc71"}
              progressValueColor={"#096dd9"}
              activeStrokeColor={'red'}
              activeStrokeSecondaryColor={'#1890ff'}
            />
          </View>
        </View>
      </ImageBackground>

      <ScrollView style={{flex: 1}}>
        {
          (item.avgSpO2 >= item.oximeterMonitor) ?
            <View>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  color: "#069A8E",
                }}
              >
                Chỉ số Oxi trong máu ổn định
              </Text>
              <Text style={{alignSelf: "center", color: "#069A8E"}}>
                Khoẻ mạnh
              </Text>
            </View> :
            <View>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  color: "#ff7a45",
                }}
              >
                Chỉ số Oxi trong máu không ổn định
              </Text>
              <Text style={{alignSelf: "center", color: "#ff7a45"}}>
                Cần theo dõi
              </Text>
            </View>
        }


        <View
          style={{
            flex: 1,
            marginTop: 4,
          }}
        >
          <View style={{flex: 1}}>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 2,flexDirection: "row",alignItems: "center",paddingHorizontal: 16}}>
                    <Ionicons name="leaf-outline" size={24} color="#7027A0"/>
                    <Text style={{marginHorizontal: 4, color: "#7027A0"}}>
                      Tổng thời gian đo
                    </Text>
                  </View>
                  <View style={{flex: 2, alignSelf: "flex-end", paddingHorizontal: 16}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.totalTime}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={100}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={100}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#7027A0",
                    },
                  ]}
                  minimumTrackTintColor="#7027A0"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 2, flexDirection: "row",alignItems: "center", paddingHorizontal: 16}}>
                    <FontAwesome5 name="heartbeat" size={24} color="#1DB9C3"/>
                    <Text style={{marginHorizontal: 4, color: "#1DB9C3"}}>
                      Nhịp tim ({item?.avgPulseRate?.toFixed(0)})
                    </Text>
                  </View>
                  <View style={{flex: 2, paddingHorizontal: 16}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.minPulseRate}/{item?.maxPulseRate}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={100}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={100}
                  trackStyle={customStyles3.track}
                  thumbStyle={[customStyles3.thumb, {backgroundColor: "#1DB9C3"},]}
                  minimumTrackTintColor="#1DB9C3"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 4,flexDirection: "row", alignItems: "center", paddingHorizontal: 16}}
                  >
                    <Ionicons name="heart-circle-outline" size={24} color="#5b8c00" />
                    <Text style={{marginHorizontal: 4, color: "#5b8c00"}}>
                      Chỉ số PI ({item?.avgPI.toFixed(1)})
                    </Text>
                  </View>
                  <View style={{flex: 1, alignSelf: "flex-end", paddingHorizontal: 16,}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.minPI}/{item?.maxPI}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={7}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={7}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#5b8c00",
                    },
                  ]}
                  minimumTrackTintColor="#5b8c00"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 4,flexDirection: "row", alignItems: "center", paddingHorizontal: 16}}
                  >
                    <FontAwesome5 name="head-side-mask" size={20} color="#2f54eb" />
                    <Text style={{marginHorizontal: 4, color: "#2f54eb"}}>
                      Số lần đo
                    </Text>
                  </View>
                  <View style={{flex: 1, alignSelf: "flex-end", paddingHorizontal: 16,}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.total}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={7}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={7}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#2f54eb",
                    },
                  ]}
                  minimumTrackTintColor="#2f54eb"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 4,flexDirection: "row", alignItems: "center", paddingHorizontal: 16}}
                  >
                    <Ionicons name="md-warning-outline" size={24} color="#eb2f96"/>
                    <Text style={{marginHorizontal: 4, color: "#eb2f96"}}>
                      Tổng số lần SP02 {"<="} {item.oximeterMonitor}%
                    </Text>
                  </View>
                  <View style={{flex: 1, alignSelf: "flex-end", paddingHorizontal: 16,}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.totalBelowThreshold}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={7}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={7}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#eb2f96",
                    },
                  ]}
                  minimumTrackTintColor="#eb2f96"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 4,flexDirection: "row", alignItems: "center", paddingHorizontal: 16}}
                  >
                    <Ionicons name="timer" size={24} color="#fa8c16"/>
                    <Text style={{marginHorizontal: 4, color: "#fa8c16"}}>
                      Thời gian dưới ngưỡng dài nhất
                    </Text>
                  </View>
                  <View style={{flex: 1, alignSelf: "flex-end", paddingHorizontal: 16,}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.maxTimeRange}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={7}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={7}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#fa8c16",
                    },
                  ]}
                  minimumTrackTintColor="#fa8c16"
                  disabled={true}
                />
              </View>
            </View>

            <View>
              <View style={{paddingHorizontal: 16}}>
                <View style={tw.flexRow}>
                  <View style={{flex: 4,flexDirection: "row", alignItems: "center", paddingHorizontal: 16}}
                  >
                    <Ionicons name="timer-outline" size={24} color="#FEB139"/>
                    <Text style={{marginHorizontal: 4, color: "#FEB139"}}>
                      Trung bình mỗi lần {"<="} {item.oximeterMonitor}%
                    </Text>
                  </View>
                  <View style={{flex: 1, alignSelf: "flex-end", paddingHorizontal: 16,}}>
                    <Text style={{alignSelf: "flex-end"}}>
                      {item?.avgTimeBelowThreshold}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={7}
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={7}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#FEB139",
                    },
                  ]}
                  minimumTrackTintColor="#FEB139"
                  disabled={true}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <GradientButton
        style={{margin: 4}}
        text={"Chi tiết"}
        onPress={() => props.navigation.navigate(HISTORY_PAGE, {
          measurementDate: item?.measurementDate,
          typeRecord: 3
        })}
      />
    </View>
  );
}

const customStyles3 = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 5,
    backgroundColor: "#d0d0d0",
  },
  thumb: {
    width: 4,
    height: 20,
    borderRadius: 5,
  },
});

DetailAnalysisScreen.navigationOptions = ({navigation}) => ({
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
