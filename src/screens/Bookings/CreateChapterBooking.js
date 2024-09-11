import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Header2 from "../../components/Header2";
import { Picker } from "@react-native-picker/picker";
Picker

const dummyData = {
  "Class 11": {
    Math: ["Algebra", "Trigonometry", "Statistics"],
    Physics: ["Kinematics", "Laws of Motion", "Thermodynamics"],
    Chemistry: ["Atomic Structure", "Chemical Bonding", "Thermochemistry"],
  },
  "Class 12": {
    Math: ["Calculus", "Probability", "Vectors"],
    Physics: ["Electrostatics", "Magnetism", "Optics"],
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
  },
  "IIT": {
    Math: ["Coordinate Geometry", "Complex Numbers", "Integral Calculus"],
    Physics: ["Mechanics", "Electricity and Magnetism", "Modern Physics"],
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
  },
};

const CreateChapterBooking = ({ navigation }) => {
  const { control, handleSubmit, watch } = useForm();
  const selectedClass = watch("class");
  const selectedSubject = watch("subject");

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };



  return (
    <View style={styles.container}>
      <Header2
        title="Create Booking"
        isBackButtonVisible={true}
        isRightButtonVisible={true}
        onRightPress={handleSubmit(onSubmit)}
        onBackPress={() => navigation.goBack()}
        rightTitle="Submit"
      />

      {/* Select Class */}
      <Text style={styles.label}>Select Class</Text>
      <Controller
        name="class"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a class" value="" />
            {Object.keys(dummyData).map((className) => (
              <Picker.Item key={className} label={className} value={className} />
            ))}
          </Picker>
        )}
      />

      {/* Select Subject */}
      {selectedClass && (
        <>
          <Text style={styles.label}>Select Subject</Text>
          <Controller
            name="subject"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a subject" value="" />
                {Object.keys(dummyData[selectedClass]).map((subject) => (
                  <Picker.Item key={subject} label={subject} value={subject} />
                ))}
              </Picker>
            )}
          />
        </>
      )}

      {/* Select Chapter */}
      {selectedClass && selectedSubject && (
        <>
          <Text style={styles.label}>Select Chapter</Text>
          <Controller
            name="chapter"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <FlatList
                data={dummyData[selectedClass][selectedSubject]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Text
                    style={[
                      styles.chapterItem,
                      value === item && styles.selectedChapter,
                    ]}
                    onPress={() => onChange(item)}
                  >
                    {item}
                  </Text>
                )}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

export default CreateChapterBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    marginBottom: 16,
    height: 50,
    width: "100%",
  },
  chapterItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedChapter: {
    backgroundColor: "#f0f0f0",
  },
});
