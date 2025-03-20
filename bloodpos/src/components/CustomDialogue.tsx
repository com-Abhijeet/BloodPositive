import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

interface CustomDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const { theme } = useTheme();

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialogContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <Text style={[styles.title, { color: theme.primary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={onConfirm} style={styles.button}>
              Yes
            </Button>
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              No
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default CustomDialog;
