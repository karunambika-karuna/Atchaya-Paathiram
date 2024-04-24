import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Post = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    const databaseRef = firebase.database().ref();
    databaseRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const postData = snapshot.val();
        let postArray = [];
        if (filter === 'All') {
          if (postData.donations) postArray = postArray.concat(Object.values(postData.donations));
          if (postData.sales) postArray = postArray.concat(Object.values(postData.sales));
        } else if (filter === 'Donation') {
          if (postData.donations) postArray = Object.values(postData.donations);
        } else if (filter === 'Sale') {
          if (postData.sales) postArray = Object.values(postData.sales);
        }
        setPosts(postArray.filter(post => post.userId !== currentUser?.uid));
      }
    });

    return () => {
      databaseRef.off();
    };
  }, [filter, currentUser?.uid]);

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleOrder = (item) => {
    console.log("Ordering item:", item);
    navigation.navigate('OrderPage', { item: item });
  };

  const renderPostItem = ({ item, index }) => (
    <View key={index} style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postType}>{item.type}</Text>
      <Text style={styles.postDescription}>Description: {item.description}</Text>
      <Text style={styles.postDescription}>Location: {item.location}</Text>
      {item.cooked ? (
        <>
          <Text style={styles.postDescription}>Manufacturing Date: {item.manufacturingDate}</Text>
          <Text style={styles.postDescription}>Expiry Date: {item.expiryDate}</Text>
        </>
      ) : (
        <Text style={styles.postDescription}>Pick Up Time: {item.pickUpTime}</Text>
      )}
      <Text style={styles.postDescription}>Quantity: {item.quantity}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.postImage} />}
      <Text style={styles.postDescription}>Phone Number: {item.phoneNumber}</Text>
      <TouchableOpacity style={styles.orderButton} onPress={() => handleOrder(item)}>
        <Text style={styles.buttonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'All' && styles.filterButtonActive]}
          onPress={() => handleFilter('All')}
        >
          <Text style={[styles.filterButtonText, filter === 'All' && styles.filterButtonTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Donation' && styles.filterButtonActive]}
          onPress={() => handleFilter('Donation')}
        >
          <Text style={[styles.filterButtonText, filter === 'Donation' && styles.filterButtonTextActive]}>Donation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Sale' && styles.filterButtonActive]}
          onPress={() => handleFilter('Sale')}
        >
          <Text style={[styles.filterButtonText, filter === 'Sale' && styles.filterButtonTextActive]}>Sale</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#000',
  },
  filterButtonActive: {
    backgroundColor: '#f94d00',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  postContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postType: {
    fontSize: 16,
    color: '#f94d00',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: '#f94d00',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Post;
