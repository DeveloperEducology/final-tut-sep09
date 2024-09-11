import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

const Header2 = ({
  navigation,
  isBackButtonVisible = false,
  isRightButtonVisible = false,
  onBackPress,
  onRightPress,
  title,
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
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
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

          <Text style={styles.welcomeText}>{title}</Text>
        </View>
        {isRightButtonVisible && (
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={onRightPress}>
              <Button>{rightTitle}</Button>
            </TouchableOpacity>
          </View>
        )}
        {isFavourite && (
          <TouchableOpacity onPress={onFavouritePress}>
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark-outline"} // Ensure this matches an icon in your library
              size={28}
              color="#333"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: "row", gap: 5 }}>
          {isSettings && (
            <TouchableOpacity onPress={onSettingsPress}>
              <Icon
                name={isSettings ? "settings" : "settings-outline"} // Ensure this matches an icon in your library
                size={28}
                color="#333"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          {isSearch && (
            <TouchableOpacity onPress={onSearchPress}>
              <Icon
                name={isSettings ? "search" : "search-outline"} // Ensure this matches an icon in your library
                size={28}
                color="#333"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          {isFilter && (
            <TouchableOpacity onPress={onFilterPress}>
              <Icon
                name={isSettings ? "filter" : "filter-outline"} // Ensure this matches an icon in your library
                size={28}
                color="#333"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header2;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
    // backgroundColor: "#fff",
    // elevation: 4,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 3,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
});
