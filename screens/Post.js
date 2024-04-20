import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import Donation from './Mydonations';
import Sale from './Mysales';

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

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const databaseRef = firebase.database().ref('posts');
    databaseRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const postData = snapshot.val();
        const postArray = Object.values(postData);
        setPosts(postArray);
        setFilteredPosts(postArray);
      }
    });

    return () => {
      databaseRef.off();
    };
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredPosts(posts);
    } else if (filter === 'Donation') {
      const filtered = posts.filter(post => post.type === 'Donation');
      setFilteredPosts(filtered);
    } else if (filter === 'Sale') {
      const filtered = posts.filter(post => post.type === 'Sale');
      setFilteredPosts(filtered);
    }
  }, [filter, posts]);

  const handleFilter = (type) => {
    setFilter(type);
  };

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
      {(filter === 'All' || filter === 'Donation') && <Donation />}
      {(filter === 'All' || filter === 'Sale') && <Sale />}
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
});

export default Post;
