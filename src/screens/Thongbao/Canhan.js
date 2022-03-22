import React from 'react';
import produce from 'immer';

import moment from 'moment';

import { tw, color } from 'react-native-tailwindcss';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, Alert, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native';

import { SwipeRow } from 'react-native-swipe-list-view';

import I18n from '../../utilities/I18n';
import {LICHSU_DICHVU_DETAIL, LICHSUKHAM_DETAIL} from '../../constants/router';

import {
  getThongbao,
  updateThongbao,
  deleteThongbao,
  readAllThongbao,
  removeAllThongbao,
} from '../../epics-reducers/services/thongbaoServices';

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

export default class ThongbaoCanhan extends React.Component {
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
        {I18n.t('Thông báo')}
      </RkText>
    ),
    headerRight: () => (
      <View style={[tw.flexRow]}>
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={navigation.getParam('onRemoveAllPress')}
        >
          <MaterialCommunityIcons
            name="delete-sweep-outline"
            size={20}
            color={KittenTheme.colors.danger}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={navigation.getParam('onReadAllPress')}
        >
          <MaterialCommunityIcons
            name="check-all"
            size={20}
            color={KittenTheme.colors.appColor}
          />
        </TouchableOpacity>
      </View>
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
    this.swipeRows = {};

    props.navigation.setParams({
      onReadAllPress: this.onReadAllPress,
      onRemoveAllPress: this.onRemoveAllPress,
    });
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

  setFlatlistEnabled = enable => {
    this.flatList.current?.setNativeProps?.({ scrollEnabled: enable });
  };

  onItemPress = async (item) => {
    if (!item.viewYn) {
      const data = await updateThongbao(item._id, { viewYn: true });
      if (data && data._id) {
        this.setState(produce(draft => {
          const foundIndex = draft.docs.findIndex(item => item?._id === data._id);
          if (foundIndex !== -1) {
            draft.docs[foundIndex].viewYn = true;
          }
        }));
      }
    }
    console.log(item, 'itemitemitem')
    if(item.loaithongbao === 'GOIDICHVU'){
      this.props.navigation.navigate(LICHSU_DICHVU_DETAIL, { _id: item.push_link_id, reload: true });
    }else{
      this.props.navigation.navigate(LICHSUKHAM_DETAIL, {
        dangky: { _id: item.push_link_id, tab_id: item.tab_id }
      });
    }
  };

  onReadPress = async (item) => {
    const data = await updateThongbao(item._id, { viewYn: !item.viewYn });
    if (data && data._id) {
      this.setState(produce(draft => {
        const foundIndex = draft.docs.findIndex(item => item?._id === data._id);
        if (foundIndex !== -1) {
          draft.docs[foundIndex].viewYn = data.viewYn;
        }
      }));
    }
  };

  onRemovePress = async (item) => {
    const data = await deleteThongbao(item._id);
    if (data && data._id) {
      this.setState(produce(draft => {
        const foundIndex = draft.docs.findIndex(item => item?._id === data._id);
        if (foundIndex !== -1) {
          draft.docs.splice(foundIndex, 1);
        }
      }));
    }
  };

  onReadAllPress = () => {
    Alert.alert(
      'Đánh dấu đọc tất cả',
      'Xác nhận đánh dấu đã đọc tất cả thông báo',
      [
        { text: 'Hủy bỏ' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            const data = await readAllThongbao();
            if (data && data.success) {
              this.setState(produce(draft => {
                for (const item of draft.docs) {
                  item.viewYn = true;
                }
              }));
            }
          },
        },
      ]
    );
  };

  onRemoveAllPress = () => {
    Alert.alert(
      'Xóa tất cả',
      'Xác nhận xóa tất cả thông báo',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            const data = await removeAllThongbao();
            if (data && data.success) {
              this.setState({ docs: []});
            }
          },
        },
      ]
    );
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
      const responseData = await getThongbao(this.page, 15);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => (
    <SwipeRow
      ref={ref => (this.swipeRows[item._id] = ref)}
      rightOpenValue={-160}
      stopRightSwipe={-160}
      setScrollEnabled={this.setFlatlistEnabled}
    >
      <View style={[tw.flex1, tw.flexRow, tw.justifyEnd]}>
        <TouchableOpacity
          style={[tw.w20, tw.bgGray400, tw.itemsCenter, tw.justifyCenter]}
          onPress={() => {
            this.onReadPress(item);
            this.swipeRows[item._id]?.closeRow?.();
          }}
        >
          <RkText style={[tw.textCenter]}>
            {item.viewYn ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
          </RkText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw.w20, tw.bgRed400, tw.itemsCenter, tw.justifyCenter]}
          onPress={() => {
            this.onRemovePress(item);
            this.swipeRows[item._id]?.closeRow?.();
          }}
        >
          <RkText style={[tw.textWhite, tw.textCenter]}>
            Xóa
          </RkText>
        </TouchableOpacity>
      </View>
      <TouchableHighlight
        onPress={() => this.onItemPress(item)}
        underlayColor={color.white}
      >
        <View style={[tw.flexRow, tw.pX4, tw.pY3, tw.bgWhite]}>
          <View style={[tw.w10, tw.h10, tw.bgBlue400, tw.roundedFull, tw.itemsCenter, tw.justifyCenter]}>
            <Ionicons name='notifications' size={24} color="white" />
          </View>
          <View style={tw.w2} />
          <View style={tw.flex1}>
            <View style={tw.flexRow}>
              <RkText rkType="header5" style={[tw.flex1, item.viewYn && tw.textGray500]} numberOfLines={2}>
                {item.tieude}
              </RkText>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <RkText style={[tw.textSm, item.viewYn ? tw.textGray500 : tw.textBlue500]}>
                  {moment(item.created_at).fromNow()}
                </RkText>
                {!item.viewYn && <View style={[tw.w2, tw.h2, tw.mL2, tw.bgRed500, tw.roundedFull]}/>}
              </View>
            </View>
            <View style={tw.h1} />
            <RkText style={[tw.textSm, item.viewYn && tw.textGray500]} numberOfLines={4}>
              {item.noidung}
            </RkText>
          </View>
        </View>
      </TouchableHighlight>
    </SwipeRow>
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
    return <View style={[tw.mL12, tw.hPx, tw.bgGray300]} />;
  };

  renderEmpty = () => {
    if (this.state.loadStatus === LOAD_STATUS.IDLE) {
      return (
        <View style={[tw.p4, tw.itemsCenter, tw.justifyCenter]}>
          <RkText>{I18n.t('not_found')}</RkText>
        </View>
      );
    }
    return null;
  };

  renderFirstLoad = () => {
    return (
      <View style={[tw.p4, tw.itemsCenter, tw.justifyCenter]}>
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
          contentInsetAdjustmentBehavior="automatic"
        />
      </View>
    );
  }
}
