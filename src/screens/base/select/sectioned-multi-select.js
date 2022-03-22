import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { isEqual } from 'lodash'
import { RowItem } from './components'
import GradientButton from "../gradientButton"

import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../../config/theme";
import { RkText, RkTextInput } from 'react-native-ui-kitten'
import { styleContainer } from "../../../stylesContainer";
import I18n from '../../../utilities/I18n';

const defaultStyles = {
  container: {},
  selectToggle: {
    borderRadius: 4,
  },
  selectToggleText: {},
  item: {},
  subItem: {},
  itemText: {
  },
  selectedItemText: {},
  selectedSubItemText: {},
  subItemText: {
    paddingLeft: 8,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {},
  subSeparator: {
    height: 0,
  },
  chipContainer: {},
  chipText: {},
  chipIcon: {},
  searchTextInput: {},
  scrollView: {},
  button: {},
  cancelButton: {},
  confirmText: {},
  toggleIcon: {},
  selectedItem: {},
}


const defaultColors = {
  primary: '#3f51b5',
  success: '#4caf50',
  cancel: '#1A1A1A',
  text: '#2e2e2e',
  subText: '#848787',
  selectToggleTextColor: '#333',
  searchPlaceholderTextColor: '#999',
  searchSelectionColor: 'rgba(0,0,0,0.2)',
  chipColor: '#848787',
  itemBackground: '#fff',
  subItemBackground: '#ffffff',
  disabled: '#d7d7d7',
}

const ComponentContainer = ({ children }) => (
  <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </View>
)

const noResults = (
  <ComponentContainer>
    <RkText>{I18n.t("no_data_to_display")}</RkText>
  </ComponentContainer>
)

const noItems = (
  <ComponentContainer>
    <RkText>{I18n.t("no_data_to_display")}</RkText>
  </ComponentContainer>
)

const loadingComp = (
  <ComponentContainer>
    <ActivityIndicator />
  </ComponentContainer>
)

class SectionedMultiSelect extends PureComponent {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array,
    displayKey: PropTypes.string,
    uniqueKey: PropTypes.string.isRequired,
    subKey: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    showDropDowns: PropTypes.bool,
    showChips: PropTypes.bool,
    readOnlyHeadings: PropTypes.bool,
    selectText: PropTypes.string,
    selectedText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    renderSelectText: PropTypes.func,
    confirmText: PropTypes.string,
    hideConfirm: PropTypes.bool,
    styles: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    colors: PropTypes.objectOf(PropTypes.string),
    searchPlaceholderText: PropTypes.string,
    noResultsComponent: PropTypes.object,
    loadingComponent: PropTypes.object,
    loading: PropTypes.bool,
    subItemFontFamily: PropTypes.object,
    itemFontFamily: PropTypes.object,
    searchTextFontFamily: PropTypes.object,
    confirmFontFamily: PropTypes.object,
    showRemoveAll: PropTypes.bool,
    removeAllText: PropTypes.string,
    modalSupportedOrientations: PropTypes.arrayOf(PropTypes.string),
    modalAnimationType: PropTypes.string,
    hideSearch: PropTypes.bool,
    footerComponent: PropTypes.object,
    stickyFooterComponent: PropTypes.object,
    selectToggleIconComponent: PropTypes.object,
    cancelIconComponent: PropTypes.object,
    searchIconComponent: PropTypes.object,
    selectedIconComponent: PropTypes.object,
    dropDownToggleIconUpComponent: PropTypes.object,
    dropDownToggleIconDownComponent: PropTypes.object,
    chipRemoveIconComponent: PropTypes.object,
    selectChildren: PropTypes.bool,
    highlightChildren: PropTypes.bool,
    onSelectedItemObjectsChange: PropTypes.func,
    itemNumberOfLines: PropTypes.number,
    selectLabelNumberOfLines: PropTypes.number,
    showCancelButton: PropTypes.bool,
    hideSelect: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    headerComponent: PropTypes.object,
    alwaysShowSelectText: PropTypes.bool,
    searchAdornment: PropTypes.func,
    expandDropDowns: PropTypes.bool,
    animateDropDowns: PropTypes.bool,
    customLayoutAnimation: PropTypes.object,
    filterItems: PropTypes.func,
    onToggleSelector: PropTypes.func,
    noItemsComponent: PropTypes.object,
    customChipsRenderer: PropTypes.func,
    chipsPosition: PropTypes.oneOf(['top', 'bottom']),
  }

  static defaultProps = {
    single: false,
    selectedItems: [],
    displayKey: 'name',
    showDropDowns: true,
    showChips: false,
    readOnlyHeadings: true,
    selectText: I18n.t("select"),
    selectedText: I18n.t("selected"),
    confirmText: I18n.t("confirm"),
    hideConfirm: false,
    searchPlaceholderText: I18n.t("search"),
    noResultsComponent: noResults,
    loadingComponent: loadingComp,
    loading: false,
    styles: {},
    colors: {},
    itemFontFamily: { fontWeight: '200' },
    subItemFontFamily: { fontWeight: '200' },
    searchTextFontFamily: { fontWeight: '200' },
    confirmFontFamily: { fontWeight: 'bold' },
    removeAllText: I18n.t("remove_all"),
    showRemoveAll: false,
    modalSupportedOrientations: ['portrait', 'landscape'],
    modalAnimationType: 'slide',
    hideSearch: false,
    selectChildren: true,
    highlightChildren: true,
    itemNumberOfLines: null,
    selectLabelNumberOfLines: 1,
    showCancelButton: false,
    hideSelect: false,
    alwaysShowSelectText: false,
    expandDropDowns: true,
    animateDropDowns: true,
    filterItems: null,
    noItemsComponent: noItems,
    chipsPosition: 'bottom',
  }

  constructor(props) {
    super(props)

    this.state = {
      selector: false,
      searchTerm: '',
      highlightedChildren: [],
      styles: StyleSheet.flatten([defaultStyles, props.styles]),
      colors: StyleSheet.flatten([defaultColors, props.colors])
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.styles, nextProps.styles)) {
      this.setState({ styles: StyleSheet.flatten([defaultStyles, nextProps.styles]) })
    }
    if (!isEqual(this.props.colors, nextProps.colors)) {
      this.setState({ colors: StyleSheet.flatten([defaultColors, nextProps.colors]) })
    }
  }

  getProp = (object, key) => object && object[key]

  rejectProp = (items, fn) => items.filter(fn)

  find = (id, items) => {
    if (!items) {
      return {}
    }
    const { uniqueKey, subKey } = this.props
    let i = 0
    let found
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id) {
        return items[i]
      } else if (Array.isArray(items[i][subKey])) {
        found = this.find(id, items[i][subKey])
        if (found) {
          return found
        }
      }
    }
  }

  reduceSelected = (array, toSplice) => {
    const { uniqueKey } = this.props
    array.reduce((prev, curr) => {
      toSplice.includes(curr[uniqueKey]) &&
        toSplice.splice(toSplice.findIndex(el => (
          el === curr[uniqueKey]
        )), 1)
    }, {})
    return toSplice
  }

  _getSelectLabel = () => {
    const {
      selectText,
      selectedText,
      single,
      selectedItems,
      displayKey,
      alwaysShowSelectText,
      renderSelectText,
    } = this.props

    if (renderSelectText) {
      return renderSelectText(this.props)
    }

    if (!single && alwaysShowSelectText) {
      return selectText
    }
    if (!selectedItems || selectedItems.length === 0) {
      return selectText
    } else if (single || selectedItems.length === 1) {
      const item = selectedItems[0]
      const foundItem = this._findItem(item)
      return this.getProp(foundItem, displayKey) || selectText
    }
    return `${selectText} (${selectedItems.length} ${selectedText || 'đã chọn'})`
  }

  _filterItems = (searchTerm) => {
    const {
      items,
      subKey,
      uniqueKey,
      displayKey,
      filterItems,
    } = this.props

    if (filterItems) {
      return filterItems(searchTerm, items, this.props)
    }
    let filteredItems = []
    let newFilteredItems = []

    items && items.forEach((item) => {
      const parts = searchTerm.replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&').trim().split(' ')
      const regex = new RegExp(`(${parts.join('|')})`, 'i')

      if (regex.test(this.getProp(item, displayKey))) {
        filteredItems.push(item)
      }
      if (item[subKey]) {
        const newItem = Object.assign({}, item)
        newItem[subKey] = []
        item[subKey].forEach((sub) => {
          if (regex.test(this.getProp(sub, displayKey))) {
            newItem[subKey] = [...newItem[subKey], sub]
            newFilteredItems = this.rejectProp(filteredItems, singleItem =>
              item[uniqueKey] !== singleItem[uniqueKey])
            newFilteredItems.push(newItem)
            filteredItems = newFilteredItems
          }
        })
      }
    })

    return filteredItems
  }

  _removeItem = (item) => {
    const {
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props

    const newItems = this.rejectProp(selectedItems, singleItem => (
      item[uniqueKey] !== singleItem
    ))

    highlightChildren && this._unHighlightChildren(item[uniqueKey])
    onSelectedItemObjectsChange && this._broadcastItemObjects(newItems)

    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems)
  }

  _removeAllItems = () => {
    const { onSelectedItemsChange, onSelectedItemObjectsChange } = this.props
    // broadcast new selected items state to parent component
    onSelectedItemsChange([])
    this.setState({ highlightedChildren: [] })
    onSelectedItemObjectsChange && this._broadcastItemObjects([])
  }

  _toggleSelector = () => {
    const { onToggleSelector } = this.props
    const newState = !this.state.selector
    this.setState({
      selector: newState,
    })
    onToggleSelector && onToggleSelector(newState)
  }

  _closeSelector = () => {
    const { onToggleSelector } = this.props
    this.setState({
      selector: false,
      searchTerm: '',
    })
    onToggleSelector && onToggleSelector(false)
  }

  _submitSelection = () => {
    const { onConfirm } = this.props
    this._toggleSelector()
    this.setState({ searchTerm: '' })
    onConfirm && onConfirm()
  }

  _cancelSelection = () => {
    const { onCancel } = this.props
    this._toggleSelector()
    this.setState({ searchTerm: '' })
    onCancel && onCancel()
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return selectedItems.includes(item[uniqueKey])
  }

  _toggleItem = (item, hasChildren) => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      selectChildren,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props


    if (single) {
      onSelectedItemsChange([item]) // nếu single thì data trả về đầy đủ dữ liệu
      this._submitSelection()
      onSelectedItemObjectsChange && this._broadcastItemObjects([item[uniqueKey]])
    } else {
      const selected = this._itemSelected(item)
      let newItems = []
      if (selected) {
        if (hasChildren) {
          if (selectChildren) {
            newItems = [...this._rejectChildren(item[uniqueKey])]

            newItems = this.rejectProp(newItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          } else if (highlightChildren) {
            this._unHighlightChildren(item[uniqueKey])
            newItems = this.rejectProp(selectedItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          } else {
            newItems = this.rejectProp(selectedItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          }
        } else {
          newItems = this.rejectProp(selectedItems, singleItem => (
            item[uniqueKey] !== singleItem
          ))
        }
      } else {
        newItems = [...selectedItems, item[uniqueKey]]
        if (hasChildren) {
          if (selectChildren) {
            newItems = [...newItems, ...this._selectChildren(item[uniqueKey])]
          } else if (highlightChildren) {
            this._highlightChildren(item[uniqueKey])
          }
        }
      }
      onSelectedItemsChange(newItems)
      onSelectedItemObjectsChange && this._broadcastItemObjects(newItems);
    }
  }

  _findItem = (id) => {
    const { items } = this.props
    return this.find(id, items)
  }

  _highlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]
    if (!items) return
    let i = 0
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !highlighted.includes(sub[uniqueKey]) && highlighted.push(sub[uniqueKey])
        })
      }
    }
    this.setState({ highlightedChildren: highlighted })
  }

  _unHighlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]

    const array = items.filter(item => item[uniqueKey] === id)

    if (!array['0']) {
      return
    }
    if (array['0'] && !array['0'][subKey]) {
      return
    }

    const newHighlighted = this.reduceSelected(array['0'][subKey], highlighted)

    this.setState({ highlightedChildren: newHighlighted })
  }

  _selectChildren = (id) => {
    const {
      items,
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props
    if (!items) return
    let i = 0
    const selected = []
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !selectedItems.includes(sub[uniqueKey]) && selected.push(sub[uniqueKey])
        })
      }
    }

    this._highlightChildren(id)
    return selected
  }

  _rejectChildren = (id) => {
    const {
      items,
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props
    const arrayOfChildren = items.filter(item => item[uniqueKey] === id)
    const selected = [...selectedItems]
    if (!arrayOfChildren['0']) {
      return
    }
    if (arrayOfChildren['0'] && !arrayOfChildren['0'][subKey]) {
      return
    }

    const newSelected = this.reduceSelected(arrayOfChildren['0'][subKey], selected)

    this._unHighlightChildren(id)
    return newSelected
  }

  _getSearchTerm = () => {
    return this.state.searchTerm
  }

  _broadcastItemObjects = (newItems) => {
    const {
      onSelectedItemObjectsChange,
    } = this.props

    const fullItems = []
    newItems.forEach((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)
      fullItems.push(item)
    })
    onSelectedItemObjectsChange(fullItems)
  }

  _customChipsRenderer = () => {
    const { styles, colors } = this.state
    const { customChipsRenderer } = this.props
    return customChipsRenderer && customChipsRenderer({ ...this.props, colors, styles })
  }

  _displaySelectedItems = () => {
    const {
      uniqueKey,
      selectedItems,
      displayKey,
      chipRemoveIconComponent,
    } = this.props
    const { styles, colors } = this.state
    return selectedItems.map((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)

      if (!item || !item[displayKey]) return null

      return (

        <View
          style={[{
            overflow: 'hidden',
            justifyContent: 'center',
            height: 34,
            borderColor: colors.chipColor,
            borderWidth: 1,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            margin: 3,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
          }, styles.chipContainer]}
          key={item[uniqueKey]}
        >
          <RkText
            numberOfLines={1}
            style={[
              {
                color: colors.chipColor,
                marginRight: 0,
              },
              styles.chipText]}
          >
            {item[displayKey]}
          </RkText>
          <TouchableOpacity
            onPress={() => {
              this._removeItem(item)
            }}
            style={{
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            {chipRemoveIconComponent ?
              chipRemoveIconComponent
              :
              <Ionicons name="ios-close-circle-outline" size={20} color={KittenTheme.colors.disabled} />}
          </TouchableOpacity>
        </View>
      )
    })
  }

  _renderSeparator = () => (
    <View
      style={[{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        alignSelf: 'stretch',
        backgroundColor: '#dadada',
      }, this.state.styles.separator]}
    />
  )


  _renderFooter = () => {
    const { footerComponent } = this.props
    return (
      <View>
        {footerComponent && footerComponent}
      </View>
    )
  }

  _renderItemFlatList = ({ item }) => {
    const { styles, colors } = this.state
    const { searchTerm } = this.state
    return (
      <View>
        <RowItem
          item={item}
          mergedStyles={styles}
          mergedColors={colors}
          _itemSelected={this._itemSelected}
          searchTerm={searchTerm}
          _toggleItem={this._toggleItem}
          highlightedChildren={this.state.highlightedChildren}
          _cancelSelection={this._cancelSelection}
          {...this.props}
        />
      </View>
    )
  }

  render() {
    const {
      items,
      selectedItems,
      uniqueKey,
      confirmText,
      searchPlaceholderText,
      noResultsComponent,
      loadingComponent,
      loading,
      modalAnimationType,
      modalSupportedOrientations,
      hideSearch,
      showCancelButton,
      hideSelect,
      searchAdornment,
      selectLabelNumberOfLines,
      noItemsComponent,
      single
    } = this.props

    const {
      searchTerm,
      selector,
      styles,
      colors,
    } = this.state

    const renderItems = searchTerm ? this._filterItems(searchTerm.trim()) : items

    return (
      <View>
        <Modal
          supportedOrientations={modalSupportedOrientations}
          animationType={modalAnimationType}
          transparent
          visible={selector}
          onRequestClose={this._closeSelector}
        >
          <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, styles.backdrop]}>
            <View style={[{
              overflow: 'hidden',
              marginHorizontal: 18,
              marginVertical: 26,
              borderRadius: 6,
              alignSelf: 'stretch',
              flex: 1,
              backgroundColor: 'white',
            }]}>
              {!hideSearch &&
                <View style={[{ flexDirection: 'row', padding: 5, borderBottomWidth: KittenTheme.border.borderWidth, borderColor: KittenTheme.border.borderColor }, styles.searchBar]}>
                  <View style={styles.center}>
                    <Ionicons name="ios-search" size={20} color={KittenTheme.colors.disabled} />
                  </View>
                  <RkTextInput
                    rkType='clear'
                    value={this.state.searchTerm}
                    selectionColor={colors.searchSelectionColor}
                    onChangeText={searchTerm => this.setState({ searchTerm })}
                    placeholder={searchPlaceholderText}
                    selectTextOnFocus
                    placeholderTextColor={colors.searchPlaceholderTextColor}
                    underlineColorAndroid="transparent"
                    style={[{ flex: 1 }]} />
                  {searchAdornment && searchAdornment(searchTerm)}
                </View>
              }

              <ScrollView
                keyboardShouldPersistTaps="always"
                style={[{ paddingHorizontal: 12, flex: 1 }, styles.scrollView]}
              >
                <View>
                  {loading ?
                    loadingComponent
                    :
                    <View>
                      {!renderItems || !renderItems.length && !searchTerm ? noItemsComponent : null}
                      {items && renderItems && renderItems.length ?
                        <View>
                          <FlatList
                            keyboardShouldPersistTaps="always"
                            removeClippedSubviews
                            initialNumToRender={15}
                            data={renderItems}
                            extraData={selectedItems}
                            keyExtractor={item => `${item[uniqueKey]}`}
                            ItemSeparatorComponent={this._renderSeparator}
                            ListFooterComponent={this._renderFooter}
                            renderItem={this._renderItemFlatList}
                          />
                        </View>
                        :
                        searchTerm ? noResultsComponent : null
                      }
                    </View>
                  }
                </View>
              </ScrollView>
              <View style={{ flexDirection: "row" }}>
                {showCancelButton && <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <GradientButton
                    style={styleContainer.buttonGradient}
                    text={"Hủy"}
                    onPress={this._cancelSelection} />
                </View>}
                {!single && <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <GradientButton
                    style={styleContainer.buttonGradient}
                    text={confirmText || "Xác nhận"}
                    onPress={this._submitSelection} />
                </View>}
              </View>
            </View>
          </View>
        </Modal>
        {!hideSelect &&
          <TouchableOpacity onPress={this._toggleSelector} disabled={this.state.selector}>
            <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
              <RkText
                numberOfLines={selectLabelNumberOfLines}
                style={[{ flex: 1, }, styles.selectToggleText]}>
                {this._getSelectLabel()}
              </RkText>
              <Ionicons name="ios-chevron-down" size={20} color={KittenTheme.colors.appColor} />
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }
}


export default SectionedMultiSelect
