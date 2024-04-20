// BadgesScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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

const BadgesScreen = () => {
  const [donationCount, setDonationCount] = useState(0);
  const [badge, setBadge] = useState('Steel');

  useEffect(() => {
    const databaseRef = firebase.database().ref('donate');
    databaseRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const count = Object.keys(snapshot.val()).length;
        setDonationCount(count);

        // Update badge
        if (count >= 10 && count < 20) {
          setBadge('Bronze');
        } else if (count >= 20 && count < 30) {
          setBadge('Silver');
        } else if (count >= 30 && count < 40) {
          setBadge('Gold');
        } else if (count >= 40 && count < 50) {
          setBadge('Platinum');
        } else {
          setBadge('Steel');
        }
      }
    });

    return () => {
      databaseRef.off();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Badges</Text>
      <View style={styles.badgeContainer}>
        <Image style={styles.avatar} source={getBadgeImage(badge)} />
        <Text style={styles.badge}>{badge}</Text>
      </View>
      <Text style={styles.donationCount}>Total Donations: {donationCount}</Text>
      {badge !== 'Platinum' && (
        <Text style={styles.boostingMessage}>Donate more to achieve the Platinum badge!</Text>
      )}
    </View>
  );
};

const getBadgeImage = (badge) => {
  switch (badge) {
    case 'Bronze':
      return require('../assets/bronze_badge.png');
    case 'Silver':
      return require('../assets/silver_badge.png');
    case 'Gold':
      return require('../assets/gold_badge.png');
    case 'Platinum':
      return require('../assets/platinum_badge.png');
    default:
      return require('../assets/steel_badge.png');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f94d00',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  badge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f94d00',
    textAlign: 'center',
    marginLeft: 10,
  },
  donationCount: {
    fontSize: 16,
    color: '#fff',
  },
  boostingMessage: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default BadgesScreen;
