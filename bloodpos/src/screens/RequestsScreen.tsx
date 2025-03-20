import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SentRequestsList from "../components/SentRequestsList";
import IncomingRequestsList from "../components/IncomingRequestsList";

const RequestsScreen = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"sent" | "incoming">("sent");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "sent"
              ? { backgroundColor: theme.primary }
              : { borderColor: theme.primary, borderWidth: 1 },
          ]}
          onPress={() => setActiveTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sent"
                ? { color: theme.background }
                : { color: theme.primary },
            ]}
          >
            Sent Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "incoming"
              ? { backgroundColor: theme.primary }
              : { borderColor: theme.primary, borderWidth: 1 },
          ]}
          onPress={() => setActiveTab("incoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "incoming"
                ? { color: theme.background }
                : { color: theme.primary },
            ]}
          >
            Incoming Requests
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === "sent" ? <SentRequestsList /> : <IncomingRequestsList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    gap: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RequestsScreen;
