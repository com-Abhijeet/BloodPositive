import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { NavigationProp } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageBackground
        source={require("../../assets/OnboardingScreen-bg.png")} 
        style={styles.graphicContainer}
        resizeMode="cover"
      >
        <Text style={styles.title}>Blood Positive</Text>
        <Text style={styles.subTitle}>
          Your journey to a healthy life starts here
        </Text>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Text style={[styles.CardTitle, { color: theme.text }]}>
          Get Started with Blood Positive
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
          buttonColor={theme.primary}
        >
          Login
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Register")}
          style={styles.button}
          buttonColor={theme.secondary}
          textColor={theme.text}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphicContainer: {
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: -20, // Overlap with graphicContainer
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#fff",
  },
  subTitle: {
    fontSize: 24,
    textAlign: "center",
    color: "#fff",
  },
  CardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    marginVertical: 8,
    width: "80%",
  },
});

export default WelcomeScreen;
