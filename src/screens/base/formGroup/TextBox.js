import React from 'react';
import getIn from 'lodash/get';
import { View, StyleSheet } from 'react-native';
import { RkText, RkTextInput } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import Space from '../space';
import Required from '../required';
import { styleContainer } from '../../../stylesContainer';

export default function TextBox(props) {
  const showBorder = getIn(props.props, 'border', true);
  const showShadow = getIn(props.props, 'shadow', true);

  return (
    <View style={[
      styles.viewContainer,
      showBorder && styles.boxBorder,
      showShadow && styleContainer.boxShadow,
      props.props.containerStyle,
      !props.props.editable && styles.editableView
    ]}>
      {props.props.labelIcon
        ? <View style={[styles.labelIcon, props.props.labelIconStyle]}>
          {props.props.labelIcon}
        </View>
        : null
      }
      <View style={[styles.viewText, props.props.contentStyle, !props.props.editable && styles.editableView]}>
        {props.props.readOnly === true
          ? <View style={[styles.readOnly, props.props.readOnlyStyle]}>
            {props.props.placeholder &&
              <RkText rkType="primary2">{props.props.placeholder}<Space /></RkText>
            }
            <RkText rkType="primary2 disabled" style={[{ textAlign: 'right' }, props.props.textValueStyle]}>
              {props.props.value}
            </RkText>
          </View>
          : <View style={styles.textBox}>
            {props.props.placeholder &&
              <RkText rkType="primary2 disabled" >
                {props.props.placeholder}
                <Required required={props.props.required} />
              </RkText>
            }
            <RkTextInput
              autoCapitalize = {props.props.autoCapitalize ? props.props.autoCapitalize : 'sentences'}
              keyboardType={props.props.keyboardType}
              returnKeyType={props.props.returnKeyType}
              style={{ marginLeft: -15, marginVertical: 0 }}
              secureTextEntry={props.props.secureTextEntry}
              editable={props.props.editable}
              placeholder={props.props.placeholderText}
              value={props.props.value}
              rkType="clear"
              maxLength={props.props.maxLength}
              onChangeText={(value) => props.props.onChangeText(props.props.id, value)}
              onSubmitEditing={props.props.onSubmitEditing} />
          </View>
        }
      </View>
      {props.props.searchIcon
        ? <View style={[styles.searchIcon, props.props.searchIconStyle]}>
          {props.props.searchIcon}
        </View>
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: "row",
    backgroundColor: KittenTheme.colors.white,
    marginBottom: 5,
    padding: 5
  },
  boxBorder: {
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    borderRadius: KittenTheme.border.borderRadius
  },
  view: { flexDirection: "row", flex: 1 },
  editableView: { backgroundColor: KittenTheme.colors.blueGray_1 },
  labelIcon: { alignSelf: "center", flex: 1 },
  searchIcon: { alignSelf: "center", flex: 1, alignItems: "flex-end" },
  viewText: { backgroundColor: "#ffffff", flex: 9 },
  placeholderIcon: { flex: 1, alignSelf: "center" },
  readOnly: { flexDirection: 'row', justifyContent: 'space-between' },
  textBox: { flexDirection: 'column' }
})
