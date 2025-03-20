import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "react-native-paper";

interface ActionItemProps {
  icon: string;
  heading: string;
  onPress: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, heading, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon source={icon} size={30} color={theme.primary} />
      <Text style={[styles.actionText, { color: theme.primary }]}>
        {heading}
      </Text>
    </TouchableOpacity>
  );
};

const ActionContainer = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActionItem
        icon="heart"
        heading="Donate"
        onPress={() => console.log("Donate")}
      />
      <ActionItem
        icon="blood-bag"
        heading="Request"
        onPress={() => console.log("Blood Req")}
      />
      <ActionItem
        icon="hospital"
        heading="Banks"
        onPress={() => console.log("Blood Banks")}
      />
      <ActionItem
        icon="account-multiple-plus"
        heading="Invite"
        onPress={() => console.log("Invite")}
      />
      <ActionItem
        icon="gift"
        heading="Rewards"
        onPress={() => console.log("Rewards")}
      />
      <ActionItem
        icon="help-circle"
        heading="Support"
        onPress={() => console.log("Support")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#f1f1f1",
  },
  actionItem: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff0000",
    borderRadius: 10,
    width: 70,
    height: 70,
    margin: 8,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ActionContainer;
