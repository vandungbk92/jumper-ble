import React, {useEffect, useState} from "react";
import {
    View, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView, StyleSheet
} from "react-native";
import {BleManager} from "react-native-ble-plx";
import GradientButton from "../base/gradientButton";
import {Buffer} from "buffer";
import {tw} from "react-native-tailwindcss";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {postOximeterData} from "../../epics-reducers/services/oximeterServices";
import {showToast} from "../../epics-reducers/services/common";
import {Ionicons, AntDesign, FontAwesome5} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import {Audio} from "expo-av";
import {HISTORY_PAGE} from "../../constants/router";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import {CONSTANTS} from "../../constants";
import CircularProgress from "react-native-circular-progress-indicator";
import Slider from "react-native-slider";
import moment from "moment";

const manager = new BleManager();
const {width: screenWidth, height: screenHeight} = Dimensions.get("screen");

export default function PulseOximeter(props) {
    const [device, setDevice] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [stopMonitoring, setStopMonitoring] = useState(false);

    useEffect(() => {
        props.navigation.setParams({
            onBackAction: onBackAction, scanAndConnect: scanAndConnect,
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
        if (device || deviceData) {
            setDeviceData(null);
            return;
        }
        const id = "40:2E:71:47:0A:1F";
        // const id = "88:6B:0F:77:0A:11";
        setDeviceData(null);
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                setDeviceData(null);
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
                setDevice(device);
                readData(device);
            })
            .catch((error) => {
                console.log(error.message);
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
                    if (x.isNotifiable) {
                        x.monitor(async (err, listener) => {
                            if (err) {
                                setDeviceData(null)
                                console.log(err.message);
                            }
                            if (stopMonitoring) {
                                return;
                            }
                            if (listener) {
                                if (listener.hasOwnProperty("value")) {
                                    const hexString = Buffer.from(listener.value, "base64").toString("hex");
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
            oxigenSaturation: data[2], pulseRate: data[1], perfussionIndex: data[3] / 10,
        };
        if (oxiData.oxigenSaturation !== 127 && oxiData.pulseRate !== 255 && oxiData.perfussionIndex !== 0) {
            setDeviceData(data);

            // await postOximeterData(oxiData);
        }
    };

    const onDestroyBLE = async () => {
        try {
            await manager.cancelDeviceConnection("40:2E:71:47:0A:1F").then((res) => {
                console.log("Manager cancel connection");
            });
            setDevice(null);
            setDeviceData(null);
            if (device) {
                await manager.cancelDeviceConnection("40:2E:71:47:0A:1F").then((res) => {
                    console.log("Manager cancel connection");
                });
                setDevice(null);
                setDeviceData(null);

            }

            await manager.stopDeviceScan();
        } catch (err) {
            console.log(err.message);
        }
    };

    return (<View style={{flex: 1}}>
        <ImageBackground
            source={require("../../assets/bg.jpg")}
            style={{
                width: screenWidth, height: screenHeight * 0.25, flex: 1,
            }}
            resizeMode={"cover"}
        >
            <View
                style={{
                    justifyContent: "center", alignItems: "center", marginTop: screenWidth * 0.1,
                }}
            >
                <View
                    style={{
                        alignItems: "center", justifyContent: "center", marginBottom: 10,
                    }}
                >
                    <Text style={{color: "white"}}>Giấc ngủ</Text>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row", alignItems: "center",
                        }}
                        onPress={() => props.navigation.navigate(HISTORY_PAGE)}
                    >
                        <Text style={{color: "white", fontSize: 18}}>
                            {moment().format('dd DD MMMM YYYY')}
                        </Text>
                        <AntDesign
                            name="caretdown"
                            size={14}
                            color="white"
                            style={{marginHorizontal: 8}}
                        />
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
                        value={deviceData ? deviceData[2] : 0}
                        progressValueColor={"#92BA92"}
                        maxValue={100}
                        valueSuffix={"%"}
                        inActiveStrokeColor={"#2ecc71"}
                        inActiveStrokeOpacity={0.2}
                        radius={screenWidth * 0.25 - 5}
                    />
                </View>
            </View>
        </ImageBackground>
        <ScrollView style={{flex: 1}}>
            <Text
                style={{
                    alignSelf: "center", fontSize: 20, color: "#069A8E",
                }}
            >
                Chỉ số Oxi trong máu ổn định
            </Text>
            <Text style={{alignSelf: "center", color: "#069A8E"}}>
                Khoẻ mạnh
            </Text>
            <View
                style={{
                    flex: 1, marginTop: 4
                }}
            >
                <View style={{flex: 1}}>
                    <View>
                        <View style={{paddingHorizontal: 16}}>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 16
                                    }}
                                >
                                    <FontAwesome5 name="heartbeat" size={24} color="#1DB9C3"/>
                                    <Text style={{marginHorizontal: 4, color: '#1DB9C3'}}>
                                        Nhịp tim
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1, paddingHorizontal: 16
                                }}>
                                    <Text style={{alignSelf: "flex-end"}}>
                                        {deviceData ? deviceData[1] : 0}
                                    </Text>
                                </View>
                            </View>
                            <Slider
                                value={deviceData ? parseInt(deviceData[1]) : 0}
                                style={{height: 40}}
                                minimumValue={0}
                                maximumValue={150}
                                trackStyle={customStyles3.track}
                                thumbStyle={[customStyles3.thumb, {
                                    backgroundColor: '#1DB9C3',
                                }]}
                                minimumTrackTintColor='#1DB9C3'
                                disabled={true}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{paddingHorizontal: 16}}>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 16
                                    }}
                                >
                                    <Ionicons
                                        name="leaf-outline"
                                        size={24}
                                        color="#7027A0"
                                    />
                                    <Text style={{marginHorizontal: 4, color: '#7027A0'}}>
                                        Nồng độ Oxi trong máu
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1, alignSelf: "flex-end", paddingHorizontal: 16
                                }}>
                                    <Text style={{alignSelf: "flex-end"}}>
                                        {deviceData ? deviceData[2] : 0}
                                    </Text>
                                </View>
                            </View>
                            <Slider
                                value={deviceData ? parseInt(deviceData[2]) : 0}
                                style={{height: 40}}
                                minimumValue={0}
                                maximumValue={100}
                                trackStyle={customStyles3.track}
                                thumbStyle={[customStyles3.thumb, {
                                    backgroundColor: '#7027A0',
                                }]}
                                minimumTrackTintColor='#7027A0'
                                disabled={true}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{paddingHorizontal: 16}}>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 16
                                    }}
                                >
                                    <Ionicons
                                        name="leaf-outline"
                                        size={24}
                                        color="#FEB139"
                                    />
                                    <Text style={{marginHorizontal: 4, color: '#FEB139'}}>
                                        Chỉ số PI
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1, alignSelf: "flex-end", paddingHorizontal: 16
                                }}>
                                    <Text style={{alignSelf: "flex-end"}}>
                                        {deviceData ? deviceData[3] / 10 : 0}
                                    </Text>
                                </View>
                            </View>
                            <Slider
                                value={deviceData ? parseFloat(deviceData[3] / 10) : 0}
                                style={{height: 40}}
                                minimumValue={0}
                                maximumValue={20}
                                trackStyle={customStyles3.track}
                                thumbStyle={[customStyles3.thumb, {
                                    backgroundColor: '#FEB139',
                                }]}
                                minimumTrackTintColor='#FEB139'
                                disabled={true}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>);
}

const customStyles3 = StyleSheet.create({
    track: {
        height: 3, borderRadius: 5, backgroundColor: '#d0d0d0',
    }, thumb: {
        width: 4, height: 20, borderRadius: 5
    }
});

PulseOximeter.navigationOptions = ({navigation}) => ({
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
    headerTitle: () => <RkText rkType="header4">{I18n.t("Oximeter")}</RkText>,
    headerRight: () => (<TouchableOpacity
        style={styleContainer.headerButton}
        onPress={navigation.getParam("scanAndConnect")}
    >
        <RkText rkType={"link"}>{I18n.t("Quét")}</RkText>
    </TouchableOpacity>),
});
