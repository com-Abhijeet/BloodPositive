import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { useTheme } from "../context/ThemeContext";
import { NavigationProp } from "@react-navigation/native";
import { searchNearbyDonors } from "../services/searchService";
import * as Location from "expo-location";

const DonorSearch = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { theme } = useTheme();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [distance, setDistance] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const toggleCollapse = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
    Animated.timing(animation, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [collapsed, animation]);

  const handleSearch = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log(selectedBloodGroup);
      const results = await searchNearbyDonors(
        selectedBloodGroup,
        latitude,
        longitude,
        distance
      );
      navigation.navigate("SearchResults");
      console.log(
        `Searching for ${selectedBloodGroup} donors within ${distance} km`
      );
    } catch (error) {
      console.error("Error during search:", error);
    }
  }, [selectedBloodGroup, distance, navigation]);

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 420], // Adjust the height values as needed
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { height: animatedHeight },
        { backgroundColor: theme.primary },
      ]}
    >
      <TouchableOpacity onPress={toggleCollapse}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.secondary }]}>
            Search for Donor Nearby
          </Text>
          <View style={styles.line} />
        </View>
      </TouchableOpacity>
      {!collapsed && (
        <>
          <View
            style={[
              styles.bloodGroupContainer,
              { backgroundColor: theme.primary },
            ]}
          >
            <Text style={[styles.bloodGroupText, { color: "#fff" }]}>
              Select Blood Group
            </Text>
            <View style={styles.bloodGroupRow}>
              {bloodGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.bloodGroupCard,
                    selectedBloodGroup === group && {
                      backgroundColor: "#fff",
                    },
                    {
                      borderColor: "#fff",
                    },
                  ]}
                  onPress={() => setSelectedBloodGroup(group)}
                >
                  <Text
                    style={[
                      styles.bloodGroupCardText,
                      selectedBloodGroup === group && {
                        color: theme.primary,
                      },
                      {
                        color:
                          selectedBloodGroup === group ? theme.primary : "#fff",
                      },
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: "#fff" }]}>
              <Text style={styles.bloodGroupText}>Distance: </Text> {distance}{" "}
              km
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={0}
              onValueChange={setDistance}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#fff"
              thumbTintColor="#fff"
            />
          </View>
          <Button
            mode="contained"
            onPress={handleSearch}
            style={styles.searchButton}
            buttonColor="#fff"
            textColor={theme.primary}
          >
            Search
          </Button>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    // margin: 16,
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#ccc",
    marginTop: 8,
  },
  bloodGroupContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  bloodGroupText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bloodGroupRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bloodGroupCard: {
    width: "22%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    marginBottom: 10,
  },
  bloodGroupCardText: {
    fontSize: 16,
  },
  sliderContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  searchButton: {
    marginTop: 20,
    marginHorizontal: 16,
  },
});

export default DonorSearch;
