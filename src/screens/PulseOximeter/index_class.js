import React from 'react';
import {connect} from 'react-redux';

import {tw} from 'react-native-tailwindcss';
import {Ionicons, FontAwesome5} from '@expo/vector-icons';

import {RkText, RkButton} from 'react-native-ui-kitten';

import {View, FlatList, SafeAreaView, TouchableOpacity, Text} from 'react-native';

import I18n from '../../utilities/I18n';


import {KittenTheme} from '../../../config/theme';
import {styleContainer} from '../../stylesContainer';
import {BleManager} from 'react-native-ble-plx';

class PulseOximeter extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: () => (
      <TouchableOpacity
        style={styleContainer.headerButton}
        onPress={() => navigation.goBack(null)}
      >
        <Ionicons
          name="ios-arrow-back"
          size={20}
          color={KittenTheme.colors.appColor}
        />
      </TouchableOpacity>
    ),
    headerTitle: () => (
      <RkText rkType="header4">
        {I18n.t('SPO2')}
      </RkText>
    ),
  });

  constructor(props) {
    super(props);
    this.manager = new BleManager();
  }

  componentDidMount() {

  }

  startScanDevice = () => {
    // console.log('startScanDevice')
    const subscription = this.manager.onStateChange((state) => {
      console.log(state, 'state')
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
  }

  startScanDevice = () => {

  }

  async componentWillUnmount() {
    console.log('componentWillUnmount');
    this?.manager?.destroy();
  }

  scanAndConnect() {
    // this.manager.cancelDeviceConnection("40:2E:71:47:0A:1F");
    // return;
    console.log('scanAndConnect');

    this.manager.startDeviceScan(null, {ScanMode: "Balanced"}, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log(JSON.stringify(error));
        // this.scanAndConnect()
        return
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device) {
        console.log(device.id,device.name, '2')
      }
      if (device.name === 'My Oximeter') {
        console.log(device.name, '1111')
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.manager.stopDeviceScan();

        // Proceed with connection.
        // this.connectDevice(device);
        this.manager.connectToDevice(device.id, {autoConnect: true}).then((device) => {
          (async () => {
            console.log("connected to ", device.name);
            //listener for disconnection
            device.onDisconnected((error, disconnectedDevice) => {
              console.log('Disconnected ', disconnectedDevice.name);
              // this.scanAndConnect();
            });

          })();
        })
      }
    });
  }

  connectDevice = (device) => {
    device
      .connect()
      .then(async (device) => {
        console.log('connectDeviceconnectDevice')
      })
      .catch((error) => {
        return;
      });
  };

  render() {
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <View style={[tw.flexRow, tw.justifyEvenly, tw.mT4]}>
          <RkButton rkType='primary' onPress={this.startScanDevice}>Quét thiết bị</RkButton>
          <RkButton rkType='primary' onPress={this.startScanDevice} >Hủy kết nối</RkButton>
        </View>
      </SafeAreaView>
    );
  }
}

export default PulseOximeter;
