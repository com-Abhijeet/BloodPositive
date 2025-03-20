import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { IconButton, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserSentRequests } from "../services/requestService";
import { Request } from "../types/Request";

const SentRequestsList = () => {
  const { theme } = useTheme();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        const userObj = user ? JSON.parse(user) : null;
        const userId = userObj?._id;
        if (!userId) {
          console.error("User ID not found in AsyncStorage");
          return;
        }

        const sentRequests = await getUserSentRequests(userId);
        await AsyncStorage.setItem(
          "sentRequests",
          JSON.stringify(sentRequests)
        );
        setRequests(sentRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "low":
        return theme.secondary;
      case "medium":
        return theme.secondary;
      case "high":
        return theme.primary;
      default:
        return "gray";
    }
  };

  const renderItem = ({ item }: { item: Request }) => (
    <View
      key={item._id}
      style={[styles.card, { backgroundColor: theme.background }]}
    >
      <View style={styles.row}>
        <Image
          source={require("../../assets/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>
            {typeof item.requestedTo === "object"
              ? item.requestedTo.name
              : item.requestedTo}
          </Text>
          <Text style={[styles.address, { color: theme.text }]}>
            {typeof item.requestedTo === "object"
              ? item.requestedTo.address
              : ""}
          </Text>
          <Text style={[styles.requiredUntil, { color: theme.text }]}>
            Required Until:{" "}
            {new Date(item.requiredUntil).toLocaleDateString("en-GB")}
          </Text>
        </View>
        <View style={styles.urgencyContainer}>
          <Text
            style={[
              styles.urgency,
              {
                backgroundColor: getUrgencyColor(item.urgency),
                color:
                  item.urgency === "high"
                    ? getUrgencyColor("low")
                    : getUrgencyColor("high"),
              },
            ]}
          >
            {item.urgency === "high" ? "URGENT" : item.urgency.toUpperCase()}
          </Text>
          <View style={styles.actions}>
            {item.status === "accepted" && (
              <IconButton
                icon="phone"
                iconColor={theme.primary}
                size={20}
                onPress={() =>
                  typeof item.requestedTo === "object" &&
                  console.log("Call", item.requestedTo.phoneNumber)
                }
              />
            )}
            <IconButton
              icon="message"
              iconColor={theme.primary}
              size={20}
              onPress={() =>
                typeof item.requestedTo === "object" &&
                console.log("Message", item.requestedTo.phoneNumber)
              }
            />
            <IconButton
              icon="share-variant"
              iconColor={theme.primary}
              size={20}
              onPress={() => console.log("Share", item._id)}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <Text style={[styles.status, { color: theme.primary }]}>
          {item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : ""}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={requests}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#666",
  },
  requiredUntil: {
    fontSize: 14,
    color: "#666",
  },
  urgencyContainer: {
    alignItems: "flex-end",
  },
  urgency: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 4,
    borderRadius: 4,
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
});

export default SentRequestsList;
