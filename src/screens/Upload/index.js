import React from "react";
import {TouchableOpacity, View} from "react-native";
import {styleContainer} from "../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {RkText, RkTextInput} from "react-native-ui-kitten";
import * as ImagePicker from 'expo-image-picker';
import {CONSTANTS} from "../../constants";
import I18n from "../../utilities/I18n";
import {tw} from "react-native-tailwindcss";
import GradientButton from "../base/gradientButton";
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {convertImagesGallery, showToast} from "../../epics-reducers/services/common";
import {AUDIO_PAGE, IMAGE_BROWSER_PAGE, VIDEO_PAGE, VIEW_IMAGE_PAGE} from "../../constants/router";
import {Camera} from "expo-camera";
import {Gallery} from "../base/gallery";
import {connect} from "react-redux";
import {Audio} from "expo-av";
import {postImages} from "../../epics-reducers/services/fileServices";

class UploadScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
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
            headerTitle: () => <RkText rkType="header4">Dữ liệu</RkText>,
            headerTitleContainerStyle: {
                marginHorizontal: 0,
            },
            headerRight: () => {
                return(
                    <TouchableOpacity
                        style={styleContainer.headerButton}
                        onPress={navigation.getParam('onFormSubmit')}
                    >
                        <RkText rkType="link">Lưu</RkText>
                    </TouchableOpacity>
                )
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            mabn: "",
            images: [],
            imagesUpload: [],
            videos: null
        };
        this.actionSheet = React.createRef();
        props.navigation?.setParams({onFormSubmit: this.onFormSubmit});
    }

    showActionSheet = () => {
        this.actionSheet.current?.show();
    };

    onFormSubmit = async () => {
        if (this.state.imagesUpload.length && this.state.mabn) {
            const images = await postImages(this.state.imagesUpload, this.state.mabn);
            if(images) showToast('Tải ảnh thành công!');

            this.setState({
                images: [],
                imagesUpload: [],
                videos: null
            })
        }else{
            showToast('Vui lòng nhập đủ dữ liệu!');
        }


    };

    async pickImage() {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast(I18n.t('please_allow_the_application_to_access_memory'));
            return;
        }

        this.props.navigation.navigate(IMAGE_BROWSER_PAGE, {
            max: 5,
            total_exits: this.state.images ? this.state.images.length : 0,
            onGoBack: (callback) => this.imageBrowserCallback(callback),
        });
    }

    async pickCamera() {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            showToast(I18n.t('please_allow_the_application_to_access_camera'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({});
        if (!result.cancelled) {
            this.setState((state) => ({
                images: [...state.images, ...convertImagesGallery([result])],
                imagesUpload: [...state.imagesUpload, result],
            }));
        }
    }

    async pickVideo() {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            showToast(I18n.t('please_allow_the_application_to_access_camera'));
            return;
        }
        if (this.state.mabn) {
            this.props.navigation.navigate(VIDEO_PAGE, {mabn: this.state.mabn});
        } else {
            showToast("Chưa nhập mã bệnh nhân");
        }
    }

    async showRecordScreen() {
        const {status} = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            showToast(I18n.t('please_allow_the_application_to_access_camera'));
            return;
        }
        if (this.state.mabn) {
            this.props.navigation.navigate(AUDIO_PAGE, {status: status, mabn: this.state.mabn});
        } else {
            showToast("Chưa nhập mã bệnh nhân");
        }
    }

    onActionPress = (index) => {
        switch (index) {
            case 1:
                this.actionSheet.current?.hide();
                setTimeout(() => this.pickImage(), 10);
                break;

            case 2:
                this.actionSheet.current?.hide();
                setTimeout(() => this.pickCamera(), 10);
                break;

            case 3:
                this.props.navigation.navigate(VIEW_IMAGE_PAGE, {
                    images: this.state.images,
                });
                break;
            default:
                break;
        }
    };


    deleteImgFunc = async (uri) => {
        let {images, imagesUpload} = this.state;

        images = images.filter((data) => {
            return data.source.uri !== uri;
        });
        imagesUpload = imagesUpload.filter((data) => {
            return data.file !== uri;
        });

        this.setState({
            images: images,
            imagesUpload: imagesUpload,
        });
    };

    imageBrowserCallback(callback) {
        if (callback === CONSTANTS.REJECT) {
            return;
        }

        callback
            .then((photos) => {
                this.setState((state) => ({
                    images: [...state.images, ...convertImagesGallery(photos)],
                    imagesUpload: [...state.imagesUpload, ...photos],
                }));
            })
            .catch((e) => null);
    }

    render() {
        let {images} = this.state;
        let options = [
            <RkText>{I18n.t('reject')}</RkText>,
            <View style={[tw.flexRow, tw.itemsCenter]}>
                <Ionicons
                    name="ios-folder"
                    size={20}
                    color={KittenTheme.colors.appColor}
                />
                <View style={tw.w1}/>
                <RkText>{I18n.t('select_photos_from_the_device')}</RkText>
            </View>,
            <View style={[tw.flexRow, tw.itemsCenter]}>
                <Ionicons
                    name="ios-camera"
                    size={20}
                    color={KittenTheme.colors.appColor}
                />
                <View style={tw.w1}/>
                <RkText>{I18n.t('take_a_photo')}</RkText>
            </View>
        ];
        if (images && images.length > 0) {
            options.push(
                <View style={[tw.flexRow, tw.itemsCenter]}>
                    <Ionicons
                        name="ios-eye"
                        size={20}
                        color={KittenTheme.colors.appColor}
                    />
                    <View style={tw.w1}/>
                    <RkText>{I18n.t('view_photo')}</RkText>
                </View>,
            );
        }

        return (
            <>
                <View style={tw.p4}>
                    <RkTextInput
                        label={"Mã bệnh nhân"}
                        onChangeText={value => {
                            this.setState({mabn: value})
                        }}
                    />

                    <GradientButton text={I18n.t('Ảnh')}
                                    style={[tw.mT1, styleContainer.buttonGradient]}
                                    onPress={this.showActionSheet}/>
                    <GradientButton text={I18n.t('Video')}
                                    style={[tw.mT1, styleContainer.buttonGradient]}
                                    onPress={() => this.pickVideo()}/>
                    <GradientButton
                        text="Record"
                        style={[tw.mT1, styleContainer.buttonGradient]}
                        onPress={() => this.showRecordScreen()}
                    />
                    <Gallery
                        items={images}
                        deleteImg={true}
                        navigation={this.props.navigation}
                        deleteImgFunc={this.deleteImgFunc}
                    />
                </View>
                <ActionSheet
                    ref={this.actionSheet}
                    options={options}
                    onPress={this.onActionPress}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                />
            </>
        );
    }
}

function mapStateToProps(state) {
    const {userInfoRes} = state;
    return {userInfoRes};
}

export default connect(mapStateToProps)(UploadScreen);
