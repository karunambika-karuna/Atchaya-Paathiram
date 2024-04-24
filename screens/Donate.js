// DonateScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

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

const DonateScreen = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [cooked, setCooked] = useState(false);
  const [manufacturingDate, setManufacturingDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showManufacturingDatePicker, setShowManufacturingDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState('1 kgs');
  const [selectedPickUpTime, setSelectedPickUpTime] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleImageUpload = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access camera roll is required!');
        }
      }

      const imagePickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!imagePickerResult.cancelled) {
        setSelectedImage(imagePickerResult.uri);
        await uploadImage(imagePickerResult.uri);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated!');
      }

      const databaseRef = firebase.database().ref(`users/${currentUser.uid}/donations`);
      const newDonationRef = databaseRef.push();
      const data = {
        description,
        location,
        cooked,
        manufacturingDate: cooked && manufacturingDate ? manufacturingDate.toString() : null,
        expiryDate: !cooked && expiryDate ? expiryDate.toString() : null,
        pickUpTime: cooked && selectedPickUpTime ? selectedPickUpTime.toString() : null,
        quantity,
        imageURL: selectedImage || null,
        phoneNumber,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      };
      await newDonationRef.set(data);

      // Add the donation to the donations section
      const allDonationsRef = firebase.database().ref('donations');
      const allDonationNewRef = allDonationsRef.push();
      await allDonationNewRef.set(data);

      console.log('Donation details submitted successfully');
    
      setSubmitSuccess(true);
      alert('Donation details submitted successfully!');
    } catch (error) {
      console.error('Error submitting donation details:', error);
      alert('Failed to submit donation details. Please try again.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = firebase.storage().ref().child(`images/${Date.now()}`);
      await storageRef.put(blob);
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location is required!');
      }

      let location = await Location.getCurrentPositionAsync({});
      const { coords } = location;

      const addressResponse = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });

      if (addressResponse.length > 0) {
        const addressParts = addressResponse[0];
        const formattedAddress = `${addressParts.street} ${addressParts.city}, ${addressParts.region}, ${addressParts.country}`;
        setLocation(formattedAddress);
      } else {
        setLocation('Address not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Failed to get current location.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Hey Generous, Fill it</Text>
        <View style={styles.form}>
          {submitSuccess && (
            <Text style={styles.successMessage}>Donation submitted successfully!</Text>
          )}
          <Button title="Upload Image" onPress={handleImageUpload} color="#FF7F50" />
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
          <Button title={cooked ? 'Your Food Is: Cooked' : 'Your Food Is: Non-cooked'} onPress={() => {}} color="#FF7F50" />
          <TextInput
            style={styles.input}
            placeholder="Description (max 50 characters)"
            maxLength={50}
            value={description}
            onChangeText={text => setDescription(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity (e.g., 2 kgs)"
            value={quantity}
            onChangeText={text => setQuantity(text)}
          />
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Food Type:</Text>
            <Button title={cooked ? 'Cooked' : 'Non-cooked'} onPress={() => setCooked(!cooked)} color="#FF7F50" />
          </View>
          {cooked ? (
            <View style={styles.datePickerContainer}>
              <Button title="Pick Up Time" onPress={() => setShowManufacturingDatePicker(true)} color="#FF7F50" />
              {showManufacturingDatePicker && (
                <DateTimePicker
                  value={manufacturingDate || new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => setSelectedPickUpTime(selectedDate || new Date())}
                />
              )}
              {selectedPickUpTime && (
                <Text style={styles.selectedDate}>
                  Pick Up Time: {selectedPickUpTime.toLocaleTimeString()}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.datePickerContainer}>
              <Button title="Manufacturing Date" onPress={() => setShowManufacturingDatePicker(true)} color="#FF7F50" />
              {showManufacturingDatePicker && (
                <DateTimePicker
                  value={manufacturingDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => setManufacturingDate(selectedDate || new Date())}
                />
              )}
              {manufacturingDate && (
                <Text style={styles.selectedDate}>
                  Manufacturing Date: {manufacturingDate.toDateString()}
                </Text>
              )}
              <Button title="Expiry Date" onPress={() => setShowExpiryDatePicker(true)} color="#FF7F50" />
              {showExpiryDatePicker && (
                <DateTimePicker
                  value={expiryDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => setExpiryDate(selectedDate || new Date())}
                />
              )}
              {expiryDate && (
                <Text style={styles.selectedDate}>
                  Expiry Date: {expiryDate.toDateString()}
                </Text>
              )}
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
          />
          <Button title="Fetch Location" onPress={fetchCurrentLocation} color="#FF7F50" />
          <Text style={styles.locationText}>{location}</Text>
          <Button title="Donate" onPress={handleSubmit} color='#FF7F50' />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f94d00',
  },
  container: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  selectedDate: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default DonateScreen;
