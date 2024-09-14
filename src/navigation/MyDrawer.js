// MyDrawer.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/Home/HomeScreen";
import CustomHeader from "../components/CustomHeader";
import { Button, View } from "react-native";
import CreateBooking from "../screens/Bookings/CreateBooking";
import MyTabs from "./MyTabs";
import ParentDetailForm from "../screens/ParentDetailForm/ParentDetailForm";

const Drawer = createDrawerNavigator();
function Article({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="Go to notifications"
      />
    </View>
  );
}
export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="Article"
        component={Article}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="ParentDetailForm"
        component={ParentDetailForm}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}
