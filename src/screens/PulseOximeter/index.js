import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet, Alert,
  Platform,
  PermissionsAndroid
} from "react-native";

import {Buffer} from "buffer";
import I18n from "../../utilities/I18n";
import {styleContainer} from "../../stylesContainer";
import {
  postFileData,
  postOximeterData,
} from "../../epics-reducers/services/oximeterServices";
import {Ionicons, AntDesign, FontAwesome5} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import {DETAIL_ANALYSIS_PAGE, HISTORY_ANALYSIS_PAGE, HISTORY_PAGE} from "../../constants/router";
import CircularProgress from "react-native-circular-progress-indicator";
import Slider from "react-native-slider";
import moment from "moment";
import GradientButton from "../base/gradientButton";
import {showToast} from "../../epics-reducers/services/common";
import {BleManager, BleErrorCode} from "react-native-ble-plx";
const manager = new BleManager();
const RNFS = require("react-native-fs");
import produce from 'immer';
import {tw} from 'react-native-tailwindcss';

const {width: screenWidth, height: screenHeight} = Dimensions.get("screen");

const filePath = RNFS.DocumentDirectoryPath + "/data.txt";

import BlueModal from './BlueModal';
import {COMMON_APP} from "../../constants";

export default function PulseOximeter(props) {
  const [device, setDevice] = useState(null); // Thông tin device đang kết nối

  // Loại ghi dữ liệu từ thiết bị 1. chỉ đọc dữ liệu. 2. đọc và ghi dữ liệu 3. đọc ghi và phân tích.
  const [typeRecord, setTypeRecord] = useState(1);

  const [showModal, setShowModal] = useState(false); // Modal quét thiết bị

  const [deviceScan, setDeviceScan] = useState([]); // danh sách các device quét được.

  const [deviceData, setDeviceData] = useState(null); // dữ liệu đọc từ thiết bị

  const [blueError, setBlueError] = useState(null); // lỗi khi kết nối thiết bị.

  useEffect(() => {

    /*if (Platform.OS === "android" && Platform.Version >= 23) {
      // Scanning: Checking permissions...
      const enabled = yield call(PermissionsAndroid.check, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!enabled) {
        // Scanning: Permissions disabled, showing...
        const granted = yield call(PermissionsAndroid.request, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Scanning: Permissions not granted, aborting...
          return;
        }
      }
    }*/

    requestLocationPermission()

    props.navigation.setParams({
      onBackAction: onBackAction
    });

    manager.onDeviceDisconnected(device?.id,  (err, device) => {
      console.log(device.id, 'onDeviceDisconnectedonDeviceDisconnected');
      resetBlue()
    });

  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      } else {
        alert("Vui lòng bật quyền truy cập vị trí");
        return false
      }
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  const onBackAction = async () => {
    await onDestroyBLE();
    props.navigation.goBack(null);
  };

  const connectDevice = (device) => {
    device.connect().then(async (device) => {
        setDevice(device);
        await readData(device);
      }).catch((error) => {return;});
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
              if (err) {
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
      time: moment(),
    };
    if (
      oxiData.oxigenSaturation !== 127 &&
      oxiData.pulseRate !== 255 &&
      oxiData.perfussionIndex !== 0
    ) {
      setDeviceData(data);
      if(typeRecord !== 1){
        await writeFile(oxiData);
      }
    }
  };

  const onDestroyBLE = async () => {
    try {
      await manager.stopDeviceScan();
      this?.manager?.destroy();
      resetBlue()
    } catch (err) {
      console.log("destroy error", err.message);
    }
  };

  const writeFile = async (data) => {
    try {
      let url = null;
      if(typeRecord === 2){
        url = filePath
      }else if(typeRecord === 3){
        let fileNm = '/' + data.time.format('YYYYMMDDHHmm') + '.txt';
        url = RNFS.DocumentDirectoryPath + fileNm;

      }

      // nếu là quét ghi dữ liệu thì đưa vào file filePath.
      // nếu là quét ghi phân tích thì đưa vào file filePaths - ghi dữ liệu theo giờ. tránh ghi quá nhiều dữ liệu.
      if(url){
        return RNFS.appendFile(
          url,
          JSON.stringify(data) + "\n",
          "utf8"
        )
          .then((success) => {
            if(typeRecord === 3 && data.time.format('ss') === "59"){
              let fileNm = data.time.format('YYYYMMDDHHmm') + '.txt';
              handleUplToServer(url, fileNm);
            }
            return true;
          })
          .catch((err) => {
            return false;
          });
      }
    } catch (e) {
      return false;
    }
  };

  const readFile = async () => {
    // lấy danh sách các file trong thư mục.
    let result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    result.forEach(curr => {
      if(curr.isFile() && (curr?.name?.split('.')?.pop() === 'jpeg' || curr?.name?.split('.')?.pop() === 'pdf')){
        console.log(curr, 'currcurrcurr')
        /*RNFS.readFile(curr.path, "utf8")
          .then((result) => {
            console.log(curr, curr.path);
          })
          .catch((err) => {
            console.log(err.message, err.code, 'err');
          });*/
      }
    })
  };

  const deleteFile = async (filePathDel) => {
    if (await RNFS.exists(filePathDel))
      RNFS.unlink(filePathDel)
        .then(() => {
          console.log("FILE DELETED");
        })
        .catch((err) => {
          console.log(err.message);
        });
  };

  const uploadToServer = async () => {
    // lấy danh sách các file trong thư mục.
    let result = await RNFS.readDir(RNFS.DocumentDirectoryPath);

    result.forEach(curr => {
      if(curr.isFile() && curr?.name?.split('.')?.pop() === 'txt'){
        handleUplToServer(curr.path, curr.name);
      }
    })
  };

  const handleUplToServer = async (fileUri, fileNm) => {
    let fileExist = await RNFS.exists(fileUri)
    if (fileExist && typeRecord !== 1) {
      const data = await postFileData(
        fileUri,
        fileNm,
        typeRecord
      );
      if(data && data.success){
        // sau khi upload file thành công
        // B1. xóa file
        await deleteFile(fileUri);
        // B2. download file oximeter_id
        let oximeter_id = data.oximeter_id;
        let path = RNFS.DocumentDirectoryPath + `/${oximeter_id}.pdf`;
        await RNFS.downloadFile({
          fromUrl: `${COMMON_APP.HOST_API}/api/pulse-oximeter/phantich/${oximeter_id}`,
          toFile: path,
          cacheable: false
        });
      }
    }
  };

  const showModalFunc = async (type) => {
    let permisson = await requestLocationPermission();
    if(!permisson){
      return null;
    }
    setShowModal(!showModal);
    setTypeRecord(type);
    try {
      manager.startDeviceScan(null, null,  (error, device) => {
        if (error) {
          console.log(JSON.stringify(error), 'error')
          if(error.errorCode === BleErrorCode.BluetoothPoweredOff){
            // showToast('Vui lòng bật Bluetooth trước khi kết nối thiết bị');
            setBlueError('Vui lòng bật Bluetooth trước khi kết nối thiết bị')
          }else
            setBlueError('Lỗi quét khi kết nối thiết bị, liên hệ quản trị viên')
          return;
        }

        if(device.name && device.id && device.name === 'My Oximeter'){
          console.log(device.name , device.id, 'device scan');
          setDeviceScan(produce(statePrev => {
            if (!statePrev.find(curr => curr.id === device.id)) {
              statePrev.push(device)
            }
          }))
        }
      });
    }catch (e) {

    }
  };

  const docdulieuFunc = () => {
    Alert.alert(
      'Quét dữ liệu',
      'Vui lòng chọn loại quét dữ liệu',
      [
        {
          text: "Chỉ đọc dữ liệu",
          onPress: () => showModalFunc(1),
          style: 'cancel',
        },
        {text: 'Đọc và ghi dữ liệu', onPress: () => showModalFunc(2)},
      ],
    );
  }

  const handleModalFunc = (data) => {
    setBlueError(null)
    manager.stopDeviceScan();
    if(data){
      connectDevice(data);
    }
  }

  const stopConnect = async () => {
    try {
      await resetBlue();
      if(device){
        let isConnected = await device.isConnected();
        console.log(isConnected, 'isConnectedisConnected')
        if(isConnected){
          await device.cancelConnection();
          // await manager.cancelDeviceConnection(device.id)
        }
        // await manager.cancelDeviceConnection(device.id);
      }

    } catch (err) {
      console.log("destroy error", err.message);
    }
  }

  const resetBlue = async () => {
    setTypeRecord(1);
    setDevice(null);
    setDeviceScan([]);
    setDeviceData(null);
    await uploadToServer();
  }

  return (
    <View style={tw.flex1}>
      <ImageBackground
        source={require("../../assets/bg.jpg")}
        style={{
          width: screenWidth,
          height: screenHeight * 0.25,
          flex: 1,
        }}
        resizeMode={"cover"}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: screenWidth * 0.1,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{color: "white"}}>Giấc ngủ</Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                props.navigation.navigate(HISTORY_ANALYSIS_PAGE)
              }
            >
              <Text style={{color: "white", fontSize: 18}}>
                {moment().format("dd DD MMMM YYYY")}
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
            alignSelf: "center",
            fontSize: 20,
            color: "#069A8E",
          }}
        >
          Chỉ số Oxi trong máu ổn định
        </Text>
        <Text style={{alignSelf: "center", color: "#069A8E"}}>
          Khoẻ mạnh
        </Text>
        <View
          style={{
            flex: 1,
            marginTop: 4,
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
                      flex: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                    }}
                  >
                    <Ionicons
                      name="leaf-outline"
                      size={24}
                      color="#7027A0"
                    />
                    <Text
                      style={{
                        marginHorizontal: 4,
                        color: "#7027A0",
                      }}
                    >
                      Nồng độ Oxi trong máu
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "flex-end",
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{alignSelf: "flex-end"}}>
                      {deviceData ? deviceData[2] : 0}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={
                    deviceData ? parseInt(deviceData[2]) : 0
                  }
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={100}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#7027A0",
                    },
                  ]}
                  minimumTrackTintColor="#7027A0"
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
                      flex: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                    }}
                  >
                    <FontAwesome5
                      name="heartbeat"
                      size={24}
                      color="#1DB9C3"
                    />
                    <Text
                      style={{
                        marginHorizontal: 4,
                        color: "#1DB9C3",
                      }}
                    >
                      Nhịp tim
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{alignSelf: "flex-end"}}>
                      {deviceData ? deviceData[1] : 0}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={
                    deviceData ? parseInt(deviceData[1]) : 0
                  }
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={150}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#1DB9C3",
                    },
                  ]}
                  minimumTrackTintColor="#1DB9C3"
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
                      flex: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                    }}
                  >
                    <Ionicons
                      name="leaf-outline"
                      size={24}
                      color="#FEB139"
                    />
                    <Text
                      style={{
                        marginHorizontal: 4,
                        color: "#FEB139",
                      }}
                    >
                      Chỉ số PI
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "flex-end",
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text style={{alignSelf: "flex-end"}}>
                      {deviceData
                        ? deviceData[3] / 10
                        : 0}
                    </Text>
                  </View>
                </View>
                <Slider
                  value={
                    deviceData
                      ? parseFloat(deviceData[3] / 10)
                      : 0
                  }
                  style={{height: 40}}
                  minimumValue={0}
                  maximumValue={20}
                  trackStyle={customStyles3.track}
                  thumbStyle={[
                    customStyles3.thumb,
                    {
                      backgroundColor: "#FEB139",
                    },
                  ]}
                  minimumTrackTintColor="#FEB139"
                  disabled={true}
                />
              </View>
            </View>
          </View>
        </View>

        <BlueModal deviceScan={deviceScan} showModal={showModal} handleModalFunc={handleModalFunc}
                   blueError={blueError}/>

        {/*<GradientButton
          style={{margin: 4}}
          text={"Đọc"}
          onPress={() => readFile()}
        />*/}
        {
          device ? <GradientButton
            style={{margin: 4}}
            text={typeRecord !== 1 ? "Dừng và lưu dữ liệu" : "Dừng đọc dữ liệu"}
            onPress={() => stopConnect()}
          /> : <View style={[tw.flexRow, tw.justifyCenter]}>
            <GradientButton
              style={{margin: 4}}
              text={"Đọc dữ liệu"}
              // onPress={docdulieuFunc}
              onPress={() => showModalFunc(2)}
            />
            <GradientButton
              style={{margin: 4}}
              text={"Theo dõi SPO2"}
              onPress={() => showModalFunc(3)}
            />
          </View>
        }
      </ScrollView>
    </View>
  );
}

const customStyles3 = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 5,
    backgroundColor: "#d0d0d0",
  },
  thumb: {
    width: 4,
    height: 20,
    borderRadius: 5,
  },
});

PulseOximeter.navigationOptions = ({navigation}) => ({
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
  headerTitle: () => <RkText rkType="header4">{I18n.t("Oximeter")}</RkText>,
});
