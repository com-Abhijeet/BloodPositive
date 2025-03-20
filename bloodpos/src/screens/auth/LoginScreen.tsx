import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../services/authService";
const logo = require("../../../assets/logo.jpg"); // Ensure the path is correct

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timer, setTimer] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Tabs");
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const signInWithPhoneNumber = async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      "+91 " + phoneNumber
    );
    setTimer(30); // Start 30-second timer

    setConfirm(confirmation);
  };

  const confirmCode = async () => {
    try {
      if (confirm) {
        await confirm.confirm(code);
        // Make the login API call
        const data = await loginUser(phoneNumber);
        const user = data.user;
        const authToken = data.token;
        // Store the user data in AsyncStorage
        await AsyncStorage.setItem("User", JSON.stringify(user));
        console.log(await AsyncStorage.getItem("User"));
        navigation.navigate("Tabs");
      } else {
        console.log("Confirmation result is null.");
      }
    } catch (error) {
      console.log("Invalid code.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Image source={logo} style={styles.logo} />
      <Text style={[styles.heading, { color: theme.text }]}>
        Blood Positive
      </Text>
      <Text style={[styles.disclaimer, { color: theme.text }]}>
        Find blood donors near you.
      </Text>
      <View style={styles.hr}></View>

      {!confirm ? (
        <>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            mode="outlined"
            outlineColor={theme.primary}
            selectionColor={theme.primary}
            activeOutlineColor={theme.primary}
            // label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter Your Phone Number"
          />
          <Button
            mode="contained"
            onPress={signInWithPhoneNumber}
            style={styles.button}
            buttonColor={theme.primary}
            disabled={timer > 0}
          >
            {timer > 0 ? `Resend Code in ${timer}s` : "Send Code"}
          </Button>
          {timer > 0 && (
            <Text style={[styles.timerText, { color: theme.text }]}>
              Code Sent
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={styles.label}> Verification Code</Text>

          <TextInput
            mode="outlined"
            outlineColor={theme.primary}
            selectionColor={theme.primary}
            activeOutlineColor={theme.primary}
            // label="Verification Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            keyboardType="number-pad"
          />
          <Button
            mode="contained"
            onPress={confirmCode}
            style={styles.button}
            buttonColor={theme.primary}
          >
            Confirm Code
          </Button>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    // borderWidth: 1,
    width: "70%",
    marginVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical: "10%",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "80%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    alignSelf: "flex-start",
    marginLeft: "10%",
  },
  button: {
    marginVertical: 8,
    width: "80%",
  },
  timerText: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default LoginScreen;
