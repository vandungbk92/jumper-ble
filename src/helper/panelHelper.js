import React from "react";
import {TouchableOpacity, View} from "react-native";
import {tw} from "react-native-tailwindcss";
import {MaterialIcons} from "@expo/vector-icons";

export const Panel = ({title, children, opened = true }) => {
  const [isOpen, setIsOpen] = React.useState(opened);

  return (
    <View>
      <TouchableOpacity style={tw.flexRow} onPress={() => setIsOpen(!isOpen)}>
        <View style={tw.flex1}>
          {title}
        </View>
        <MaterialIcons name={
          isOpen ? "expand-less" : "expand-more"
        } size={24} color="black" />
      </TouchableOpacity>
      {isOpen && children}
    </View>
  )
}

export const PanelLable = ({title, children, opened = true }) => {
  const [isOpen, setIsOpen] = React.useState(opened);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <View style={[tw.flexRow, tw.itemsCenter]}>
          {title}
          <MaterialIcons name={
            isOpen ? "expand-less" : "expand-more"
          } size={24} color="black" />
        </View>
      </TouchableOpacity>
      {isOpen && children}
    </View>
  )
}