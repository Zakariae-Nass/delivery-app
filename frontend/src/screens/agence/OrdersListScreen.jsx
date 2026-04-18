import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setCommandes } from '../../redux/slices/commandesSlice';
import { STATUS_CONFIG } from '../../config/constants';

const CORAL = '#FF6B35';
const DARK  = '#1A1A2E';
const GRAY  = '#8E8EA0';
const LIGHT = '#F5F7FF';

export default function OrdersListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list: commandes } = useSelector((s) => s.commandes);
  const { unreadCount }     = useSelector((s) => s.notifications);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]         = useState('toutes');

  const fetchCommandes = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/commandes/mine');
      dispatch(setCommandes(data));
    } catch (e) {
      console.error('OrdersList fetch error', e);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchCommandes(); }, [fetchCommandes]);

  const FILTERS = [
    { key: 'toutes',     label: 'Toutes' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'en_cours',   label: 'En cours' },
    { key: 'livrees',    label: 'Livrées' },
    { key: 'annulees',   label: 'Annulées' },
  ];

  const filtered = commandes.filter((c) => {
    if (filter === 'toutes')    return true;
    if (filter === 'en_attente') return c.status === 'en_attente';
    if (filter === 'en_cours')   return ['en_cours_pickup','colis_recupere'].includes(c.status);
    if (filter === 'livrees')    return c.status === 'livree';
    if (filter === 'annulees')   return c.status === 'annulee';
    return true;
  });

  const renderItem = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] || {};
    const isActive = ['en_cours_pickup','colis_recupere'].includes(item.status);
    return (
      <TouchableOpacity
        style={st.card}
        onPress={() => isActive
          ? navigation.navigate('OrderTracking', { commandeId: item.id })
          : navigation.navigate('DriverSelection', { commandeId: item.id })
        }
        activeOpacity={0.8}
      >
        <View style={st.cardHeader}>
          <Text style={st.cardNumero}>{item.numero}</Text>
          <View style={[st.badge, { backgroundColor: cfg.bg || LIGHT }]}>
            <Text style={[st.badgeText, { color: cfg.color || GRAY }]}>{cfg.label || item.status}</Text>
          </View>
        </View>
        {item.isUrgent && (
          <View style={st.urgentBadge}>
            <Ionicons name="flash" size={12} color="#E63946" />
            <Text style={st.urgentText}>URGENT</Text>
          </View>
        )}
        <View style={st.addresses}>
          <View style={st.addrRow}>
            <Ionicons name="radio-button-on" size={14} color={CORAL} />
            <Text style={st.addrText} numberOfLines={1}>{item.pickupAddress}</Text>
          </View>
          <View style={st.addrRow}>
            <Ionicons name="location" size={14} color="#22C55E" />
            <Text style={st.addrText} numberOfLines={1}>{item.deliveryAddress}</Text>
          </View>
        </View>
        <View style={st.cardFooter}>
          <Text style={st.price}>{item.price} MAD</Text>
          <Text style={st.client}>{item.clientName}</Text>
          {item.livreur && <Text style={st.livreur}>{item.livreur.username}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={st.root}>
      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={st.title}>Mes Commandes</Text>
        <View style={st.headerRight}>
          <TouchableOpacity
            style={st.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={DARK} />
            {unreadCount > 0 && <View style={st.bellBadge} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={st.addBtn}
            onPress={() => navigation.navigate('CreateOrder')}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={st.filterRow}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(f) => f.key}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[st.chip, filter === f.key && st.chipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[st.chipText, filter === f.key && st.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={st.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchCommandes(); }}
            tintColor={CORAL}
          />
        }
        ListEmptyComponent={
          <View style={st.empty}>
            <Ionicons name="cube-outline" size={52} color={GRAY} />
            <Text style={st.emptyTitle}>Aucune commande</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
              <Text style={st.emptyLink}>Créer une commande</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:     { flex: 1, backgroundColor: LIGHT },
  header:   { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  backBtn:  { padding: 4 },
  title:    { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  headerRight:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  bellBtn:  { position: 'relative', padding: 4 },
  bellBadge:{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E63946' },
  addBtn:   { backgroundColor: CORAL, borderRadius: 10, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  filterRow:{ paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ECECF0' },
  chip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: LIGHT, borderWidth: 1, borderColor: '#ECECF0' },
  chipActive:{ backgroundColor: 'rgba(255,107,53,0.1)', borderColor: CORAL },
  chipText:  { fontSize: 13, fontWeight: '600', color: GRAY },
  chipTextActive:{ color: CORAL },
  list:     { padding: 16, gap: 12 },
  card:     { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardNumero:{ fontSize: 15, fontWeight: '800', color: DARK },
  badge:    { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:{ fontSize: 12, fontWeight: '700' },
  urgentBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  urgentText:{ fontSize: 11, fontWeight: '800', color: '#E63946' },
  addresses:{ gap: 6, marginBottom: 10 },
  addrRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addrText: { flex: 1, fontSize: 13, color: DARK, fontWeight: '500' },
  cardFooter:{ flexDirection: 'row', alignItems: 'center', gap: 12 },
  price:    { fontSize: 15, fontWeight: '800', color: CORAL },
  client:   { fontSize: 13, color: GRAY, flex: 1 },
  livreur:  { fontSize: 12, color: '#4361EE', fontWeight: '600' },
  empty:    { alignItems: 'center', paddingTop: 60 },
  emptyTitle:{ fontSize: 18, fontWeight: '700', color: DARK, marginTop: 16 },
  emptyLink: { fontSize: 14, color: CORAL, fontWeight: '700', marginTop: 8 },
});
