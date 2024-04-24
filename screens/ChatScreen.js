import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const firebaseConfig = {
    apiKey: "AIzaSyCfn8bx8CRYijBMjCKtMP8v3xkvqOHHktY",
    authDomain: "atchaya-paathiram-83df1.firebaseapp.com",
    projectId: "atchaya-paathiram-83df1",
    storageBucket: "atchaya-paathiram-83df1.appspot.com",
    messagingSenderId: "535479398498",
    appId: "1:535479398498:web:34aca664dcc8e92905613b",
    measurementId: "G-HE4D6X6FPR"
  
  };
const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onMessageReceived = database().ref('/messages').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });

    return () => database().ref('/messages').off('value', onMessageReceived);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        id: String(messages.length + 1),
        text: message,
        sender: 'buyer',
      };
      database().ref('/messages/' + newMessage.id).set(newMessage);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <View style={[styles.messageBubble, { backgroundColor: item.sender === 'seller' ? '#DCF8C6' : '#E5E5EA' }]}>
              <Text style={{ fontSize: 16 }}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message..."
          placeholderTextColor="#777"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <MaterialCommunityIcons name="send" size={24} color="#f94d00" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    paddingHorizontal: 10,
    marginVertical: 5,
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default ChatScreen;
