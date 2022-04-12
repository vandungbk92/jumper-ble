import React from 'react';

import JwtDecode from 'jwt-decode';
import {connect} from 'react-redux';

import {tw} from 'react-native-tailwindcss';

import {
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import {RkText} from 'react-native-ui-kitten';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {COMMON_APP, CONSTANTS} from '../../constants';
import {
    LOGIN_PAGE, PULSEOXIMETER_PAGE, UPLOAD_PAGE,
} from '../../constants/router';

import {isEmpty} from '../../epics-reducers/services/common';

import {fetchLoginFailure, fetchLoginSuccess} from '../../epics-reducers/fetch/fetch-login.duck';
import {fetchUsersInfoRequest, fetchUsersInfoFailure} from '../../epics-reducers/fetch/fetch-users-info.duck';

import {KittenTheme} from '../../../config/theme';
import {styleContainer} from '../../stylesContainer';

import ChatVoiBacSiIcon from '../../assets/icons/ChatVoiBacSi1.svg';
import DonThuocIcon from '../../assets/icons/DonThuoc1.svg';
import HoiBacSiIcon from '../../assets/icons/HoiBacSi1.svg';
import KetQuaCanLamSangIcon from '../../assets/icons/KetQuaCanLamSang1.svg';
import LichNhacIcon from '../../assets/icons/LichNhac1.svg';
import LichSuKhamIcon from '../../assets/icons/LichSuKham1.svg';

class HomePage extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: () => (
                <TouchableOpacity
                    style={styleContainer.headerButton}
                    onPress={() => navigation.toggleDrawer()}
                >
                    <Ionicons
                        name="ios-menu"
                        size={20}
                        color={KittenTheme.colors.appColor}
                    />
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <RkText rkType="header4">
                    {COMMON_APP.APP_NAME}
                </RkText>
            ),
            headerTitleContainerStyle: {
                marginHorizontal: 0
            },
        }
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            let userToken = await AsyncStorage.getItem(CONSTANTS._CITIZEN_LOGIN_);
            if (typeof userToken === 'string') userToken = JSON.parse(userToken);
            if (!isEmpty(userToken) && userToken.token !== CONSTANTS.ERROR_AUTHEN) {
                const decoded = JwtDecode(userToken.token);
                const current_time = new Date().getTime() / 1000;
                if (current_time < decoded.exp) {
                    this.props.dispatch(fetchLoginSuccess(userToken));
                } else {
                    this.props.dispatch(fetchLoginFailure({}));
                }
            } else {
                this.props.dispatch(fetchLoginFailure({}));
            }
        } catch (error) {
            this.props.dispatch(fetchLoginFailure({}));
        }
    }

    componentDidUpdate(prevProps) {
        const {loginRes} = this.props;
        if (loginRes !== prevProps.loginRes) {
            try {
                if (!isEmpty(loginRes) && loginRes.token !== CONSTANTS.ERROR_AUTHEN) {
                    const decoded = JwtDecode(loginRes.token);
                    this.props.dispatch(fetchUsersInfoRequest());
                } else {
                    this.props.dispatch(fetchUsersInfoFailure({}));
                }
            } catch (error) {
                this.props.dispatch(fetchUsersInfoFailure({}));
            }
        }
    }

    preventBeforeLogin = (routeName) => {
        console.log(routeName)
        if (this.props.userInfoRes?._id) {
            this.props.navigation.navigate(routeName);
        } else {
            this.props.navigation.navigate(LOGIN_PAGE);
        }
    };

    render() {
        return (
            <SafeAreaView style={styleContainer.containerContent}>
                <ScrollView contentContainerStyle={tw.p4}>
                    <View style={[tw.flexRow, tw.flexWrap, tw.mT4, tw._m1]}>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#ddaefe'}]}
                                onPress={() => this.preventBeforeLogin(UPLOAD_PAGE)}
                            >
                                <ChatVoiBacSiIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>
                                    Dữ liệu
                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#bfe6bb'}]}
                                onPress={() => this.preventBeforeLogin(PULSEOXIMETER_PAGE)}
                            >
                                <DonThuocIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>
                                    SpO2
                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#ece69e'}]}
                            >
                                <KetQuaCanLamSangIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#ffd556'}]}
                            >
                                <HoiBacSiIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#24bbc4'}]}
                            >
                                <LichNhacIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#fdd0c7'}]}
                            >
                                <LichSuKhamIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#ece69e'}]}
                            >
                                <KetQuaCanLamSangIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                        <View style={[tw.p1, tw.w1_3, {minHeight: 120}]}>
                            <TouchableOpacity
                                style={[tw.flex1, tw.rounded, {backgroundColor: '#fdd0c7'}]}
                            >
                                <LichSuKhamIcon style={tw.absolute}/>
                                <RkText style={[tw.p4, tw.textLg]}>

                                </RkText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    const {loginRes, userInfoRes} = state;
    return {loginRes, userInfoRes};
}

export default connect(mapStateToProps)(HomePage);
