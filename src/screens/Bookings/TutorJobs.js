import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
  ScrollView,
} from "react-native";
import _ from "lodash";
import moment from "moment";
import { Modalize } from "react-native-modalize";
import { Card, Icon } from "react-native-elements";
import { Searchbar, FAB, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { API_BASE_URL } from "../../config/urls";
import CustomHeader from "../../components/CustomHeader";

// Booking data converted into an array

const TutorJobs = ({ navigation, tutorJobId }) => {
  const user = useSelector((state) => state?.auth?.userData);
  console.log("user", user);
  const city = user?.city._id;
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 35],
    outputRange: [0, -45],
  });
  const inputRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = user?._id;
  const [editData, setEditData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Set the number of bookings per page
  const [totalBookings, setTotalBookings] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId, user?.token]); // Re-fetch data if userId or user.token changes
  const modalizeRef = useRef(null);

  const fetchUserData = useCallback(async (page = 1) => {
    const pageSize = 3; // or set it dynamically
    const apiUrl = `http://192.168.29.247:3000/bookings?page=${page}&pageSize=${pageSize}&city=${city}`;

    try {
      setLoading(page === 1);
      setIsFetchingMore(page > 1);

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (page === 1) {
          setBookings(data.bookings);
        } else {
          setBookings((prevBookings) => [...prevBookings, ...data.bookings]);
        }

        setTotalBookings(data.totalBookings); // Correctly update the total bookings count

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Bookings fetched successfully",
        });
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  const handleFormSuccess = () => {
    setModalVisible(false);
    userPosts();
  };

  console.log("edit data", editData);

  const onOpenModal = () => {
    modalizeRef.current?.open();
  };
  const onCloseModal = () => {
    modalizeRef.current?.close();
  };

  const renderItem = useCallback(
    ({ item, mode }) => (
      <Card containerStyle={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("BookingDetail", { tutorJob: item })
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center", // Ensure icons align vertically
            }}
          >
            <Text style={styles.headinfo}>
              Need Tuition for {item.course?.name || "N/A"}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text style={styles.info}>
                {moment(item.createdAt).fromNow()}
              </Text>
            </View>
          </View>
          <Card.Divider />
          <Text style={styles.info}>Category: {item.category.name}</Text>
          <Text style={styles.info}>
            Subjects: {item.subjects.map((sub) => sub.name).join(", ")}
          </Text>
          <Text style={styles.info}>City: {item.city.name}</Text>
          <Text style={styles.info}>Location: {item.location.name}</Text>
          <Text style={styles.info}>Tuition Type: {item.tuitionType}</Text>
          <Text style={styles.info}>Student Gender: {item.studentGender}</Text>
          <Text style={styles.info}>Tutor Gender: {item.tutorGender}</Text>
          <Text style={styles.info}>
            Number of Students: {item.numStudents}
          </Text>
          <Text style={styles.info}>
            Other Requirement: {item.otherRequirement}
          </Text>

          {/* Display the actual creation date */}
          <Text style={styles.info}>
            Posted at:{" "}
            {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </Text>

          <Text style={styles.info}>
            Class Need Days:{" "}
            {item.days.map((sub) => sub?.name).join(", ") || "No specific days"}
          </Text>
          <Card.Divider />
          {item.otherRequirement && (
            <>
              <Text style={styles.headinfo}>
                <Text style={{ color: "green" }}>Note: </Text>
                {item?.otherRequirement || "N/A"}
              </Text>
            </>
          )}
          {/* Display the "time ago" format */}
        </TouchableOpacity>
      </Card>
    ),
    [navigation] // Dependencies: renderItem will update when navigation changes
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />

      <Animated.View
        style={{
          transform: [{ translateY: translateY }],
          elevation: 4,
          zIndex: 100,
        }}
      >
        <CustomHeader
          isBackButtonVisible={false}
          title={`Jobs ${bookings.length}`}
          isSearch={true}
          isFilter={true}
          onFilterPress={onOpenModal}
          onSearchPress={() =>
            navigation.navigate("SearchScreen", { bookings: bookings })
          }
        />
      </Animated.View>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        onEndReachedThreshold={0.5} // Fetch more data when scrolled 50% to the end
        onEndReached={() => {
          if (!isFetchingMore && bookings.length < totalBookings) {
            setCurrentPage((prevPage) => prevPage + 1);
            fetchUserData(currentPage + 1);
          }
        }}
        ListFooterComponent={() =>
          isFetchingMore ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : null
        }
      />

      <View>
        <Modalize ref={modalizeRef} modalHeight={500}></Modalize>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        ></Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 6,
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 1,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 3,
  },
  list: {
    paddingBottom: 100, // To avoid FAB covering content
  },
  card: {
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    backgroundColor: "#fff",
    borderWidth: 0,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headinfo: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
    fontFamily: "Regular 400",
  },
  info: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Regular 400",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4CAF50",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // date
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    fontFamily: "Regular 400",
    marginLeft: 4,
    color: "#666",
  },
  avatar: {
    borderRadius: 50,
    marginRight: 10,
  },
});

export default TutorJobs;
