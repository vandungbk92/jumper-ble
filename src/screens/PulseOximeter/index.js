import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BleManager } from "react-native-ble-plx";
import GradientButton from "../base/gradientButton";
import { Buffer } from "buffer";
import { tw } from "react-native-tailwindcss";
import base64 from "react-native-base64";
import I18n from "../../utilities/I18n";
import { styleContainer } from "../../stylesContainer";
import { postOximeterData } from "../../epics-reducers/services/oximeterServices";
import { showToast } from "../../epics-reducers/services/common";
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import { Audio } from "expo-av";

const manager = new BleManager();
export default function PulseOximeter(props) {
    const [warningSound, setWarningSound] = useState(null);
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState(null);
    const [deviceData, setDeviceData] = useState(null);

    useEffect(() => {
        props.navigation.setParams({
            onReadAllPress: onReadAllPress,
        });
    }, []);

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
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
            require("../../../assets/sounds/sound.mp3"),
            { shouldPlay: true }
        );
        await sound.setIsLoopingAsync(true)
        await sound.playAsync();
        setWarningSound(sound);
    };

    const stopSound = async () => {
        if (warningSound) {
            warningSound.unloadAsync();
            setWarningSound(null);
        }
    };

    const scanAndConnect = () => {
        setDeviceData(null);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                return;
            }
            setStatus("Đang quét...");
            console.log(device.name)
            if (device.id === "40:2E:71:47:0A:1F") {
                connectDevice(device);
                manager.stopDeviceScan();
            }
        });
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
            .catch((error) => {});
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
                            console.log(listener.value);
                            if (listener.hasOwnProperty("value")) {
                                const hexString = Buffer.from(
                                    listener.value,
                                    "base64"
                                ).toString("hex");
                                const data = convertHexToDecimal(hexString);
                                if (data.length === 4) {
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
                                        console.log(oxiData);
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

    const disconnect = () => {
        if (device)
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
            disconnect();

            manager.stopDeviceScan();
            manager.destroy();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View>
            <View style={tw.m4}>
                <GradientButton
                    onPress={warningSound ? stopSound : warningSoundPlay}
                    text={
                        warningSound
                            ? I18n.t("Tắt cảnh báo")
                            : I18n.t("Cảnh báo")
                    }
                    style={[tw.mT1, styleContainer.buttonGradient]}
                />
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
            <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Text>{status}</Text>
                {deviceData && (
                    <View>
                        <Text>Nhịp tim: {deviceData[2]}</Text>
                        <Text>Oxi trong máu: {deviceData[1]}</Text>
                        <Text>Chỉ số tưới máu: {deviceData[3] / 10}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

PulseOximeter.navigationOptions = ({ navigation }) => ({
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
});
