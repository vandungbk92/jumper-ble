import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {BleManager} from "react-native-ble-plx";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import * as Location from "expo-location";

import { Buffer } from "buffer";

const manager = new BleManager();

export default function EkoDevice(props) {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState(null);
  const [deviceData, setDeviceData] = useState();
  const [deviceId, setDeviceId] = useState("88:6B:0F:77:0A:11");

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
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      scanAndConnect();
    }
  };

  const scanAndConnect = () => {
    if (device || deviceData) {
      return;
    }

    setStatus("Đang quét...");
    setDeviceData(null);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(JSON.stringify(error), 'errorerrorerror')
        setDeviceData(null);
        return;
      }
      // console.log(device.id)
      if (device.id === deviceId) {
        manager.stopDeviceScan();
        manager.onDeviceDisconnected(deviceId, async (err, device) => {
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
        setStatus(`Đã kết nối tới thiết bị: ${device.name}`);
        setDeviceId(device.id);
        setDevice(device);
        await readData(device);
      })
      .catch((error) => {
        console.log(error.message, 'message');
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
          // console.log(x.isNotifiable);
          if (x.isNotifiable) {
            x.monitor(async (err, listener) => {
              if (err) {
                console.log(err.message);
              }
              if (listener) {
                if (listener.hasOwnProperty("value")) {
                  const hexString = Buffer.from(
                    listener.value,
                    "base64"
                  ).toString("hex");
                  const data = convertHexToDecimal(hexString);
                  console.log(data);
                  // process(data)
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

  };

  const onDestroyBLE = async () => {
    try {
      await manager.cancelDeviceConnection(deviceId).then((res) => {
        console.log("Manager cancel connection");
      });
      setStatus(null);
      setDevice(null);
      setDeviceData(null);
      await manager.stopDeviceScan();
    } catch (err) {
      console.log("err ", err.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          padding: 24,
        }}
      >
        <Text style={{marginVertical: 4, alignSelf: "center"}}>
          {status}
        </Text>
      </View>
    </View>
  );
}

EkoDevice.navigationOptions = ({navigation}) => ({
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
  headerTitle: () => <RkText rkType="header4">{I18n.t("Eko")}</RkText>,
  headerRight: () => (
    <TouchableOpacity
      style={styleContainer.headerButton}
      onPress={navigation.getParam("checkPermissions")}
    >
      <RkText rkType={"link"}>{I18n.t("Quét")}</RkText>
    </TouchableOpacity>
  ),
});
