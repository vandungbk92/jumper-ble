import {useEffect, useState} from "react";
import {View, Text} from "react-native";
import {BleManager} from "react-native-ble-plx";
import GradientButton from "../base/gradientButton";
import {Buffer} from "buffer";
import {tw} from "react-native-tailwindcss";
import base64 from "react-native-base64";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {postOximeterData} from "../../epics-reducers/services/oximeterServices";
import {showToast} from "../../epics-reducers/services/common";

const manager = new BleManager();
export default function PulseOximeter(props) {
    const [device, setDevice] = useState(null);
    const [status, setStatus] = useState(null);
    const [deviceData, setDeviceData] = useState(null);

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

    const scanAndConnect = () => {
        setDeviceData(null)
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                return;
            }
            setStatus("Đang quét...")
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
                setStatus(`Đã kết nối tới thiết bị: ${device.name}`)
                setDevice(device)
                readData(device)
            })
            .then((device) => {
                manager.stopDeviceScan();
            })
            .catch((error) => {
            });
    };

    const convertHexToDecimal = (hex) => {
        let decimalValue = []
        while (hex.length > 0) {
            let hexValue = hex.substring(0, 2)
            decimalValue.push(parseInt(hexValue, 16))
            hex = hex.substring(2)
        }
        return decimalValue
    }

    const readData = async (device) => {
        if (device) {
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            for (const service of services) {
                const characteristics = await device.characteristicsForService(
                    service.uuid
                );

                characteristics.map(x => {
                    if (x.isNotifiable) {
                        x.monitor(async (err, listener) => {
                            console.log(listener.value)
                            if (listener.hasOwnProperty('value')) {
                                const hexString = Buffer.from(listener.value, 'base64').toString('hex')
                                const data = convertHexToDecimal(hexString)
                                if (data.length === 4) {
                                    const oxiData = {
                                        oxigenSaturation: data[2],
                                        pulseRate: data[1],
                                        perfussionIndex: data[3] / 10
                                    }

                                    setDeviceData(data)
                                    // if (oxiData.oxigenSaturation !== 127 && oxiData.pulseRate !== 255 && oxiData.perfussionIndex !== 0) {
                                    await postOximeterData(oxiData)
                                    // console.log(oxiData)
                                    // }

                                }
                            }
                        })
                    } else {
                        console.log("Not monitor characteristic")
                    }

                })
            }
        }

    };

    const disconnect = () => {
        if (device.isConnected) {
            setDeviceData(null)
            setDevice(null)
            setStatus(null)
            manager.cancelDeviceConnection(device.id).then(res => {
                console.log("Manager cancel connection")
            })
            setDevice(null)
            setDeviceData(null)
        } else {
            setDeviceData(null)
            setDevice(null)
            setStatus(null)
        }
        showToast("Đã ngắt kết nối")
    }

    return (
        <View>
            <View style={tw.m4}>
                {device ? (
                    <GradientButton onPress={disconnect} text={I18n.t('Ngắt kết nối')}
                                    style={[tw.mT1, styleContainer.buttonGradient]}/>
                ) : (
                    <GradientButton onPress={scanAndConnect} text={I18n.t('Tìm thiết bị')}
                                    style={[tw.mT1, styleContainer.buttonGradient]}/>
                )}
            </View>
            <View style={{alignItems: "center", marginVertical: 10}}>
                <Text>{status}</Text>
                {deviceData && <View>
                    <Text>Nhịp tim: {deviceData[2]}</Text>
                    <Text>Oxi trong máu: {deviceData[1]}</Text>
                    <Text>Chỉ số tưới máu: {deviceData[3]/10}</Text>
                </View>}
            </View>
        </View>
    );
}
