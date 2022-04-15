import {
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { styleContainer } from "../../../stylesContainer";
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import I18n from "../../../utilities/I18n";
import { useEffect, useState } from "react";
import { getOximeterData } from "../../../epics-reducers/services/oximeterServices";

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
        const newData = await getOximeterData(nextPage);
        if (newData.length > 0) {
            setData([...data, ...newData]);
            setPage(nextPage);
            setLoading(false);
        }
    };

    const renderItems = ({ item, index }) => {
        return (
            <View
                style={{
                    flex: 1,
                    margin: 4,
                    padding: 8,
                    backgroundColor: "white",
                    borderRadius: 8,
                }}
            >
                <RkText>Nhịp tim: {item.pulseRate}</RkText>
                <RkText>SpO2: {item.oxigenSaturation}</RkText>
                <RkText>Chỉ số PI: {item.perfussionIndex}</RkText>
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={data}
                renderItem={renderItems}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.1}
            />
        </>
    );
}

HistoryScreen.navigationOptions = ({ navigation }) => ({
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
    headerTitle: () => <RkText rkType="header4">{I18n.t("Lịch sử")}</RkText>,
});
