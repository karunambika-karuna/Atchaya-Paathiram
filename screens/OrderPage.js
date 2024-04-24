import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OrderPage = ({ route, navigation }) => {
  const { item } = route.params;

  const handleMessageSeller = () => {
    navigation.navigate('ChatScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order Details</Text>
      <Text style={styles.label}>Description:</Text>
      <Text>{item.description}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text>{item.location}</Text>
      {item.cooked ? (
        <>
          <Text style={styles.label}>Manufacturing Date:</Text>
          <Text>{item.manufacturingDate}</Text>
          <Text style={styles.label}>Expiry Date:</Text>
          <Text>{item.expiryDate}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Pick Up Time:</Text>
          <Text>{item.pickUpTime}</Text>
        </>
      )}
      <Text style={styles.label}>Quantity:</Text>
      <Text>{item.quantity}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.postImage} />}
      <Text style={styles.label}>Phone Number:</Text>
      <Text>{item.phoneNumber}</Text>
      <TouchableOpacity style={styles.button} onPress={handleMessageSeller}>
        <Text style={styles.buttonText}>Message Seller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f94d00',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderPage;
