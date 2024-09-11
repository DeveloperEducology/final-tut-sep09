import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import { otpVerify } from "../../redux/actions/auth";
import { showError } from "../../utils/helperFunctions";

const OTPScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    setLoading(true);
    try {
      const res = await otpVerify({
        otp,
        phoneNumber
      });
      // console.log("login api res", res);
      setLoading(false);
    } catch (error) {
      console.log("error in login api", error);
      showError(error?.error);
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.29.101:3000/verifyOTP-less",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        Alert.alert("OTP verified successfully");
        // navigation.navigate("Create");
      } else {
        Alert.alert("Failed to verify OTP", result.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter OTP sent to {phoneNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <Button
        title={loading ? "Verifying..." : "Verify OTP"}
        onPress={onVerify}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    fontSize: 18,
  },
});

export default OTPScreen;
