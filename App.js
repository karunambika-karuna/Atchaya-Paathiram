import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './screens/Home'; 
import SignupScreen from './screens/Signup';
import ProfileScreen from './screens/Profile';
import FeedsScreen from './screens/Feeds';
import Post from './screens/Post';
import OrderPage from './screens/OrderPage';
import ChatScreen from './screens/ChatScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Signup" component={SignupScreen} /> 
        <Stack.Screen name="Profile" component={ProfileScreen} /> 
        <Stack.Screen name="Feeds" component={FeedsScreen} /> 
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="OrderPage" component={OrderPage} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
