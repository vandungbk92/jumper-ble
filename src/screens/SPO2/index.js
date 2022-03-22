import { useEffect, useState } from "react";
import { BleManager } from "react-native-ble-plx";
import { Button, PermissionsAndroid, Platform, View } from "react-native";
import GradientButton from "../base/gradientButton";
import { styleContainer } from "../../stylesContainer";
import { tw } from "react-native-tailwindcss";
import { RkText } from "react-native-ui-kitten";

const manager = new BleManager();
const transactionId ="oximeter";

export default function SpO2Screen() {
    const [deviceName, setDeviceName] = useState();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            ).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                    scanAndConnect()
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
    }, []);

    const scanAndConnect = () => {
        const subscription = manager.onStateChange((state) => {
            if (state === "PoweredOn") {
                setConnected(false);
                startScan();
                subscription.remove();
            }else{
                stopScan();
            }
        }, true);
    };

    function startScan() {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(device.name);
            if (device.name === "My Oximeter") {
                setDeviceName(device.name);
                manager.stopDeviceScan();
                device
                    .connect({ autoConnect: true })
                    .then((device) => {
                        setConnected(true);
                        console.log(device.manufacturerData);
                        return device.discoverAllServicesAndCharacteristics();
                    })
                    .then((device) => {
                        console.log(device.manufacturerData);
                        return device.services();
                    })
                    .then((services) => {
                        const result = services.filter((id) => console.log(id));
                        return result;
                    })
                    .catch((error) => {
                        device.cancelConnection();
                        console.log(error.message);
                    });
            }
        });
    }

    function stopScan() {
        manager.cancelTransaction(transactionId)
        setConnected(false)
    }

    return (
        <View>
            <GradientButton
                text={connected ? "Huỷ kết nối" : "Quét"}
                style={[styleContainer.buttonGradient, tw.m8]}
                onPress={connected ? stopScan : scanAndConnect}
            />
            {connected && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <RkText>
                        Kết nối thành công đến máy đo SpO2: {deviceName}
                    </RkText>
                </View>
            )}
        </View>
    );
}
