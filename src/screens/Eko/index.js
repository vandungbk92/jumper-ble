import React, {useEffect, useState} from "react";
import {
    View, Text, TouchableOpacity, Dimensions, ImageBackground,
} from "react-native";
import {BleManager} from "react-native-ble-plx";
import {Buffer} from "buffer";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";

const manager = new BleManager();
const {width: screenWidth, height: screenHeight} = Dimensions.get("screen");

export default function EkoDevice(props) {
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState(null);
    const [deviceData, setDeviceData] = useState([]);
    const [stopMonitoring, setStopMonitoring] = useState(false);
    const [deviceId, setDeviceId] = useState(null)

    useEffect(() => {
        props.navigation.setParams({
            onBackAction: onBackAction, scanAndConnect: scanAndConnect
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

    const onBackAction = () => {
        onDestroyBLE();
        props.navigation.goBack(null);
    };

    const scanAndConnect = () => {
        if (device || deviceData.length > 0) {
            return;
        }
        const id = "88:6B:0F:77:0A:11";
        setStatus("Đang quét...");
        setDeviceData(null);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error.message)
                return;
            }
            if (device.id === id) {
                manager.stopDeviceScan();
                connectDevice(device);
            }
        });
    };

    const connectDevice = (device) => {
        device
            .connect()
            .then((device) => {
                // setStatus(`Đã kết nối tới thiết bị: ${device.name}`);
                setDeviceId(device.id)
                setDevice(device);
                readData(device);
            })
            .catch((error) => {
                console.log(error.message())
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
                const characteristics = await device.characteristicsForService(service.uuid);

                characteristics.map((x) => {
                    console.log(x.isNotifiable);
                    if (x.isNotifiable) {
                        // x.monitor(async (err, listener) => {
                        //     if (err) {
                        //         console.log(err.message);
                        //     }
                        //     if (stopMonitoring) {
                        //         return;
                        //     }
                        //     if (listener) {
                        //         if (listener.hasOwnProperty("value")) {
                        //             const hexString = Buffer.from(listener.value, "base64").toString("hex");
                        //             // console.log("base64 ",Buffer.from(listener.value, "base64"))
                        //             const data = convertHexToDecimal(hexString);
                        //             process(data)
                        //             // console.log("buffer ",data)
                        //             // if (data.length === 4) {
                        //             //     process(data);
                        //             // }
                        //         }
                        //     }
                        // });

                    } else {
                        console.log("Not monitor characteristic");
                    }
                });
            }
        }
    };

    const process = async (data) => {
        deviceData.concat(data)
        // console.log(data)
        // setDeviceData(data);
        // const oxiData = {
        //     oxigenSaturation: data[2], pulseRate: data[1], perfussionIndex: data[3] / 10,
        // };
        // if (oxiData.oxigenSaturation !== 127 && oxiData.pulseRate !== 255 && oxiData.perfussionIndex !== 0) {


        //     // await postOximeterData(oxiData);

        // }
    };

    const onDestroyBLE = async () => {
        try {
            await manager.cancelDeviceConnection(deviceId).then((res) => {
                console.log("Manager cancel connection");
            });
            if (device) {
                await device.cancelConnection()
                await manager.cancelDeviceConnection(device.id).then((res) => {
                    console.log("Manager cancel connection");
                });
                setStatus(null);
                setDevice(null);
                setDeviceData(null);
            }
            await manager.stopDeviceScan();
        } catch (err) {
            console.log("err ", err.message);
        }
    };

    return (<View style={{flex: 1}}>
        <View
            style={{
                flex: 1, padding: 24
            }}
        >
            <Text style={{marginVertical: 4, alignSelf: 'center'}}>{status}</Text>
        </View>
    </View>);
}

EkoDevice.navigationOptions = ({navigation}) => ({
    headerLeft: () => (<TouchableOpacity
        style={styleContainer.headerButton}
        onPress={navigation.getParam("onBackAction")}
    >
        <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.appColor}
        />
    </TouchableOpacity>),
    headerTitle: () => <RkText rkType="header4">{I18n.t("Eko")}</RkText>,
    headerRight: () => (<TouchableOpacity
        style={styleContainer.headerButton}
        onPress={navigation.getParam("scanAndConnect")}
    >
        <RkText rkType={"link"}>{I18n.t("Quét")}</RkText>
    </TouchableOpacity>),
});
