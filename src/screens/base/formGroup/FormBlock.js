import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RkText } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import Required from '../required';
import { styleContainer } from '../../../stylesContainer';

export default function FormBlock(props) {
  return (
    <View style={[styles.viewContainer, props.props.boxShadow === false ? null : styleContainer.boxShadow, props.props.containerStyle]}>
      {props.props.labelIcon ? <View style={styles.labelIcon}>
        {props.props.labelIcon}
      </View> : null}
      <View style={styles.viewText}>
        {props.props.readOnly === true || !props.props.editable ? <View style={styles.readOnly}>
          {props.props.placeholder && <RkText rkType={props.props.disableLabelReadOnly ? "primary2 disabled" : "primary2" }>{props.props.placeholder}</RkText>}
          <View style={{ flex: 1 }}>
            {props.props.children}
          </View>
        </View>
          :
          <View style={styles.textBox}>
            {props.props.placeholder && <RkText rkType="primary2 disabled">{props.props.placeholder}<Required required={props.props.required} /></RkText>}
            {props.props.children}
          </View>}

      </View>
    </View>
  )
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
  readOnly: { flexDirection: 'column' },
  textBox: { flexDirection: 'column' }
})
