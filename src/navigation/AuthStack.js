// navigation/AuthStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import OTPScreen from "../screens/auth/OTPScreen";
import PhoneLoginScreen from "../screens/auth/PhoneLoginScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animationTypeForReplace: "push",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        component={SignUpScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animationTypeForReplace: "push",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="phone-login"
        component={PhoneLoginScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animationTypeForReplace: "push",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
        />
      <Stack.Screen
        name="otp"
        component={OTPScreen}
        options={{
          headerShown: false,
          presentation: "modal",
          animationTypeForReplace: "push",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
