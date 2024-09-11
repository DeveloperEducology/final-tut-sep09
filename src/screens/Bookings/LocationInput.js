import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LocationInput = () => {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([
    { name: "Hanamkonda", pincode: "506001" },
    { name: "Warangal", pincode: "506002" },
    { name: "Kazipet", pincode: "506003" },
    // Add more predefined locations here
  ]);
  const [filteredLocations, setFilteredLocations] = useState([]);

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

  return (
    <View style={styles.container}>
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
            <TouchableOpacity onPress={() => handleSelectLocation(item)}>
              <Text style={styles.suggestion}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {query && filteredLocations.length === 0 && !locations.find(loc => loc.name.toLowerCase() === query.toLowerCase()) && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
          <Text style={styles.addButtonText}>
            Add "{query}" as a new location
          </Text>
        </TouchableOpacity>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
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

export default LocationInput;
