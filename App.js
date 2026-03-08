import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import  GeocodingTest from './src/screens/GeocodingTest'

export default function App() {
  // return (
  // //   <NavigationContainer>
  // //     <StackNavigator />
  // //   </NavigationContainer>
  // // );
  return (
    <GeocodingTest />
  );
}