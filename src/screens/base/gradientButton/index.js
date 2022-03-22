import React from "react";
import {
  RkButton,
  RkText,
  RkComponent,
} from "react-native-ui-kitten";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { KittenTheme } from "../../../../config/theme";
import {tw} from "react-native-tailwindcss";

export default class GradientButton extends RkComponent {
  componentName = "GradientButton";
  typeMapping = {
    button: {},
    gradient: {},
    text: {},
  };

  renderContent = () => {
    const hasText = this.props.text === undefined;
    return hasText ? this.props.children : this.renderText();
  };

  renderText = () => {
    if (typeof this.props.text === "string") {
      return <RkText style={[styles.textStyle, tw.textLg]}>{this.props.text}</RkText>;
    }
    return this.props.text;
  }

  render() {
    const { style, rkType, loading = false, ...restProps } = this.props;
    return (
      <RkButton
        rkType="stretch"
        style={[style]}
        disabled={loading}
        {...restProps}
      >
        <>
          {loading && <ActivityIndicator style={{ marginRight: 8 }} color="white" />}
          {this.renderContent()}
        </>
      </RkButton>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    color: KittenTheme.colors.white
  }
})
