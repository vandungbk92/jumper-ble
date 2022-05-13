import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import I18n from "../../utilities/I18n";
import { styleContainer } from "../../stylesContainer";
import { Ionicons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import * as Location from "expo-location";

const RNFS = require("react-native-fs");

const manager = new BleManager();
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const filePath = RNFS.DocumentDirectoryPath + "/data.txt";

export default function OmronScreen(props) {
    const [device, setDevice] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    useEffect(() => {
        props.navigation.setParams({
            onBackAction: onBackAction,
            checkPermissions: checkPermissions,
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

    const onBackAction = async () => {
        await onDestroyBLE();
        props.navigation.goBack(null);
    };

    const checkPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
            scanAndConnect();
        }
    };

    const scanAndConnect = () => {
        if (device || deviceData) {
            setDeviceData(null);
            return;
        }
        const id = "28:FF:B2:EB:5D:EC";
        setDeviceData(null);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                setDeviceData(null);
                return;
            }
            console.log(device.id);
            if (device.id === id) {
                manager.stopDeviceScan();
                manager.onDeviceDisconnected(id, async (err, device) => {
                    console.log("Destroyed");
                });
                connectDevice(device);
            }
        });
    };

    const connectDevice = (device) => {
        device
            .connect()
            .then(async (device) => {
                console.log("success");
                setDevice(device);
                await readData(device);
            })
            .catch((error) => {
                return;
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
        if (device) {
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            for (const service of services) {
                const characteristics = await device.characteristicsForService(
                    service.uuid
                );

                characteristics.map((x) => {
                    if (x.isReadable) {
                        x.read()
                            .then((res) => {
                                const hexString = Buffer.from(
                                    res.value,
                                    "base64"
                                ).toString("hex");
                                const data = convertHexToDecimal(hexString);
                                process(data);
                            })
                            .catch((err) => {
                                console.log("read err", err);
                            });
                    } else {
                        console.log("Not monitor characteristic");
                    }
                });
            }
        }
    };

    const process = async (data) => {
        console.log(data);
    };

    const onDestroyBLE = async () => {
        try {
            await manager.cancelDeviceConnection("28:FF:B2:EB:5D:EC");
            setDevice(null);
            setDeviceData(null);
            await manager.stopDeviceScan();
        } catch (err) {
            console.log("destroy error", err.message);
        }
    };

    return <View></View>;
}

OmronScreen.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
        <TouchableOpacity
            style={styleContainer.headerButton}
            onPress={navigation.getParam("onBackAction")}
        >
            <Ionicons
                name="ios-arrow-back"
                size={20}
                color={KittenTheme.colors.appColor}
            />
        </TouchableOpacity>
    ),
    headerTitle: () => <RkText rkType="header4">{I18n.t("Omron")}</RkText>,
    headerRight: () => (
        <TouchableOpacity
            style={styleContainer.headerButton}
            onPress={navigation.getParam("checkPermissions")}
        >
            <RkText rkType={"link"}>{I18n.t("Quét")}</RkText>
        </TouchableOpacity>
    ),
});
