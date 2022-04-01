import React, {Component} from "react";
import {
    Platform,
    View,
    PermissionsAndroid,
} from "react-native";
import {BleManager} from "react-native-ble-plx";
import {
    Content,
    Button,
    Text,
    Root,
} from "native-base";
import * as base64js from "base64-js";

const transactionId = "moniter";

export default class SPO2Screen extends Component {
    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {
            deviceid: "",
            serviceUUID: "",
            characteristicsUUID: "",
            text1: "",
            makedata: [],
            showToast: false,
            notificationReceiving: false,
        };
    }

    getFloatValue(value, offset) {
        const negative = value.getInt8(offset + 2) >>> 31;

        const [b0, b1, b2, exponent] = [
            value.getUint8(offset),
            value.getUint8(offset + 1),
            value.getUint8(offset + 2),

            value.getInt8(offset + 3)
        ];

        let mantissa = b0 | (b1 << 8) | (b2 << 16);
        if (negative) {
            mantissa |= 255 << 24;
        }

        return mantissa * Math.pow(10, exponent);
    }


    componentWillUnmount() {
        this.manager.cancelTransaction(transactionId);
        this.manager.stopDeviceScan();
        this.manager.destroy();
        delete this.manager;
    }

    UNSAFE_componentWillMount() {
        this.manager = new BleManager();
        if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                    // this.retrieveConnected()
                } else {
                    PermissionsAndroid.requestPermission(
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                    ).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
    }

    getServicesAndCharacteristics(device) {
        return new Promise((resolve, reject) => {
            device.services().then((services) => {
                const characteristics = [];
                services.forEach((service, i) => {
                    service.characteristics().then((c) => {
                        console.log("service.characteristics");
                        characteristics.push(c);
                        if (i === services.length - 1) {
                            const temp = characteristics.reduce(
                                (acc, current) => {
                                    return [...acc, ...current];
                                },
                                []
                            );
                            const dialog = temp.find(
                                (characteristic) =>
                                    characteristic.isWritableWithoutResponse
                            );
                            if (!dialog) {
                                reject("No writable characteristic");
                            }
                            resolve(dialog);
                        }
                    });
                });
            });
        });
    }

    stopNotication() {
        this.manager.cancelTransaction(transactionId);
        this.setState({notificationReceiving: false});
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.manager
                .cancelDeviceConnection(this.state.deviceid)
                .then((rest) => {
                    console.log(rest);
                    let cleanState = {};
                    Object.keys(this.state).forEach((x) => {
                        if (x === "makedata") {
                            cleanState[x] = [];
                        } else {
                            cleanState[x] = null;
                        }
                    });
                    this.setState(cleanState);
                })
                .catch((err) => console.log("error on cancel connection", err));
        });
    }

    async readData(device) {
        await device.discoverAllServicesAndCharacteristics();
        const services = await device.services();
        services.forEach(async service => {
            const characteristics = await device.characteristicsForService(
                service.uuid,
            );

            characteristics.map(x => {
                if (x.isReadable)
                    x.read().then(res => {
                        const arrayBytes = base64js.toByteArray(res.value);
                        const dataView = new DataView(arrayBytes.buffer);
                        console.log(this.getFloatValue(dataView, 1))
                        // const data = base64.decode(res.value)
                        // const data = Buffer.from(res.value, 'base64')
                        console.log(res.value)
                    }).catch(err => {
                        console.log(err)
                    })
            });
        });
    };

    async scanAndConnect() {
        this.setState({text1: "Scanning..."});
        this.manager.startDeviceScan(null, null, (error, device) => {
            console.log("Scanning...");

            if (error) {
                this.setState({text1: ""});
                this.manager.stopDeviceScan();
                return;
            }
            if (device.name) {
                if (device.name === "My Oximeter") {
                    const serviceUUIDs = device.serviceUUIDs[0];
                    this.setState({text1: "Connecting to " + device.name});
                    this.manager.stopDeviceScan();
                    this.manager
                        .connectToDevice(device.id, {autoConnect: true})
                        .then((device) => {
                            (async () => {
                                const services =
                                    await device.discoverAllServicesAndCharacteristics(transactionId);
                                const characteristic =
                                    await this.getServicesAndCharacteristics(
                                        services
                                    );
                                console.log(
                                    "Discovering services and characteristics",
                                    characteristic.uuid
                                );
                                this.setState({
                                    deviceid: device.id,
                                    serviceUUID: serviceUUIDs,
                                    characteristicsUUID: characteristic.uuid,
                                    device: device,
                                });
                                this.setState({
                                    text1: "Conneted to " + device.name,
                                });
                            })();
                            this.setState({device: device});
                            return device.discoverAllServicesAndCharacteristics();
                        })
                        .then((device) => {
                            this.readData(device)
                        })
                        .then(
                            () => {
                                console.log("Listening...");
                            },
                            (error) => {

                            }
                        );
                }
            }
        });
    }

    render() {
        return (
            <Root>
                <Content padder>
                    <View>
                        {this.state.deviceid ? (
                            <Button
                                warning
                                block
                                onPress={() => this.disconnect()}
                            >
                                <Text>Disconnect</Text>
                            </Button>
                        ) : (
                            <Button block onPress={() => this.scanAndConnect()}>
                                <Text>Scan for a device</Text>
                            </Button>
                        )}
                    </View>
                    <View style={{alignItems: "center", marginVertical: 10}}>
                        <Text>
                            {this.state.text1} : {this.state.deviceid}
                        </Text>
                    </View>
                </Content>
            </Root>
        );
    }
}
