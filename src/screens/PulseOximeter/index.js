import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {BleManager} from "react-native-ble-plx";
import GradientButton from "../base/gradientButton";
import {Buffer} from "buffer";
import {tw} from "react-native-tailwindcss";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {postOximeterData} from "../../epics-reducers/services/oximeterServices";
import {showToast} from "../../epics-reducers/services/common";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import {Audio} from "expo-av";
import {HISTORY_PAGE} from "../../constants/router";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {CONSTANTS} from "../../constants";

const manager = new BleManager();
export default function PulseOximeter(props) {
    const [warningSound, setWarningSound] = useState(null);
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [isWarning, setIsWarning] = useState(false);
    const [warningValues, setWarningValues] = useState();
    const [stopMonitoring, setStopMonitoring] = useState(false);
    useEffect(() => {
        props.navigation.setParams({
            onReadAllPress: onReadAllPress,
            onShowHistory: onShowHistory,
        });
        loadValues();
    }, []);

    const loadValues = async () => {
        const values = await AsyncStorageLib.getItem(
            CONSTANTS.WARNING_SETTINGS
        );
        setWarningValues(JSON.parse(values));
    };

    const onShowHistory = () => {
        props.navigation.navigate(HISTORY_PAGE);
    };

    useEffect(() => {
        manager.onStateChange((state) => {
            const subscription = manager.onStateChange((state) => {
                if (state === "PoweredOn") {
                    scanAndConnect();
                    subscription.remove();
                }
            }, true);
            return () => subscription.remove();
        });
    }, [manager]);

    const onReadAllPress = () => {
        onDestroyBLE();
        props.navigation.goBack(null);
    };

    const warningSoundPlay = async () => {
        await Audio.setAudioModeAsync({playsInSilentModeIOS: true});
        const {sound} = await Audio.Sound.createAsync(
            require("../../../assets/sounds/sound.mp3"),
            {shouldPlay: true}
        );
        setIsWarning(true);
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();
        setWarningSound(sound);
    };

    const stopSound = async () => {
        if (warningSound) {
            setIsWarning(false);
            warningSound.unloadAsync();
            setWarningSound(null);
        }
    };

    const scanAndConnect = () => {
        if(manager) {

            setDeviceData(null);
            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    return;
                }
                setStatus("Đang quét...");
                if (device.id === "40:2E:71:47:0A:1F") {
                    connectDevice(device);
                    manager.stopDeviceScan();
                }
            });
        }else{
            manager = new BleManager()
        }
    };

    const connectDevice = (device) => {
        device
            .connect()
            .then((device) => {
                setStatus(`Đã kết nối tới thiết bị: ${device.name}`);
                setDevice(device);
                readData(device);
            })
            .then((device) => {
                manager.stopDeviceScan();
            })
            .catch((error) => {
            });
    };

    const convertHexToDecimal = (hex) => {
        let decimalValue = [];
        while (hex.length > 0) {
            let hexValue = hex.substring(0, 2);
            decimalValue.push(parseInt(hexValue, 16));
            hex = hex.substring(2);
        }
        return decimalValue;
    };

    const readData = async (device) => {
        setStopMonitoring(false);
        if (device) {
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            for (const service of services) {
                const characteristics = await device.characteristicsForService(
                    service.uuid
                );

                characteristics.map((x) => {
                    if (x.isNotifiable) {
                        x.monitor(async (err, listener) => {
                            if (stopMonitoring) {
                                return;
                            }
                            if (listener) {
                                if (listener.hasOwnProperty("value")) {
                                    const hexString = Buffer.from(
                                        listener.value,
                                        "base64"
                                    ).toString("hex");
                                    const data = convertHexToDecimal(hexString);
                                    if (data.length === 4) {
                                        process(data);
                                    }
                                }
                            }
                        });
                    } else {
                        console.log("Not monitor characteristic");
                    }
                });
            }
        }
    };

    const process = async (data) => {
        const oxiData = {
            oxigenSaturation: data[2],
            pulseRate: data[1],
            perfussionIndex: data[3] / 10,
        };

        setDeviceData(data);
        if (
            oxiData.oxigenSaturation !== 127 &&
            oxiData.pulseRate !== 255 &&
            oxiData.perfussionIndex !== 0
        ) {

            await postOximeterData(oxiData);
            // if (
            //     warningValues.oxigenSaturationWarning >=
            //     oxiData.oxigenSaturation ||
            //     warningValues.pulseRateWarning >= oxiData.pulseRate ||
            //     warningValues.perfussionIndexWarning >=
            //     oxiData.perfussionIndex
            // ) {
            //     if (isWarning === false) {
            //         await warningSoundPlay();
            //     }
            // } else {
            //     if (isWarning === true) {
            //         await stopSound();
            //     }
            // }
        }
    };

    const disconnect = () => {
        if (device)
            setStopMonitoring(true);
            if (device.isConnected) {
                setDeviceData(null);
                setDevice(null);
                setStatus(null);
                manager.cancelDeviceConnection(device.id).then((res) => {
                    console.log("Manager cancel connection");
                });
                setDevice(null);
                setDeviceData(null);
            } else {
                setDeviceData(null);
                setDevice(null);
                setStatus(null);
            }
        showToast("Đã ngắt kết nối");
    };

    const onDestroyBLE = () => {
        try {
            // stopSound()
            // if (device)
            //     if (device.isConnected) {
            //         setDeviceData(null);
            //         setDevice(null);
            //         setStatus(null);
            //         manager.cancelDeviceConnection(device.id).then((res) => {
            //             console.log("Manager cancel connection");
            //         });
            //         setDevice(null);
            //         setDeviceData(null);
            //     } else {
            //         setDeviceData(null);
            //         setDevice(null);
            //         setStatus(null);
            //     }
            //
            // manager.stopDeviceScan();
            // manager.destroy();
            disconnect()
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
            }}
        >
            <View style={[tw.m4, tw.flex1]}>
                {device ? (
                    <GradientButton
                        onPress={disconnect}
                        text={I18n.t("Ngắt kết nối")}
                        style={[tw.mT1, styleContainer.buttonGradient]}
                    />
                ) : (
                    <GradientButton
                        onPress={scanAndConnect}
                        text={I18n.t("Tìm thiết bị")}
                        style={[tw.mT1, styleContainer.buttonGradient]}
                    />
                )}
            </View>
            <View style={{alignItems: "center", marginVertical: 10, flex: 1}}>
                <Text>{status}</Text>
                {deviceData && (
                    <View>
                        <Text>Nhịp tim: {deviceData[1]}</Text>
                        <Text>Oxi trong máu: {deviceData[2]}</Text>
                        <Text>Chỉ số tưới máu: {deviceData[3] / 10}</Text>
                    </View>
                )}
            </View>
            <View style={tw.m4}>
                <GradientButton
                    onPress={isWarning ? stopSound : warningSoundPlay}
                    text={
                        isWarning ? I18n.t("Tắt cảnh báo") : I18n.t("Cảnh báo")
                    }
                    style={[tw.mT1, styleContainer.buttonGradient]}
                />
            </View>
        </View>
    );
}

PulseOximeter.navigationOptions = ({navigation}) => ({
    headerLeft: () => (
        <TouchableOpacity
            style={styleContainer.headerButton}
            onPress={navigation.getParam("onReadAllPress")}
        >
            <Ionicons
                name="ios-arrow-back"
                size={20}
                color={KittenTheme.colors.appColor}
            />
        </TouchableOpacity>
    ),
    headerTitle: () => <RkText rkType="header4">{I18n.t("Oximeter")}</RkText>,
    headerRight: () => (
        <TouchableOpacity
            style={styleContainer.headerButton}
            onPress={navigation.getParam("onShowHistory")}
        >
            <RkText rkType={"link"}>{I18n.t("Lịch sử")}</RkText>
        </TouchableOpacity>
    ),
});
