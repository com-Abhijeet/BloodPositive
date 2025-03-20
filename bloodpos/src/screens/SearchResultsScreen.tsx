import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { IconButton, Button } from "react-native-paper";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCachedSearchResults } from "../services/searchService";
import MakeRequestModal from "../components/MakeRequestModal";
import { User } from "../types/User";

const SearchResultsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [results, setResults] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const cachedResults = await getCachedSearchResults();
        if (cachedResults) {
          setResults(cachedResults);
        }
      } catch (error) {
        console.error("Error fetching cached search results:", error);
      }
    };

    fetchResults();
  }, []);

  const handleRequestPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View
      style={[styles.card, { backgroundColor: theme.background }]}
      key={item._id}
    >
      <View style={styles.row}>
        <Image
          source={require("../../assets/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.bloodGroup, { color: theme.primary }]}>
              {item.bloodGroup}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={[styles.address, { color: theme.text }]}>
              {item.address}
            </Text>
            <View style={styles.actions}>
              <IconButton
                icon="phone"
                iconColor={theme.primary}
                size={20}
                onPress={() => console.log("Call", item.phoneNumber)}
              />
              <IconButton
                icon="message"
                iconColor={theme.primary}
                size={20}
                onPress={() => console.log("Message", item.phoneNumber)}
              />
            </View>
          </View>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={() => handleRequestPress(item)}
        style={styles.requestButton}
        buttonColor={theme.primary}
        textColor="#fff"
      >
        Request
      </Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || item.name}
        contentContainerStyle={styles.list}
      />
      {selectedUser && (
        <MakeRequestModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedUser={selectedUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bloodGroup: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    flexWrap: "wrap",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestButton: {
    marginTop: 16,
  },
});

export default SearchResultsScreen;
