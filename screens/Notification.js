import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';

const NotificationScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heyy Let Me Remind U</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#f94d00" }}
        thumbColor={isEnabled ? "#f94d00" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default NotificationScreen;
