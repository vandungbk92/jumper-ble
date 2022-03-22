import React, { Component } from "react";
import { RkText } from "react-native-ui-kitten"
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { styleContainer } from "../../../stylesContainer";
import { isEmpty, showToast } from "../../../epics-reducers/services/common";
import { connect } from "react-redux"
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../../config/theme";
import { getAllRatingByRequest, getMyRatingByRequest } from "../../../epics-reducers/services/ratingServices";
import axios from 'axios'
import I18n from "../../../utilities/I18n"

const ratingStar = [1, 2, 3, 4, 5]

class RatingStar extends Component {

  static navigationOptions = {
    headerShown: false
  };


  constructor(props) {
    super(props);
    this.state = {
      rating: null,
      isShowModal: false
    }
  }

  componentDidMount() {
    this.initData()
  }

  async initData() {
    let { requestId } = this.props
    let apiRequest = [
      getAllRatingByRequest(requestId)
    ]
    let apiResponse = await axios.all(apiRequest).then(axios.spread(function (rating) {
      return {
        rating: rating
      }
    }));
    let rating = apiResponse.rating
    this.setState({ rating, isShowModal: false })
  }

  render() {
    let { rating } = this.state
    if(!rating) return null;

    return (
      <View style={[styles.container, styleContainer.boxShadow]}>
        <View style={styles.group}>
          <RkText rkType="primary2">{I18n.t("evaluate_processing_results") + ' '}</RkText>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              {ratingStar.map((item, index) => {
                return (
                  <Ionicons key={index} name={item <= rating.rating ? "ios-star" : 'ios-star-outline'} size={25} color={KittenTheme.colors.appColor} />
                )
              })}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    marginTop: 5,
    backgroundColor: KittenTheme.colors.white
  },
  group: {
    flexDirection: "row",
    borderRadius: KittenTheme.border.borderRadius,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    backgroundColor: KittenTheme.colors.white
  },
  starGroup: { flexDirection: 'column' }
})

function mapStateToProps(state) {
  const { loginRes } = state
  return { loginRes }
}

export default connect(mapStateToProps)(RatingStar);
