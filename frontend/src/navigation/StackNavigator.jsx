/**
 * StackNavigator.jsx
 *
 * Navigation conditionnelle basée sur Redux state.auth.isLoggedIn.
 *
 * Au démarrage (sessionLoading = true) :
 *   → Écran de chargement pendant la vérification du token en SecureStore.
 *
 * isLoggedIn = false :
 *   → Stack publique : Login + Register uniquement.
 *   → L'utilisateur ne peut PAS accéder aux écrans protégés.
 *
 * isLoggedIn = true, role = "agency" :
 *   → Stack agence : Dashboard, OrdersList, CreateOrder, etc.
 *
 * isLoggedIn = true, role = "delivery" :
 *   → Stack livreur : Home, Profile, KYC, Candidatures, Wallet.
 *
 * Pourquoi cette approche (stacks séparées) plutôt qu'une seule stack avec
 * un initialRouteName conditionnel ?
 * → React Navigation recommande de changer la STRUCTURE du navigator quand
 *   l'état auth change. Ainsi, les écrans non autorisés n'existent tout
 *   simplement pas dans la stack — impossible d'y naviguer par erreur.
 * → La transition entre "non connecté" et "connecté" est automatiquement
 *   animée par React Navigation.
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { restoreSession, logout } from '../redux/slices/authSlice';
import { authService } from '../services/auth.service';
import apiClient from '../api/axios.config';

// ─── Écrans auth (publics) ───────────────────────────────────────────────────
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// ─── Écrans agence ───────────────────────────────────────────────────────────
import AgenceDashboardScreen  from '../screens/agence/DashboardScreen';
import OrdersListScreen       from '../screens/agence/OrdersListScreen';
import CreateOrderScreen      from '../screens/agence/CreateOrderScreen';
import NotificationsScreen    from '../screens/agence/NotificationsScreen';
import DriverSelectionScreen  from '../screens/agence/DriverSelectionScreen';
import NavigationScreen       from '../screens/agence/NavigationScreen';

// ─── Écrans livreur ──────────────────────────────────────────────────────────
import LivreurHomeScreen      from '../screens/livreur/HomeScreen';
import DriverProfileScreen    from '../screens/livreur/DriverProfileScreen';
import KycScreen              from '../screens/livreur/KycScreen';
import MesCandidaturesScreen  from '../screens/livreur/MesCandidaturesScreen';
import LivreurWalletScreen    from '../screens/livreur/LivreurWalletScreen';

const Stack = createStackNavigator();

// Options communes à toutes les stacks
const SCREEN_OPTIONS = { headerShown: false, animation: 'fade' };

// ─── Écran de chargement initial ─────────────────────────────────────────────
function SplashScreen() {
  return (
    <View style={styles.splash}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

// ─── Stack publique (non connecté) ───────────────────────────────────────────
function PublicStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Stack agence ─────────────────────────────────────────────────────────────
function AgencyStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="AgenceDashboard"  component={AgenceDashboardScreen} />
      <Stack.Screen name="OrdersList"       component={OrdersListScreen} />
      <Stack.Screen name="CreateOrder"      component={CreateOrderScreen} />
      <Stack.Screen name="Notifications"    component={NotificationsScreen} />
      <Stack.Screen name="DriverSelection"  component={DriverSelectionScreen} />
      <Stack.Screen name="Navigation"       component={NavigationScreen} />
    </Stack.Navigator>
  );
}

// ─── Stack livreur ────────────────────────────────────────────────────────────
function DeliveryStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="LivreurHome"      component={LivreurHomeScreen} />
      <Stack.Screen name="DriverProfile"    component={DriverProfileScreen} />
      <Stack.Screen name="KycVerification"  component={KycScreen} />
      <Stack.Screen name="MesCandidatures"  component={MesCandidaturesScreen} />
      <Stack.Screen name="Wallet"           component={LivreurWalletScreen} />
    </Stack.Navigator>
  );
}

// ─── Navigateur racine ────────────────────────────────────────────────────────
const StackNavigator = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // true pendant qu'on vérifie SecureStore au démarrage
  const [sessionLoading, setSessionLoading] = useState(true);

  /**
   * Restauration de session au démarrage.
   *
   * Flux :
   * 1. Lire le token depuis SecureStore
   * 2. Si token présent → appeler GET /auth/me pour vérifier qu'il est encore valide
   *    (un token expiré retourne 401 et on le supprime)
   * 3. Si valide → dispatch(restoreSession) → isLoggedIn = true sans repasser par Login
   * 4. Si invalide ou absent → afficher Login
   */
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await authService.getStoredToken();

        if (token) {
          // Le token est en SecureStore → l'intercepteur axios l'injecte
          const { data } = await apiClient.get('/auth/me');
          dispatch(restoreSession({ token, user: data.user }));
        }
      } catch {
        // Token expiré ou invalide → on le supprime et on affiche Login
        await authService.logout();
        dispatch(logout());
      } finally {
        // Quoi qu'il arrive, on arrête l'écran de chargement
        setSessionLoading(false);
      }
    };

    restoreAuth();
  }, [dispatch]);

  // ── Pendant la vérification initiale ──────────────────────────────────────
  if (sessionLoading) {
    return <SplashScreen />;
  }

  // ── Non connecté → écrans publics uniquement ───────────────────────────────
  if (!isLoggedIn) {
    return <PublicStack />;
  }

  // ── Connecté → stack selon le rôle ────────────────────────────────────────
  if (user?.role === 'agency') {
    return <AgencyStack />;
  }

  if (user?.role === 'delivery') {
    return <DeliveryStack />;
  }

  // Rôle admin ou inconnu → renvoyer vers Login par sécurité
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
