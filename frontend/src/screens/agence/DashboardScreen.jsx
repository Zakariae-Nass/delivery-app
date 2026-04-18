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
import { setCommandes } from '../../redux/slices/commandesSlice';
import { notificationsSocket } from '../../services/notifications.socket';
import StatCard from '../../components/StatCard';
import DrawerMenu from '../../components/DrawerMenu';
import CommandeCard from './components/CommandeCard';
import { styles } from './styles/DashboardScreen.styles';

const FILTERS = [
  { key: 'toutes',     label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours',   label: 'En cours' },
  { key: 'livrees',    label: 'Livrées' },
];

const AGENCY_MENU_ITEMS = [
  { key: 'AgenceDashboard', label: 'Dashboard',      icon: 'home-outline' },
  { key: 'OrdersList',      label: 'Mes Commandes',  icon: 'list-outline' },
  { key: 'AgencyWallet',    label: 'Mon Wallet',     icon: 'wallet-outline' },
  { key: 'AgencyProfile',   label: 'Mon Profil',     icon: 'person-outline' },
  { key: 'Notifications',   label: 'Notifications',  icon: 'notifications-outline' },
];

export default function AgenceDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: commandes } = useSelector((s) => s.commandes);
  const { unreadCount } = useSelector((s) => s.notifications);

  const [activeFilter, setActiveFilter] = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchCommandes(); }}
              tintColor="#FF6B35"
            />
          }
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
                <Ionicons name="menu-outline" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <View>
                <Text style={styles.greeting}>Bonjour</Text>
                <Text style={styles.agenceName}>{user?.username || 'Agence'}</Text>
              </View>
            </View>
            <View style={styles.topBarRight}>
              <TouchableOpacity
                style={styles.notifBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color="#1C1C1E" />
                {unreadCount > 0 && <View style={styles.notifBadge} />}
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
            <StatCard icon="cube-outline"              label="Total"      value={stats.total}     color="#4361EE" />
            <StatCard icon="bicycle-outline"           label="En cours"   value={stats.enCours}   color="#FF6B35" />
            <StatCard icon="time-outline"              label="En attente" value={stats.enAttente} color="#F59E0B" />
            <StatCard icon="checkmark-circle-outline"  label="Livrées"    value={stats.livrees}   color="#22C55E" />
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
              <ActivityIndicator color="#FF6B35" size="large" style={{ marginTop: 40 }} />
            ) : filteredCommandes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={52} color="#8E8EA0" style={{ marginBottom: 12 }} />
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

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="AgenceDashboard"
        driverName={user?.username || ''}
        driverEmail={user?.email || ''}
        menuItems={AGENCY_MENU_ITEMS}
        profileScreenName="AgencyProfile"
      />
    </View>
  );
}
