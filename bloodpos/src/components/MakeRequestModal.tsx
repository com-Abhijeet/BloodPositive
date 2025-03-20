import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRequest } from "../services/requestService";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { User } from "../types/User";

interface MakeRequestModalProps {
  visible: boolean;
  onClose: () => void;
  selectedUser: User;
}

const MakeRequestModal = ({
  visible,
  onClose,
  selectedUser,
}: MakeRequestModalProps) => {
  const { theme } = useTheme();
  const [requiredUntil, setRequiredUntil] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [requestorId, setRequestorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestorId = async () => {
      const user = await AsyncStorage.getItem("User");
      const userObj = user ? JSON.parse(user) : null;
      setRequestorId(userObj?._id || null);
    };

    fetchRequestorId();
  }, []);

  const calculateUrgency = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 1) return "high";
    if (diffInDays <= 5) return "medium";
    return "low";
  };

  const handleRequest = async () => {
    if (!requestorId) {
      console.error("Requestor ID not found");
      return;
    }

    setLoading(true);
    const urgency = calculateUrgency(requiredUntil);
    const request = {
      requestor: requestorId,
      requestedTo: selectedUser._id,
      status: "pending",
      requiredBloodGroup: selectedUser.bloodGroup,
      requiredUntil: requiredUntil.toISOString(),
      urgency,
    };

    try {
      const response = await createRequest(request);

      if (response.status === 200) {
        setRequestStatus("Request sent successfully");
      } else {
        setRequestStatus("Request failed");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setRequestStatus("Request failed");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setRequestStatus(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              Make a Request
            </Text>
            <IconButton
              icon="close"
              iconColor={theme.primary}
              size={24}
              onPress={onClose}
            />
          </View>
          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : requestStatus ? (
              <Text style={[styles.statusMessage, { color: theme.primary }]}>
                {requestStatus}
              </Text>
            ) : (
              <>
                <Text style={[styles.label, { color: theme.text }]}>
                  Required Until
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePicker}
                >
                  <Text style={[styles.dateText, { color: theme.text }]}>
                    {requiredUntil.toDateString()}
                  </Text>
                  <Icon name="calendar" size={24} color={theme.primary} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={requiredUntil}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setRequiredUntil(date);
                    }}
                  />
                )}
                <Button
                  mode="contained"
                  onPress={handleRequest}
                  style={styles.requestButton}
                  buttonColor={theme.primary}
                  textColor="#fff"
                >
                  Request
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  requestButton: {
    marginTop: 20,
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MakeRequestModal;
