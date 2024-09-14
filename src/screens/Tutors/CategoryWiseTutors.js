import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import TutorProfile from "../../components/TutorProfiles";

const CategoryWiseTutors = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: profiles?.length
        ? `${profiles.length} ${categoryName} Tutors Found`
        : "Tutors Categories",
    });

    fetchUserData();
  }, [categoryId, profiles, navigation]);

  const fetchUserData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `http://192.168.29.247:3000/profile-categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfiles(data?.profiles);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to fetch profile");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  console.log("profiles", profiles);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : profiles.length > 0 ? (
        <TutorProfile profiles={profiles} />
      ) : (
        <Text style={styles.noDataText}>No profiles found</Text>
      )}
    </View>
  );
};

export default CategoryWiseTutors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
