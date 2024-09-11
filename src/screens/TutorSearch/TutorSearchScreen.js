import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const TutorSearchScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15 }}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View>
      <Text>TutorSearchScreen</Text>
    </View>
  );
};

export default TutorSearchScreen;

const styles = StyleSheet.create({});
