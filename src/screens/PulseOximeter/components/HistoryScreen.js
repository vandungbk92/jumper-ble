import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import {View, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import I18n from '../../../utilities/I18n';

import {DETAIL_OXIMETER_PAGE, DETAIL_VIEW_PAGE} from '../../../constants/router';

import { getOximeterData } from '../../../epics-reducers/services/oximeterServices';
import { KittenTheme } from '../../../../config/theme';
import { styleContainer } from '../../../stylesContainer';
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
const {width: screenWidth, height: screenHeight} = Dimensions.get("window");
const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class HistoryScreen extends React.Component {
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
      <RkText rkType="header4">
        Lịch sử SPO2
      </RkText>
    ),
    headerRight: () => (
      <TouchableOpacity
        style={styleContainer.headerButton}
        onPress={() => navigation.navigate('HOME_PAGE')}
      >
        <Ionicons
          name="ios-home"
          size={20}
          color={KittenTheme.colors.appColor}
        />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      loadStatus: LOAD_STATUS.NONE,
    };

    this.page = 1;
    this.flatList = React.createRef();
  }

  componentDidMount() {
    this.onGetFirstLoad();
  }

  getPage() {
    return this.page;
  }

  setPage(page) {
    this.page = page;
  }

  onLoadMore = () => {
    if (this.state.loadStatus === LOAD_STATUS.IDLE) {
      if (this.flatList.current?._listRef?._scrollMetrics?.offset > 1) {
        this.onGetLoadMore();
      }
    }
  };

  onGetLoadMore = async () => {
    this.setState({ loadStatus: LOAD_STATUS.LOAD_MORE });

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState((state) => ({
      docs: docs.length > 0 ? [...state.docs, ...docs] : state.docs,
      loadStatus: docs.length > 0 ? LOAD_STATUS.IDLE : LOAD_STATUS.ALL_LOADED,
    }));
  };

  onGetFirstLoad = async () => {
    this.setState({ loadStatus: LOAD_STATUS.FIRST_LOAD });
    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetPullRefresh = async () => {
    this.setState({ loadStatus: LOAD_STATUS.PULL_REFRESH });
    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetRecords = async () => {
    try {
      let data = this.props.navigation.state.params
      let query = ''
      if(data && data.measurementDate){
        query = `&measurementDate=${data.measurementDate}`
      }
      if(data && data.typeRecord){
        query = `&typeRecord=${data.typeRecord}`
      }
      const responseData = await getOximeterData(this.page, 10, query);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginHorizontal: 8,
          marginTop: 8,
          padding: 8,
          flexDirection: "row",
          backgroundColor: 'white'
        }}
        onPress={() =>
          this.props.navigation.navigate(DETAIL_VIEW_PAGE, {
            oximeter_id: item._id,
          })
        }
      >
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress
            value={item.avgSpO2}
            // progressValueColor={"#92BA92"}
            maxValue={100}
            valueSuffix={"%"}
            // inActiveStrokeColor={"#2ecc71"}
            inActiveStrokeOpacity={1}
            radius={screenWidth * 0.12}
            circleBackgroundColor={"white"}

            inActiveStrokeColor={"#bfbfbf"}
            progressValueColor={"#096dd9"}
            activeStrokeColor={'#ff4d4f'}
            activeStrokeSecondaryColor={'#1890ff'}
          />
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            marginHorizontal: 8,
          }}
        >
          <RkText>
            {moment(item.measurementDate).format("dd DD MMMM YYYY HH:mm")}
          </RkText>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state.loadStatus === LOAD_STATUS.FIRST_LOAD) {
      return this.renderFirstLoad();
    } else if (this.state.loadStatus === LOAD_STATUS.LOAD_MORE) {
      return this.renderLoadMore();
    } else if (this.state.loadStatus === LOAD_STATUS.ALL_LOADED) {
      return this.renderAllLoaded();
    }
    return null;
  };

  renderSeparator = () => {
    return <View style={[tw.mY2, tw.hPx, tw.bgGray400]} />;
  };

  renderEmpty = () => {
    if (this.state.loadStatus === LOAD_STATUS.IDLE) {
      return (
        <View style={[tw.itemsCenter, tw.justifyCenter]}>
          <RkText>{I18n.t('not_found')}</RkText>
        </View>
      );
    }
    return null;
  };

  renderFirstLoad = () => {
    return (
      <View style={[tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t('loading')}</RkText>
      </View>
    );
  };

  renderLoadMore = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText style={tw.mL1}>{I18n.t('load_more')}</RkText>
      </View>
    );
  };

  renderAllLoaded = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t('all_loaded')}</RkText>
      </View>
    );
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <FlatList
          ref={this.flatList}
          data={this.state.docs}
          extraData={this.state}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={0.1}
          contentContainerStyle={tw.p4}
          contentInsetAdjustmentBehavior="automatic"
        />
      </View>
    );
  }
}
