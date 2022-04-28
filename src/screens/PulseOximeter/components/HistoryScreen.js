import {
    View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, ImageBackground
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {getHistory, getOximeterData} from "../../../epics-reducers/services/oximeterServices";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
import {DETAIL_OXIMETER_PAGE} from "../../../constants/router";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window")

export default function HistoryScreen(props) {
    const [data, setData] = useState([]);
    useEffect(async () => {
        await onLoadMore();
    }, []);

    const onLoadMore = async () => {
        const newData = await getOximeterData();
        if (newData) setData(newData.data)
    };

    const renderItems = ({item, index}) => {
        return (<TouchableOpacity
            style={{
                flex: 1, margin: 4, padding: 8, flexDirection: 'row'
            }}
            onPress={() => props.navigation.navigate(DETAIL_OXIMETER_PAGE, {
                date: item.date
            })}
        >
            <View
                style={{
                    alignSelf: "center", justifyContent: "center", alignItems: "center", flex: 1,
                }}
            >
                <CircularProgress
                    value={item.spo2}
                    progressValueColor={"#92BA92"}
                    maxValue={100}
                    valueSuffix={"%"}
                    inActiveStrokeColor={"#2ecc71"}
                    inActiveStrokeOpacity={0.2}
                    radius={screenWidth * 0.12}
                    circleBackgroundColor={"white"}
                />
            </View>
            <View style={{
                flex: 2, justifyContent: "center", marginHorizontal: 8
            }}>
                <RkText style={{color: 'white'}}>{moment(item.date).format('dd DD MMMM YYYY')}</RkText>

            </View>
        </TouchableOpacity>);
    };

    return (<ImageBackground source={require('../../../assets/his_bg.jpg')}
                             style={{width: screenWidth, height: screenHeight, opacity: 0.9}}>
        <FlatList
            data={data}
            renderItem={renderItems}
            keyExtractor={item => item._id}
        />
    </ImageBackground>);
}

HistoryScreen.navigationOptions = ({navigation}) => ({
    headerLeft: () => (<TouchableOpacity
        style={styleContainer.headerButton}
        onPress={() => navigation.goBack(null)}
    >
        <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.appColor}
        />
    </TouchableOpacity>), headerTitle: () => <RkText rkType="header4">{I18n.t("Lịch sử")}</RkText>,
});
