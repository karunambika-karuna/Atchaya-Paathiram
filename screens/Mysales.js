// MySales.j
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
  
const MySales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const databaseRef = firebase.database().ref('sell');
      databaseRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const salesList = Object.values(data);
          setSales(salesList);
        }
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      alert('Failed to fetch sales. Please try again.');
    }
  };

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text>Description: {item.description}</Text>
      <Text>Price: {item.price}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Location: {item.location}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.saleImage} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Sales</Text>
      <FlatList
        data={sales}
        renderItem={renderSaleItem}
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
  saleItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  saleImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
});

export default MySales;
