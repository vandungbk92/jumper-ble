import React, {Component} from "react";
import {View} from "react-native";
import MapView, {Marker, Callout, Polygon} from "react-native-maps";

import Constants from 'expo-constants';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'

import {Platform, StyleSheet, TouchableOpacity} from "react-native";
import {ASPECT_RATIO, DEVICE_HEIGHT, DEVICE_WIDTH} from "../../../constants/variable";
import {isEmpty, showToast} from "../../../epics-reducers/services/common";
import {CONSTANTS} from "../../../constants";
import {THANH_HOA_BOUNDS, polygon} from "../../../constants/polygon";

import {RkText, RkTextInput} from "react-native-ui-kitten";
import {KittenTheme} from "../../../../config/theme";
import I18n from "../../../utilities/I18n"
import {Ionicons} from "@expo/vector-icons";

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000
};

class MapNative extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      latLng: {
        latitude: null,
        longitude: null
      },
      address: "",
      editable: false,
      searchTimeout: null,
      listSuggestions: [],

      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05 * ASPECT_RATIO
      },
      use_maps: false,
      isChangeAddress: true,
      marginBottom: 1
    })
  }

  async componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      showToast('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
    } else {
      let {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
        this.getLocationAsync(false);
      } else {
        let {locationServicesEnabled} = await Location.getProviderStatusAsync()
        if (!locationServicesEnabled) {
          showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
          this.getLocationAsync(false);
        } else {
          this.getLocationAsync(true);
        }
      }
    }

    if(this.mapRef){
      this.mapRef.setMapBoundaries({latitude: THANH_HOA_BOUNDS.north, longitude: THANH_HOA_BOUNDS.east},{latitude: THANH_HOA_BOUNDS.south, longitude: THANH_HOA_BOUNDS.west})
    }
  }

  getAddress(lat, lng) {
    return fetch(`${'https://maps.googleapis.com/maps/api/geocode/json?latlng='}${lat}${','}${lng}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
      method: "GET",
    })
      .then(response => {
        return response.json()
      })
      .then(res => {
        let results = res.results
        let address = results[0].formatted_address;
        return address
      })
      .catch(err => {
        return null
      })
  }

  getCurrentPositionDevice(location, address, use_maps){
    let use_maps_init = (use_maps === false) ? false : true
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ASPECT_RATIO
    }
    if (this.props.getData) this.props.getData(address, location.latitude, location.longitude, use_maps_init)
    this.setState({
      latLng: {latitude: location.latitude, longitude: location.longitude},
      address: address,
      region,
      use_maps: use_maps_init
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    let {disableMap, address, showMap} = this.props
    if(showMap !== prevProps.showMap && !showMap){
      let {listSuggestions} = this.state
      if(listSuggestions && listSuggestions.length) this.setState({listSuggestions: []})
    }

    if(showMap !== prevProps.showMap && showMap && !this.state.use_maps){
      let {locationServicesEnabled} = await Location.getProviderStatusAsync()

      if (locationServicesEnabled) {
        try{
          let locationDevice = await Location.getCurrentPositionAsync({timeout: 5000});
          let location = {
            latitude: locationDevice.coords.latitude,
            longitude: locationDevice.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05 * ASPECT_RATIO
          }
          this.getLocation(location)
        }catch (e) {
          let location = {
            latitude: 19.807685,
            longitude: 105.776748,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05 * ASPECT_RATIO
          }
          this.getLocation(location)
        }
      }else{
        let location = {
          latitude: 19.807685,
          longitude: 105.776748,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05 * ASPECT_RATIO
        }
        this.getLocation(location)
      }
    }
  }

  getLocation(location){
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ASPECT_RATIO
    }

    this.setState({
      latLng: {latitude: location.latitude, longitude: location.longitude},
      region,
      use_maps: false
    });

  }

  async getLocationAsync(perLocation) {
    let {dataMap, initData, address, showMap} = this.props
    if(showMap){
      try {
        let location
        if(initData){
          location = Object.assign({}, dataMap)
        }
        else if (perLocation) {
          let locationDevice = await Location.getCurrentPositionAsync({timeout: 5000});
          location = {
            latitude: locationDevice.coords.latitude,
            longitude: locationDevice.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05 * ASPECT_RATIO
          }
          address = address ? address : await this.getAddress(location.latitude, location.longitude)
        } else {
          location = {
            latitude: 19.807685,
            longitude: 105.776748,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05 * ASPECT_RATIO
          }
          address = address ? address : await this.getAddress(location.latitude, location.longitude)
        }
        this.getCurrentPositionDevice(location, address)
      } catch (e) {
        let location = {
          latitude: 19.807685,
          longitude: 105.776748,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05 * ASPECT_RATIO
        }
        this.getCurrentPositionDevice(location)
      }
    }else{
      this.setState({address: address, use_maps: false})
    }

  }

  async handleMapRegionChangeComplete(location) {
    let {disableMap} = this.props
    if(disableMap) return
    if (!location.latitude || !location.longitude) return
    let latLng = {
      latitude: location.latitude,
      longitude: location.longitude
    }

    if(latLng.latitude !== this.state.latLng.latitude || latLng.longitude !== this.state.latLng.longitude){
      let address = this.state.use_maps ? await this.getAddress(latLng.latitude, latLng.longitude) : this.props.address
      let use_maps = this.state.use_maps
      this.setState({latLng: latLng, address: address, listSuggestions: [], region: location, use_maps:true}, () => {
        if (this.props.getData) this.props.getData(address, latLng.latitude, latLng.longitude, use_maps)
      })
    }
  }

  onChangeText(value) {
    if (this.state.searchTimeout) {
      clearTimeout(this.state.searchTimeout);
    }
    if (this.props.getData) this.props.getData(value, null, null, false)
    this.setState({
      address: value,
      use_maps: false,
      searchTimeout: setTimeout(() => {
        fetch(`${'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='}${value}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}&location=20.063665,105.407093&radius=120000&strictbounds`, {
          method: "GET",
        })
          .then(response => {
            return response.json()
          })
          .then(res => {
            this.setState({listSuggestions: res.predictions})
          }).catch(err => {
          this.setState({listSuggestions: []})
        })
      }, 1000)
    })
  }

  suggestionsClick(item) {
    fetch(`${'https://maps.googleapis.com/maps/api/place/details/json?placeid='}${item.place_id}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
      method: "GET",
    })
      .then(response => {
        return response.json()
      })
      .then(res => {
        let result = res.result
        let latLng = {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng
        }
        let region = {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05 * ASPECT_RATIO
        }
        this.setState({
            listSuggestions: [],
            address: item.description,
            latLng,
            region,
            use_maps: true
          },
          () => {

          }
        )
        if (this.props.getData) this.props.getData(this.state.address, result.geometry.location.lat, result.geometry.location.lng, true)

      }).catch(err => {
      console.log(err)
    })
  }

  _onMapReady(){
    this.setState({ marginBottom: 0 })
  }

  render() {
    let {width, height, pinColor, disableMap, showMap} = this.props
    return (
      <View style={styles.container}>
        {
          disableMap ? <View style={{ flex: 1 }}>
            <RkText rkType="" style={{ textAlign: 'left' }}>{this.state.address}</RkText>
          </View> :
            <RkTextInput value={this.state.address || ""}
                                      rkType="clear"
                                      style={{marginLeft: -15, marginVertical: 0}}
                                      onChangeText={this.onChangeText.bind(this)}
                                      multiline={true}
                                      inputStyle={{marginLeft: 15, paddingTop: 0, height: 60}}
                                      numberOfLines={2}/>
        }
        {this.state.listSuggestions.map((item, index) => {
          return <TouchableOpacity key={index} style={styles.listSuggestions}
                                   onPress={() => this.suggestionsClick(item)}><RkText>{item.description}</RkText></TouchableOpacity>
        })}
        {showMap
          &&
        <MapView
          ref={(ref)=> this.mapRef = ref}
          region={this.state.region}  // Các khu vực sẽ được hiển thị bởi bản đồ. Vùng được xác định bởi tọa độ trung tâm và khoảng tọa độ cần hiển thị.
          //onRegionChange={(e) => this.handleMapRegionChange(e)} // gọi khi khu vực thay đổi
          onRegionChangeComplete={(e) => this.handleMapRegionChangeComplete(e)} // gọi 1 lần khi hoàn thành thay đổi bản đồ.
          style={{width: width, height: height, flex: 1, marginBottom: this.state.marginBottom}}
          showsUserLocation={true} // vị trí người dùng
          followsUserLocation={true} // tập trung vị trí người dùng
          showsMyLocationButton={true} // hiển thị button vị trí của tôi
          provider={MapView.PROVIDER_GOOGLE}
          onMapReady={this._onMapReady.bind(this)}
          minZoomLevel={8}
          maxZoomLevel={20}
          // onPress={(e) => this.handleMapViewOnPress(e.nativeEvent)}
        >
          {this.state.latLng.latitude && this.state.latLng.longitude &&
          <Marker
            coordinate={this.state.latLng} // tọa độ điểm đánh dấu
            // image={CONSTANTS.PIN_RED}
            pinColor={pinColor}>
            <Callout
              tooltip={true}>
              {!isEmpty(this.state.address) &&
              <View style={styles.inforMarker}>
                <RkText
                  style={styles.calloutDescription}>{this.state.address ? this.state.address : 'N/A'}</RkText>
              </View>}
            </Callout>
          </Marker>
          }

          <Polygon
            coordinates={polygon}
            strokeColor="#0000FF"
            fillColor="rgba(0,0,0,0)"
            fillOpacity={0}
            strokeWidth={1}
          />

        </MapView>
        }

        {!disableMap && showMap &&
        <View style={[styles.contemplate, {top: this.props.height / 2 + 58, left: this.props.width / 2 - 9}]}>
          <Ionicons name="md-locate" size={20} color={KittenTheme.colors.appColor}/>
        </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  contemplate: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  calloutDescription: {
    textAlign: "center"
  },
  inforMarker: {
    backgroundColor: KittenTheme.colors.white,
    borderRadius: 1.7,
    borderStyle: "solid",
    borderColor: "#a2a2a2",
    width: DEVICE_WIDTH * 2 / 3
  },
  listSuggestions: {
    padding: 5,
    backgroundColor: KittenTheme.colors.white,
    borderBottomWidth: KittenTheme.border.borderWidth,
    borderBottomColor: KittenTheme.border.borderColor
  }
})
MapNative.defaultProps = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  pinColor: 'red',
  language: 'vi'
};
export default MapNative;
