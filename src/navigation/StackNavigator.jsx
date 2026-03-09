import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OrdersListScreen      from '../screens/agence/OrdersListScreen';
import CreateOrderScreen     from '../screens/agence/CreateOrderScreen';
import NotificationsScreen   from '../screens/agence/NotificationsScreen';
import DriverSelectionScreen from '../screens/agence/DriverSelectionScreen';
import NavigationScreen      from '../screens/agence/NavigationScreen';
import LoginScreen           from '../screens/auth/LoginScreen';
import RegisterScreen        from '../screens/auth/RegisterScreen';
import AgenceDashboardScreen from '../screens/agence/DashboardScreen';
import LivreurHomeScreen     from '../screens/livreur/HomeScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
       <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="Register"       component={RegisterScreen} />
      {/* ── Order flow (initial) ── */}
      <Stack.Screen name="OrdersList"      component={OrdersListScreen} />
      <Stack.Screen name="CreateOrder"     component={CreateOrderScreen} />
      <Stack.Screen name="Notifications"   component={NotificationsScreen} />
      <Stack.Screen name="DriverSelection" component={DriverSelectionScreen} />
      <Stack.Screen name="Navigation"      component={NavigationScreen} />

      {/* ── Auth / other roles ── */}
  
      <Stack.Screen name="AgenceDashboard" component={AgenceDashboardScreen} />
      <Stack.Screen name="LivreurHome"    component={LivreurHomeScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
