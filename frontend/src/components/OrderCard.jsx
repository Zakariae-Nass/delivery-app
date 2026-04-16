import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS, PKG_ICONS, VEHICLE_ICONS } from '../config/constants';
import StatusBadge from './StatusBadge';
import ProgressDots from './ProgressDots';

function cityShort(address) {
  if (!address) return '-';
  return address.split(',')[0].trim();
}

export default function OrderCard({ order, navigation }) {
  const hasApplicants = order.applicants && order.applicants.length > 0;
  const isAssigned    = order.statut === 'Assigne';
  const driver        = order.assignedDriver;

  return (
    <View style={[styles.orderCard, order.isUrgent && styles.orderCardUrgent]}>
      {order.isUrgent && (
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentBadgeText}>🔴 URGENT</Text>
        </View>
      )}

      <View style={styles.cardTopRow}>
        <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
        <StatusBadge statut={order.statut} />
      </View>

      <ProgressDots statut={order.statut} />

      <View style={styles.routeRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.routeLabel}>DEPART</Text>
          <Text style={styles.routeCity} numberOfLines={1}>{cityShort(order.departTexte)}</Text>
        </View>
        <Text style={styles.arrowIcon}>→</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.routeLabel}>DESTINATION</Text>
          <Text style={styles.routeCity} numberOfLines={1}>{cityShort(order.destinationTexte)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>{PKG_ICONS[order.packageType] || '📦'} {order.packageType || '-'}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>{VEHICLE_ICONS[order.vehicleType] || '🚗'} {order.vehicleType || '-'}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>💰 {order.prix} MAD</Text>
        </View>
        <TouchableOpacity
          style={[styles.detailChip, styles.phoneChip]}
          onPress={() => Linking.openURL(`tel:${order.clientTelephone}`)}
        >
          <Text style={[styles.detailText, { color: COLORS.blue }]}>📞 {order.clientTelephone}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.clientName}>{order.clientNom}</Text>

      {isAssigned && driver ? (
        <>
          <View style={styles.divider} />
          <View style={styles.assignedBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.assignedBannerLabel}>Livreur assigne</Text>
              <Text style={styles.assignedBannerDriver}>
                {driver.avatar} {driver.name} · ⭐ {driver.rating}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.navigate('Navigation', { orderId: order.id })}
            >
              <Text style={styles.navBtnText}>🗺️ Navigation</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : order.statut === 'En attente' && hasApplicants ? (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.applicantsBanner}
            onPress={() => navigation.navigate('DriverSelection', { orderId: order.id })}
          >
            <Text style={styles.applicantsBannerText}>
              👥 {order.applicants.length} livreur{order.applicants.length > 1 ? 's' : ''} ont postule — Voir et choisir →
            </Text>
          </TouchableOpacity>
        </>
      ) : order.statut === 'En attente' ? (
        <>
          <View style={styles.divider} />
          <Text style={styles.waitingText}>⏳ En attente de livreurs...</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
  },
  orderCardUrgent: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF0F0',
    borderColor: COLORS.danger,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 1,
  },
  urgentBadgeText: { color: COLORS.danger, fontSize: 11, fontWeight: '700' },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderId: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },

  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  routeLabel: { fontSize: 10, color: '#BDBDBD', fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  routeCity: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  arrowIcon: { fontSize: 20, color: '#BDBDBD', marginHorizontal: 8 },

  divider: { height: 1, backgroundColor: '#F0F0F5', marginVertical: 10 },

  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  detailChip: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  phoneChip: { backgroundColor: COLORS.blueLight },
  detailText: { fontSize: 12, color: '#666' },
  clientName: { fontSize: 13, color: '#999', fontStyle: 'italic' },

  waitingText: { fontSize: 13, color: '#999', textAlign: 'center', paddingVertical: 4 },

  applicantsBanner: {
    backgroundColor: '#FFF8EE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  applicantsBannerText: { fontSize: 13, color: COLORS.warning, fontWeight: '600' },

  assignedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  assignedBannerLabel: { fontSize: 10, color: COLORS.blue, fontWeight: '700', letterSpacing: 0.5 },
  assignedBannerDriver: { fontSize: 13, color: '#1A1A2E', fontWeight: '600', marginTop: 2 },
  navBtn: {
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 10,
  },
  navBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
