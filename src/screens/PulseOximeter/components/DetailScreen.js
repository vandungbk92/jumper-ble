import {
    View,
    TouchableOpacity,
    Dimensions,
    Text,
    ScrollView,
} from "react-native";
import { styleContainer } from "../../../stylesContainer";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, { useEffect, useState } from "react";
import { getHistory } from "../../../epics-reducers/services/oximeterServices";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DetailScreen(props) {
    const [data, setData] = useState();
    useEffect(async () => {
        await onLoadMore();
    }, []);

    const onLoadMore = async () => {
        const { date } = props.navigation.state.params;
        const data = await getHistory(date.substring(0, 10));
        if (data) {
            setData(data);
        }
    };

    function convertData(array) {
        const { data } = array;
        let pulse = data.map((item) => parseInt(item.pulseRate));
        let spo2 = data.map((item) => parseInt(item.oxigenSaturation));
        return {
            pulse: pulse,
            spo2: spo2,
        };
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                {data &&
                    data.map((item, index) => {
                        const { spo2_data, history_data } = item;
                        const objectData = convertData(spo2_data);
                        let maxPulse =
                            parseInt(Math.max(...objectData.pulse)) + 30;
                        let minPulse =
                            parseInt(Math.min(...objectData.pulse)) - 30;
                        return (
                            <View
                                key={index}
                                style={{
                                    flex: 1,
                                    marginTop: 4,
                                    backgroundColor: "white",
                                }}
                            >
                                <RkText
                                    style={{ alignSelf: "center", margin: 4 }}
                                >
                                    Biểu đồ nhịp tim
                                </RkText>
                                <ScrollView horizontal={true}>
                                    <LineChart
                                        data={{
                                            datasets: [
                                                {
                                                    data: objectData.pulse,
                                                },
                                                {
                                                    data: [
                                                        minPulse > 0
                                                            ? minPulse
                                                            : 0,
                                                        maxPulse,
                                                    ],
                                                    color: () => "transparent",
                                                    strokeWidth: 0,
                                                    withDots: false,
                                                },
                                            ],
                                        }}
                                        width={
                                            objectData.pulse.length >
                                            screenWidth
                                                ? objectData.pulse.length
                                                : screenWidth
                                        }
                                        height={screenHeight / 3}
                                        withHorizontalLabels={true}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            fillShadowGradientFrom: "#fff",
                                            fillShadowGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 1) =>
                                                `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: () => `rgba(0,0,0,1)`,
                                            useShadowColorFromDataset: false,
                                            strokeWidth: 2,
                                            decimalPlaces: 0,
                                        }}
                                        withDots={false}
                                        withVerticalLines={false}
                                        style={{
                                            paddingRight: 40,
                                        }}
                                    />
                                </ScrollView>
                                <RkText
                                    style={{ alignSelf: "center", margin: 4 }}
                                >
                                    Biểu đồ SpO2
                                </RkText>
                                <ScrollView horizontal={true}>
                                    <LineChart
                                        data={{
                                            datasets: [
                                                {
                                                    data: objectData.spo2,
                                                },
                                                {
                                                    data: [0, 100],
                                                    color: () => "transparent",
                                                    strokeWidth: 0,
                                                    withDots: false,
                                                },
                                            ],
                                        }}
                                        width={
                                            objectData.spo2.length > screenWidth
                                                ? objectData.spo2.length
                                                : screenWidth
                                        }
                                        height={screenHeight / 3}
                                        withHorizontalLabels={true}
                                        chartConfig={{
                                            backgroundColor: "#fff",
                                            backgroundGradientFrom: "#fff",
                                            backgroundGradientTo: "#fff",
                                            fillShadowGradientFrom: "#fff",
                                            fillShadowGradientTo: "#fff",
                                            decimalPlaces: 2,
                                            color: (opacity = 1) =>
                                                `rgba(0, 0, 0, ${opacity})`,
                                            labelColor: () => `rgba(0,0,0,1)`,
                                            useShadowColorFromDataset: false,
                                            strokeWidth: 2,
                                            decimalPlaces: 0,
                                        }}
                                        withDots={false}
                                        withVerticalLines={false}
                                        style={{
                                            paddingRight: 40,
                                        }}
                                    />
                                </ScrollView>
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{
                                            paddingHorizontal: 16,
                                        }}
                                    >
                                        <RkText
                                            style={{
                                                marginVertical: 4,
                                            }}
                                        >
                                            Thời gian đo:{" "}
                                            {moment(
                                                history_data.created_at
                                            ).format("HH:mm:ss DD-MM-YYYY")}
                                        </RkText>
                                        <RkText
                                            style={{
                                                marginVertical: 4,
                                            }}
                                        >
                                            Giá trị SpO2 trung bình:{" "}
                                            {history_data.avgSpO2}
                                        </RkText>
                                    </View>
                                    <View>
                                        <View
                                            style={{
                                                paddingHorizontal: 16,
                                                marginVertical: 4,
                                            }}
                                        >
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
                                                    }}
                                                >
                                                    {data && (
                                                        <Text
                                                            style={{
                                                                alignSelf:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            {
                                                                history_data.minPulseRate
                                                            }{" "}
                                                            /{" "}
                                                            {
                                                                history_data.maxPulseRate
                                                            }
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            style={{
                                                paddingHorizontal: 16,
                                                marginVertical: 4,
                                            }}
                                        >
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
                                                    }}
                                                >
                                                    {data && (
                                                        <Text
                                                            style={{
                                                                alignSelf:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            {history_data.minPI}{" "}
                                                            /{" "}
                                                            {history_data.maxPI}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <View
                                            style={{
                                                paddingHorizontal: 16,
                                                marginVertical: 4,
                                            }}
                                        >
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
                                                        Tổng thời gian dưới
                                                        ngưỡng
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        alignSelf: "flex-end",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            alignSelf:
                                                                "flex-end",
                                                        }}
                                                    >
                                                        {parseInt(
                                                            history_data.totalTime /
                                                                1000
                                                        )}{" "}
                                                        (giây)
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}

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
