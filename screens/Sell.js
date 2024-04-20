import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView } from 'react-native';
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

const SellScreen = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [cooked, setCooked] = useState(false);
  const [manufacturingDate, setManufacturingDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showManufacturingDatePicker, setShowManufacturingDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState('1 kgs');
  const [selectedManufacturingDate, setSelectedManufacturingDate] = useState(null);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
  const [selectedPickUpTime, setSelectedPickUpTime] = useState(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const imagePickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!imagePickerResult.cancelled) {
      setSelectedImage(imagePickerResult.uri);
      uploadImage(imagePickerResult.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const databaseRef = firebase.database().ref('sell');
      const newDonationRef = databaseRef.push();
      await newDonationRef.set({
        description,
        location,
        cooked,
        manufacturingDate: cooked ? null : manufacturingDate.toString(),
        expiryDate: cooked ? null : expiryDate.toString(),
        pickUpTime: cooked ? selectedPickUpTime.toString() : null,
        quantity,
        imageURL: selectedImage ? await getImageURL() : null,
        phoneNumber,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sellingPrice
      });
      console.log('Sale details submitted successfully');
    } catch (error) {
      console.error('Error submitting sale details:', error);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = firebase.storage().ref().child('images/' + Date.now());

    try {
      await storageRef.put(blob);
      console.log('Image uploaded successfully');
      const imageURL = await storageRef.getDownloadURL();
      saveDataToRealtimeDatabase(imageURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const getImageURL = async () => {
    try {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child('images/' + Date.now());
      return await imageRef.getDownloadURL();
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
    }
  };
  
  const saveDataToRealtimeDatabase = async (imageURL) => {
    try {
      const databaseRef = firebase.database().ref('sell');
      const newDonationRef = databaseRef.push();
      await newDonationRef.set({
        description,
        location,
        cooked,
        manufacturingDate: cooked ? null : manufacturingDate.toString(),
        expiryDate: cooked ? null : expiryDate.toString(),
        pickUpTime: cooked ? selectedPickUpTime.toString() : null,
        quantity,
        imageURL,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sellingPrice
      });
      console.log('Sale details submitted successfully');
    } catch (error) {
      console.error('Error submitting sale details:', error);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location is required!');
        return;
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
      alert('Failed to get current location');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Hey Seller, Fill it</Text>
        <View style={styles.form}>
          <Button title="Upload Image" onPress={handleImageUpload} color="#FF7F50" />
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
          <Button title={cooked ? 'Your Food Is: ' : 'Your Food Is: '}  color="#FF7F50" />
          <TextInput
            style={styles.input}
            placeholder="Give recipe suggestion or description (max 50 characters)"
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
          <TextInput
            style={styles.input}
            placeholder="Selling Price (e.g., $10)"
            value={sellingPrice}
            onChangeText={text => setSellingPrice(text)}
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
          <Button title="Sell" onPress={handleSubmit} color='#FF7F50' />
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
});

export default SellScreen;
