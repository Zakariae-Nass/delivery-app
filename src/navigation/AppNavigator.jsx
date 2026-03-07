import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AgenceDashboardScreen from '../screens/agence/DashboardScreen';
import LivreurHomeScreen from '../screens/livreur/HomeScreen';
import { Colors } from '../config/theme';
import { STORAGE_KEYS } from '../config/constants';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);

        if (token && userStr) {
          const user = JSON.parse(userStr);
          if (user.role === 'livreur') setInitialRoute('LivreurHome');
          else setInitialRoute('AgenceDashboard');
        } else {
          setInitialRoute('Login');
        }
      } catch {
        setInitialRoute('Login');
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgDark }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AgenceDashboard" component={AgenceDashboardScreen} />
        <Stack.Screen name="LivreurHome" component={LivreurHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
