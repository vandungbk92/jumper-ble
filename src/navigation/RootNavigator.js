import React from "react";

import { tw } from "react-native-tailwindcss";

import { Animated, Platform, TouchableOpacity } from "react-native";

import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import NavDrawer from "./NavDrawer";
import {
    MAIN_NAVIGATOR,
    APP_NAVIGATOR,
    VERIFICATION_NAVIGATOR,
    LOGIN_PAGE,
    LOGIN_PHONE_PAGE,
    REGISTER_PAGE,
    HOME_PAGE,
    PROFILE_PAGE,
    FORGET_PASSWORD_PAGE,
    RESET_PASSWORD_PAGE,
    PHONE_VERIFICATION_PAGE,
    VERIFICATION_USER_PAGE,
    VERIFICATION_CODE_PAGE,
    IMAGE_BROWSER_PAGE,
    VIEW_IMAGE_PAGE,
    CANHAN_PAGE,
    CHANGE_PHONE_PAGE,
    CHANGE_PASSWORD_PAGE,
    THONGBAO_PAGE,
    THONGBAO_CANHAN,
    THONGBAO_CONGDONG,
    SPO2_PAGE,
    UPLOAD_PAGE,
    VIDEO_PAGE,
    AUDIO_PAGE,
    PULSEOXIMETER_PAGE,
    HISTORY_PAGE,
    SETTINGS_PAGE,
    EKO_PAGE,
    DETAIL_OXIMETER_PAGE,
    OMRON_PAGE,
} from "../constants/router";

import { getStoreInstance } from "../epics-reducers/store";

import LoginScreen from "../screens/Login";
import LoginPhoneScreen from "../screens/Login/Phone";

import RegisterScreen from "../screens/Login/Register";

import ForgotPasswordScreen from "../screens/Login/ForgotPassword";
import ResetPasswordScreen from "../screens/Login/ResetPassword";

import PhoneVerificationScreen from "../screens/Verification/Phone";
import VerificationCodeScreen from "../screens/Verification/Code";
import VerificationMaBenhNhanScreen from "../screens/Verification/MaBenhNhan";

import HomeScreen from "../screens/Home";
import UserProfileScreen from "../screens/UserProfile";

import ImageBrowserScreen from "../screens/ImageBrowser";
import ViewImageScreen from "../screens/base/viewImages";

import CanhanPage from "../screens/Canhan";
import ChangePhonePage from "../screens/Canhan/ChangePhone";
import ChangePasswordPage from "../screens/Canhan/ChangePassword";

import ThongbaoScreen from "../screens/Thongbao";
import ThongbaoCanhan from "../screens/Thongbao/Canhan";
import ThongbaoCongdong from "../screens/Thongbao/Congdong";
import UploadScreen from "../screens/Upload";
import VideoUpload from "../screens/Upload/components/VideoUpload";
import AudioUpload from "../screens/Upload/components/AudioUpload";
import { Ionicons } from "@expo/vector-icons";
import { styleContainer } from "../stylesContainer";
import { RkText } from "react-native-ui-kitten";
import { KittenTheme } from "../../config/theme";
import PulseOximeter from "../screens/PulseOximeter";
import HistoryScreen from "../screens/PulseOximeter/components/HistoryScreen";
import SettingsScreen from "../screens/Settings";
import EkoDevice from "../screens/Eko";
import DetailScreen from "../screens/PulseOximeter/components/DetailScreen";
import OmronScreen from "../screens/Omron";

const DrawerNavigator = createDrawerNavigator(
    {
        HOME: {
            screen: createStackNavigator(
                { HOME: HomeScreen },
                { defaultNavigationOptions: { headerTitleAlign: "center" } }
            ),
            navigationOptions: {
                title: "Trang chủ",
            },
        },
        THONGBAO_PAGE: {
            screen: createStackNavigator(
                { THONGBAO_PAGE: ThongbaoScreen },
                { defaultNavigationOptions: { headerTitleAlign: "center" } }
            ),
            navigationOptions: {
                title: "Thông báo",
            },
        },
    },
    {
        navigationOptions: {
            headerShown: false,
        },
        drawerType: "front",
        drawerPosition: "left",
        drawerBackgroundColor: "white",
        contentComponent: NavDrawer,
    }
);

