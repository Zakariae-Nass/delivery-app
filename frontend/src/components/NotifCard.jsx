import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';
import { timeAgo } from '../utils/formatters';

const NOTIF_CONFIG = {
  driver_applied: {
    icon: '🚴',
    title: n => `${n.driverName} a postule pour la commande #${n.orderShortId}`,
  },
  agency_assigned: {
    icon: '✅',
    title: n => `Vous avez assigne ${n.driverName} a la commande #${n.orderShortId}`,
  },
  auto_assigned: {
    icon: '🤖',
    title: n => `Assignation auto : ${n.driverName} → commande #${n.orderShortId}`,
  },
};

export default function NotifCard({ notif }) {
  const cfg = NOTIF_CONFIG[notif.type] || { icon: '🔔', title: () => '' };
  return (
    <View style={[styles.card, !notif.read && styles.cardUnread]}>
      {!notif.read && <View style={styles.unreadBar} />}
      <Text style={styles.cardIcon}>{cfg.icon}</Text>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{cfg.title(notif)}</Text>
        <Text style={styles.cardTime}>{timeAgo(notif.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  cardUnread: { backgroundColor: '#F0F4FF' },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.blue,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', lineHeight: 20 },
  cardTime: { fontSize: 12, color: '#999', marginTop: 4 },
});
