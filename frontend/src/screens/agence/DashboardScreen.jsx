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
import { MOCK_COMMANDES_AGENCE, MOCK_STATS_AGENCE } from '../../config/mockData';

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', color: Colors.warning, bg: Colors.warningGhost, icon: '⏳' },
  acceptee:   { label: 'Acceptée',   color: Colors.info,    bg: 'rgba(59,130,246,0.12)', icon: '✅' },
  en_route:   { label: 'En route',   color: Colors.primary, bg: Colors.primaryGhost,   icon: '🚴' },
  livree:     { label: 'Livrée',     color: Colors.success, bg: Colors.successGhost,   icon: '✅' },
  annulee:    { label: 'Annulée',    color: Colors.error,   bg: Colors.errorGhost,     icon: '❌' },
};

const VEHICLE_ICONS = {
  moto: '🛵',
  voiture: '🚗',
  camionnette: '🚐',
};

const FILTERS = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'livrees', label: 'Livrées' },
];

export default function AgenceDashboardScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('toutes');

  const filteredCommandes = MOCK_COMMANDES_AGENCE.filter((c) => {
    if (activeFilter === 'toutes') return true;
    if (activeFilter === 'en_cours') return ['acceptee', 'en_route', 'pickup'].includes(c.statut);
    if (activeFilter === 'en_attente') return c.statut === 'en_attente';
    if (activeFilter === 'livrees') return c.statut === 'livree';
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
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
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

        {/* ── Stats Cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard icon="📦" label="Total" value={MOCK_STATS_AGENCE.totalCommandes} color={Colors.info} />
          <StatCard icon="🚴" label="En cours" value={MOCK_STATS_AGENCE.enCours} color={Colors.primary} />
          <StatCard icon="⏳" label="En attente" value={MOCK_STATS_AGENCE.enAttente} color={Colors.warning} />
          <StatCard icon="✅" label="Livrées" value={MOCK_STATS_AGENCE.livrees} color={Colors.success} />
          <StatCard icon="💰" label="Ce mois (MAD)" value={MOCK_STATS_AGENCE.gainsMois} color={Colors.success} />
        </ScrollView>

        {/* ── Bouton Nouvelle Commande ── */}
        <TouchableOpacity style={styles.newCommandeBtn} activeOpacity={0.85} onPress={() => navigation.navigate('CreateOrder')}>
          <Text style={styles.newCommandeIcon}>+</Text>
          <Text style={styles.newCommandeText}>Nouvelle commande</Text>
        </TouchableOpacity>

        {/* ── Section Commandes ── */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.sectionTitle}>Mes commandes</Text>
            <Text style={styles.sectionCount}>{filteredCommandes.length}</Text>
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

        {/* Liste commandes */}
        <View style={styles.commandesList}>
          {filteredCommandes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
                <Text style={styles.emptyLink}>Créer une commande →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredCommandes.map((commande) => (
              <CommandeCard key={commande.id} commande={commande} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Composant StatCard ──
function StatCard({ icon, label, value, color }) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <Text style={statStyles.icon}>{icon}</Text>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

// ── Composant CommandeCard ──
function CommandeCard({ commande }) {
  const status = STATUS_CONFIG[commande.statut] || STATUS_CONFIG.en_attente;

  return (
    <TouchableOpacity style={commandeStyles.card} activeOpacity={0.8}>
      {/* Header de la card */}
      <View style={commandeStyles.header}>
        <View style={commandeStyles.idRow}>
          <Text style={commandeStyles.vehicleIcon}>
            {VEHICLE_ICONS[commande.vehiculeType] || '📦'}
          </Text>
          <Text style={commandeStyles.id}>#CMD-{commande.id.padStart(4, '0')}</Text>
        </View>
        <View style={[commandeStyles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[commandeStyles.statusText, { color: status.color }]}>
            {status.icon} {status.label}
          </Text>
        </View>
      </View>

      {/* Adresses */}
      <View style={commandeStyles.addressSection}>
        <View style={commandeStyles.addressRow}>
          <View style={[commandeStyles.dot, { backgroundColor: Colors.primary }]} />
          <Text style={commandeStyles.addressText} numberOfLines={1}>
            {commande.pickupAdresse}
          </Text>
        </View>
        <View style={commandeStyles.addressLine} />
        <View style={commandeStyles.addressRow}>
          <View style={[commandeStyles.dot, { backgroundColor: Colors.success }]} />
          <Text style={commandeStyles.addressText} numberOfLines={1}>
            {commande.depotAdresse}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={commandeStyles.footer}>
        <Text style={commandeStyles.description} numberOfLines={1}>
          📦 {commande.description}
        </Text>
        <View style={commandeStyles.footerRight}>
          {commande.livreur && (
            <Text style={commandeStyles.livreur}>🛵 {commande.livreur}</Text>
          )}
          <Text style={commandeStyles.prix}>{commande.prix} MAD</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  container: { flex: 1, backgroundColor: Colors.bgDark },
  scrollContent: { paddingBottom: 32 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary },
  agenceName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { position: 'relative', padding: Spacing.xs },
  notifIcon: { fontSize: 22 },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryGhost,
    borderWidth: 1.5,
    borderColor: Colors.borderActive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },

  statsScroll: { marginBottom: Spacing.md },
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
  voirTout: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
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

  filtersScroll: { marginBottom: Spacing.md },
  filtersContent: { paddingHorizontal: Spacing.lg, gap: 8 },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryGhost,
    borderColor: Colors.borderActive,
  },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.primary },

  commandesList: { paddingHorizontal: Spacing.lg, gap: 12 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon:  { fontSize: 52, marginBottom: 12 },
  emptyText:  { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 12 },
  emptyLink:  { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 3,
    alignItems: 'center',
  },
  icon: { fontSize: 22, marginBottom: Spacing.xs },
  value: { fontSize: FontSize.xl, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});

const commandeStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vehicleIcon: { fontSize: 18 },
  id: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },

  addressSection: { marginBottom: Spacing.md },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  addressLine: {
    width: 1.5,
    height: 12,
    backgroundColor: Colors.border,
    marginLeft: 3.5,
    marginVertical: 2,
  },
  addressText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  description: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  footerRight: { alignItems: 'flex-end', gap: 2 },
  livreur: { fontSize: FontSize.xs, color: Colors.textSecondary },
  prix: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
});
