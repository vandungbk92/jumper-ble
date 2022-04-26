import {
    View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, ImageBackground
} from "react-native";
import {styleContainer} from "../../../stylesContainer";
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../../config/theme";
import {RkText} from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import React, {useEffect, useState} from "react";
import {getOximeterData} from "../../../epics-reducers/services/oximeterServices";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";

const {width: screenWidth, height: screenHeight} = Dimensions.get("window")

export default function HistoryScreen(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(async () => {
        await onLoadMore(page);
    }, []);

    const onLoadMore = async () => {
        setLoading(true);
        let nextPage = page + 1;
        const newData = await getOximeterData(1);
        if (newData.length > 0) {
            setData([...data, ...newData]);
            setPage(nextPage);
            setLoading(false);
        }
    };

    const renderItems = ({item, index}) => {
        return (<View
            style={{
                flex: 1, margin: 4, padding: 8, flexDirection: 'row'
            }}
        >
            <View
                style={{
                    alignSelf: "center", justifyContent: "center", alignItems: "center", flex: 1,
                }}
            >
                <CircularProgress
                    value={item.oxigenSaturation}
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
                <RkText style={{color: 'white'}}>Nhịp tim: {item.pulseRate}</RkText>
                <RkText style={{color: 'white'}}>Chỉ số PI: {item.perfussionIndex}</RkText>
                <RkText style={{color: 'white'}}>Ngày: {moment(item.created_at).format("dd DD MMMM YYYY")}</RkText>

            </View>
        </View>);
    };

    return (<ImageBackground source={require('../../../assets/his_bg.jpg')}
                             style={{width: screenWidth, height: screenHeight, opacity: 0.9}}>
        <FlatList
            data={data}
            renderItem={renderItems}
            // onEndReached={onLoadMore}
            // onEndReachedThreshold={0.1}
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
