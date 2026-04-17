import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../../../config/theme';

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

export default function CommandeCard({ commande }) {
  const status = STATUS_CONFIG[commande.statut] || STATUS_CONFIG.en_attente;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Header de la card */}
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Text style={styles.vehicleIcon}>
            {VEHICLE_ICONS[commande.vehiculeType] || '📦'}
          </Text>
          <Text style={styles.id}>#CMD-{commande.id.padStart(4, '0')}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.icon} {status.label}
          </Text>
        </View>
      </View>

      {/* Adresses */}
      <View style={styles.addressSection}>
        <View style={styles.addressRow}>
          <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.addressText} numberOfLines={1}>
            {commande.pickupAdresse}
          </Text>
        </View>
        <View style={styles.addressLine} />
        <View style={styles.addressRow}>
          <View style={[styles.dot, { backgroundColor: Colors.success }]} />
          <Text style={styles.addressText} numberOfLines={1}>
            {commande.depotAdresse}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.description} numberOfLines={1}>
          📦 {commande.description}
        </Text>
        <View style={styles.footerRight}>
          {commande.livreur && (
            <Text style={styles.livreur}>🛵 {commande.livreur}</Text>
          )}
          <Text style={styles.prix}>{commande.prix} MAD</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
