import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { ProgressStep, ProgressSteps } from "../../components/ProgressSteps";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import MultiSelectComponent from "../../components/MultiSelectComponent";
import actions from "../../redux/actions";
import SingleSelectDropdown from "../../components/SingleSelectDropdown";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";

const ProfileInfoSection = ({
  title,
  information,
  handleChange,
  editableField,
  handleEdit,
}) => (
  <View style={styles.formGroup}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {Object.keys(information).map((field, index) => (
      <View>
        <Text style={styles.label}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </Text>
        <TextInput
          style={styles.input}
          value={information[field]}
          onChangeText={(text) => handleChange(field, text)}
        />
      </View>
    ))}
  </View>
);

const CreateProfile = ({ route, navigation, profile }) => {
  // const { profile, mode } = route.params;
  // const [formData, setFormData] = useState(profile);
  const userData = useSelector((state) => state?.auth?.userData);
  const [firstName, setFirstName] = useState(
    profile?.basicInfo?.firstName || ""
  );
  const [lastName, setLastName] = useState(profile?.basicInfo?.lastName || "");
  const [whatsAppNumber, setWhatsAppNumber] = useState(
    profile?.basicInfo?.whatsAppNumber || ""
  );

  const [gender, setGender] = useState(profile?.basicInfo?.gender || "");
  const [date, setDate] = useState(profile?.basicInfo?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(
    profile?.otherInfo?.preferredSubjects || []
  );
  const [selectedCategory, setSelectedCategory] = useState(
    profile?.otherInfo?.preferredCategories || []
  );
  const [selectedClass, setSelectedClass] = useState(
    profile?.otherInfo?.preferredClasses || []
  );
  const [myCity, setMyCity] = useState(profile?.otherInfo?.city || null);
  const [myLocation, setMyLocation] = useState(
    profile?.otherInfo?.location || null
  );

  // console.log("profile data in tutor profile create/edit page", formData);
  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    try {
      const res = await actions.getCollections();

      setCategoriesData(res.categories || []);
      setClassesData(res.classes || []);
      setSubjectsData(res.subjects || []);
      setCitiesData(res.cities || []);
      setLocationsData(res.locations || []);
      setBoards(res.boards || []);
      setPincodeData(res.pincodes || []);
      setAreas(res.areas || []);
    } catch (error) {
      console.log("Error in getting collections:", error);
    }
  };

  const [preferPincodes, setPreferPincodes] = useState([]);
  const [selectMode, setSelectMode] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [boards, setBoards] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState(pincodeData);
  const [filterLocations, setFilterLocations] = useState([]);

  // Personal Information
  const [personalInformation, setPersonalInformation] = useState({
    additionalNumber: "54554",
    gender: "male",
    dateOfBirth: "12-12-12",
    religion: "hind",
    nationality: "indian",
    fathersName: "san",
    fathersNumber: "55454654",
    mothersName: "pad",
    mothersNumber: "5545",
    overview: "fdfdsfd",
  });

  // Emergency Information
  const [emergencyInformation, setEmergencyInformation] = useState({
    name: "shiva",
    number: "0000",
    relation: "god",
    address: "kailasam",
  });

  // Address Information
  const [address, setAddress] = useState({
    street: "road nno 4",
    city: "Hyderabad",
    state: "Telagnana",
    postalCode: "500063",
    country: "India",
  });

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInformation((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyInfoChange = (field, value) => {
    setEmergencyInformation((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Validation before proceeding to next step
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!firstName) return "Please enter your first name.";
        if (!lastName) return "Please enter your last name.";
        if (!whatsAppNumber) return "Please enter your WhatsApp number.";
   
        if (!gender) return "Please select your gender.";
        return null;
      default:
        return null;
    }
  };

  const teachModes = [
    {
      _id: "1",
      name: "online",
    },
    {
      _id: "2",
      name: "offline",
    },
    {
      _id: "3",
      name: "home",
    },
    {
      _id: "4",
      name: "institute",
    },
    {
      _id: "5",
      name: "School/college",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handlePreviousStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };
  // Handlers for step navigation
  const handleNextStep = () => {
    const error = validateStep();
    if (error) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: error,
      });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  // Filter locations based on selected city
  const [filteredLocations, setFilteredLocations] = useState([]);
  useEffect(() => {
    if (myCity) {
      const filtered = pincodeData.filter((loc) => loc.cityId === myCity);
      setFilteredLocations(filtered);
    }
  }, [myCity, pincodeData]);

  const handleTextChange = (text) => {
    setQuery(text);

    // Filter locations based on the input text
    if (text) {
      const filtered = locations.filter((location) =>
        location.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleAddLocation = () => {
    if (
      query &&
      !locations.find((loc) => loc.name.toLowerCase() === query.toLowerCase())
    ) {
      const newLocation = { name: query, pincode: "" }; // You can prompt for pincode if needed
      setLocations([...locations, newLocation]);
      //   setQuery("");
      setFilteredLocations([]);
    }
  };

  const handleSelectLocation = (location) => {
    setQuery(location.name);
    setFilteredLocations([]);
  };

  // Submit handler
  const handleSubmit = async () => {
    const profileData = {
      userId: userData?._id,
      basicInfo: {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        whatsAppNumber: whatsAppNumber,
        dateOfBirth: date,
      },
      otherInfo: {
        preferredCategories: selectedCategory,
        preferredClasses: selectedClass,
        preferredSubjects: selectedSubjects,
        preferredLocations: preferPincodes,
        location: myLocation,
        city: myCity,
      },
      address,
      personalInformation,
      emergencyInformation,
    };

    try {
      const response = await fetch(
        `http://192.168.29.247:3000/create-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile created successfully",
        });
        navigation.navigate("profile-verify"); // Replace "Home" with your desired screen
      } else {
        Alert.alert("Error", data.message || `Failed to create profile`);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressSteps activeStep={activeStep}>
        {/* Step 1: Basic Information */}
        <ProgressStep
          label="Basic Info"
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          nextBtnText="Next"
          previousBtnText="Back"
          isFirstStep
        >
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text style={styles.header}>General Details</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>WhatsApp Number *</Text>
              <TextInput
                style={styles.input}
                value={whatsAppNumber}
                onChangeText={setWhatsAppNumber}
                placeholder="Enter your WhatsApp number"
                keyboardType="phone-pad"
              />
            </View>

            

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Birth *</Text>
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateText}>
                  {moment(date).format("DD-MM-YYYY")}
                </Text>
                <Ionicons
                  name="calendar"
                  size={24}
                  color="black"
                  onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Gender *</Text>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </ScrollView>
        </ProgressStep>

        {/* Step 2: Tuition Information */}
        <ProgressStep
          label="Tuition"
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          nextBtnText="Next"
          previousBtnText="Back"
        >
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <MultiSelectComponent
              placeholder="Select Teaching Mode"
              value={selectMode}
              data={teachModes}
              onChange={(item) => {
                setSelectMode(item);
              }}
            />
            <MultiSelectComponent
              placeholder="Select Categories"
              value={selectedCategory}
              data={categoriesData}
              onChange={(item) => {
                setSelectedCategory(item);
              }}
              isMultiSelect={false} // Allow multiple selections
            />
            <MultiSelectComponent
              placeholder="Select Classes"
              value={selectedClass}
              data={classesData}
              onChange={(item) => {
                setSelectedClass(item);
              }}
              isMultiSelect={true} // Allow multiple selections
            />
            <MultiSelectComponent
              placeholder="Select Subjects"
              value={selectedSubjects}
              data={subjectsData}
              onChange={(item) => {
                setSelectedSubjects(item);
              }}
            />
            <View style={styles.formGroup}>
              <Text style={styles.label}>Select City *</Text>
              <Picker
                selectedValue={myCity}
                style={styles.picker}
                onValueChange={(itemValue) => setMyCity(itemValue)}
              >
                <Picker.Item label="Select City" value="" />
                {citiesData.map((item) => (
                  <Picker.Item
                    key={item._id}
                    label={`${item.name}`}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Location *</Text>
              <Picker
                selectedValue={myLocation}
                style={styles.picker}
                onValueChange={(itemValue) => setMyLocation(itemValue)}
              >
                <Picker.Item label="Select Location" value="" />
                {filteredLocations.map((item) => (
                  <Picker.Item
                    key={item._id}
                    label={`${item.name} (${item.pincode})`}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.formGroup}>
              <MultiSelectComponent
                placeholder="select prefer locations"
                data={pincodeData}
                value={preferPincodes}
                onChange={(item) => {
                  setPreferPincodes(item);
                }}
                mode="modal"
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Type location name"
                value={query}
                onChangeText={handleTextChange}
              />
              {filteredLocations.length > 0 && (
                <FlatList
                  data={filteredLocations}
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
              {query &&
                filteredLocations.length === 0 &&
                !locations.find(
                  (loc) => loc.name.toLowerCase() === query.toLowerCase()
                ) && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddLocation}
                  >
                    <Text style={styles.addButtonText}>
                      Add "{query}" as a new location
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          </ScrollView>
        </ProgressStep>

        {/* Step 3: Personal & Emergency Information */}

        <ProgressStep
          label="Personal Info"
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          nextBtnText="Next"
          previousBtnText="Back"
        >
          <ScrollView>
            <ProfileInfoSection
              title="Personal Information"
              information={personalInformation}
              handleChange={handlePersonalInfoChange}
            />
            <ProfileInfoSection
              title="Emergency Information"
              information={emergencyInformation}
              handleChange={handleEmergencyInfoChange}
            />
            <ProfileInfoSection
              title="Address Information"
              information={address}
              handleChange={handleAddressChange}
            />
          </ScrollView>
        </ProgressStep>

        {/* Step 4: Review and Submit */}
        <ProgressStep
          label="Review"
          onPrevious={handlePreviousStep}
          finishBtnText="Submit"
          onSubmit={handleSubmit}
          previousBtnText="Back"
          isLastStep
        >
          {/* Review and Submit form goes here */}
          <Button onPress={handleSubmit}>submitButton</Button>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});

export default CreateProfile;
