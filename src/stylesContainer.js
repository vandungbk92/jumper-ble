import { RkStyleSheet } from "react-native-ui-kitten";
import { StyleSheet, Dimensions } from "react-native";
import { KittenTheme } from "../config/theme";
import { PLATFORM_IOS } from "./constants/variable";
const dimensions = Dimensions.get("window");
const imageWidth = dimensions.width - 30;
const imageHeight = Math.round(imageWidth * 9 / 16);

export const styleContainer = RkStyleSheet.create(theme => ({
  containerContent: {
    backgroundColor: "#fff",
    flex: 1
  },
  header: {
    backgroundColor: "#fff"
  },
  body: {
    flex: 4,
    alignItems: "center"
  },
  icon: {
    color: "#db3839",
    fontSize: 20
  },
  textSaveReject: {
    //fontSize: 25,
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#da3839"
  },
  buttonHeader: {
    alignSelf: "stretch",
    //textAlign: "center",
  },
  titleScreen: {
    color: "#db3839",
    justifyContent: "center",
    alignItems: "center",
    //fontSize: CONSTANTS.BIGGER,
    //fontWeight: "bold"
  },
  error: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconFavorite: {
    height: 18,
    width: 18
  },
  helpLinkText: {
    //fontSize: 14,
    color: "#2e78b7",
  },
  statusWaitConfirm: {
    backgroundColor: "#f5302e",
    color: "#fff",
    borderWidth: 0.5,
    borderColor: "#f5302e",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  statusReject: {
    backgroundColor: "#c69500",
    color: "#fff",
    borderWidth: 0.5,
    borderColor: "#c69500",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  statusConfirmed: {
    backgroundColor: "#2eadd3",
    color: "#fff",
    borderWidth: 0.5,
    borderColor: "#2eadd3",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  statusPublic: {
    backgroundColor: "#379457",
    color: "#fff",
    borderWidth: 0.5,
    borderColor: "#379457",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: "center",
  },
  rkCardImg: {
    height: 150//imageHeight
  },
  buttonGradient: {
    marginVertical: 10,
    height: 50,
    backgroundColor: theme.colors.appColor
  },
  buttonGradientSecond: {
    marginVertical: 10,
    height: 40,
    backgroundColor: theme.colors.appColor
  },
  sizeTextLarge: {
    //fontSize: CONSTANTS.LARGE
  },
  sizeTextNormal: {
    //fontSize: CONSTANTS.NORMAL
  },
  sizeTextSmall: {
    //fontSize: CONSTANTS.SMALL
  },
  sizeTextTiny: {
    //fontSize: CONSTANTS.TINY
  },
  timeAndStatus: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center",
    marginBottom: 10
  },
  border: {
    borderStyle: "solid",
    borderWidth: 1,//StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    borderRadius: 5,
  },
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerButton: {
    paddingVertical: PLATFORM_IOS ? 0 : 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: KittenTheme.colors.primaryText,
  },
  overlay: {
    justifyContent: "flex-end",
    maxHeight: imageHeight
  },
  boxShadow: {
    shadowColor:PLATFORM_IOS? KittenTheme.colors.blueGray : KittenTheme.colors.blueGray_1,
    shadowOffset: {
      width: 0,
      height: PLATFORM_IOS ? 5 : 1,
    },
    shadowOpacity: PLATFORM_IOS ? 0.34 : 0.22,
    shadowRadius: PLATFORM_IOS ? 6.27 : 2.22,

    elevation: PLATFORM_IOS ? 10 : 3,
  }
}))
