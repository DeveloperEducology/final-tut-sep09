import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import actions from "../../redux/actions";
import { useSelector } from "react-redux"; // Assuming you're using Redux for userData

export default function ParentDetailForm({ profile }) {
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [whatsAppNumber, setWhatsAppNumber] = useState(
    profile?.whatsAppNumber || ""
  );
  const [email, setEmail] = useState(profile?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [city, setCity] = useState(profile?.city || "");
  const [pinCode, setPinCode] = useState(profile?.pinCode || "");
  const [schoolName, setSchoolName] = useState(profile?.schoolName || "");
  const [board, setBoard] = useState(profile?.board || "");
  const [medium, setMedium] = useState(profile?.medium || "");
  const [guardianName, setGaurdianName] = useState(profile?.guardianName || "");
  const [guardianContact, setGaurdianContact] = useState(
    profile?.guardianContact || ""
  );
  const [guardianRelation, setGaurdianRelation] = useState(
    profile?.guardianRelation || ""
  );
  const [date, setDate] = useState(profile?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [citiesData, setCitiesData] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [schools, setSchools] = useState([]);
  const [filterLocations, setFilterLocations] = useState(schools);
  const [newSchool, setNewSchool] = useState(profile?.newSchool || "");
 
  const userData = useSelector((state) => state.userData); // Fetch userData from Redux store

  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    try {
      const res = await actions.getCollections();
      setCitiesData(res.cities || []);
      setPincodeData(res.pincodes || []);
      setBoards(res.boards || []);
      setSchools(res.schools || []);
    } catch (error) {
      console.log("Error in getting collections:", error);
    }
  };

  const handleTextChange = (text) => {
    setNewSchool(text);

    // Filter locations based on the input text
    if (text) {
      const filtered = schools.filter((location) =>
        location.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilterLocations(filtered);
    } else {
      setFilterLocations([]);
    }
  };

  const handleAddLocation = async () => {
    if (
      setNewSchool &&
      !schools.find(
        (loc) => loc.name.toLowerCase() === setNewSchool.toLowerCase()
      )
    ) {
      const newLocation = { name: newSchool, cityId: city }; // Prompt for pincode if needed

      try {
        const response = await fetch("http://192.168.29.247:3000/add-school", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLocation),
        });

        const data = await response.json();

        if (response.ok) {
          // Successfully added location
          setSchools([...schools, newLocation]);
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

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Function to submit form data
  const handleSubmit = async () => {
    const formData = {
      firstName,
      lastName,
      whatsAppNumber,
      email,
      dateOfBirth: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      gender,
      city,
      pinCode,
      schoolName,
      board,
      medium,
      guardianName,
      guardianContact,
      guardianRelation,
    };

    try {
      const response = await fetch("http://192.168.29.247:3000/parent-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${userData.token}`, // Attach userData token here
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Form submitted successfully");
      } else {
        Alert.alert("Error", result.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Error in form submission:", error);
      Alert.alert("Error", "Could not submit form");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>General Details</Text>
      {currentStep === 1 && (
        <View>
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
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={date.toISOString().split("T")[0]} // Display the formatted date
                editable={false} // Prevent direct editing
                placeholder="DD-MM-YYYY"
              />
              <Ionicons
                name="calendar"
                size={24}
                color="black"
                style={styles.calendarIcon}
                onPress={() => setShowDatePicker(true)}
              />
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
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Select City *</Text>
            <Picker
              selectedValue={city}
              style={styles.picker}
              onValueChange={(itemValue) => setCity(itemValue)}
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
            <Text style={styles.label}>Select Pincode *</Text>
            <Picker
              selectedValue={pinCode}
              style={styles.picker}
              onValueChange={(itemValue) => setPinCode(itemValue)}
            >
              <Picker.Item label="Select Pincode" value="" />
              {pincodeData.map((item) => (
                <Picker.Item
                  key={item._id}
                  label={`${item.name} (${item.pincode})`}
                  value={item._id}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentStep === 2 && (
        <View>
          <Text style={styles.title}>Educational Details</Text>
          <TextInput placeholder="Enter school name" style={styles.input} />
          <Picker
            selectedValue={"Select Board"}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) => console.log(itemValue)}
          >
            <Picker.Item label="Select Board" value="Select Board" />
            <Picker.Item label="CBSE" value="cbse" />
            <Picker.Item label="SSC" value="ssc" />
            <Picker.Item label="ICSE" value="icse" />
          </Picker>
          <Picker
            selectedValue={"Select Medium"}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) => console.log(itemValue)}
          >
            <Picker.Item label="Select Medium" value="Select Medium" />
            <Picker.Item label="Telugu" value="telugu" />
            <Picker.Item label="English" value="english" />
            <Picker.Item label="Urdu" value="urdu" />
            <Picker.Item label="Others" value="others" />
          </Picker>
          <TextInput placeholder="Enter guardian name" style={styles.input} />
          <Picker
            selectedValue={"Select Guardian Relation"}
            style={styles.input}
            onValueChange={(itemValue, itemIndex) => console.log(itemValue)}
          >
            <Picker.Item
              label="Select Guardian Relation"
              value="Select Guardian Relation"
            />
            <Picker.Item label="Father" value="father" />
            <Picker.Item label="Mother" value="mother" />
            <Picker.Item label="Brother" value="brother" />
            <Picker.Item label="Sister" value="sister" />
          </Picker>
          <TextInput
            placeholder="Enter guardian contact number"
            style={styles.input}
          />
          <TextInput placeholder="Enter your address" style={styles.input} />
          <View style={styles.values}>
            <TextInput
              style={styles.input}
              placeholder="Type Scool name"
              value={newSchool}
              onChangeText={handleTextChange}
            />
            {filterLocations.length > 0 && (
              <FlatList
                data={filterLocations}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectLocation(item)}>
                    <Text style={styles.suggestion}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {newSchool &&
              filterLocations.length === 0 &&
              !schools.find(
                (loc) => loc.name.toLowerCase() === newSchool.toLowerCase()
              ) && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddLocation}
                >
                  <Text style={styles.addButtonText}>
                    Add "{newSchool}" as a new school
                  </Text>
                </TouchableOpacity>
              )}
          </View>
          <TouchableOpacity onPress={prevStep} style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginLeft: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#a100ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  suggestion: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
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
});
