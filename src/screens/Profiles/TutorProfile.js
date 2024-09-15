import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import actions from "../../redux/actions";
import { Ionicons } from "@expo/vector-icons";
import CreateProfile from "./CreateProfile";

const TutorProfile = ({ navigation }) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 45);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 45],
    outputRange: [0, -45],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileDetail, setProfileDetail] = useState(null);

  const profileId = userData?._id;
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (profileId) {
      fetchUserData();
    }
  }, [profileId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleEdit}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.247:3000/profile-detail/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("profile detail data in tutor profile screen", data);
        setProfileDetail(data);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to fetch profile");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderInfo = (label, value) => (
    <Text style={styles.infoText}>
      {label} :{" "}
      <Text style={value ? styles.infoGiven : styles.infoNotGiven}>
        {value || "Not provided"}
      </Text>
    </Text>
  );

  useEffect(() => {
    userPosts();
  }, [userData]);

  const userPosts = async () => {
    try {
      const res = await actions.getTutorProfile(`?userId=${userData?._id}`);
      console.log("res in parent profile screen", res);
      setProfile(res.data);
    } catch (error) {
      console.log("error raised", error);
    }
  };
  console.log("userdata in tutor profile page", profile);

  const toggleEdit = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View>
      {profile && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={(e) => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16} // this makes sure the onScroll event is called at a certain rate (in milliseconds)
        >
          <View style={styles.profileHeader}>
            <Image
              style={styles.profileImage}
              source={{ uri: profile?.profileImage }}
            />
            <Text style={styles.name}>
              {profile?.userId?.userName || "N/A"}
            </Text>
            <Text style={styles.rating}>0 / 5.0</Text>
            <Text style={styles.id}>ID: {profile?.profileId || "N/A"}</Text>
            <Text style={styles.phone}>
              {profile?.personalInformation?.additionalNumber || "N/A"}
            </Text>
            <Text style={styles.profileCompletion}>
              Profile Completed: <Text style={styles.percent}>13%</Text>
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Educational Information</Text>
            {profileDetail?.education?.length > 0
              ? profileDetail.education.map((edu, index) => (
                  <View key={index}>
                    {renderInfo("School Name", edu.schoolName)}
                    {renderInfo("Year", edu.year)}
                    {renderInfo("Grade", edu.grade)}
                  </View>
                ))
              : renderInfo(
                  "Educational Information",
                  "You didn’t input any educational information yet"
                )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tuition Related Information</Text>
            {renderInfo(
              "Tutoring Method",
              profileDetail?.availability?.tutoringMethod.join(", ")
            )}

            {renderInfo(
              "Available Days",
              profileDetail?.availability?.days.join(", ")
            )}
            {renderInfo(
              "Preferred Categories",
              profileDetail?.otherInfo?.preferredCategories
                .map((cat) => cat.name)
                .join(", ")
            )}
            {renderInfo(
              "Preferred Classes",
              profileDetail?.otherInfo?.preferredClasses
                .map((cls) => cls.name)
                .join(", ")
            )}
            {renderInfo(
              "Preferred Subjects",
              profileDetail?.otherInfo?.preferredSubjects
                .map((sub) => sub.name)
                .join(", ")
            )}

            {renderInfo(
              "Preferred Locations",
              profileDetail?.otherInfo?.preferredLocations
                .map((loc) => loc.name)
                ?.join(" ")
            )}
            {renderInfo("City", profileDetail?.otherInfo?.city)}
            {renderInfo("Location", profileDetail?.otherInfo?.location)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderInfo("Name", profile?.userId?.userName)}
            {renderInfo(
              "Additional Number",
              profile?.personalInformation?.additionalNumber
            )}
            {renderInfo("Gender", profile?.personalInformation?.gender)}
            {renderInfo(
              "Date of Birth",
              profile?.personalInformation?.dateOfBirth
            )}
            {renderInfo("Religion", profile?.personalInformation?.religion)}
            {renderInfo(
              "Nationality",
              profile?.personalInformation?.nationality
            )}
            {renderInfo(
              "Father's Name",
              profile?.personalInformation?.fathersName
            )}
            {renderInfo(
              "Father's Number",
              profile?.personalInformation?.fathersNumber
            )}
            {renderInfo(
              "Mother's Name",
              profile?.personalInformation?.mothersName
            )}
            {renderInfo(
              "Mother's Number",
              profile?.personalInformation?.mothersNumber
            )}
            {renderInfo("Overview", profile?.personalInformation?.overview)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Emergency Information</Text>
            {renderInfo("Name", profile?.emergencyInformation?.name)}
            {renderInfo("Relation", profile?.emergencyInformation?.relation)}
            {renderInfo("Number", profile?.emergencyInformation?.number)}
            {renderInfo("Address", profile?.emergencyInformation?.address)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            {renderInfo("Street", profile?.address?.street)}
            {renderInfo("City", profile?.address?.city)}
            {renderInfo("State", profile?.address?.state)}
            {renderInfo("Postal Code", profile?.address?.postalCode)}
            {renderInfo("Country", profile?.address?.country)}
          </View>
        </ScrollView>
      )}

      <View>
        {!profile && (
          <Button
            onPress={() =>
              navigation.navigate("Stakess", {
                screen: "create-profile",
                params: {
                  mode: "create",
                },
              })
            }
          >
            CreateProfile
          </Button>
        )}
      </View>
      <View>
        {/* Modal for editing */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleEdit}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleEdit}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
            {profile && <CreateProfile profile={profile} />}
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default TutorProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 1,
    backgroundColor: "#f2f2f2",
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rating: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  id: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileCompletion: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  percent: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  infoNotGiven: {
    color: "#ff0000",
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 1,
  },
});
