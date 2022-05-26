import React, {useState, useEffect} from "react";
import {TouchableOpacity, View} from "react-native";
import {styleContainer} from "../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText, RkTextInput} from "react-native-ui-kitten";
import I18n from "../../utilities/I18n";
import {tw} from "react-native-tailwindcss";
import Slider from "@react-native-community/slider";
import GradientButton from "../base/gradientButton";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {CONSTANTS} from "../../constants/constants";
import {showToast} from "../../epics-reducers/services/common";
import {putSetting, getSetting} from "../../epics-reducers/services/settingServices";

export default function SettingsScreen(props) {
  const [oximeter_min, setOximeterMin] = useState(null);
  const [oximeter_max, setOximeterMax] = useState(null);
  const [oximeter_monitor, setOximeterMonitor] = useState(null);

  const [pulse_max, setPulseMax] = useState(null);
  const [pulse_min, setPulseMin] = useState(null);


  useEffect(() => {
    funcGetSetting()
  }, []);

  const funcGetSetting = async () => {
    let data = await getSetting();
    setOximeterMin(data.oximeter_min);
    setOximeterMax(data.oximeter_max);
    setOximeterMonitor(data.oximeter_monitor);

    setPulseMax(data.pulse_max);
    setPulseMin(data.pulse_min);
  }

  const onSaveSettings = async () => {
    const dataRequest = {
      oximeter_min,
      oximeter_max,
      oximeter_monitor,
      pulse_max,
      pulse_min,
    };
    const data = await putSetting(dataRequest);
    if(data){
      showToast("Cập nhật dữ liệu thành công!");
    }
  };

  return (<>
    <View style={[tw.p4, tw.flex1, {flexDirection: 'column'}]}>
      <View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>SP02 theo dõi</RkText>
          <RkText>{oximeter_monitor}</RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          value={oximeter_monitor}
          minimumValue={50}
          maximumValue={100}
          step={1}
          onValueChange={(value) => setOximeterMonitor(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>
      <View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>SpO2 (Min)</RkText>
          <RkText>{oximeter_min}</RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          minimumValue={50}
          maximumValue={100}
          value={oximeter_min}
          step={1}
          onValueChange={(value) => setOximeterMin(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>
      <View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>SpO2 (Max)</RkText>
          <RkText>{oximeter_max}</RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          minimumValue={50}
          maximumValue={100}
          value={oximeter_max}
          step={1}
          onValueChange={(value) => setOximeterMax(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>

      <View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>Nhịp tim (Min)</RkText>
          <RkText>{pulse_min}</RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          minimumValue={25}
          maximumValue={250}
          value={pulse_min}
          step={1}
          onValueChange={(value) => setPulseMin(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>
      <View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>Nhịp tim (Max)</RkText>
          <RkText>{pulse_max}</RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          minimumValue={25}
          maximumValue={250}
          value={pulse_max}
          step={1}
          onValueChange={(value) => setPulseMax(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>

      {/*<View>
        <View
          style={{
            justifyContent: "space-between", flexDirection: "row",
          }}
        >
          <RkText>SP02 Max</RkText>
          <RkText>
            {parseFloat(set)
              .toFixed(1)
              .toString()}
          </RkText>
        </View>
        <Slider
          style={{width: "100%", height: 40}}
          minimumValue={0}
          maximumValue={20}
          step={0.1}
          onValueChange={(value) => setPerfussionIndexWarning(value)}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
        />
      </View>*/}

      <GradientButton
        onPress={onSaveSettings}
        text={I18n.t("Lưu")}
        style={[styleContainer.buttonGradient]}
      />
    </View>
  </>);
}

SettingsScreen.navigationOptions = ({navigation}) => ({
  headerLeft: () => (<TouchableOpacity
    style={styleContainer.headerButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons
      name="ios-arrow-back"
      size={20}
      color={KittenTheme.colors.appColor}
    />
  </TouchableOpacity>), headerTitle: () => (<RkText rkType="header4">{I18n.t("Cài đặt cảnh báo")}</RkText>),
});
