import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import DonorSearch from "../components/DonorSearch";
import PromotionCard from "../components/PromotionCard";
import ActionContainer from "../components/ActionContainer";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={[styles.container]}>
      <DonorSearch navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ActionContainer />
        <PromotionCard
          body="Your Donation Can Save a Life"
          actionText="View Camps"
          onActionPress={() => console.log("View Donation Campaigns")}
          icon="heart"
        />
        <PromotionCard
          body="Join Our Blood Donation Drive"
          actionText="Join Now"
          onActionPress={() => console.log("Join Now")}
          icon="account-group"
        />
        <PromotionCard
          body="Learn About Blood Donation"
          actionText="Learn More"
          onActionPress={() => console.log("Learn More")}
          icon="book-open"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
});

export default HomeScreen;
