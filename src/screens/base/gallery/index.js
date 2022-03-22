import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { KittenTheme } from '../../../../config/theme';
import { RkText } from 'react-native-ui-kitten';
import Space from '../space';
import { DEVICE_WIDTH } from '../../../constants/variable';
import { VIEW_IMAGE_PAGE } from '../../../constants/router';
import I18n from '../../../utilities/I18n';
import { tw } from 'react-native-tailwindcss';

const ImageView = ({source}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const _onLoadEnd = () => {setIsLoading(false)}
  const itemSize = (DEVICE_WIDTH - 40) / 3
  return <View style={[tw.bgGray200]}>
    <Image
      style={{ width: itemSize, height: itemSize, borderRadius: KittenTheme.border.borderRadius }}
      source={source}
      onLoadEnd={_onLoadEnd}
    />
    <ActivityIndicator size="large" color={KittenTheme.colors.appColor} animating={isLoading} style={[tw.absolute, tw.inset0]}/>
  </View>
}

export class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSize: (DEVICE_WIDTH - 40) / 3,
    };

    this.delImgFunc = this.delImgFunc.bind(this)
  }

  delImgFunc(position){
    this.props.deleteImgFunc(position)
  }

  render = () => {
    let { items, label } = this.props
    if (!items || !items.length)
      return (
        <View></View>
      )
    let count = 1
    let imageGroup = []
    for (let index = 0; index < items.length; index += 3) {
      imageGroup.push(
        <View style={styles.imageGroup} key={index}>
          {items[index * count] && <TouchableOpacity style={styles.image} onPress={() => this.props.navigation.navigate(VIEW_IMAGE_PAGE, {
            initialPage: index * count,
            images: this.props.items,
            delImgFunc: this.delImgFunc,
            deleteImg: this.props.deleteImg
          })}>
            <ImageView source={items[index * count].source}/>
          </TouchableOpacity>}
          {items[index * count + 1] && <TouchableOpacity style={styles.image} onPress={() => this.props.navigation.navigate(VIEW_IMAGE_PAGE, {
            initialPage: index * count + 1,
            images: this.props.items,
            delImgFunc: this.delImgFunc,
            deleteImg: this.props.deleteImg
          })}>
            <ImageView source={items[index * count + 1].source}/>
          </TouchableOpacity>}
          {items[index * count + 2] && <TouchableOpacity style={styles.image} onPress={() => this.props.navigation.navigate(VIEW_IMAGE_PAGE, {
            initialPage: index * count + 2,
            images: this.props.items,
            delImgFunc: this.delImgFunc,
            deleteImg: this.props.deleteImg
          })}>
            <ImageView source={items[index * count + 2].source}/>
          </TouchableOpacity>}
        </View>
      )
    }
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <RkText rkType="primary2">{label ? label: I18n.t("image")}<Space /></RkText>
        <View style={styles.flatList}>
          {imageGroup}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  imageGroup: { flexDirection: 'row' },
  flatList: { flex: 1, marginTop: 5 },
  image: { padding: 2, borderRadius: KittenTheme.border.borderRadius }
});
