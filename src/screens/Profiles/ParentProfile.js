import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";

import { Icon } from "react-native-elements";
import React, { useEffect, useState, useLayoutEffect } from "react";
import actions from "../../redux/actions";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ParentDetailForm from "../ParentDetailForm/ParentDetailForm";

const ParentProfile = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const userData = useSelector((state) => state?.auth?.userData);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    userPosts();
  }, [userData]);

  const userPosts = async () => {
    try {
      const res = await actions.getParentProfile(`?userId=${userData?._id}`);
      console.log("res in parent profile screen", res);
      setProfile(res.data);
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const toggleEdit = () => {
    setModalVisible(!modalVisible);
  };

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

  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture and Name */}
      <View style={styles.profileInfo}>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>
          {profile?.firstName} {profile?.lastName}
        </Text>
        <Text style={styles.profileRole}>STUDENT</Text>
      </View>

      {/* Basic Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Basic Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>E-Mail</Text>
          <Text style={styles.detailValue}>{profile?.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile No.</Text>
          <Text style={styles.detailValue}>7386533211</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date of Birth</Text>
          <Text style={styles.detailValue}>{profile?.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{profile?.gender}</Text>
        </View>
      </View>

      {/* Education Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Education Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>School Board</Text>
          <Text style={styles.detailValue}>CBSE</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>School Medium</Text>
          <Text style={styles.detailValue}>{profile?.medium}</Text>
        </View>
      </View>

      {/* Guardian Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Guardian Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Guardian Name</Text>
          <Text style={styles.detailValue}>{profile?.guardianName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Guardian Relation</Text>
          <Text style={styles.detailValue}>{profile?.guardianRelation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Guardian Contact No.</Text>
          <Text style={styles.detailValue}>{profile?.guardianContact}</Text>
        </View>
      </View>

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
          {profile && <ParentDetailForm profile={profile} />}
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ParentProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8a0057",
  },
  profileRole: {
    fontSize: 16,
    color: "#8a0057",
    marginBottom: 10,
  },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: "#333",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalView: {
    flex: 1,
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
