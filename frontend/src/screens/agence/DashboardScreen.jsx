import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { logout } from '../../redux/slices/authSlice';
import { setCommandes } from '../../redux/slices/commandesSlice';
import { authService } from '../../services/auth.service';
import { notificationsSocket } from '../../services/notifications.socket';
import StatCard from '../../components/StatCard';
import CommandeCard from './components/CommandeCard';
import { styles } from './styles/DashboardScreen.styles';
import { Colors } from '../../config/theme';
import { STATUS_CONFIG } from '../../config/constants';

const FILTERS = [
  { key: 'toutes',     label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours',   label: 'En cours' },
  { key: 'livrees',    label: 'Livrées' },
];

export default function AgenceDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: commandes } = useSelector((s) => s.commandes);
  const { unreadCount } = useSelector((s) => s.notifications);

  const [activeFilter, setActiveFilter] = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommandes = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/commandes/mine');
      dispatch(setCommandes(data));
    } catch (e) {
      console.error('Failed to fetch commandes', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchCommandes(); }, [fetchCommandes]);

  const filteredCommandes = commandes.filter((c) => {
    if (activeFilter === 'toutes') return true;
    if (activeFilter === 'en_cours') return ['en_cours_pickup', 'colis_recupere'].includes(c.status);
    if (activeFilter === 'en_attente') return c.status === 'en_attente';
    if (activeFilter === 'livrees') return c.status === 'livree';
    return true;
  });

  const stats = {
    total:     commandes.length,
    enCours:   commandes.filter(c => ['en_cours_pickup','colis_recupere'].includes(c.status)).length,
    enAttente: commandes.filter(c => c.status === 'en_attente').length,
    livrees:   commandes.filter(c => c.status === 'livree').length,
  };

  const handleLogout = async () => {
    notificationsSocket.disconnect();
    await authService.logout();
    dispatch(logout());
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'AG';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCommandes(); }} tintColor={Colors.primary} />}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour</Text>
            <Text style={styles.agenceName}>{user?.username || 'Agence'}</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              {unreadCount > 0 && <View style={styles.notifBadge} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard icon="cube-outline"     label="Total"      value={stats.total}     color={Colors.info || '#4361EE'} />
          <StatCard icon="bicycle-outline"  label="En cours"   value={stats.enCours}   color={Colors.primary} />
          <StatCard icon="time-outline"     label="En attente" value={stats.enAttente} color={Colors.warning} />
          <StatCard icon="checkmark-circle-outline" label="Livrées" value={stats.livrees} color={Colors.success} />
        </ScrollView>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 8 }}>
          <TouchableOpacity
            style={[styles.newCommandeBtn, { flex: 1, marginHorizontal: 0, marginBottom: 0 }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CreateOrder')}
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.newCommandeText}>Nouvelle commande</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.newCommandeBtn, { flex: 0, paddingHorizontal: 16, backgroundColor: '#4361EE', marginHorizontal: 0, marginBottom: 0 }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AgencyWallet')}
          >
            <Ionicons name="wallet-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.sectionTitle}>Mes commandes</Text>
            <Text style={styles.sectionCount}>{filteredCommandes.length}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('OrdersList')}>
            <Text style={styles.voirTout}>Voir toutes</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        <View style={styles.commandesList}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : filteredCommandes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={52} color={Colors.textSecondary} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
                <Text style={styles.emptyLink}>Créer une commande</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredCommandes.map((commande) => (
              <CommandeCard
                key={commande.id}
                commande={commande}
                onPress={() => {
                  const isActive = ['en_cours_pickup', 'colis_recupere'].includes(commande.status);
                  navigation.navigate(isActive ? 'OrderTracking' : 'DriverSelection', { commandeId: commande.id });
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
