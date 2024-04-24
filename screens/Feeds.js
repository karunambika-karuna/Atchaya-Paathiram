// Feeds.js

import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import HomeScreen from './Home';
import DonateScreen from './Donate';
import SellScreen from './Sell';
import BadgesScreen from './Badges';
import NotificationsScreen from './Notification';
import MyDonations from './Mydonations';
import MySales from './Mysales';
import Post from './Post';
import ChatScreen from './ChatScreen';
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();


const DrawerScreens = {
  Post: {
    screen: Post,
    navigationOptions: {
      tabBarLabel: 'Buy',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="cart" color={color} size={26} />
      ),
    },
  },
  Donate: {
    screen: DonateScreen,
    navigationOptions: {
      tabBarLabel: 'Donate',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="heart-outline" color={color} size={26} />
      ),
    },
  },
  Sell: {
    screen: SellScreen,
    navigationOptions: {
      tabBarLabel: 'Sell',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="shopping" color={color} size={26} />
      ),
    },
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      tabBarLabel: 'Chat',
      tabBarIcon: ({ color }) => (
        <MaterialCommunityIcons name="chat" color={color} size={26} />
      ),
    },
  },
};




function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Post"
      activeColor="#f94d00"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: '#f94d00' }}
    >
      {Object.entries(DrawerScreens).map(([name, options]) => (
        <Tab.Screen
          key={name}
          name={name}
          component={options.screen}
          options={options.navigationOptions}
        />
      ))}
    </Tab.Navigator>
  );
}

function Feeds() {
  return (
    <Drawer.Navigator
  
      screenOptions={{
        drawerItemStyle: {
          backgroundColor: '#f94d00',
          borderRadius: 5,
          marginVertical: 3,
        },
        drawerLabelStyle: {
          fontWeight: 'bold',
        },
        activeTintColor: '#FFFFFF',
      }}
    >
  
    
      <Drawer.Screen name="Atchaya Paathiram" component={TabNavigator} />
      <Drawer.Screen name="My Donations" component={MyDonations} />
      <Drawer.Screen name="My Sales" component={MySales} />
      <Drawer.Screen name="My Badges" component={BadgesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Logout" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default Feeds;
