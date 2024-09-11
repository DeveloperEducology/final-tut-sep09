// MainStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import MyTabs from "./MyTabs";
import CreateBooking from "../screens/Bookings/CreateBooking";

const Stack = createNativeStackNavigator();
const FormStack = createNativeStackNavigator();

export default function Stakess() {
  return (
    <>
      <FormStack.Navigator screenOptions={{ headerShown: false }}>
        <FormStack.Screen name="create" component={CreateBooking} />
        {/* Add other screens here */}
      </FormStack.Navigator>
      <Toast position="bottom" />
    </>
  );
}

function MyStacks() {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainTabs" component={MyTabs} />
        <Stack.Screen name="Stakess" component={Stakess} />
        {/* Add other screens here */}
      </Stack.Navigator>
      <Toast position="bottom" />
    </>
  );
}

export default function MainStack() {
  return <MyStacks />;
}
