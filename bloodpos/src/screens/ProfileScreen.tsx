import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Button, IconButton } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isAvailable, setIsAvailable] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser: User = JSON.parse(user);
          setUserData(parsedUser);
        }
      } catch (error) {
        console.log("Error fetching user data from AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    auth().signOut();
    navigation.navigate("Welcome");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[styles.detailsContainer, { backgroundColor: theme.background }]}
      >
        <IconButton
          icon="arrow-left"
          iconColor={theme.text}
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <View style={styles.imageContainer}>
          <View style={[styles.dottedBorder, { borderColor: theme.primary }]}>
            <Image
              source={require("../../assets/avatar.png")}
              style={styles.profileImage}
            />
          </View>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>
          {userData?.name || "N/A"}
        </Text>
        <Text style={[styles.email, { color: theme.text }]}>
          {userData?.phoneNumber || "N/A"}
        </Text>
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => console.log("Call Now")}
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            labelStyle={{ color: "#fff" }}
            icon={() => <Icon name="phone" size={20} color="#fff" />}
          >
            Call Now
          </Button>
          <Button
            mode="outlined"
            onPress={() => console.log("Request")}
            style={[styles.actionButton, { borderColor: theme.primary }]}
            labelStyle={{ color: theme.primary }}
            icon={() => (
              <Icon
                name="arrow-u-left-top-bold"
                size={20}
                color={theme.primary}
              />
            )}
          >
            Request
          </Button>
        </View>
        <View style={styles.stats}>
          <View style={[styles.statItem, { borderColor: theme.primary }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {userData?.bloodGroup || "N/A"}
            </Text>
            <Text style={[styles.statLabel, { color: theme.primary }]}>
              Blood Type
            </Text>
          </View>
          <View style={[styles.statItem, { borderColor: theme.primary }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {userData?.subscription?.donationRequestCount || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.primary }]}>
              Donated
            </Text>
          </View>
          <View style={[styles.statItem, { borderColor: theme.primary }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {userData?.subscription?.callCount || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.primary }]}>
              Requested
            </Text>
          </View>
        </View>
        <View style={styles.options}>
          <View
            style={[
              styles.optionItem,
              {
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={[styles.optionLabel, { color: theme.text }]}>
              Available to donate
            </Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => console.log("Invite a friend")}
          >
            <Icon name="account-multiple-plus" size={20} color={theme.text} />
            <Text style={[styles.optionLabel, { color: theme.text }]}>
              Invite a friend
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => console.log("Get help")}
          >
            <Icon name="help-circle" size={20} color={theme.text} />
            <Text style={[styles.optionLabel, { color: theme.text }]}>
              Get help
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={handleSignOut}>
            <Icon name="logout" size={20} color={theme.primary} />
            <Text style={[styles.optionLabel, { color: theme.primary }]}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  imageContainer: {
    alignItems: "center",
    // marginTop: -30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
  },
  dottedBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
    // marginTop: -50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    // marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 16,
  },
  actionButton: {
    width: "45%",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 16,
  },
  statItem: {
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: "30%",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
  },
  options: {
    width: "100%",
    // paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginVertical: 8,
    boxShadow: "0px 0px 10px rgba(0, 0, 0,  0.1)",
  },
  optionLabel: {
    fontSize: 16,
  },
});

export default ProfileScreen;
