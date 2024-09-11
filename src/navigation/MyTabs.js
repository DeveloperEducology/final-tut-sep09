import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Modalize } from "react-native-modalize";
import { useNavigation } from "@react-navigation/native";
import ParentBookings from "../screens/Bookings/ParentBookings";
import TutorJobs from "../screens/Bookings/TutorJobs";
import ParentProfile from "../screens/Profiles/ParentProfile";
import TutorProfile from "../screens/Profiles/TutorProfile";
import MyDrawer from "./MyDrawer";
import TutorSearchScreen from "../screens/TutorSearch/TutorSearchScreen";
import BookamarkJobs from "../screens/BookMarkJobs/BookamarkJobs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateBooking from "../screens/Bookings/CreateBooking";
import CreateChapterBooking from "../screens/Bookings/CreateChapterBooking";
import LocationInput from "../screens/Bookings/LocationInput";


const Tab = createBottomTabNavigator();
const FormStack = createNativeStackNavigator();

function Stakess() {
  const userData = useSelector((state) => state?.auth?.userData);
  return (
    <>
      <FormStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Bookings"
      >
        <FormStack.Screen name="create" component={CreateBooking} />
        <FormStack.Screen
          name="create-chapter-booking"
          component={CreateChapterBooking}
        />
        <FormStack.Screen
          name="Bookings"
          component={
            userData?.userType === "student" ? ParentBookings : TutorJobs
          }
        />
        {/* Add other screens here */}
      </FormStack.Navigator>
    </>
  );
}

export default function MyTabs() {
  const userData = useSelector((state) => state?.auth?.userData);
  const modalizeRef = useRef(null);
  const navigation = useNavigation();

  const onOpenModal = () => {
    modalizeRef.current?.open();
  };

  const handleCreateTutorRequest = () => {
    modalizeRef.current?.close();
    navigation.navigate("create", { mode: "new" });
  };

  const handleCreateChapterExpert = () => {
    modalizeRef.current?.close();
    navigation.navigate("create-chapter-booking", { mode: "new" });
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "CreateBooking") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "Bookings") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "Bookmark") {
              iconName = focused ? "bookmark" : "bookmark-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            backgroundColor: "#f8f8f8",
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={MyDrawer}
          options={{ tabBarLabel: "", headerShown: false }}
        />
        {userData?.userType === "student" && (
          <>
            <Tab.Screen
              name="Search"
              component={TutorSearchScreen}
              options={{ tabBarLabel: "" }}
            />
            <Tab.Screen
              name="CreateBooking"
              component={View} // Use a placeholder View since the modal is used for this
              options={{
                tabBarLabel: "",
                headerShown: false,
                tabBarButton: (props) => (
                  <TouchableOpacity
                    {...props}
                    onPress={onOpenModal}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      top: -10,
                    }}
                  >
                    <Icon
                      name="add-circle-outline"
                      size={28}
                      color={
                        props.accessibilityState.selected ? "blue" : "gray"
                      }
                    />
                  </TouchableOpacity>
                ),
              }}
            />
          </>
        )}
        <Tab.Screen
          name="Bookings"
          component={Stakess}
          options={{ tabBarLabel: "", headerShown: false }}
        />
        {userData?.userType === "tutor" && (
          <Tab.Screen
            name="Bookmark"
            component={LocationInput}
            options={{ tabBarLabel: "", headerShown: false }}
          />
        )}
           <Tab.Screen
            name="Bookmark"
            component={LocationInput}
            options={{ tabBarLabel: "", headerShown: false }}
          />
        <Tab.Screen
          name="Profile"
          component={
            userData?.userType === "student" ? ParentProfile : TutorProfile
          }
          options={{ tabBarLabel: "" }}
        />
      </Tab.Navigator>

      <Modalize ref={modalizeRef} adjustToContentHeight>
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            onPress={handleCreateTutorRequest}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 18 }}>Create Tutor Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreateChapterExpert}
            style={{ padding: 10, marginTop: 10 }}
          >
            <Text style={{ fontSize: 18 }}>Create Chapter Expert</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </>
  );
}
