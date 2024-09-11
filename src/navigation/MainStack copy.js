import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomHeader from "../components/CustomHeader";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Article() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Article Screen</Text>
    </View>
  );
}

const MyStacks = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MyTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MyTabs" component={MyTabs} />
        <Stack.Screen
          name="CatWiseTutors"
          component={CatWiseTutors}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create-Booking"
          component={CreateBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create-Chapter-Booking"
          component={ChapterBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingDetail"
          component={BookingDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookmarkedJobs"
          component={BookmarkedJobs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast position="bottom" />
    </>
  );
};

function MyDrawer() {
  const userData = useSelector((state) => state?.auth?.userData);

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name={"Welcome, " + userData.userName}
        component={HomeScreen}
        screenOptions={{
          header: (props) => (
            <CustomHeader
              isDrawer={true}
              {...props}
              title={"Welcome, " + userData.userName}
            />
          ), // Use your custom header
        }}
      />
      <Drawer.Screen
        name="Article"
        component={Article}
        screenOptions={{ headerShown: false }}
      />
      {/* Add other drawer screens */}
    </Drawer.Navigator>
  );
}
export default function MainStack() {
  return <MyDrawer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
