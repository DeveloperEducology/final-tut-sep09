import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import actions from "../../redux/actions";
import { Ionicons } from "@expo/vector-icons";
import CreateProfile from "./CreateProfile";

const TutorProfile = ({ navigation }) => {
  const userData = useSelector((state) => state?.auth?.userData);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState(null);
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


  return (
    <View>
      <Text>TutorProfile</Text>
      <Button
        onPress={() =>
          navigation.navigate("Stakess", {
            screen: "create-profile",
          })
        }
      >
        CreateProfile
      </Button>
      <Button onPress={toggleEdit}>Edit Profile</Button>
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
