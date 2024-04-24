import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
const logo=require("../assets/logo.png");

const Welcome = ({ navigation }) => {
  const handleSignIn = () => {
    
    navigation.navigate('Signup');
  };



  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.appName}>Atchaya Pathiram</Text>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in / Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20,
  },
  appName: {
   // Use the custom font
    fontSize: 45,
    color: '#fb4f14',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#8ee8a6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight:"bold",
  },
});

export default Welcome;
