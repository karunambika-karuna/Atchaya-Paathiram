import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  // Your Firebase config here
  // Make sure to replace the placeholder values with your actual Firebase config
  apiKey: "AIzaSyCfn8bx8CRYijBMjCKtMP8v3xkvqOHHktY",
  authDomain: "atchaya-paathiram-83df1.firebaseapp.com",
  projectId: "atchaya-paathiram-83df1",
  storageBucket: "atchaya-paathiram-83df1.appspot.com",
  messagingSenderId: "535479398498",
  appId: "1:535479398498:web:34aca664dcc8e92905613b",
  measurementId: "G-HE4D6X6FPR"


};

const App = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('User signed in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('User created successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      setMessage(`Authentication error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('User logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
      setMessage(`Logout error: ${error.message}`);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.authContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f94d00' }]} onPress={handleProfile}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f94d00' }]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authContainer}>
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#f94d00' }]} onPress={handleAuthentication}>
            <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </View>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f94d00',
    padding: 16,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  buttonContainer: {
    backgroundColor: '#f94d00',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
   
  },
  input: {
    height: 40,
    borderColor: '#ff7f00',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 15,
    
    color: 'white',
  },
  toggleText: {
    color: 'black',
    textAlign: 'center',
    
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