const AppNavigator = createStackNavigator(
    {
        DrawerNavigator,

        [HOME_PAGE]: HomeScreen,
        [PROFILE_PAGE]: UserProfileScreen,

        [IMAGE_BROWSER_PAGE]: ImageBrowserScreen,
        [VIEW_IMAGE_PAGE]: ViewImageScreen,

        [CANHAN_PAGE]: CanhanPage,

        [CHANGE_PHONE_PAGE]: ChangePhonePage,
        [CHANGE_PASSWORD_PAGE]: ChangePasswordPage,

        [THONGBAO_PAGE]: ThongbaoScreen,
        [THONGBAO_CANHAN]: ThongbaoCanhan,
        [THONGBAO_CONGDONG]: ThongbaoCongdong,

        [UPLOAD_PAGE]: UploadScreen,
        [VIDEO_PAGE]: {
            screen: VideoUpload,
            navigationOptions: ({ navigation }) => {
                return {
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
                    headerTitle: () => <RkText rkType="header4">Video</RkText>,
                };
            },
        },
        [AUDIO_PAGE]: {
            screen: AudioUpload,
            navigationOptions: ({ navigation }) => {
                return {
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
                    headerTitle: () => <RkText rkType="header4">Audio</RkText>,
                };
            },
        },

        [PULSEOXIMETER_PAGE]: {
            screen: PulseOximeter,
        },
        [HISTORY_PAGE]: HistoryScreen,

        [SETTINGS_PAGE]: SettingsScreen,

        [EKO_PAGE]: EkoDevice,

        [DETAIL_OXIMETER_PAGE]: DetailScreen,

        [OMRON_PAGE]: OmronScreen,
    },
    {
        headerMode: "screen",
        defaultNavigationOptions: {
            headerTitleAlign: "center",
        },
    }
);

const VerificationNavigator = createStackNavigator(
    {
        [PHONE_VERIFICATION_PAGE]: PhoneVerificationScreen,
        [VERIFICATION_CODE_PAGE]: VerificationCodeScreen,
        [VERIFICATION_USER_PAGE]: VerificationMaBenhNhanScreen,
    },
    {
        navigationOptions: {
            cardStyle: [{ marginTop: "50%" }, tw.roundedTLg, tw.bgWhite],
            gestureEnabled: false,
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({
                current,
                inverted,
                layouts: { screen },
            }) => {
                const translateY = Animated.multiply(
                    current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [screen.height, 0],
                        extrapolate: "clamp",
                    }),
                    inverted
                );

                return {
                    cardStyle: {
                        transform: [{ translateY }],
                    },
                    overlayStyle: {
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                    },
                };
            },
        },
        defaultNavigationOptions: {
            headerStyle: Platform.select({
                android: {
                    elevation: 0,
                },
                ios: {
                    height: 44,
                    shadowOffset: {
                        height: 0,
                    },
                },
                default: {
                    borderBottomWidth: 0,
                },
            }),
            headerStatusBarHeight: 0,
        },
    }
);

const MainNavigator = createStackNavigator(
    {
        [APP_NAVIGATOR]: AppNavigator,

        [LOGIN_PAGE]: LoginScreen,
        [LOGIN_PHONE_PAGE]: LoginPhoneScreen,

        [REGISTER_PAGE]: RegisterScreen,

        [FORGET_PASSWORD_PAGE]: ForgotPasswordScreen,
        [RESET_PASSWORD_PAGE]: ResetPasswordScreen,
    },
    {
        defaultNavigationOptions: {
            headerShown: false,
            headerTitle: () => null,
        },
    }
);

const RootNavigator = createStackNavigator(
    {
        [MAIN_NAVIGATOR]: MainNavigator,
        [VERIFICATION_NAVIGATOR]: VerificationNavigator,
    },
    {
        mode: "modal",
        headerMode: "none",
    }
);

export default RootNavigator;
