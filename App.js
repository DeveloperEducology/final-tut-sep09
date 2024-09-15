import { GestureHandlerRootView } from "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import * as React from "react";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { saveUserData } from "./src/redux/reducers/auth";
import store from "./src/redux/store";
import { getData } from "./src/utils/helperFunctions";
import notifee from "@notifee/react-native";

const { dispatch } = store;

export default function App() {
  React.useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      let data = await getData("userData");
      console.log("stored data", data);
      if (!!data) {
        dispatch(saveUserData(JSON.parse(data)));
      }
    } catch (error) {
      console.log("no data found");
    }
  };
  React.useEffect(() => {
    getFCMToken();
  }, []);

  async function getFCMToken() {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    // Store or send the token to your server
  }

  // Handle incoming messages
  messaging().onMessage(async (remoteMessage) => {
    console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
