import React from 'react';
import produce from 'immer';

import moment from 'moment';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import {View, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';

import I18n from '../../utilities/I18n';
import { TINTUC_DETAIL, HUONGDAN_DETAIL } from '../../constants/router';

import {getThongbaoChung} from '../../epics-reducers/services/thongbaoServices';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class ThongbaoCongdong extends React.Component {
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
        {I18n.t('Thông báo cộng đồng')}
      </RkText>
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

  setPage(page) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }

  onItemPress = async (item) => {
    if (item && item.link_push_id) {
      if(item.loaithongbao === 'TinTuc'){
        this.props.navigation.navigate(TINTUC_DETAIL, {
          data: { _id: item?.link_push_id._id }
        });
      }else if(item.loaithongbao === 'HuongDan'){
        this.props.navigation.navigate(HUONGDAN_DETAIL, {
          data: { _id: item?.link_push_id._id }
        });
      }

    }
  };

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
      const responseData = await getThongbaoChung(this.page, 15);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onItemPress(item)}>
      <View style={tw.flexRow}>
        <View style={[tw.w10, tw.h10, tw.bgBlue400, tw.roundedFull, tw.itemsCenter, tw.justifyCenter]}>
          <Ionicons name='notifications' size={24} color="white" />
        </View>
        <View style={tw.w2} />
        <View style={tw.flex1}>
          <View style={tw.flexRow}>
            <RkText rkType="header5" style={[tw.flex1, item.viewYn && tw.textGray500]} numberOfLines={2}>
              {item.loaithongbao === 'TinTuc' ? 'Tin Tức' : 'Hướng dẫn'}
            </RkText>
            <View style={[tw.flexRow, tw.itemsCenter]}>
              <RkText style={[tw.textSm, item.viewYn ? tw.textGray500 : tw.textBlue500]}>
                {moment(item.created_at).fromNow()}
              </RkText>
              {/*{!item.viewYn && <View style={[tw.w2, tw.h2, tw.mL2, tw.bgRed500, tw.roundedFull]}/>}*/}
            </View>
          </View>
          <View style={tw.h1} />
          <RkText style={[tw.textSm, item.viewYn && tw.textGray500]} numberOfLines={4}>
            {item.link_push_id.tieude}
          </RkText>
        </View>
      </View>
    </TouchableOpacity>
  );

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
    return <View style={[tw.mY3, tw.mL12, tw.hPx, tw.bgGray300]} />;
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
