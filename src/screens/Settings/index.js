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
import DatePicker from "react-native-date-picker";

export default function SettingsScreen(props) {
    const [pulseRateWarning, setPulseRateWarning] = useState(0);
    const [perfussionIndexWarning, setPerfussionIndexWarning] = useState(0);
    const [oxigenSaturation, setOxigenSaturation] = useState(0);

    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())

    const showStart = () => {
        setOpenStart(true)
    }

    const showEnd = () => {
        setOpenEnd(true)
    }

    const onSaveSettings = () => {
        AsyncStorageLib.setItem(CONSTANTS.WARNING_SETTINGS, JSON.stringify({
            pulseRateWarning: pulseRateWarning,
            perfussionIndexWarning: perfussionIndexWarning,
            oxigenSaturationWarning: oxigenSaturation,
            startRecording: startTime.toLocaleString(),
            endRecording: endTime.toLocaleString()
        }));
        showToast("Lưu thành công!");
        props.navigation.goBack(null);
    };

    return (<>
            <View style={[tw.p4, tw.flex1, {flexDirection: 'column'}]}>
                <View>
                    <View
                        style={{
                            justifyContent: "space-between", flexDirection: "row",
                        }}
                    >
                        <RkText>Nhịp tim</RkText>
                        <RkText>{pulseRateWarning}</RkText>
                    </View>
                    <Slider
                        style={{width: "100%", height: 40}}
                        minimumValue={50}
                        maximumValue={100}
                        step={1}
                        onValueChange={(value) => setPulseRateWarning(value)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View>
                    <View
                        style={{
                            justifyContent: "space-between", flexDirection: "row",
                        }}
                    >
                        <RkText>SpO2</RkText>
                        <RkText>{oxigenSaturation}</RkText>
                    </View>
                    <Slider
                        style={{width: "100%", height: 40}}
                        minimumValue={50}
                        maximumValue={100}
                        step={1}
                        onValueChange={(value) => setOxigenSaturation(value)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View>
                    <View
                        style={{
                            justifyContent: "space-between", flexDirection: "row",
                        }}
                    >
                        <RkText>Chỉ số PI</RkText>
                        <RkText>
                            {parseFloat(perfussionIndexWarning)
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
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
                <View style={{marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={showStart}>
                        <RkText>Thời gian bắt đầu đo</RkText>
                        <DatePicker
                            modal
                            open={openStart}
                            date={startTime}
                            onConfirm={(date) => {
                                setOpenStart(false)
                                setStartTime(date)
                            }}
                            onCancel={() => {
                                setOpenStart(false)
                            }}
                            mode={'time'}
                            title={'Thời gian bắt đầu đo'}
                            confirmText={'Xác nhận'}
                            cancelText={'Huỷ'}
                        />
                    </TouchableOpacity>
                    <View>
                        <RkText>{startTime.toLocaleTimeString().substring(0, 5)}</RkText>
                    </View>
                </View>
                <View style={{marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={showEnd}>
                        <RkText>Thời gian kết thúc đo</RkText>
                        <DatePicker
                            modal
                            open={openEnd}
                            date={endTime}
                            onConfirm={(date) => {
                                setOpenEnd(false)
                                setEndTime(date)
                            }}
                            onCancel={() => {
                                setOpenEnd(false)
                            }}
                            mode={'time'}
                            title={'Thời gian kết thúc đo'}
                            confirmText={'Xác nhận'}
                            cancelText={'Huỷ'}
                        />
                    </TouchableOpacity>
                    <View>
                        <RkText>{endTime.toLocaleTimeString().substring(0, 5)}</RkText>
                    </View>
                </View>

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
