import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../../config/theme';
import { MOCK_STATS_AGENCE } from '../../utils/mocks/mockData';
import { STATUS_CONFIG, VEHICLE_ICONS, DASHBOARD_FILTERS } from '../../config/constants';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';

export default function AgenceDashboardScreen({ navigation }) {
  const { orders } = useApp();
  const [activeFilter, setActiveFilter] = useState('toutes');

  const filteredOrders = orders.filter((c) => {
    if (activeFilter === 'toutes')     return true;
    if (activeFilter === 'en_cours')   return ['acceptee', 'en_route', 'pickup', 'Assigne', 'En cours'].includes(c.statut);
    if (activeFilter === 'en_attente') return c.statut === 'en_attente' || c.statut === 'En attente';
    if (activeFilter === 'livrees')    return c.statut === 'livree'     || c.statut === 'Livre';
    return true;
  });

  const handleLogout = () => navigation.replace('Login');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour</Text>
            <Text style={styles.agenceName}>Express Maroc</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <Text style={styles.avatarText}>EM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard icon="📦" label="Total"          value={MOCK_STATS_AGENCE.totalCommandes} color={Colors.info} />
          <StatCard icon="🚴" label="En cours"       value={MOCK_STATS_AGENCE.enCours}        color={Colors.primary} />
          <StatCard icon="⏳" label="En attente"     value={MOCK_STATS_AGENCE.enAttente}      color="#FF9F1C" />
          <StatCard icon="✅" label="Livrees"        value={MOCK_STATS_AGENCE.livrees}        color="#2DC653" />
          <StatCard icon="💰" label="Ce mois (MAD)"  value={MOCK_STATS_AGENCE.gainsMois}      color="#2DC653" />
        </ScrollView>

        {/* Bouton Nouvelle Commande */}
        <TouchableOpacity
          style={styles.newCommandeBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CreateOrder')}
        >
          <Text style={styles.newCommandeIcon}>+</Text>
          <Text style={styles.newCommandeText}>Nouvelle commande</Text>
        </TouchableOpacity>

        {/* Section Commandes */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>Mes commandes</Text>
            <Text style={styles.sectionCount}>{filteredOrders.length}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('OrdersList')}>
            <Text style={styles.voirTout}>Voir toutes →</Text>
          </TouchableOpacity>
        </View>

        {/* Filtres */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {DASHBOARD_FILTERS.map((f) => (
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

        {/* Liste commandes */}
        <View style={styles.commandesList}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
                <Text style={styles.emptyLink}>Creer une commande →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => navigation.navigate('OrdersList')}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OrderCard({ order, onPress }) {
  const status = STATUS_CONFIG[order.statut] || STATUS_CONFIG['En attente'];
  const pickup = order.pickupAdresse   || order.departTexte      || '—';
  const depot  = order.depotAdresse    || order.destinationTexte || '—';
  const vtype  = order.vehiculeType    || order.vehicleType      || '';
  const desc   = order.description     || order.packageType      || '';
  const prix   = order.prix !== undefined ? `${order.prix} MAD` : '—';

  return (
    <TouchableOpacity style={[cardStyles.card, order.isUrgent && cardStyles.cardUrgent]} activeOpacity={0.8} onPress={onPress}>
      {order.isUrgent && (
        <View style={cardStyles.urgentBadge}>
          <Text style={cardStyles.urgentBadgeText}>🔴 URGENT</Text>
        </View>
      )}
      <View style={cardStyles.header}>
        <View style={cardStyles.idRow}>
          <Text style={cardStyles.vehicleIcon}>{VEHICLE_ICONS[vtype] || '📦'}</Text>
          <Text style={cardStyles.id}>#{order.id.slice(0, 8)}</Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[cardStyles.statusText, { color: status.color }]}>
            {status.icon} {status.label}
          </Text>
        </View>
      </View>
      <View style={cardStyles.addressSection}>
        <View style={cardStyles.addressRow}>
          <View style={[cardStyles.dot, { backgroundColor: '#4361EE' }]} />
          <Text style={cardStyles.addressText} numberOfLines={1}>{pickup}</Text>
        </View>
        <View style={cardStyles.addressLine} />
        <View style={cardStyles.addressRow}>
          <View style={[cardStyles.dot, { backgroundColor: '#2DC653' }]} />
          <Text style={cardStyles.addressText} numberOfLines={1}>{depot}</Text>
        </View>
      </View>
      <View style={cardStyles.footer}>
        <Text style={cardStyles.description} numberOfLines={1}>📦 {desc}</Text>
        <Text style={cardStyles.prix}>{prix}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: Colors.bgDark },
  container:     { flex: 1, backgroundColor: Colors.bgDark },
  scrollContent: { paddingBottom: 32 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting:    { fontSize: FontSize.sm,  color: Colors.textSecondary },
  agenceName:  { fontSize: FontSize.xl,  fontWeight: '800', color: Colors.textPrimary },
  topBarRight: { flexDirection: 'row',   alignItems: 'center', gap: 10 },
  notifBtn:    { position: 'relative',   padding: Spacing.xs },
  notifIcon:   { fontSize: 22 },
  notifBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.error,
  },
  avatarBtn: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.primaryGhost,
    borderWidth: 1.5, borderColor: Colors.borderActive,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },

  statsScroll:  { marginBottom: Spacing.md },
  statsContent: { paddingHorizontal: Spacing.lg, gap: 10 },

  newCommandeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    height: 52,
    gap: 8,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  newCommandeIcon: { color: '#fff', fontSize: 22, fontWeight: '300' },
  newCommandeText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  sectionCount: {
    backgroundColor: Colors.bgElevated,
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voirTout: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  filtersScroll:   { marginBottom: Spacing.md },
  filtersContent:  { paddingHorizontal: Spacing.lg, gap: 8 },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive:  { backgroundColor: Colors.primaryGhost, borderColor: Colors.borderActive },
  filterText:        { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive:  { color: Colors.primary },

  commandesList: { paddingHorizontal: Spacing.lg, gap: 12 },

  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon:  { fontSize: 48, marginBottom: 12 },
  emptyText:  { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 10 },
  emptyLink:  { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
});


const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  cardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#E63946',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF0F0',
    borderColor: '#E63946',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 1,
  },
  urgentBadgeText: { color: '#E63946', fontSize: 11, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleIcon: { fontSize: 18 },
  id:          { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText:  { fontSize: 11, fontWeight: '700' },
  addressSection: { marginBottom: 10 },
  addressRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  addressLine:    { width: 1.5, height: 10, backgroundColor: '#E0E0E0', marginLeft: 3.5, marginVertical: 2 },
  addressText:    { flex: 1, fontSize: 13, color: '#1A1A2E', fontWeight: '500' },
  footer:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F5' },
  description: { flex: 1, fontSize: 11, color: '#999', marginRight: 8 },
  prix:        { fontSize: 14, fontWeight: '800', color: '#4361EE' },
});
