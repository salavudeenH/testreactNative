import React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert,Image,ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import Home from './screens/Home'
import Details from './screens/Details'
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="Details"
        component={Details}
      />
    </Stack.Navigator>
  </NavigationContainer>

  )
}
export default App;


