import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RkText, RkTextInput } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import Required from '../required';
import { styleContainer } from '../../../stylesContainer';

export default function TextArea(props) {
  return (
    <View style={[styles.viewContainer, props.props.boxShadow === false ? null : styleContainer.boxShadow, props.props.containerStyle]}>
      {props.props.labelIcon ? <View style={styles.labelIcon}>
        {props.props.labelIcon}
      </View> : null}
      <View style={styles.viewText}>
        {props.props.readOnly === true || !props.props.editable ? <View style={styles.readOnly}>
          <View>
            <RkText rkType={props.props.disableLabelReadOnly ? "primary2 disabled" : "primary2" }>{props.props.placeholder}</RkText>
          </View>
          <View style={{ flex: 1 }}>
            <RkText rkType="" style={{ textAlign: 'left' }}>{props.props.value}</RkText>
          </View>
        </View>
          :
          <View style={styles.textBox}>
            <RkText rkType="primary2 disabled">{props.props.placeholder}<Required required={props.props.required} /></RkText>
            <RkTextInput
              keyboardType={props.props.keyboardType}
              style={{ marginLeft: -15, marginVertical: 0 }}
              secureTextEntry={props.props.secureTextEntry}
              editable={props.props.editable}
              placeholder={props.props.placeholderText}
              value={props.props.value}
              rkType="clear text-area"
              inputStyle={[{marginLeft: 15, paddingTop: 0, height: 60}, props.props.inputStyle]}
              multiline={true}
              numberOfLines={props.props.numberOfLines || 8}
              onChangeText={(value) => props.props.onChangeText(props.props.id, value)} />
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
