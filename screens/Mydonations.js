// MyDonations.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const firebaseConfig = {
    apiKey: "AIzaSyCfn8bx8CRYijBMjCKtMP8v3xkvqOHHktY",
    authDomain: "atchaya-paathiram-83df1.firebaseapp.com",
    projectId: "atchaya-paathiram-83df1",
    storageBucket: "atchaya-paathiram-83df1.appspot.com",
    messagingSenderId: "535479398498",
    appId: "1:535479398498:web:34aca664dcc8e92905613b",
    measurementId: "G-HE4D6X6FPR"
  
  };
  
const MyDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const databaseRef = firebase.database().ref('donate');
      databaseRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const donationList = Object.values(data);
          setDonations(donationList);
        }
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Failed to fetch donations. Please try again.');
    }
  };

  const renderDonationItem = ({ item }) => (
    <View style={styles.donationItem}>
      <Text>Description: {item.description}</Text>
      <Text>Quantity: {item.quantity}</Text>
      {item.cooked ? (
        <Text>Pick Up Time: {new Date(item.pickUpTime).toLocaleTimeString()}</Text>
      ) : (
        <>
          <Text>Manufacturing Date: {new Date(item.manufacturingDate).toDateString()}</Text>
          <Text>Expiry Date: {new Date(item.expiryDate).toDateString()}</Text>
        </>
      )}
      <Text>Location: {item.location}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.donationImage} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Donations</Text>
      <FlatList
        data={donations}
        renderItem={renderDonationItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f94d00',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  donationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  donationImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
});

export default MyDonations;
