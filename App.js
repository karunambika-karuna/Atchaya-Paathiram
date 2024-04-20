import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './screens/Home'; // Import your Home.js screen component
import SignupScreen from './screens/Signup';
import ProfileScreen from './screens/Profile';
import FeedsScreen from './screens/Feeds';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Signup" component={SignupScreen} /> 
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
        <Stack.Screen name="Feeds" component={FeedsScreen} /> 
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
