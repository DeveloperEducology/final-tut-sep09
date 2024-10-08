import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { CheckBox } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Modalize } from "react-native-modalize";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import Header2 from "../../components/Header2";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import MultiSelectComponent from "../../components/MultiSelectComponent";
import { Ionicons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoadingModal = ({ visible }) => (
  <Modal
    transparent={true}
    animationType="none"
    visible={visible}
    onRequestClose={() => {}}
  >
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </View>
  </Modal>
);

const CreateBooking = ({
  defaultValues,
  navigation,
  route,
  handleFormSuccess,
}) => {
  const { mode, tutorJob } = route.params;
  const tutorJobId = tutorJob?._id;
  const userData = useSelector((state) => state?.auth?.userData);
  const [booking, setBooking] = useState();
  const userId = userData?._id;
  const [selectedDate, setSelectedDate] = useState(null);

  const [selected, setSelected] = useState([]);

  const [categoriesData, setCategoriesData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [boards, setBoards] = useState([]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [pincodes, setPincodes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [area, setArea] = useState("");
  const [filterLocations, setFilterLocations] = useState(areas);

  console.log(boards);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false); // Set loading to false once data is loaded
    }, 3000); // Replace with actual data fetching
  }, []);

  const handleTextChange = (text) => {
    setArea(text);

    // Filter locations based on the input text
    if (text) {
      const filtered = areas.filter((location) =>
        location.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilterLocations(filtered);
    } else {
      setFilterLocations([]);
    }
  };

  const handleAddLocation = async () => {
    if (
      area &&
      !areas.find((loc) => loc.name.toLowerCase() === area.toLowerCase())
    ) {
      const newLocation = { name: area, cityId: selectedCity }; // Prompt for pincode if needed

      try {
        const response = await fetch("http://192.168.29.247:3000/add-area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLocation),
        });

        const data = await response.json();

        if (response.ok) {
          // Successfully added location
          setAreas([...areas, newLocation]);
          // setArea("");
          setFilterLocations([]);
          console.log("Location added:", data);
        } else {
          // Handle error
          console.error("Error adding location:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  const handleSelectLocation = (location) => {
    setArea(location.name);
    setFilterLocations([]);
  };

  const formatCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(currentDate.getDate()).padStart(2, "0"); // Add leading zero if needed

    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatCurrentDate();
  console.log(formattedDate); // Output: 2024-08-26 (or the current date)
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues || {
      userId: userId,
      tuitionType: "",
      city: "",
      location: "",
      category: "",
      course: "",
      subjects: [],
      studentGender: "",
      tutorGender: "",
      numStudents: "",
      days: [],
      otherRequirement: "",
      daysPerWeek: "",
      salery: "",
      postedDate: formattedDate,
      board: "",
    },
  });
  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);

  console.log(date);

  const modalRefs = useRef([]);

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStartConfirm = (date) => {
    setDate(date.toISOString().split("T")[0]);
    setIsDatePickerVisibility(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.29.247:3000/collections", {
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setCategoriesData(data.categories || []);
          setClassesData(data.classes || []);
          setSubjectsData(data.subjects || []);
          setCitiesData(data.cities || []);
          setLocationsData(data.locations || []);
          setBoards(data.boards || []);
          setPincodes(data.pincodes || []);
          setAreas(data.areas || []);
          console.log(data.areas);
        } else {
          const errorData = await response.json();
          Alert.alert(
            "Error",
            errorData.message || "Failed to fetch collections"
          );
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tutorJobId) {
      fetchUserData();
    }
  }, [tutorJobId]);

  // Filter locations based on selected city
  useEffect(() => {
    if (selectedCity) {
      const filtered = pincodes.filter((loc) => loc.cityId === selectedCity);
      setFilteredLocations(filtered);
    }
  }, [selectedCity, pincodes]);

  // Fetch booking data for editing
  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.247:3000/booking/${tutorJobId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        const data = res?.data;
        console.log("data test", data);
        setBooking(data);

        // Update form fields with booking data
        setValue("tuitionType", data.tuitionType);
        setValue("city", data.city);
        setValue("location", data.location);
        setValue("category", data.category);
        setValue("course", data.course);
        setValue("subjects", data.subjects);
        setSelectedSubjects(data.subjects);

        setValue("studentGender", data.studentGender);
        setValue("tutorGender", data.tutorGender);
        setValue("numStudents", data.numStudents);
        setValue("days", data.days);
        setSelectedDays(data.days);
        setDate(data.tuitionDemoDate);
        setValue("salary", data.salary),
          setValue("otherRequirement", data.otherRequirement);
        setValue("daysPerWeek", data?.daysPerWeek);
        setValue("board", data?.board);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to fetch booking");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const submitBooking = async (formData) => {
    const token = userData?.token;
    console.log(token);
    const endpoint =
      mode === "new" ? `create-booking` : `update-booking/${tutorJobId}`;
    const method = mode === "new" ? "POST" : "PUT";
    try {
      const response = await fetch(`http://192.168.29.247:3000/${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", "Booking created successfully");
        Toast.show({
          type: "success",
          text1: "Success",
          text2:
            mode === "create"
              ? "Booking created successfully"
              : "Booking updated successfully",
        });
        handleFormSuccess();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create booking");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  const onSubmit = (data) => {
    let tuitionDemoDate = date;
    const formData = {
      ...data,
      userId,
      area,
      tuitionDemoDate,
      selectedSubjects,
    };
    submitBooking(formData);
  };

  console.log(selectedSubjects);

  return (
    <ScrollView>
      <Header2
        title={mode === "new" ? "Create Tutor Request" : "Update Tutor Request"}
        isBackButtonVisible={true}
        isRightButtonVisible={true}
        onRightPress={handleSubmit(onSubmit)}
        onBackPress={() => navigation.goBack()}
      />

      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ padding: 16, gap: 10 }}>
          <View style={styles.values}>
            <MultiSelectComponent
              placeholder="Select Subjects"
              value={selectedSubjects}
              data={subjectsData}
              onChange={(item) => {
                setSelectedSubjects(item);
              }}
            />
          </View>

          <View style={styles.values}>
            <Controller
              name="tuitionType"
              style={{ backgroundColor: "#FFF" }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select type" value="" />
                  <Picker.Item label="Online" value="online" />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Group" value="group" />
                  <Picker.Item label="Institute" value="institute" />
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="board"
              style={{ backgroundColor: "#FFF" }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select Board" value="" />
                  <Picker.Item label="CBSE" value="cbse" />
                  <Picker.Item label="ICSE" value="icse" />
                  <Picker.Item label="SSC" value="ssc" />
                  <Picker.Item label="IGCSE" value="igcse" />
                  <Picker.Item label="OTHER" value="other" />
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select a Category" value="" />
                  {categoriesData.map((category) => (
                    <Picker.Item
                      key={category._id}
                      label={category.name}
                      value={category._id}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="course"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select a Course" value="" />
                  {classesData.map((course) => (
                    <Picker.Item
                      key={course._id}
                      label={course.name}
                      value={course._id}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>

          <View style={styles.values}>
            <Controller
              name="city"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => {
                    onChange(itemValue);
                    setSelectedCity(itemValue); // Update selectedCity state
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select a City" value="" />
                  {citiesData.map((city) => (
                    <Picker.Item
                      key={city._id}
                      label={city.name}
                      value={city._id}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="location"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select a Location" value="" />
                  {filteredLocations.map((item) => (
                    <Picker.Item
                      key={item._id}
                      label={`${item.name} (${item.pincode})`}
                      value={item._id}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>

          {selectedCity && (
            <View style={styles.values}>
              <TextInput
                style={styles.input}
                placeholder="Type location name"
                value={area}
                onChangeText={handleTextChange}
              />
              {filterLocations.length > 0 && (
                <FlatList
                  data={filterLocations}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectLocation(item)}
                    >
                      <Text style={styles.suggestion}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              {area &&
                filterLocations.length === 0 &&
                !areas.find(
                  (loc) => loc.name.toLowerCase() === area.toLowerCase()
                ) && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddLocation}
                  >
                    <Text style={styles.addButtonText}>
                      Add "{area}" as a new location
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
          <View style={styles.values}>
            <Controller
              name="studentGender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select Student Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Any" value="any" />
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="tutorGender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ marginBottom: 10 }}
                >
                  <Picker.Item label="Select Tutor Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Any" value="any" />
                </Picker>
              )}
            />
          </View>
          <View style={styles.values}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Tuition demo Date</Text>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                />
              )}
              <Text>{moment(date).format("DD-MM-YYYY")}</Text>

              <Button onPress={() => setShowDatePicker(true)}>
                <Ionicons
                  name="calendar"
                  size={24}
                  color="black"
                  style={styles.calendarIcon}
                />
              </Button>
            </View>
          </View>

          <View style={styles.values}>
            <Controller
              name="daysPerWeek"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="No of Days/week"
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)} // This updates the value in the form's state
                  value={value} // The current value in the form state
                  onBlur={onBlur} // This will trigger validation when the input loses focus
                />
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="otherRequirement"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="other Requirement"
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)} // This updates the value in the form's state
                  value={value} // The current value in the form state
                  onBlur={onBlur} // This will trigger validation when the input loses focus
                />
              )}
            />
          </View>
          <View style={styles.values}>
            <Controller
              name="salary"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="salary"
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)} // This updates the value in the form's state
                  value={value} // The current value in the form state
                  onBlur={onBlur} // This will trigger validation when the input loses focus
                />
              )}
            />
          </View>
        </View>
      </View>
      <LoadingModal visible={loading} />
      <Button onPress={handleSubmit(onSubmit)}>
        {mode === "new" ? "Submit" : "update"}
      </Button>

      {/* Modal components */}
      {modalRefs.current.map((modalRef, index) => (
        <Modalize key={index} ref={modalRef}>
          {/* Modal content */}
        </Modalize>
      ))}
    </ScrollView>
  );
};

export default CreateBooking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "gray" },
  step: { padding: 16 },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    // backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarIcon: {
    marginLeft: 10,
  },
  values: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#b5b0b0",
    borderRadius: 10,
    padding: 5,
  },
  chipText: { fontSize: 14, color: "#333" },
  reviewTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
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
  suggestion: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  input: {
    padding: 12,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
