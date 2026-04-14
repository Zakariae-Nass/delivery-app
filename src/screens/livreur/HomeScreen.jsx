import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, FontSize } from '../../config/theme';
import { MOCK_COMMANDES_LIVREUR, MOCK_STATS_LIVREUR } from '../../utils/mocks/mockData';
import { VEHICLE_ICONS } from '../../config/constants';

export default function LivreurHomeScreen({ navigation }) {
  const [isOnline, setIsOnline] = useState(true);
  const [acceptedId, setAcceptedId] = useState(null);

  const handleAccept = (id) => setAcceptedId(id);
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
            <Text style={styles.livreurName}>Youssef Benali</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <Text style={styles.avatarText}>YB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Toggle Disponibilité ── */}
        <View style={[styles.statusToggle, isOnline && styles.statusToggleOnline]}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? Colors.success : Colors.textMuted }]} />
            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? '🟢 Disponible' : '⚫ Hors ligne'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'Vous recevez des commandes'
                  : 'Activez pour recevoir des commandes'}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: Colors.bgElevated, true: Colors.successGhost }}
            thumbColor={isOnline ? Colors.success : Colors.textMuted}
          />
        </View>

        {/* ── Stats du jour ── */}
        <View style={styles.statsRow}>
          <MiniStat icon="📦" label="Aujourd'hui" value={`${MOCK_STATS_LIVREUR.commandesAujourdhui}`} color={Colors.primary} />
          <MiniStat icon="💰" label="Gains / jour" value={`${MOCK_STATS_LIVREUR.gainsAujourdhui} MAD`} color={Colors.success} />
          <MiniStat icon="⭐" label="Note" value={`${MOCK_STATS_LIVREUR.note}/5`} color={Colors.warning} />
        </View>

        {/* ── Gains semaine ── */}
        <View style={styles.earningsCard}>
          <View>
            <Text style={styles.earningsLabel}>Gains cette semaine</Text>
            <Text style={styles.earningsValue}>{MOCK_STATS_LIVREUR.gainsSemaine} MAD</Text>
          </View>
          <View style={styles.earningsRight}>
            <Text style={styles.totalLabel}>Total livraisons</Text>
            <Text style={styles.totalValue}>{MOCK_STATS_LIVREUR.totalLivraisons} 🏆</Text>
          </View>
        </View>

        {/* ── Commandes disponibles ── */}
        {isOnline ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Commandes disponibles</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={styles.commandesList}>
              {MOCK_COMMANDES_LIVREUR.map((commande) => (
                <CommandeDisponibleCard
                  key={commande.id}
                  commande={commande}
                  accepted={acceptedId === commande.id}
                  onAccept={() => handleAccept(commande.id)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineEmoji}>😴</Text>
            <Text style={styles.offlineTitle}>Vous êtes hors ligne</Text>
            <Text style={styles.offlineSubtitle}>
              Activez le switch ci-dessus pour commencer à recevoir des commandes.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Composant MiniStat ──
function MiniStat({ icon, label, value, color }) {
  return (
    <View style={miniStatStyles.card}>
      <Text style={miniStatStyles.icon}>{icon}</Text>
      <Text style={[miniStatStyles.value, { color }]}>{value}</Text>
      <Text style={miniStatStyles.label}>{label}</Text>
    </View>
  );
}

// ── Composant CommandeDisponibleCard ──
function CommandeDisponibleCard({ commande, accepted, onAccept }) {
  return (
    <View style={cardStyles.card}>
      {/* Header */}
      <View style={cardStyles.header}>
        <View style={cardStyles.agenceRow}>
          <Text style={cardStyles.vehicleIcon}>
            {VEHICLE_ICONS[commande.vehiculeType] || '📦'}
          </Text>
          <View>
            <Text style={cardStyles.agenceName}>{commande.agence}</Text>
            <Text style={cardStyles.commandeId}>#CMD-{commande.id.padStart(4, '0')}</Text>
          </View>
        </View>
        <View style={cardStyles.prixBox}>
          <Text style={cardStyles.prix}>{commande.prix}</Text>
          <Text style={cardStyles.prixUnit}>MAD</Text>
        </View>
      </View>

      {/* Adresses */}
      <View style={cardStyles.addressSection}>
        <View style={cardStyles.addressRow}>
          <View style={[cardStyles.dot, { backgroundColor: Colors.primary }]} />
          <Text style={cardStyles.addressText} numberOfLines={1}>
            {commande.pickupAdresse}
          </Text>
        </View>
        <View style={cardStyles.addressLine} />
        <View style={cardStyles.addressRow}>
          <View style={[cardStyles.dot, { backgroundColor: Colors.success }]} />
          <Text style={cardStyles.addressText} numberOfLines={1}>
            {commande.depotAdresse}
          </Text>
        </View>
      </View>

      {/* Infos + Description */}
      <View style={cardStyles.infoRow}>
        <View style={cardStyles.infoBadge}>
          <Text style={cardStyles.infoText}>📍 {commande.distance} km</Text>
        </View>
        <View style={cardStyles.infoBadge}>
          <Text style={cardStyles.infoText}>⏱ {commande.tempsEstime}</Text>
        </View>
        <Text style={cardStyles.description} numberOfLines={1}>
          {commande.description}
        </Text>
      </View>

      {/* Bouton Accepter */}
      {accepted ? (
        <View style={cardStyles.acceptedBox}>
          <Text style={cardStyles.acceptedText}>✅ Commande acceptée ! En route vers le pickup...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={cardStyles.acceptBtn}
          onPress={onAccept}
          activeOpacity={0.85}
        >
          <Text style={cardStyles.acceptBtnText}>Accepter cette commande →</Text>
        </TouchableOpacity>
      )}
    </View>
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
  livreurName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { padding: Spacing.xs },
  notifIcon: { fontSize: 22 },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.successGhost,
    borderWidth: 1.5,
    borderColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: Colors.success, fontWeight: '700', fontSize: FontSize.sm },

  // Toggle
  statusToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  statusToggleOnline: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  statusSubtitle: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: 10,
    marginBottom: Spacing.md,
  },

  // Earnings card
  earningsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  earningsLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  earningsValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.success },
  earningsRight: { alignItems: 'flex-end' },
  totalLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  totalValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorGhost,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  liveText: { fontSize: FontSize.xs, color: Colors.error, fontWeight: '800', letterSpacing: 1 },

  commandesList: { paddingHorizontal: Spacing.lg, gap: 12 },

  // Offline
  offlineBox: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  offlineEmoji: { fontSize: 56, marginBottom: Spacing.md },
  offlineTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  offlineSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});

const miniStatStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  icon: { fontSize: 20, marginBottom: 4 },
  value: { fontSize: FontSize.md, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
});

const cardStyles = StyleSheet.create({
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
  agenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleIcon: { fontSize: 24 },
  agenceName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  commandeId: { fontSize: FontSize.xs, color: Colors.textMuted },
  prixBox: { alignItems: 'flex-end' },
  prix: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, lineHeight: 28 },
  prixUnit: { fontSize: FontSize.xs, color: Colors.textSecondary },

  addressSection: { marginBottom: Spacing.md },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  addressLine: {
    width: 1.5,
    height: 12,
    backgroundColor: Colors.border,
    marginLeft: 3.5,
    marginVertical: 2,
  },
  addressText: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '500' },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  infoBadge: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  description: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted },

  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  acceptedBox: {
    backgroundColor: Colors.successGhost,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success,
    alignItems: 'center',
  },
  acceptedText: { color: Colors.success, fontSize: FontSize.sm, fontWeight: '600' },
});
