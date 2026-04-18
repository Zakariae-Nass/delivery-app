import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setActiveCommande } from '../../redux/slices/commandesSlice';
import DrawerMenu from '../../components/DrawerMenu';
import { STATUS_CONFIG } from '../../config/constants';

const CORAL = '#FF6B5B';
const DARK  = '#1C1C1E';
const GRAY  = '#8E8EA0';
const LIGHT = '#F5F5F7';
const SUCCESS = '#22C55E';

export default function MesCandidaturesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { activeCommande } = useSelector((s) => s.commandes);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/commandes/my-applications');
      setApplications(data);
    } catch (e) {
      console.error('Applications fetch error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // Navigate to active order when assigned
  useEffect(() => {
    if (activeCommande) {
      navigation.navigate('ActiveOrder');
    }
  }, [activeCommande?.id]);

  const statusCfg = (status) => STATUS_CONFIG[status] || { label: status, color: GRAY, bg: LIGHT };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchApplications(); }}
            tintColor={CORAL}
          />
        }
      >
        {/* Header */}
        <View style={st.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={st.iconBtn}>
            <Ionicons name="menu-outline" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={st.title}>Mes Candidatures</Text>
          <View style={st.countBadge}>
            <Text style={st.countText}>{applications.length}</Text>
          </View>
        </View>

        {/* Active commande banner */}
        {activeCommande && (
          <TouchableOpacity
            style={st.activeBanner}
            onPress={() => navigation.navigate('ActiveOrder')}
          >
            <View style={st.activeBannerLeft}>
              <Ionicons name="bicycle-outline" size={22} color={SUCCESS} />
              <View>
                <Text style={st.activeBannerTitle}>Commande active</Text>
                <Text style={st.activeBannerSub}>{activeCommande.numero}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={SUCCESS} />
          </TouchableOpacity>
        )}

        {/* Applications list */}
        {loading ? (
          <ActivityIndicator color={CORAL} size="large" style={{ marginTop: 40 }} />
        ) : applications.length === 0 ? (
          <View style={st.empty}>
            <Ionicons name="document-outline" size={52} color={GRAY} />
            <Text style={st.emptyTitle}>Aucune candidature en cours</Text>
            <Text style={st.emptySub}>Postulez à des commandes depuis l'accueil</Text>
          </View>
        ) : (
          <View style={st.list}>
            {applications.map((commande) => {
              const cfg = statusCfg(commande.status);
              return (
                <View key={commande.id} style={st.card}>
                  <View style={st.cardHeader}>
                    <Text style={st.cardNumero}>{commande.numero}</Text>
                    <View style={[st.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[st.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>
                  <View style={st.addressRow}>
                    <Ionicons name="location-outline" size={14} color={CORAL} />
                    <Text style={st.addressText} numberOfLines={1}>{commande.pickupAddress}</Text>
                  </View>
                  <View style={st.addressRow}>
                    <Ionicons name="flag-outline" size={14} color={SUCCESS} />
                    <Text style={st.addressText} numberOfLines={1}>{commande.deliveryAddress}</Text>
                  </View>
                  <View style={st.cardFooter}>
                    <Text style={st.price}>{commande.price} MAD</Text>
                    <Text style={st.agence}>{commande.agence?.username || 'Agence'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="MesCandidatures"
        driverName={user?.username || ''}
        driverEmail={user?.email || ''}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:        { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  countBadge:   { backgroundColor: LIGHT, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  countText:    { fontSize: 14, fontWeight: '700', color: GRAY },
  activeBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(34,197,94,0.1)', margin: 16, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
  },
  activeBannerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeBannerTitle: { fontSize: 14, fontWeight: '700', color: SUCCESS },
  activeBannerSub:   { fontSize: 12, color: GRAY },
  empty:      { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: DARK, marginTop: 16 },
  emptySub:   { fontSize: 13, color: GRAY, textAlign: 'center', marginTop: 8 },
  list:       { paddingHorizontal: 16, gap: 12, paddingTop: 8 },
  card:       { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNumero: { fontSize: 16, fontWeight: '800', color: DARK },
  statusBadge:{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addressText:{ flex: 1, fontSize: 13, color: DARK, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price:      { fontSize: 16, fontWeight: '800', color: CORAL },
  agence:     { fontSize: 12, color: GRAY },
});
