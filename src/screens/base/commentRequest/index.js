import React, { Component } from "react";
import {RkText, RkTextInput} from "react-native-ui-kitten"
import {TouchableOpacity, View, StyleSheet, Alert} from "react-native";
import { styleContainer } from "../../../stylesContainer";
import { isEmpty, showToast, checkValidate } from "../../../epics-reducers/services/common";
import { connect } from "react-redux"
import { KittenTheme } from "../../../../config/theme";
import {
  getAllCommentRequest,
  createComment,
  delComment,
  updateComment
} from "../../../epics-reducers/services/commentServices";
import FormGroup from "../formGroup";
import { CONSTANTS } from "../../../constants";
import { LOGIN_PAGE } from "../../../constants/router";
import GradientButton from "../gradientButton";
import Space from "../space";
import I18n from "../../../utilities/I18n"
import {timeFormatter} from '../../../constants/dateFormat'

class CommentRequest extends Component {

  static navigationOptions = {
    headerShown: false
  };


  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      comment: "",
      pageIndex: 0
    }
  }

  async componentDidMount() {
    try {
      let comments = await getAllCommentRequest(this.props.requestId)
      if (comments) {
        this.setState({ comments })
      }
    } catch (e) {

    }
  }

  handlePagination(index) {
    this.setState({pageIndex: index})
  }


  render() {
    let { comments, comment, pageIndex } = this.state
    let { setting, userInfoRes } = this.props
    const pagination = Array(parseInt(comments.length / setting.item_per_page) + 1).fill(0).map((e, i) => i + 1)
    const showPage = 2
    return (
      <View style={styles.container}>

        <View style={styles.comments}>
          <RkText rkType="header5">{I18n.t("comment_by_readers")}<Space /><RkText rkType="disabled light">({comments.length})</RkText> </RkText>
          <View style={{ marginTop: 5 }}>
            {comments.length ? comments.map((comment, index) => {
              if (index >= (setting.item_per_page * pageIndex) && index < (setting.item_per_page * (pageIndex + 1)))
                return <View key={index} style={styles.commentBox}>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <RkText rkType="primary2">{comment.citizen_id.full_name}</RkText>
                      <Space/>
                      <RkText rkType='disabled light' style={{fontSize: 13}}>{timeFormatter(comment.created_at)}</RkText>
                      <Space/>

                    </View>
                    <View>
                      <RkText> {comment.content} </RkText>
                    </View>
                  </View>
                </View>
            }) : <View >
                <RkText style={styles.tipList}> {I18n.t("no_comment_to_display")} </RkText>
              </View>}
          </View>
          {comments.length ? <View style={{ flexDirection: 'row' }}>
            {pageIndex !== 0 && <TouchableOpacity style={styles.buttonPage} onPress={() => this.handlePagination(0)}>
              <RkText>{"<<"}</RkText>
            </TouchableOpacity>}
            {pagination.map((item, index) => {
              if (item <= parseInt(pageIndex) + showPage && item >= parseInt(pageIndex) - showPage)
                return (
                  <TouchableOpacity style={styles.buttonPage} key={index} onPress={() => this.handlePagination(index)}>
                    <RkText style={index === pageIndex ? styles.buttonActive : styles.buttonNoneActive}>{index + 1}</RkText>
                  </TouchableOpacity>
                )
            })}
            {pageIndex !== (pagination.length - 1) && <TouchableOpacity style={styles.buttonPage} onPress={() => this.handlePagination(pagination.length - 1)}>
              <RkText>{">>"}</RkText>
            </TouchableOpacity>}
          </View> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  group: {
    backgroundColor: KittenTheme.colors.white,
    flexDirection: "column",
    padding: 5,
    borderRadius: KittenTheme.border.borderRadius,
  },
  comment: {
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    //marginTop: 5,
    marginBottom: 5,

  },
  commentBox: {
    marginBottom: 5,
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    padding: 5,
  },
  comments: {
    flexDirection: "column",
    marginBottom: 5,
  },
  buttonPage: {
    padding: 15
  },
  buttonActive: {
    color: KittenTheme.colors.appColor
  },
  buttonNoneActive: {

  }
})


function mapStateToProps(state) {
  const { loginRes, userInfoRes, setting } = state
  return { loginRes, userInfoRes, setting }
}

export default connect(mapStateToProps)(CommentRequest);
