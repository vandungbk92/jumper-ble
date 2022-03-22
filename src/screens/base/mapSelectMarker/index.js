import React, { Component } from "react";
import { View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { ASPECT_RATIO, DEVICE_HEIGHT, DEVICE_WIDTH } from "../../../constants/variable";
import { isEmpty, showToast } from "../../../epics-reducers/services/common";
import { CONSTANTS } from "../../../constants";
import { RkText, RkTextInput } from "react-native-ui-kitten";
import { KittenTheme } from "../../../../config/theme";
import I18n from "../../../utilities/I18n"
import { Ionicons } from "@expo/vector-icons";

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000
};

class MapSelectMarker extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      latLng: {
        latitude: null,
        longitude: null
      },
      address: {
        address: '',
        ward: '',
        district: ''
      },
      editable: false,
      searchTimeout: null,
      listSuggestions: []
    })
    this.listSuggestions = []
    this.region = {
      latitude: 0,//37.78825,
      longitude: 0,//-122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    this.location = {
      coords: {
        latitude: 0,//19.807685,
        longitude: 0,//105.776748
      }
    }
    this.mapRegion = {
      latitude: 0,//19.807685,
      longitude: 0,//105.776748,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1 * ASPECT_RATIO
    }
    this.waitGetAddress = true
    this.permissionsLocation = false
    this.getLocationAsync = this.getLocationAsync.bind(this)
    this.handleMapRegionChange = this.handleMapRegionChange.bind(this)
    this.handleMapViewOnPress = this.handleMapViewOnPress.bind(this)
    this.getAddress = this.getAddress.bind(this)
  }

  async componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      showToast('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        this.permissionsLocation = false
        this.waitGetAddress = false
        this.mapRegion = {
          latitude: 19.807685,
          longitude: 105.776748,
          latitudeDelta: 15,
          longitudeDelta: 15 * ASPECT_RATIO
        }
        this.forceUpdate()
        showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
      } else {
        let { locationServicesEnabled } = await Location.getProviderStatusAsync()
        this.permissionsLocation = true
        this.waitGetAddress = false
        if (!locationServicesEnabled) {
          this.mapRegion = {
            latitude: 19.807685,
            longitude: 105.776748,
            latitudeDelta: 15,
            longitudeDelta: 15 * ASPECT_RATIO
          }
          this.forceUpdate()
          showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
          return
        }
        this.getLocationAsync();
      }
    }
  }

  componentDidMount() {

  }

  getAddress(lat, lng) {
    // `${'https://maps.googleapis.com/maps/api/geocode/json?latlng='}${lat}${','}${lng}${'&sensor=true'}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`
    return fetch(`${'https://maps.googleapis.com/maps/api/geocode/json?latlng='}${lat}${','}${lng}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
      method: "GET",
    })
      .then(response => {
        return response.json()
      })
      .then(res => {
        return this.convertAddress(res)
      })
      .catch(err => {
        return null
      })
  }
  convertAddress(res) {
    let results = res.results
    var address = results[0].formatted_address;
    let address_components = results[0].address_components
    let ward = this.getRegionAddress(address_components, 'administrative_area_level_3')
    let district = this.getRegionAddress(address_components, 'administrative_area_level_2')
    return {
      address: address,
      district: district,
      ward: ward
    }
  }
  getRegionAddress(address_components, type) {
    let result = ''
    address_components.map(item => {
      if (item.types.indexOf(type) !== -1) {
        result = item.short_name
      }
    })
    return result
  }

  async getLocationAsync() {
    try {
      Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.handleMapRegionChange);
      let location = await Location.getCurrentPositionAsync({});
      let address = await this.getAddress(location.coords.latitude, location.coords.longitude)
      this.waitGetAddress = false
      this.location = location
      this.mapRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1 * ASPECT_RATIO
      }
      if (this.props.getData) this.props.getData(address, location.coords.latitude, location.coords.longitude)
      this.setState({
        latLng: { latitude: location.coords.latitude, longitude: location.coords.longitude },
        address: address
      });
    } catch (e) {
      showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
    }
  }

  handleMapRegionChange(location) {
    if (location.coords) {
      this.location = location
      this.mapRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1 * ASPECT_RATIO
      }
    } else {
      this.mapRegion = location
    }
  };
  handleMapRegionChangeComplete(location) {
    let data = {
      coordinate: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }
    if (!location.latitude || !location.longitude) return
    clearTimeout(this.state.searchTimeout);
    this.state.searchTimeout = setTimeout(() => {
      this.handleMapViewOnPress(data)
    }, 1000);
  }
  async  handleMapViewOnPress(nativeEvent) {
    // return
    if (this.waitGetAddress) return
    this.waitGetAddress = true
    let latLng = { latitude: nativeEvent.coordinate.latitude, longitude: nativeEvent.coordinate.longitude }
    let address = await this.getAddress(latLng.latitude, latLng.longitude)
    this.waitGetAddress = false
    if (this.props.getData) this.props.getData(address, latLng.latitude, latLng.longitude)
    this.setState({ latLng: latLng, address: address, listSuggestions: [] })
  }
  focusText() {
    this.state.editable = true
    this.forceUpdate()
  }
  onChangeText(value) {
    /////https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Thanh%20h%C3%B3a&key=AIzaSyChN7EsiBMaf4xme4-LXzPasweMJEufAXs
    clearTimeout(this.state.searchTimeout);
    this.state.address.address = value
    if (this.props.getData) this.props.getData({ address: value }, null, null)
    //this.state[id] = value
    this.forceUpdate()
    this.state.searchTimeout = setTimeout(() => {
      // insertParam(CONSTANTS.KEY_SEARCH, this.filterSymbol(value), this.props.history)
      fetch(`${'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='}${value}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
        method: "GET",
      })
        .then(response => {
          return response.json()
        })
        .then(res => {
          this.state.listSuggestions = this.convertSuggestions(res.predictions)
          this.forceUpdate()
        }).catch(err => {
          this.state.listSuggestions = []
          this.forceUpdate()

        })
    }, 1000);
  }
  convertSuggestions(predictions) {
    return predictions
  }
  suggestionsClick(item) {
    //https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJdyJ-I_73NjEROiH8ezYyOKE&key=AIzaSyChN7EsiBMaf4xme4-LXzPasweMJEufAXs
    this.state.listSuggestions = []
    this.state.address.address = item.description
    this.forceUpdate()
    //'https://maps.googleapis.com/maps/api/place/details/json?placeid='}${item.place_id}${'&key='}${CONSTANTS.GOOGLE_API_KEY
    fetch(`${'https://maps.googleapis.com/maps/api/place/details/json?placeid='}${item.place_id}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
      method: "GET",
    })
      .then(response => {
        return response.json()
      })
      .then(res => {
        let result = res.result
        let address_components = result.address_components
        this.state.address.ward = this.getRegionAddress(address_components, 'administrative_area_level_3')
        this.state.address.district = this.getRegionAddress(address_components, 'administrative_area_level_2')
        this.state.latLng.latitude = result.geometry.location.lat
        this.state.latLng.longitude = result.geometry.location.lng

        this.location = result.geometry.location
        this.mapRegion = {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1 * ASPECT_RATIO
        }
        if (this.props.getData) this.props.getData(this.state.address, result.geometry.location.lat, result.geometry.location.lng)
        this.forceUpdate()
      }).catch(err => {
        this.state.listSuggestions = []
      })
  }
  render() {
    let { width, height, pinColor } = this.props
    return (
      <View style={styles.container}>
        <RkTextInput value={this.state.address.address || ""}
          rkType="clear"
          style={{ marginLeft: -15, marginVertical: 0 }}
          onChangeText={this.onChangeText.bind(this)}
          multiline={true}
          numberOfLines={2} />
        {this.state.listSuggestions.map((item, index) => {
          return <TouchableOpacity key={index} style={styles.listSuggestions} onPress={() => this.suggestionsClick(item)}><RkText >{item.description}</RkText></TouchableOpacity>
        })}
        <MapView
          region={this.mapRegion}
          onRegionChange={(e) => this.handleMapRegionChange(e)}
          onRegionChangeComplete={(e) => this.handleMapRegionChangeComplete(e)}
          style={{ width: width, height: height }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          provider={MapView.PROVIDER_GOOGLE}
        // onPress={(e) => this.handleMapViewOnPress(e.nativeEvent)}
        >
          {this.state.latLng.latitude && this.state.latLng.longitude &&
            <Marker
              coordinate={{
                latitude: this.state.latLng.latitude,
                longitude: this.state.latLng.longitude,
              }}
              // image={CONSTANTS.PIN_RED}
              pinColor={pinColor}>
              <Callout
                tooltip={true}>
                {!isEmpty(this.state.address) &&
                  <View style={styles.inforMarker}>
                    <RkText
                      style={styles.calloutDescription}>{this.state.address.address ? this.state.address.address : 'N/A'}</RkText>
                  </View>}
              </Callout>
            </Marker>}
        </MapView>
        <View style={[styles.contemplate, { top: this.props.height / 2 + 37, left: this.props.width / 2 - 9 }]}>
          <Ionicons name="md-locate" size={20} color={KittenTheme.colors.appColor} />
        </View>
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
MapSelectMarker.defaultProps = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  pinColor: 'red',
  language: 'vi'
};
export default MapSelectMarker;
