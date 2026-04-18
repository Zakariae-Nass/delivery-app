import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { restoreSession, logout } from '../redux/slices/authSlice';
import {
  addApplication,
  updateCommandeStatus,
  updateSelectionTimer,
  setAssignedCommande,
} from '../redux/slices/commandesSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { authService } from '../services/auth.service';
import { notificationsSocket } from '../services/notifications.socket';
import apiClient from '../api/axios.config';

// Auth screens
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Agency screens
import AgenceDashboardScreen  from '../screens/agence/DashboardScreen';
import OrdersListScreen       from '../screens/agence/OrdersListScreen';
import CreateOrderScreen      from '../screens/agence/CreateOrderScreen';
import NotificationsScreen    from '../screens/agence/NotificationsScreen';
import DriverSelectionScreen  from '../screens/agence/DriverSelectionScreen';
import NavigationScreen       from '../screens/agence/NavigationScreen';
import AgencyWalletScreen     from '../screens/agence/AgencyWalletScreen';

// Agency screens
import OrderTrackingScreen    from '../screens/agence/OrderTrackingScreen';
import AgencyProfileScreen    from '../screens/agence/AgencyProfileScreen';

// Delivery screens
import LivreurHomeScreen      from '../screens/livreur/HomeScreen';
import DriverProfileScreen    from '../screens/livreur/DriverProfileScreen';
import KycScreen              from '../screens/livreur/KycScreen';
import MesCandidaturesScreen  from '../screens/livreur/MesCandidaturesScreen';
import LivreurWalletScreen    from '../screens/livreur/LivreurWalletScreen';
import ActiveOrderScreen      from '../screens/livreur/ActiveOrderScreen';

const Stack = createStackNavigator();
const SCREEN_OPTIONS = { headerShown: false, animation: 'fade' };

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

function PublicStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AgencyStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="AgenceDashboard"  component={AgenceDashboardScreen} />
      <Stack.Screen name="OrdersList"       component={OrdersListScreen} />
      <Stack.Screen name="CreateOrder"      component={CreateOrderScreen} />
      <Stack.Screen name="Notifications"    component={NotificationsScreen} />
      <Stack.Screen name="DriverSelection"  component={DriverSelectionScreen} />
      <Stack.Screen name="Navigation"       component={NavigationScreen} />
      <Stack.Screen name="OrderTracking"    component={OrderTrackingScreen} />
      <Stack.Screen name="AgencyWallet"     component={AgencyWalletScreen} />
      <Stack.Screen name="AgencyProfile"    component={AgencyProfileScreen} />
    </Stack.Navigator>
  );
}

function DeliveryStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="LivreurHome"      component={LivreurHomeScreen} />
      <Stack.Screen name="DriverProfile"    component={DriverProfileScreen} />
      <Stack.Screen name="KycVerification"  component={KycScreen} />
      <Stack.Screen name="MesCandidatures"  component={MesCandidaturesScreen} />
      <Stack.Screen name="Wallet"           component={LivreurWalletScreen} />
      <Stack.Screen name="ActiveOrder"      component={ActiveOrderScreen} />
    </Stack.Navigator>
  );
}

const StackNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await authService.getStoredToken();
        if (token) {
          const { data } = await apiClient.get('/auth/me');
          dispatch(restoreSession({ token, user: data.user }));
        }
      } catch {
        await authService.logout();
        dispatch(logout());
      } finally {
        setSessionLoading(false);
      }
    };
    restoreAuth();
  }, [dispatch]);

  // Connect / disconnect notifications WebSocket based on login state
  useEffect(() => {
    if (isLoggedIn && user) {
      notificationsSocket.connect(user.id, user.role, dispatch, {
        addApplication,
        updateCommandeStatus,
        updateSelectionTimer,
        setAssignedCommande,
        addNotification,
      });
    } else {
      notificationsSocket.disconnect();
    }
    return () => {};
  }, [isLoggedIn, user?.id]);

  if (sessionLoading) return <SplashScreen />;
  if (!isLoggedIn) return <PublicStack />;
  if (user?.role === 'agency') return <AgencyStack />;
  if (user?.role === 'delivery') return <DeliveryStack />;
  return <PublicStack />;
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D14',
  },
});

export default StackNavigator;
