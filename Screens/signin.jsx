import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SignIn({ setUser }) {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    setUser(username);
    navigation.navigate('Dashboard'); 
  };

  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      {/* Your inputs, buttons, etc */}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
