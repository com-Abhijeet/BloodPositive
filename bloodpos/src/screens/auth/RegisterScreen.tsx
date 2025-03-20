import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import {
  Button,
  TextInput,
  Text,
  Avatar,
  RadioButton,
} from "react-native-paper";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp } from "@react-navigation/native";
import * as Location from "expo-location";
import { registerUser } from "../../services/authService";
import CustomDialog from "../../components/CustomDialogue";
import { Picker } from "@react-native-picker/picker";

const { height } = Dimensions.get("window");

const RegisterScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [step, setStep] = useState(1);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [plusCode, setPlusCode] = useState("");
  const { theme } = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user && step === 1) {
        setStep(2);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [step]);

  const signInWithPhoneNumber = async () => {
    const confirmation = await auth().signInWithPhoneNumber(
      "+91 " + phoneNumber
    );
    setConfirm(confirmation);
  };

  const confirmCode = async () => {
    try {
      if (confirm) {
        await confirm.confirm(code);
        setStep(2);
      } else {
        console.log("Confirmation result is null.");
      }
    } catch (error) {
      console.log("Invalid code.");
    }
  };

  const register = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userDetails = {
        phoneNumber,
        name,
        address,
        city,
        pincode,
        state,
        aadhaar,
        bloodGroup,
        gender,
        plusCode,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        subscription: {
          subscriptionTier: "free",
          subscriptionStatus: "active",
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: "",
          searchCount: "0",
          callCount: "0",
          donationRequestCount: "0",
        },
      };

      // Call the registerUser function from authService
      const response = await registerUser(userDetails);
      Alert.alert("Registration Successful", JSON.stringify(response));

      navigation.navigate("Tabs");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        Alert.alert("Registration Failed", error.message);
      } else {
        Alert.alert("Registration Failed", "An unknown error occurred.");
      }
    }
  };

  const handleBack = () => {
    if (step === 2 && confirm) {
      setDialogVisible(true);
    } else {
      setStep((prevStep) => Math.max(prevStep - 1, 1));
    }
  };

  const handleDialogConfirm = async () => {
    await auth().signOut(); // Clear Firebase auth state
    setStep(1);
    setConfirm(null);
    setCode("");
    setPhoneNumber("");
    setDialogVisible(false);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            {!confirm ? (
              <>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={styles.input}
                  keyboardType="phone-pad"
                  mode="outlined"
                  outlineColor={theme.primary}
                  activeOutlineColor={theme.primary}
                  placeholder="Enter Your Phone Number"
                />
                <Button
                  mode="contained"
                  onPress={signInWithPhoneNumber}
                  style={styles.button}
                  buttonColor={theme.primary}
                >
                  Send Verification Code
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  style={styles.input}
                  keyboardType="number-pad"
                  mode="outlined"
                  outlineColor={theme.primary}
                  activeOutlineColor={theme.primary}
                  placeholder="Enter Verification Code"
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
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="Enter Name"
            />
            <Text style={styles.label}>Gender</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue: React.SetStateAction<string>) =>
                setGender(itemValue)
              }
              style={styles.input}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            <Button
              mode="contained"
              onPress={() => setStep(3)}
              style={styles.button}
              buttonColor={theme.primary}
              rippleColor={theme.secondary}
            >
              Next
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.label}>Aadhaar Number</Text>
            <TextInput
              value={aadhaar}
              onChangeText={setAadhaar}
              style={styles.input}
              keyboardType="number-pad"
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="xxxx xxxx xxxx"
            />
            <Button
              mode="contained"
              onPress={() => setStep(4)}
              style={styles.button}
              buttonColor={theme.primary}
            >
              Next
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <TextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="eg :  123, ABC Street, City"
            />
            <TextInput
              label="City"
              value={city}
              onChangeText={setCity}
              style={styles.input}
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="eg : Mumbai"
            />
            <TextInput
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              style={styles.input}
              keyboardType="number-pad"
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="200001"
            />
            <TextInput
              label="State"
              value={state}
              onChangeText={setState}
              style={styles.input}
              mode="outlined"
              outlineColor={theme.primary}
              activeOutlineColor={theme.primary}
              placeholder="Maharashtra"
            />
            <Button
              mode="contained"
              onPress={() => setStep(5)}
              style={styles.button}
              buttonColor={theme.primary}
            >
              Next
            </Button>
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.label}>Select Blood Group</Text>
            <View style={styles.bloodGroupContainer}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.bloodGroupCard,
                      bloodGroup === group && {
                        backgroundColor: theme.primary,
                      },
                      {
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => setBloodGroup(group)}
                  >
                    <Text
                      style={[
                        styles.bloodGroupText,
                        bloodGroup === group && {
                          color: "#fff",
                        },
                      ]}
                    >
                      {group}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
            <Button
              mode="contained"
              onPress={register}
              style={styles.button}
              buttonColor={theme.primary}
            >
              Register
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[1, 2, 3, 4, 5].map((s) => (
          <View
            key={s}
            style={[
              styles.dot,
              step === s && { backgroundColor: theme.primary },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
            source={require("../../../assets/OnboardingScreen-bg.png")}
            style={styles.graphicContainer}
          >
            <Avatar.Image
              size={200}
              source={require("../../../assets/avatar.png")}
            />
          </ImageBackground>
          <View style={styles.contentContainer}>
            {renderStepContent()}
            {renderDots()}
            <View style={styles.navigationButtons}>
              {step > 1 && (
                <Button
                  mode="text"
                  onPress={handleBack}
                  style={styles.navButton}
                  color={theme.primary}
                >
                  Back
                </Button>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomDialog
        visible={dialogVisible}
        title="Confirm"
        message="Are you sure you want to go back and re-verify your phone number?"
        onConfirm={handleDialogConfirm}
        onClose={handleDialogClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensure full width
  },
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    // borderWidth: 1,
    width: "70%",
    marginVertical: 10,
  },
  graphicContainer: {
    height: height * 0.4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // borderBottomLeftRadius: 100,
    // borderBottomRightRadius: 100,
    marginBottom: -50,
    zIndex: 0,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 0,
    width: "100%", // Ensure full width
  },
  input: {
    width: "100%", // Ensure full width
    marginVertical: 8,
  },
  button: {
    marginVertical: 8,
    width: "100%", // Ensure full width
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  bloodGroupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 16,
  },
  bloodGroupCard: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,
  },
  bloodGroupText: {
    fontSize: 18,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    position: "absolute",
    bottom: 16,
  },
  navButton: {
    width: "45%",
  },
  radioButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonLabel: {
    marginRight: 10,
  },
});

export default RegisterScreen;
