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
  TextInput,
  Modal,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { Searchbar, FAB, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import moment from "moment";
import { Modalize } from "react-native-modalize";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_BASE_URL } from "../../config/urls";
// Booking data converted into an array

const ParentBookings = ({ navigation, tutorJobId }) => {
  const user = useSelector((state) => state?.auth?.userData);
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = user?._id;
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState([]);
  const [editData, setEditData] = useState();
  const [loading, setLoading] = useState(false);

  // Memoize the derived data if necessary
  const derivedData = useMemo(() => {
    return formData.map((booking) => ({
      ...booking,
      formattedDate: new Date(booking.date).toLocaleDateString(),
    }));
  }, [formData]);

  useEffect(() => {
    fetchUserData();
  }, [userId, user?.token]); // Re-fetch data if userId or user.token changes
  const modalizeRef = useRef(null);

  const fetchUserData = useCallback(async () => {
    const forStudent = `http://192.168.29.247:3000/bookings/${userId}`;
    const forTutor = `http://192.168.29.247:3000/bookings`;

    try {
      setLoading(true);
      const response = await fetch(
        user?.userType === "tutor" ? forTutor : forStudent,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(data.bookings || []);
        console.log("Fetched bookings:", data.bookings);
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
    }
  }, [userId, user?.token]); // Dependencies: fetchUserData will update when userId or user.token changes

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://192.168.29.247:3000/booking/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Assuming you're using JWT
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Booking deleted successfully");
        fetchUserData();
      } else {
        alert(result.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
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

            {user?.userType === "student" && item.userId === user._id && (
              <View style={styles.iconContainer}>
                {/* Edit Icon */}
                <Icon
                  name="edit"
                  type="font-awesome"
                  color="#1E90FF"
                  size={24}
                  onPress={() =>
                    navigation.navigate("Stakess", {
                      screen: "create",
                      params: { mode: "edit", tutorJob: item },
                    })
                  }
                />

                {/* Delete Icon */}
                <Icon
                  name="trash"
                  type="font-awesome"
                  color="red"
                  size={24}
                  onPress={() => handleDeleteBooking(item._id)}
                  containerStyle={{ marginLeft: 15 }} // Add some spacing between the icons
                />
              </View>
            )}
          </View>
          <Card.Divider />
          <Text style={styles.info}>Category: {item.category.name}</Text>
          <Text style={styles.info}>
            Subjects: {item.subjects.map((sub) => sub.name).join(", ")}
          </Text>
          <Text style={styles.info}>City: {item.city.name}</Text>
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
          {/* Display the "time ago" format */}
          <Text style={styles.info}>
            Posted: {moment(item.createdAt).fromNow()}
          </Text>
        </TouchableOpacity>
      </Card>
    ),
    [navigation] // Dependencies: renderItem will update when navigation changes
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <FlatList
        data={derivedData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      <View>
        <Modalize ref={modalizeRef} modalHeight={500}></Modalize>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        ></Modal>
      </View>
    </SafeAreaView>
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
    justifyContent: "space-between",
  },
  datePicker: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#007bff",
    marginBottom: 5,
  },
  dateInput: {
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default ParentBookings;
