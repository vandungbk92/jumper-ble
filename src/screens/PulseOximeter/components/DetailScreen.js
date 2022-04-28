import {
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    ScrollView,
} from "react-native";
import { styleContainer } from "../../../stylesContainer";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, { useEffect, useState } from "react";
import {
    getHistory,
    getOximeterData,
} from "../../../epics-reducers/services/oximeterServices";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
import Slider from "react-native-slider";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DetailScreen(props) {
    const [data, setData] = useState();
    useEffect(async () => {
        await onLoadMore();
    }, []);

    const onLoadMore = async () => {
        const { date } = props.navigation.state.params;
        const data = await getHistory(date.substring(0, 10));
        if (data) setData(data);
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../../assets/bg.jpg")}
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
                        <Text style={{ color: "white" }}>Giấc ngủ</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 18 }}>
                                {moment(
                                    props.navigation.state.params.date
                                ).format("dd DD MMMM YYYY")}
                            </Text>
                            <AntDesign
                                name="caretdown"
                                size={14}
                                color="white"
                                style={{ marginHorizontal: 8 }}
                            />
                        </View>
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
                            value={data ? data.averageSpO2 : 0}
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
            <ScrollView style={{ flex: 1 }}>
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 20,
                        color: "#069A8E",
                    }}
                >
                    Chỉ số Oxi trong máu ổn định
                </Text>
                <Text style={{ alignSelf: "center", color: "#069A8E" }}>
                    Khoẻ mạnh
                </Text>
                <View
                    style={{
                        flex: 1,
                        marginTop: 4,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View>
                            <View style={{ paddingHorizontal: 16 }}>
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
                                            paddingHorizontal: 8,
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
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        {data && (
                                            <Text
                                                style={{
                                                    alignSelf: "flex-end",
                                                }}
                                            >
                                                {data.minPulseRate} /{" "}
                                                {data.maxPulseRate}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <Slider
                                    value={data ? data.averagePulseRate : 0}
                                    style={{ height: 40 }}
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
                            <View style={{ paddingHorizontal: 16 }}>
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
                                            paddingHorizontal: 8,
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
                                            Chỉ số tưới máu
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignSelf: "flex-end",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        {data && (
                                            <Text
                                                style={{
                                                    alignSelf: "flex-end",
                                                }}
                                            >
                                                {data.minPI} / {data.minPI}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <Slider
                                    value={data ? data.averagePI : 0}
                                    style={{ height: 40 }}
                                    minimumValue={0}
                                    maximumValue={20}
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
                            <View style={{ paddingHorizontal: 16 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 3,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <Ionicons
                                            name="timer-outline"
                                            size={24}
                                            color="#FEB139"
                                        />
                                        <Text
                                            style={{
                                                marginHorizontal: 4,
                                                color: "#FEB139",
                                            }}
                                        >
                                            Tổng thời gian dưới ngưỡng
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignSelf: "flex-end",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        {data && (
                                            <Text
                                                style={{
                                                    alignSelf: "flex-end",
                                                }}
                                            >
                                                {parseInt(
                                                    data.totalTime / 1000
                                                )}{" "}
                                                (giây)
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            alignSelf: "flex-end",
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        {data !== undefined ? (
                                            data.eachTime.map((item, index) => {
                                                return (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                                marginVertical: 4
                                                        }}
                                                    >
                                                        <View
                                                            style={{ flex: 3 }}
                                                        >
                                                            <RkText>
                                                                Lần {index + 1}:
                                                            </RkText>
                                                        </View>
                                                        <View
                                                            style={{
                                                                alignSelf:
                                                                    "flex-end",
                                                                flex: 2,
                                                            }}
                                                        >
                                                            <RkText
                                                                style={{
                                                                    alignSelf:
                                                                        "flex-end",
                                                                }}
                                                            >
                                                                {parseFloat(
                                                                    item.time /
                                                                        1000
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                (giây)
                                                            </RkText>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        ) : (
                                            <View />
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
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

DetailScreen.navigationOptions = ({ navigation }) => ({
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
    headerTitle: () => <RkText rkType="header4">{I18n.t("Chi tiết")}</RkText>,
});
