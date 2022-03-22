import { StatusBar } from "react-native";
import { RkTheme } from "react-native-ui-kitten";
import { KittenTheme } from "./theme";

export const bootstrap = () => {
  RkTheme.setTheme(KittenTheme, null);

  RkTheme.setType("RkText", "basic", {
    fontFamily: theme => theme.fonts.family.regular,
    backgroundColor: "transparent",
    color: theme => theme.colors.primaryText
  });

  RkTheme.setType("RkText", "bold", {
    fontFamily: theme => theme.fonts.family.bold,
  });

  RkTheme.setType("RkText", "italic", {
    fontFamily: theme => theme.fonts.family.italic,
    color: theme => theme.colors.appColor
  });

  RkTheme.setType("RkText", "regular", {
    fontFamily: theme => theme.fonts.family.regular,
  });

  RkTheme.setType("RkText", "light", {
    fontFamily: theme => theme.fonts.family.light,
  });

  RkTheme.setType("RkText", "logo", {
    fontFamily: theme => theme.fonts.family.logo,
  });

  RkTheme.setType("RkText", "disabled", {
    color: theme => theme.colors.disabled,
  });
  RkTheme.setType("RkText", "error", {
    color: theme => theme.colors.error,
  });
  RkTheme.setType("RkText", "warning", {
    color: theme => theme.colors.warning,
  });
  RkTheme.setType("RkText", "danger", {
    color: theme => theme.colors.danger,
  });
  RkTheme.setType("RkText", "success", {
    color: theme => theme.colors.success,
  });
  RkTheme.setType("RkText", "primary", {
    color: theme => theme.colors.primary,
  });
  RkTheme.setType("RkText", "link", {
    color: theme => theme.colors.link,
  });

  // theme text styles
  RkTheme.setType("RkText", "header1", {
    fontSize: theme => theme.fonts.sizes.h1,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "header2", {
    fontSize: theme => theme.fonts.sizes.h2,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "header3", {
    fontSize: theme => theme.fonts.sizes.h3,
    fontFamily: theme => theme.fonts.family.bold,
    color: theme => theme.colors.appColor
  });
  RkTheme.setType("RkText", "header4", {
    fontSize: theme => theme.fonts.sizes.h4,
    fontFamily: theme => theme.fonts.family.bold,
    color: theme => theme.colors.appColor
  });
  RkTheme.setType("RkText", "header5", {
    fontSize: theme => theme.fonts.sizes.h5,
    fontFamily: theme => theme.fonts.family.bold,
    color: theme => theme.colors.appColor
  });
  RkTheme.setType("RkText", "header6", {
    fontSize: theme => theme.fonts.sizes.h6,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "secondary1", {
    fontSize: theme => theme.fonts.sizes.s1,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary2", {
    fontSize: theme => theme.fonts.sizes.s2,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary3", {
    fontSize: theme => theme.fonts.sizes.s3,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary4", {
    fontSize: theme => theme.fonts.sizes.s4,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary5", {
    fontSize: theme => theme.fonts.sizes.s5,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary6", {
    fontSize: theme => theme.fonts.sizes.s6,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "secondary7", {
    fontSize: theme => theme.fonts.sizes.s7,
    fontFamily: theme => theme.fonts.family.light,
  });
  RkTheme.setType("RkText", "primary1", {
    fontSize: theme => theme.fonts.sizes.p1,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "primary2", {
    fontSize: theme => theme.fonts.sizes.p2,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "primary3", {
    fontSize: theme => theme.fonts.sizes.p3,
    fontFamily: theme => theme.fonts.family.bold,
  });
  RkTheme.setType("RkText", "primary4", {
    fontSize: theme => theme.fonts.sizes.p4,
    fontFamily: theme => theme.fonts.family.bold,
  });

  RkTheme.setType("RkText", "center", {
    text: { textAlign: "center" },
  });

  /*
   RkButton types
   */

  RkTheme.setType("RkButton", "basic", {
    container: { alignSelf: "auto" },
  });

  RkTheme.setType("RkButton", "square", {
    borderRadius: 3,
    backgroundColor: theme => theme.colors.darkBlue,
    container: {
      flexDirection: "column",
      margin: 8,
    },
  });
  /*
   RkTextInput
   */

  RkTheme.setType("RkTextInput", "basic", {
    input: {
      fontFamily: theme => theme.fonts.family.regular,
      color: theme => theme.colors.primaryText,
      marginVertical: {
        ios: 4,
        android: 4,
      }

    },
    backgroundColor: theme => theme.colors.transparent,
    labelColor: theme => theme.colors.labelText,
    placeholderTextColor: theme => theme.colors.labelText,
  });

  RkTheme.setType("RkTextInput", "rounded", {
    //fontSize: theme => theme.fonts.sizes.h6,
    borderWidth: theme => theme.border.borderWidth,
    borderRadius: theme => theme.border.borderRadius,
    paddingLeft: 5,
    borderColor: theme => theme.border.borderColor,
    placeholderTextColor: theme => theme.colors.labelText,
    input: {
      marginVertical: {
        ios: 4,
        android: 4,
      },
    },
  });

  RkTheme.setType("RkTextInput", "disabled", {
    input: {
      color: theme => theme.colors.disabled,
    },
  });

  RkTheme.setType("RkTextInput", "text-area", {
    input: {
      textAlignVertical: 'top',
    },
  });

  RkTheme.setType("RkCard", "basic", {
    container: {
      borderRadius: theme => theme.colors.border.borderRadius,
      backgroundColor: theme => theme.colors.transparent,
    },
    header: {
      justifyContent: "flex-start",
      paddingVertical: 14,
    },
    content: {
      padding: 16,
    },
    footer: {
      paddingBottom: 20,
      paddingTop: 7.5,
      paddingHorizontal: 0,
    },
  });

  RkTheme.setType("RkCard", "blog", {
    header: {
      paddingHorizontal: 16,
      paddingVertical: 0,
      paddingTop: 16,
    },
    content: {
      padding: 0,
      paddingVertical: 0,
      paddingTop: 12,
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 15,
      paddingBottom: 16,
      alignItems: "center",
    },
  });

  RkTheme.setType("RkTabSet", "_base", {
    tabBar: {
      tab: {
        title: {
          base: {
            color: KittenTheme.colors.primaryText,
            fontFamily: KittenTheme.fonts.family.bold,
          },
          selected: {
            color: KittenTheme.colors.appColor,
            fontFamily: KittenTheme.fonts.family.bold,
          },
        },
      },
    },
    indicator: {
      container: {
        height: 1,
      },
      content: {
        backgroundColor: KittenTheme.colors.appColor,
      },
    },
  });

  RkTheme.setType("RkChoice", "_base", {
    inner: {
      width: 6,
      height: 6,
    },
  });

  RkTheme.setType("RkChoice", "Selected", {
    backgroundColor: 'transparent',
    inner: {
      tintColor: KittenTheme.colors.appColor,
    },
  });

  RkTheme.setType("RkChoice", "radioSelected", {
    inner: {
      tintColor: KittenTheme.colors.appColor,
    },
  });

  StatusBar.setBarStyle("dark-content", true);
};
