import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { RkText } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import Space from '../space';
import Required from '../required';
import { isEmpty } from '../../../epics-reducers/services/common';
import SectionedMultiSelect from "../select";
import { CONSTANTS } from '../../../constants';
import { styleContainer } from '../../../stylesContainer';
import I18n from '../../../utilities/I18n';
import { PLATFORM_ANDROID } from '../../../constants/variable';

export class Select extends Component {
  constructor(props) {
    super(props),
      this.state = {
        selectedItems: [],
      };
  }
  componentDidMount() {
    if (this.props.props.type === CONSTANTS.SELECT) {
      let copy = Object.assign([], this.props.props.selectedItems)
      this.setState({ selectedItems: copy })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.props.type === CONSTANTS.SELECT) {
      let { selectedItems } = this.props.props
      if (selectedItems !== prevProps.props.selectedItems) {
        let copy = Object.assign([], this.props.props.selectedItems)
        this.setState({ selectedItems: copy })
      }
    }
  }

  onSelectedItemsChange(id, selected) {
    this.state.selectedItems = selected
    this.forceUpdate()

  }

  onConfirm() {
    this.props.props.onConfirm(this.props.props.id, this.state.selectedItems)
  }

  onCancel() {
    let copy = Object.assign([], this.props.props.selectedItems)
    this.setState({ selectedItems: copy })
    this.props.props.onCancel(this.props.props.id, this.props.props.selectedItems)
  }


  render() {
    let { props } = this.props
    let valueShow = {}

    if (!isEmpty(props.value) && props.single && !isEmpty(this.state.selectedItems) && props.value.length) {
      valueShow = props.value[0].children.filter(item => {
        return item._id === this.state.selectedItems[0]
      })[0] || {}
    }

    if (!isEmpty(props.value) && !props.single) {
      valueShow.name = ""
      let temp = props.value.filter(item => {
        return item._id === this.state.selectedItems
      })
      temp.map(item => {
        valueShow.name += (item.name + ', ')
      })
    }
    //console.log(valueShow, 'valueShow')

    let isSelectDoctor = false;
    if (props.hasOwnProperty('isSelectDoctor')) {
      isSelectDoctor = true;
    }

    return (
      <View style={[styles.viewContainer, styleContainer.boxShadow, props.containerStyle]}>
        {props.labelIcon ? <View style={{ flex: 1, alignSelf: "center", }}>
          {props.labelIcon}
        </View> : null}
        <View style={styles.viewText}>
          {props.readOnly === true ? <View style={styles.readOnly}>
            <View>
              <RkText rkType="primary2">{props.selectText}<Space /></RkText>
            </View>
            <View style={{ flex: 1 }}>
              <RkText rkType="primary2 disabled" style={{ textAlign: 'right' }}>{valueShow.name || ""}</RkText>
            </View>
          </View>
            :
            <View style={styles.selectBox}>
              <RkText rkType="primary2 disabled">{props.selectText}<Required required={props.required} /></RkText>
              <View style={{ marginVertical: PLATFORM_ANDROID ? 7.5 : 4}}>
                <SectionedMultiSelect
                  items={props.value} // nếu single thì data trả về đầy đủ dữ liệu, còn nếu multi thì chỉ trả về id.
                  uniqueKey="_id"
                  subKey={props.subKey}
                  single={props.single}
                  displayKey={props.displayKey}
                  showCancelButton={props.showCancelButton}
                  selectText={I18n.t("select") + " " + props.selectText}
                  selectedItems={this.state.selectedItems}
                  onSelectedItemsChange={(selected) => this.onSelectedItemsChange(props.id, selected)}
                  onConfirm={() => this.onConfirm()}
                  onCancel={() => this.onCancel()}
                  isSelectDoctor={isSelectDoctor}
                  navigation={props.navigation}
                />
              </View>
            </View>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: "row",
    backgroundColor: KittenTheme.colors.white,
    marginBottom: 5,
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    padding: 5
  },
  view: { flexDirection: "row", flex: 1 },
  labelIcon: { alignSelf: "center", flex: 1 },
  viewText: { backgroundColor: "#ffffff", flex: 9 },
  placeholderIcon: { flex: 1, alignSelf: "center" },
  readOnly: { flexDirection: 'row' },
  selectBox: { flexDirection: 'column' }

})