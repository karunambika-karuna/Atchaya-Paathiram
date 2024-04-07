import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import firebase from 'firebase/app';
import 'firebase/database';

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Fetch location when component mounts
    fetchCurrentLocation();
  }, []);

  const firebaseConfig = {
   
    apiKey: "AIzaSyCfn8bx8CRYijBMjCKtMP8v3xkvqOHHktY",
    authDomain: "atchaya-paathiram-83df1.firebaseapp.com",
    projectId: "atchaya-paathiram-83df1",
    storageBucket: "atchaya-paathiram-83df1.appspot.com",
    messagingSenderId: "535479398498",
    appId: "1:535479398498:web:34aca664dcc8e92905613b",
    measurementId: "G-HE4D6X6FPR"
  };

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch current location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleSubmit = async () => {
    try {
      // Fetch location again before submitting
      await fetchCurrentLocation();
      
      // Store data in Firebase Realtime Database
      firebase.database().ref('users').push({
        firstName: firstName,
        lastName: lastName,
        location: location ? { latitude: location.coords.latitude, longitude: location.coords.longitude } : null,
      });

      // Reset form fields
      setFirstName('');
      setLastName('');

      Alert.alert('Success', 'Data stored successfully!');
    } catch (error) {
      console.error('Error storing data:', error);
      Alert.alert('Error', 'Failed to store data');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={text => setFirstName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={text => setLastName(text)}
        />
        <Button title="Fetch Location" onPress={fetchCurrentLocation} color="#f94d00" />
        <Button title="Submit" onPress={handleSubmit} color="#f94d00" />
        <Button title="Continue" onPress={() => navigation.navigate('Feed')} color="#f94d00" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f94d00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#f94d00',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
