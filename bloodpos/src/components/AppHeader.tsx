import React from "react";
import { Text, View } from "react-native";
import { Droplets } from "lucide-react";

const AppHeader = () => {
  return (
    <View>
      <Text>
        {" "}
        <Droplets />
        AppHeader{" "}
      </Text>
    </View>
  );
};

export default AppHeader;
