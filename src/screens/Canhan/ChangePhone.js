import React from "react";
import { connect } from "react-redux";

import * as Yup from "yup";
import "yup-phone";

import { tw } from "react-native-tailwindcss";
import { Ionicons } from "@expo/vector-icons";

import { NavigationEvents } from "react-navigation";

import { RkText } from "react-native-ui-kitten";
import { View, TouchableOpacity } from "react-native";

import I18n from "../../utilities/I18n";

import { CONSTANTS } from "../../constants";
import {
    CANHAN_PAGE,
    CHANGE_PHONE_PAGE,
    PHONE_VERIFICATION_PAGE,
} from "../../constants/router";

import FormGroup from "../base/formGroup";
import GradientButton from "../base/gradientButton";

import { KittenTheme } from "../../../config/theme";
import { styleContainer } from "../../stylesContainer";

import { userChangePhone } from "../../epics-reducers/services/userServices";
import { fetchUsersInfoSuccess } from "../../epics-reducers/fetch/fetch-users-info.duck";

import { checkValidate, showToast } from "../../epics-reducers/services/common";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class ChangePhonePage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
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
            <RkText rkType="header4">{I18n.t("Thay đổi điện thoại")}</RkText>
        ),
    });

    constructor(props) {
        super(props);
        const phone = props.navigation.getParam("phone", "");
        this.state = {
            phone: phone,
        };
    }

    navigationDidFocus = async () => {
        const { isVerified, userIdToken, verificationId } =
            this.props.navigation.state?.params || {};
        if (isVerified) {
            const data = await userChangePhone({
                token: userIdToken,
                verificationId: verificationId,
            });
            if (data) {
                showToast(I18n.t("Cập nhật số điện thoại thành công"));
                this.props.dispatch(fetchUsersInfoSuccess(data));
                this.props.navigation.navigate(CANHAN_PAGE);
            }
        }
    };

    navigationDidBlur = () => {
        this.props.navigation.setParams({ isVerified: false });
    };

    onFormSubmit = async () => {
        try {
            const phoneSchema = Yup.string()
                .label("Số điện thoại")
                .required("${path} không được để trống")
                .phone("VN", false, "${path} không đúng định dạng");
            const phone = await phoneSchema.validate(this.state.phone);

            this.props.navigation.navigate(PHONE_VERIFICATION_PAGE, {
                route: CHANGE_PHONE_PAGE,
                phone,
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                showToast(error.message);
            }
        }
    };

    render() {
        return (
            <View style={styleContainer.containerContent}>
                <NavigationEvents
                    onDidFocus={this.navigationDidFocus}
                    onDidBlur={this.navigationDidBlur}
                />
                <KeyboardAwareScrollView>
                    <View style={tw.p4}>
                        <FormGroup
                            id="phone"
                            type={CONSTANTS.TEXT}
                            value={this.state.phone}
                            editable={true}
                            required={true}
                            placeholder="Số điện thoại"
                            keyboardType="phone-pad"
                            onChangeText={(id, value) =>
                                this.setState({ [id]: value })
                            }
                        />
                        <GradientButton
                            text="Xác nhận"
                            style={styleContainer.buttonGradient}
                            onPress={this.onFormSubmit}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default connect()(ChangePhonePage);
