import React, {useEffect, useState, useRef} from "react";
import { Button, Text, View, Dimensions, Platform, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal";
import {tw} from 'react-native-tailwindcss';
import { FontAwesome } from '@expo/vector-icons';
import {RkText} from "react-native-ui-kitten";
import PulseLoader from '../base/PulseLoader/PulseLoader';
import PropTypes from "prop-types";
import LocationPulseLoader from "../base/PulseLoader/PulseLoader";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function BlueModal({deviceScan, showModal, handleModalFunc, blueError}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const isInitialMount = useRef(false);
  useEffect(() => {

    if (!isInitialMount.current) {
      isInitialMount.current = true;
    } else {
      setModalVisible(true);
    }

  }, [showModal]);

  useEffect(() => {
    console.log(deviceScan.length, 'deviceScan')
  }, [deviceScan]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    handleModalFunc()
  };

  const connectDevice = (data) => {
    setModalVisible(!isModalVisible);
    handleModalFunc(data)
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={isModalVisible}
             propagateSwipe={true}
             deviceWidth={deviceWidth}
             deviceHeight={deviceHeight}
      >
        <View style={[tw.bgWhite, {maxHeight: deviceHeight - 100}]}>
          <View style={[tw.bgGray300, tw.justifyCenter, tw.itemsCenter, tw.p2]}>
            <RkText rkType="link">TÌM THIẾT BỊ</RkText>
          </View>

          {
            !deviceScan.length && <View style={[tw.bgWhite, tw.justifyCenter, tw.itemsCenter, tw.pY6]}>
              {
                blueError ? <RkText rkType="link">{blueError}</RkText> : <View>
                  <ActivityIndicator size={60} color="green"></ActivityIndicator>
                  <View style={[tw.absolute,
                    tw.top0, tw.bottom0, tw.left0, tw.right0, tw.justifyCenter, tw.itemsCenter]}>
                    <FontAwesome name="bluetooth" size={30} color="green"/>
                  </View>

                </View>
              }
              <RkText rkType="link">Đang quét thiết bị ...</RkText>
            </View>
          }

          <ScrollView>
            {
              deviceScan.length ? <View>
                {
                  deviceScan.map((data, i) => {
                    return <View style={[tw.p4, tw.bgWhite]}>
                      <TouchableOpacity onPress={() => connectDevice(data)}>
                        <View style={[tw.bgWhite, tw.flexRow, tw.justifyBetween, tw.pY2]}>
                          <RkText>{data.name}</RkText>
                          <FontAwesome name="bluetooth" size={24} color="gray" />
                        </View>
                      </TouchableOpacity>
                      {
                        i !== (deviceScan.length - 1) && <View style={[tw.bgGray300, tw.hPx]}></View>
                      }
                    </View>
                  })
                }
              </View> : null
            }
          </ScrollView>


          <View style={[tw.bgGray200, tw.hPx]}></View>
          <TouchableOpacity onPress={toggleModal}>
            <View style={[tw.bgWhite, tw.justifyCenter, tw.itemsCenter, tw.p2]}>
              <RkText rkType="link">Hủy</RkText>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

BlueModal.defaultProps = {
  showModal: false
}

export default BlueModal;