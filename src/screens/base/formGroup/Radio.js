import React from 'react';

import getIn from 'lodash/get';

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RkText, RkChoice, RkChoiceGroup } from 'react-native-ui-kitten';

import Space from '../space';
import Required from '../required';

import { KittenTheme } from '../../../../config/theme';
import { styleContainer } from '../../../stylesContainer';

export function Radio(props) {
  const showBorder = getIn(props.props, 'border', true);
  const showShadow = getIn(props.props, 'shadow', true);

  const [selectedId, setSelectedId] = React.useState(props.props.value);

  React.useEffect(() => {
    if (props.props.value) {
      setSelectedId(props.props.value);
    }
  }, [props.props.value]);

  const onChange = React.useCallback((selectedIndex) => {
      const selectedItem = props.props.data[selectedIndex];
      setSelectedId(selectedItem._id);
      props.props.onChange(props.props.id, selectedItem);
    }, [
    props.props.data,
    selectedId,
  ]);

  return (
    <View
      style={[
        styles.viewContainer,
        showBorder && styles.boxBorder,
        showShadow && styleContainer.boxShadow,
        props.props.containerStyle,
      ]}
    >
      {props.props.labelIcon ? (
        <View style={styles.labelIcon}>{props.props.labelIcon}</View>
      ) : null}
      <View style={styles.viewText}>
        {props.props.placeholder && (
          <RkText rkType="primary2 disabled">
            {props.props.placeholder}
            <Required required={props.props.required} />
          </RkText>
        )}
        {props.props.data.length > 0 && (
          <RkChoiceGroup radio onChange={onChange} style={{flexDirection: 'row'}}>
            {props.props.data.map((item) => (
              <TouchableOpacity key={item._id} choiceTrigger>
                <View style={styles.itemContainer}>
                  <RkChoice style={styles.choiceStyle} rkType="radio" selected={selectedId === item._id} />
                  <RkText style={styles.choiceTextStyle}>
                    {props.props.displayKey ? item[props.props.displayKey] : item.name}
                  </RkText>
                </View>
              </TouchableOpacity>
            ))}
          </RkChoiceGroup>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    backgroundColor: KittenTheme.colors.white,
    marginBottom: 5,
    padding: 5,
  },
  boxBorder: {
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    borderRadius: KittenTheme.border.borderRadius,
  },
  labelIcon: { alignSelf: 'center', flex: 1 },
  viewText: { backgroundColor: '#ffffff', flex: 9 },
  itemContainer: { flexDirection: 'row', marginTop: 4, alignItems: 'center' },
  choiceStyle: { marginTop: 2 },
  choiceTextStyle: { marginLeft: 8, marginRight: 8 },
});
