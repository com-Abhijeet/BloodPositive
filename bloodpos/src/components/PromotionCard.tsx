import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "react-native-paper";

interface PromotionCardProps {
  body: string;
  actionText: string;
  onActionPress: () => void;
  icon: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  body,
  actionText,
  onActionPress,
  icon,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.cardContainer}>
      <View
        style={[styles.bodyContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.bodyText, { color: theme.text }]}>{body}</Text>
      </View>
      <TouchableOpacity
        style={[styles.actionContainer, { backgroundColor: theme.primary }]}
        onPress={onActionPress}
        activeOpacity={0.7}
      >
        <Icon source={icon} size={24} color={theme.secondary} />
        <Text style={[styles.actionText, { color: theme.secondary }]}>
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    elevation: 5,
    minHeight: "15%",
  },
  bodyContainer: {
    flex: 2,
    justifyContent: "center",
    padding: 16,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default PromotionCard;
