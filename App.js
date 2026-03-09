import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
