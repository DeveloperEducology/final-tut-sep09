import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { showError } from "../../utils/helperFunctions";
import validator from "../../utils/validations";
import { userLogin, userPhoneLogin } from "../../redux/actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PhoneLoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setLoading] = useState(false);

  // console.log("route params", route.params);

  const isValidData = () => {
    const error = validator({
      // email,
      // password,
    });
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };
  const onLogin = async () => {
    const checkValid = isValidData();
    if (checkValid) {
      setLoading(true);
      try {
        let fcmToken = await AsyncStorage.getItem("fcm_token");

        const res = await userPhoneLogin({
          phoneNumber,
          fcmToken,
        });
        console.log("login api res", res);
        setLoading(false);
        // if (!!res.data) {
          navigation.navigate("otp", { data: res.data });
          // return;
        // }
      } catch (error) {
        console.log("error in login api", error);
        showError(error?.error);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subHeader}>Enter your Phone Number to login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("register")}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f3e1f6",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#a050d0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#6f42c1",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6f42c1",
  },
});

export default PhoneLoginScreen;
