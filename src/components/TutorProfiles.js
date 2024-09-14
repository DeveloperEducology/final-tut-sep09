import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // To show star icons for ratings

const TutorProfile = ({ profiles }) => {
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={16}
          color="#FFD700" // Gold color for stars
          style={{ marginRight: 4 }} // Space between stars
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <FlatList
      data={profiles}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: item.userId.profilePic || "https://via.placeholder.com/100",
            }}
            style={styles.profilePic}
          />
          <View style={styles.textContainer}>
            <Text style={styles.profileName}>{item.userId.userName}</Text>
            <Text style={styles.profileName}>
              {" "}
              {item?.preferredClasses?.map((cl) => cl?.name).join(", ")}
            </Text>
            <Text>
              {renderRating(item?.rating || 4)} {/* Default rating of 4 */}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
});

export default TutorProfile;
