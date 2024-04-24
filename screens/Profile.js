import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const firebaseConfig = {
  
  apiKey: "AIzaSyCfn8bx8CRYijBMjCKtMP8v3xkvqOHHktY",
  authDomain: "atchaya-paathiram-83df1.firebaseapp.com",
  projectId: "atchaya-paathiram-83df1",
  storageBucket: "atchaya-paathiram-83df1.appspot.com",
  messagingSenderId: "535479398498",
  appId: "1:535479398498:web:34aca664dcc8e92905613b",
  measurementId: "G-HE4D6X6FPR"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null); 

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { firstName, lastName, address } = JSON.parse(userData);
        setFirstName(firstName);
        setLastName(lastName);
        setAddress(address);
      } else {
        const user = firebase.auth().currentUser;
        if (user) {
          fetchUserData(user.uid);
        } else {
          navigation.navigate('Signup');
        }
      }
    } catch (error) {
      console.error('Error fetching user data from local storage:', error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };
  
  

  const handleContinue = () => {
    navigation.navigate('Feeds');
  };

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch current location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { coords } = location;
      setLocation(location);

      const addressResponse = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });
      
      if (addressResponse.length > 0) {
        const addressParts = addressResponse[0];
        const formattedAddress = `${addressParts.street} ${addressParts.city}, ${addressParts.region}, ${addressParts.country}`;
        setAddress(formattedAddress);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleSubmit = async () => {
    try {
      // Fetch location again before submitting
      await fetchCurrentLocation();
      
      // Get the currently authenticated user
      const user = firebase.auth().currentUser;
      if (user) {
        // Create a data object with user details and location
        const userData = {
          firstName: firstName,
          lastName: lastName,
          address: address, // Add address to userData
          location: location ? { latitude: location.coords.latitude, longitude: location.coords.longitude } : null,
        };
  
        // Store user data in Firebase database under user's UID
        await firebase.database().ref('users/' + user.uid).set(userData);
  
        // Store user data in local storage for persistence
        await AsyncStorage.setItem('userData', JSON.stringify({ firstName, lastName, address }));
  
        // Reset form fields
        setFirstName('');
        setLastName('');
  
        // Show success message
        Alert.alert('Success', 'Data stored successfully!', [
          { text: 'Continue to App', onPress: handleContinue }
        ]);
      } else {
        Alert.alert('Error', 'User is not logged in');
      }
    } catch (error) {
      console.error('Error storing data:', error);
      Alert.alert('Error', 'Failed to store data');
    }
  };
  const fetchUserData = async (userId) => {
    try {
      const snapshot = await firebase.database().ref('users/' + userId).once('value');
      const userData = snapshot.val();
      if (userData) {
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setAddress(userData.address || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data');
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
        <Text style={styles.address}>{address}</Text>
        <Button title="Fetch Location" onPress={fetchCurrentLocation} color="#f94d00" />
        <Button title="Submit" onPress={handleSubmit} color="#f94d00" />
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
  address: {
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});

export default ProfileScreen;