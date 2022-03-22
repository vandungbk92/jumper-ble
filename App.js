import 'rxjs';
import React from 'react';
import { Platform, StyleSheet, View, BackHandler, Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import AppContainer from './src/navigation/AppContainer';
import { bootstrap } from './config/bootstrap';
import { extendFunction } from './config/extendFunction';
import rootReducer from './src/epics-reducers/rootReducer';
import rootEpic from './src/epics-reducers/rootEpic';
import { setStoreInstance } from './src/epics-reducers/store';
import { CONSTANTS } from './src/constants/constants';
import { fetchThongtinchungRequest } from './src/epics-reducers/fetch/fetch-thongtinchung.duck';
import Navigator from './src/utilities/Navigator';
import I18n, { I18nProvider } from './src/utilities/I18n';
import { registerPushNotifications } from './src/utilities/PushNotify';
import IsLoading from './src/screens/base/IsLoading/IsLoading';
import AppNotification from './src/screens/AppNotification';
import configureFirebase from './src/configureFirebase';
import {COMMON_APP} from "./src/constants";

const epicMiddleware = createEpicMiddleware(rootEpic);
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

bootstrap();
extendFunction(store);
setStoreInstance(store);

configureFirebase();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    };
  }

  async componentDidMount() {
    await registerPushNotifications();
    store.dispatch(fetchThongtinchungRequest());
    this.updatesSubscription = Updates.addListener(this._handleUpdatesChange);
  }

  _handleUpdatesChange = ({ type }) => {
    if (type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      Alert.alert(
        COMMON_APP.APP_NAME,
        'Bản cập nhật mới đã có sẵn, bạn có muốn khởi động lại ứng dụng không?',
        [
          { text: 'Tiếp tục' },
          { text: 'Khởi động lại', onPress: Updates.reloadAsync },
        ],
      );
    }
  };

  componentWillUnmount() {
    this.updatesSubscription?.remove();
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      I18n.init(),
      Asset.loadAsync([
        CONSTANTS.LOGO,
        CONSTANTS.LOGO_HOME,
        CONSTANTS.AVATAR_NAM,
        CONSTANTS.AVATAR_NAM,
      ]),
      Font.loadAsync({
        SVN_Raleway_Bold: require('./assets/fonts/Roboto-Bold.ttf'),
        SVN_Raleway_Light: require('./assets/fonts/Roboto-Light.ttf'),
        SVN_Raleway_Italic: require('./assets/fonts/Roboto-Italic.ttf'),
        SVN_Raleway_Regular: require('./assets/fonts/Roboto-Regular.ttf'),
        ...Icon.Ionicons.font,
        ...Icon.FontAwesome.font,
        ...Icon.FontAwesome5.font,
        ...Icon.MaterialCommunityIcons.font,
      }),
    ]);
  };

  _handleLoadingError = (error) => {
    console.log(error, 'errorerror')
    // showToast('Ứng dụng khởi động không thành công, vui lòng thử lại sau')
    // setTimeout(function () {
    //   BackHandler.exitApp()
    // }, 2000);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <I18nProvider i18n={I18n.getInstance()}>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppContainer ref={Navigator.setNavigatorRef} />
            <AppNotification />
            <IsLoading />
          </View>
        </I18nProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
