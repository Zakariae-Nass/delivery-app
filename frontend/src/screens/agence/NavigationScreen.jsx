import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../config/constants';
import useNavigation from '../../hooks/useNavigation';

const VEHICLE_ICONS = { moto: 'bicycle-outline', voiture: 'car-outline', camion: 'bus-outline' };
const PACKAGE_ICONS = {
  general: 'cube-outline', vetements: 'shirt-outline', electronique: 'phone-portrait-outline',
  alimentation: 'fast-food-outline', medical: 'medkit-outline', documents: 'document-text-outline',
};

export default function NavigationScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { order, distance, openMaps, hasCoords } = useNavigation(orderId);

  if (!order) {
    return (
      <SafeAreaView style={[st.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#999" />
        <Text style={st.notFound}>Commande introuvable</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrdersList')} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.blue, fontWeight: '700' }}>Retour aux commandes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const driver = order.assignedDriver || order.livreur;

  return (
    <SafeAreaView style={st.root}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={st.headerTitle}>Navigation</Text>
        <View style={st.orderBadge}>
          <Text style={st.orderBadgeText}>{order.numero || `#${String(order.id).slice(-4)}`}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        {driver && (
          <View style={st.card}>
            <View style={st.driverRow}>
              <View style={st.driverAvatar}>
                <Text style={st.driverInitials}>
                  {(driver.username || 'L').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={st.driverInfo}>
                <Text style={st.driverName}>{driver.username}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="star" size={13} color="#FF9F1C" />
                  <Text style={st.driverRating}>
                    {Number(driver.averageNote || 0).toFixed(1)}
                  </Text>
                </View>
              </View>
              <View style={st.assignedBadge}>
                <Text style={st.assignedBadgeText}>Livreur assigné</Text>
              </View>
            </View>
          </View>
        )}

        <View style={st.card}>
          <View style={st.routeContainer}>
            <View style={st.connector}>
              <View style={[st.connDot, { backgroundColor: COLORS.blue }]} />
              <View style={st.connLine} />
              <View style={[st.connDot, { backgroundColor: COLORS.danger }]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={st.routeItem}>
                <Text style={st.routeLabel}>DÉPART</Text>
                <Text style={st.routeAddress} numberOfLines={3}>
                  {order.pickupAddress || order.departTexte || '—'}
                </Text>
              </View>
              <View style={[st.routeItem, { marginTop: 20 }]}>
                <Text style={st.routeLabel}>DESTINATION</Text>
                <Text style={st.routeAddress} numberOfLines={3}>
                  {order.deliveryAddress || order.destinationTexte || '—'}
                </Text>
              </View>
            </View>
          </View>
          {distance && (
            <View style={st.distanceRow}>
              <Ionicons name="resize-outline" size={14} color="#8E8EA0" />
              <Text style={st.distanceText}>~{distance} km estimés</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[st.mapsBtn, !hasCoords && st.mapsBtnDisabled]}
          onPress={openMaps}
          disabled={!hasCoords}
        >
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={st.mapsBtnText}>Lancer Google Maps</Text>
        </TouchableOpacity>

        <View style={st.card}>
          <Text style={st.cardTitle}>Détails commande</Text>
          <View style={st.detailsGrid}>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>COLIS</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={PACKAGE_ICONS[order.packageType] || 'cube-outline'} size={14} color="#8E8EA0" />
                <Text style={st.detailValue}>{order.packageType || '—'}</Text>
              </View>
            </View>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>VÉHICULE</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={VEHICLE_ICONS[order.vehiculeType] || 'car-outline'} size={14} color="#8E8EA0" />
                <Text style={st.detailValue}>{order.vehiculeType || '—'}</Text>
              </View>
            </View>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>PRIX</Text>
              <Text style={[st.detailValue, { color: COLORS.blue, fontWeight: '700' }]}>
                {order.price} MAD
              </Text>
            </View>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>CLIENT</Text>
              <Text style={st.detailValue}>{order.clientName || '—'}</Text>
            </View>
          </View>
          {order.clientPhone && (
            <TouchableOpacity
              style={st.callRow}
              onPress={() => Linking.openURL(`tel:${order.clientPhone}`)}
            >
              <Ionicons name="call-outline" size={16} color={COLORS.blue} />
              <Text style={st.callText}>{order.clientPhone}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#F5F7FF' },
  header:         { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:        { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F7FF', justifyContent: 'center', alignItems: 'center' },
  headerTitle:    { flex: 1, fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  orderBadge:     { backgroundColor: '#F5F7FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  orderBadgeText: { fontSize: 12, fontWeight: '700', color: '#FF6B35' },
  scroll:         { padding: 16, gap: 12 },
  notFound:       { fontSize: 16, color: '#999', marginTop: 12 },
  card:           { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  driverRow:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar:   { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF1FF', justifyContent: 'center', alignItems: 'center' },
  driverInitials: { fontSize: 16, fontWeight: '800', color: '#4361EE' },
  driverInfo:     { flex: 1 },
  driverName:     { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  driverRating:   { fontSize: 13, color: '#FF9F1C', fontWeight: '600' },
  assignedBadge:  { backgroundColor: '#EAFAF1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  assignedBadgeText:{ fontSize: 11, fontWeight: '700', color: '#2DC653' },
  routeContainer: { flexDirection: 'row', gap: 12 },
  connector:      { alignItems: 'center', paddingTop: 4, width: 16 },
  connDot:        { width: 12, height: 12, borderRadius: 6 },
  connLine:       { flex: 1, width: 2, backgroundColor: '#ECECF0', marginVertical: 4 },
  routeItem:      {},
  routeLabel:     { fontSize: 10, fontWeight: '700', color: '#8E8EA0', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  routeAddress:   { fontSize: 14, color: '#1A1A2E', fontWeight: '500', lineHeight: 20 },
  distanceRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ECECF0' },
  distanceText:   { fontSize: 13, color: '#8E8EA0' },
  mapsBtn:        { flexDirection: 'row', backgroundColor: '#4361EE', borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', gap: 10 },
  mapsBtnDisabled:{ opacity: 0.5 },
  mapsBtnText:    { color: '#fff', fontWeight: '700', fontSize: 16 },
  cardTitle:      { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 14 },
  detailsGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem:     { width: '45%' },
  detailLabel:    { fontSize: 10, fontWeight: '700', color: '#8E8EA0', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  detailValue:    { fontSize: 14, color: '#1A1A2E', fontWeight: '500' },
  callRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#ECECF0' },
  callText:       { fontSize: 14, color: '#4361EE', fontWeight: '600' },
});
