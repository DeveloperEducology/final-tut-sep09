import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have react-native-vector-icons installed
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";

const CustomHeader = ({
  title,
  isDrawer,
  onNotifyPress,
  isBackButtonVisible = false,
  isRightButtonVisible = false,
  onBackPress,
  onRightPress,
  isFavourite,
  rightTitle,
  isBookmarked,
  onFavouritePress,
  isSettings,
  onSettingsPress,
  isSearch,
  onSearchPress,
  isFilter,
  onFilterPress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {isDrawer && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
        {isBackButtonVisible && (
          <TouchableOpacity onPress={onBackPress}>
            <Icon
              name="arrow-back-outline"
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {isFavourite && (
          <TouchableOpacity onPress={onFavouritePress}>
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {isSettings && (
          <TouchableOpacity onPress={onSettingsPress}>
            <Icon
              name="settings-outline"
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {isSearch && (
          <TouchableOpacity onPress={onSearchPress}>
            <Icon
              name="search-outline"
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {isFilter && (
          <TouchableOpacity onPress={onFilterPress}>
            <Icon
              name="filter-outline"
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {isRightButtonVisible && (
          <TouchableOpacity onPress={onRightPress}>
            <Text>{rightTitle}</Text>
          </TouchableOpacity>
        )}
        {isDrawer && (
          <TouchableOpacity onPress={onNotifyPress}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute", // Position it at the top
    top: 0,
    left: 0,
    right: 0,
    height: 60, // Adjust the height as needed
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: "#fff", // Customize the background color if needed
    elevation: 4, // Add elevation for Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 2, // iOS shadow
    // zIndex: 1000, // Ensure it stays above other content
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // Adjust the spacing as needed
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15, // Adjust gap as needed
  },
  icon: {
    marginLeft: 15, // Adjust the margin as needed
  },
});

export default CustomHeader;
