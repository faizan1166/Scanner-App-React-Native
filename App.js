import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ScanScreen from "./Screens/ScanScreen";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
        <Stack.Screen
          name="Scanner"
          component={ScanScreen}
          options={{
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "tomato",
            },
            headerTitleStyle: {
              fontWeight: "bold",
            },

          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
