import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-reanimated-carousel";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUserData } from "../../redux/reducers/auth";
import store from "../../redux/store";
import { showError } from "../../utils/helperFunctions";
import RequestDemoComponent from "../../components/RequestDemoComponent";

const { dispatch } = store;

const { width } = Dimensions.get("window");

const categories = [
  { _id: "1", name: "School", value: "school", icon: "school-outline" },
  { _id: "2", name: "College", value: "college", icon: "business-outline" },
  {
    _id: "3",
    name: "Pre-School",
    value: "pre-school",
    icon: "color-filter-outline",
  },
  { _id: "4", name: "Art", value: "art", icon: "musical-notes-outline" },
  {
    _id: "5",
    name: "Engineering",
    value: "engineering",
    icon: "build-outline",
  },
  { _id: "6", name: "Medical", value: "medical", icon: "fitness-outline" },
  { _id: "7", name: "IIT-JEE", value: "IIT_JEE", icon: "newspaper-outline" },
  { _id: "8", name: "NEET", value: "neet", icon: "nutrition-outline" },
];

const testimonials = [
  {
    id: "1",
    name: "Mr. John Doe",
    image:
      "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
    text: "I had the pleasure of being tutored by Mr. John Doe for my high school math courses, and I can confidently say that he is one of the best teachers I've ever had.",
  },
  {
    id: "2",
    name: "Ms. Jane Smith",
    image:
      "https://th.bing.com/th/id/OIP.0yi26fO0azz9oRCE5I59zgHaE8?w=285&h=190&c=7&r=0&o=5&pid=1.7",

    text: "Ms. Jane Smith helped me improve my writing skills tremendously. Her guidance and support were invaluable.",
  },
  {
    id: "3",
    name: "Mr. Alex Johnson",
    image: "https://example.com/image3.jpg",
    text: "Mr. Alex Johnson's lessons were always engaging and insightful. He made learning physics fun and understandable.",
  },
  // Add more testimonials as needed
];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({ navigation }) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  console.log(userData);
  const onLogout = () => {
    AsyncStorage.removeItem("userData")
      .then((res) => {
        console.log("user remove suceessfully..!!");
        dispatch(saveUserData({}));
      })
      .catch((error) => {
        showError("Data not found");
      });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Welcome, Student", // Add your desired title here
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const toggleCategories = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAllCategories(!showAllCategories);
  };

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 2);

  const tutorCategories = [
    {
      name: "Applied",
      length: 2,
    },
    {
      name: "Short Listed",
      length: 3,
    },
    {
      name: "Demo Taken",
      length: 5,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Carousel */}
        <View style={styles.imageContainer}>
          <Carousel
            fadeAnim
            width={width}
            height={width / 2}
            autoPlay={true}
            data={[
              "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=195&h=195&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.0yi26fO0azz9oRCE5I59zgHaE8?w=285&h=190&c=7&r=0&o=5&pid=1.7",
              "https://th.bing.com/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?w=166&h=196&c=7&r=0&o=5&pid=1.7",
            ]}
            scrollAnimationDuration={2000}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image style={styles.carouselImage} source={{ uri: item }} />
              </View>
            )}
          />
        </View>
        {/* Categories */}
        {userData?.userType === "student" && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={toggleCategories}>
              <Text style={styles.viewAllText}>
                {showAllCategories ? "Show Less" : "View All"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {userData?.userType === "tutor" ? (
          <View style={styles.categoriesContainer}>
            {tutorCategories.map((category) => (
              <View key={category._id} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{category.length}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            {displayedCategories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={styles.categoryButton}
                onPress={() =>
                  navigation.navigate("catwisetutors", {
                    categoryId: category._id,
                  })
                }
              >
                <Icon name={category.icon} size={30} color="#fff" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {userData?.userType === "student" && (
          <RequestDemoComponent
            name={userData?.userName}
            title={"Request A Free Demo Class Now"}
            onDemoPress={() => navigation.navigate("create", { mode: "new" })}
          />
        )}

        {/* Testimonials */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Testimonials</Text>
          <TouchableOpacity onPress={showModal}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            data={testimonials}
            scrollAnimationDuration={10000}
            renderItem={({ item }) => (
              <View style={styles.TestcarouselItem}>
                <View style={{ width: "20%" }}>
                  <Image
                    style={styles.TestcarouselImage}
                    source={{ uri: item.image }}
                  />
                  <Text>{item.name}</Text>
                </View>
                <View style={{ width: "80%" }}>
                  <Text>{item.text}</Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Modal for Viewing All Testimonials */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={hideModal}
        >
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[styles.modalContent, { opacity: fadeAnim }]}
                >
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={hideModal}>
                      <Icon name="arrow-back" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>All Testimonials</Text>
                  </View>
                  <ScrollView>
                    {testimonials.map((testimonial) => (
                      <View key={testimonial.id} style={styles.testimonialItem}>
                        <Image
                          style={styles.modalTestimonialImage}
                          source={{ uri: testimonial.image }}
                        />
                        <View style={styles.testimonialTextContainer}>
                          <Text style={styles.testimonialName}>
                            {testimonial.name}
                          </Text>
                          <Text>{testimonial.text}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 40,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3D3D3D",
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  categoryButton: {
    width: "43%",
    alignItems: "center",
    backgroundColor: "#6200ea",
    borderRadius: 12,
    padding: 15,
    marginVertical: 7,
    elevation: 3,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    marginVertical: 20,
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  TestcarouselItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  TestcarouselImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  testimonialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  modalTestimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  testimonialTextContainer: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
