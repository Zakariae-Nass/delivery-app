import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { STATUS_CONFIG } from '../../../config/constants';

const VEHICLE_ICONS = { moto: 'bicycle-outline', voiture: 'car-outline', camion: 'bus-outline' };

export default function CommandeCard({ commande, onPress }) {
  const cfg = STATUS_CONFIG[commande.status] || { label: commande.status, color: '#8E8EA0', bg: '#F5F7FF' };
  const vehicleIcon = VEHICLE_ICONS[commande.vehiculeType] || 'cube-outline';

  return (
    <TouchableOpacity style={st.card} onPress={onPress} activeOpacity={0.8}>
      <View style={st.header}>
        <View style={st.idRow}>
          <Ionicons name={vehicleIcon} size={16} color="#8E8EA0" />
          <Text style={st.id}>{commande.numero}</Text>
        </View>
        <View style={[st.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[st.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <View style={st.addressSection}>
        <View style={st.addressRow}>
          <View style={[st.dot, { backgroundColor: '#4361EE' }]} />
          <Text style={st.addressText} numberOfLines={1}>{commande.pickupAddress}</Text>
        </View>
        <View style={st.addressLine} />
        <View style={st.addressRow}>
          <View style={[st.dot, { backgroundColor: '#2DC653' }]} />
          <Text style={st.addressText} numberOfLines={1}>{commande.deliveryAddress}</Text>
        </View>
      </View>

      <View style={st.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="person-outline" size={12} color="#8E8EA0" />
          <Text style={st.client}>{commande.clientName || '—'}</Text>
        </View>
        <View style={st.footerRight}>
          {commande.livreur && (
            <Text style={st.livreur}>{commande.livreur.username}</Text>
          )}
          <Text style={st.prix}>{commande.price} MAD</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  card:          { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#ECECF0' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idRow:         { flexDirection: 'row', alignItems: 'center', gap: 6 },
  id:            { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  badge:         { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:     { fontSize: 11, fontWeight: '700' },
  addressSection:{ marginBottom: 12 },
  addressRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:           { width: 8, height: 8, borderRadius: 4 },
  addressLine:   { width: 1.5, height: 10, backgroundColor: '#ECECF0', marginLeft: 3.5, marginVertical: 2 },
  addressText:   { flex: 1, fontSize: 13, color: '#1A1A2E', fontWeight: '500' },
  footer:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ECECF0' },
  client:        { fontSize: 12, color: '#8E8EA0' },
  footerRight:   { alignItems: 'flex-end', gap: 2 },
  livreur:       { fontSize: 11, color: '#4361EE', fontWeight: '600' },
  prix:          { fontSize: 14, fontWeight: '800', color: '#FF6B35' },
});
