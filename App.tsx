// App.tsx

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "./Screens/SignIn";
import Register from "./Screens/Register";
import Dashboard from "./Screens/Dashboard";
import Settings from "./Screens/Settings";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn">
          {() => <SignIn setUser={setUser} />}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {() => <Register user={user} />}
        </Stack.Screen>

        <Stack.Screen name="Dashboard">
          {() => <Dashboard user={user} />}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {() => <Settings />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
