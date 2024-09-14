// MainStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import MyTabs from "./MyTabs";
import CreateBooking from "../screens/Bookings/CreateBooking";
import CategoryWiseTutors from "../screens/Tutors/CategoryWiseTutors";
import { useSelector } from "react-redux";
import CreateChapterBooking from "../screens/Bookings/CreateChapterBooking";
import ParentBookings from "../screens/Bookings/ParentBookings";
import TutorJobs from "../screens/Bookings/TutorJobs";
import CreateProfile from "../screens/Profiles/CreateProfile";

const Stack = createNativeStackNavigator();

const FormStack = createNativeStackNavigator();

function Stakess() {
  const userData = useSelector((state) => state?.auth?.userData);
  return (
    <>
      <FormStack.Navigator
        screenOptions={{ headerShown: true }}
        initialRouteName="Bookings"
      >
        <FormStack.Screen
          name="create"
          component={CreateBooking}
          options={{ headerShown: false }}
        />
        <FormStack.Screen
          name="create-profile"
          component={CreateProfile}
          options={{ headerShown: true }}
        />
        <FormStack.Screen
          name="create-chapter-booking"
          component={CreateChapterBooking}
          options={{ headerShown: false }}
        />
        <FormStack.Screen
          name="Bookings"
          component={
            userData?.userType === "student" ? ParentBookings : TutorJobs
          }
        />
        <FormStack.Screen name="catwisetutors" component={CategoryWiseTutors} />
        {/* Add other screens here */}
      </FormStack.Navigator>
    </>
  );
}

function MyStacks() {
  return (
    <>
      <Stack.Navigator
        initialRouteName="MyTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Mytabs" component={MyTabs} />
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
