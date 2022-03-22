import React from "react";
import {
  Image,
  View,
} from "react-native";

export default class Avatar extends React.Component {

  renderImg = (styles) => (
    <View>
      <Image style={styles.image} source={this.props.img} />
    </View>
  );

  render() {
    const container = [{ "alignItems": "center" }, { "flexDirection": "column" }]
    const other = { "image": [{ "width": 110 }, { "height": 110 }, { "borderRadius": 55 }, { "marginBottom": 19 }], "badge": [{ "width": 15 }, { "height": 15 }, { "borderRadius": 7.5 }, { "alignItems": "center" }, { "justifyContent": "center" }, { "position": "absolute" }, { "bottom": -2 }, { "right": -2 }], "badgeText": [{ "backgroundColor": "transparent" }, { "fontSize": 9 }] }
    return (
      <View style={[container, this.props.style]}>
        {this.renderImg(other)}
      </View>
    );
  }
}
