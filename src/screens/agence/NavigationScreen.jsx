import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

const BLUE    = '#4361EE';
const SUCCESS = '#2DC653';
const BG      = '#F5F7FF';

const PKG_ICONS     = { general: '📦', vetements: '👗', electronique: '📱', alimentation: '🍔', medical: '💊', documents: '📄' };
const VEHICLE_ICONS = { moto: '🏍️', voiture: '🚗', camion: '🚛' };

function haversine(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

export default function NavigationScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { orders }  = useApp();
  const order       = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#999' }}>Commande introuvable</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrdersList')} style={{ marginTop: 16 }}>
          <Text style={{ color: BLUE, fontWeight: '700' }}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const driver   = order.assignedDriver;
  const hasCoords =
    order.departLat != null &&
    order.departLng != null &&
    order.destinationLat != null &&
    order.destinationLng != null;

  const distance = hasCoords
    ? haversine(order.departLat, order.departLng, order.destinationLat, order.destinationLng)
    : null;

  const openMaps = () => {
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${order.departLat},${order.departLng}` +
      `&destination=${order.destinationLat},${order.destinationLng}` +
      `&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Navigation</Text>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>#{order.id.slice(-4)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* DRIVER CARD */}
        {driver && (
          <View style={styles.card}>
            <View style={styles.driverRow}>
              <Text style={styles.driverAvatar}>{driver.avatar}</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverRating}>⭐ {driver.rating} · {driver.trips} courses</Text>
              </View>
              <View style={styles.assignedBadge}>
                <Text style={styles.assignedBadgeText}>Livreur assigné</Text>
              </View>
            </View>
          </View>
        )}

        {/* ROUTE CARD */}
        <View style={styles.card}>
          <View style={styles.routeContainer}>
            {/* Left connector */}
            <View style={styles.connector}>
              <View style={[styles.connDot, { backgroundColor: BLUE }]} />
              <View style={styles.connLine} />
              <View style={[styles.connDot, { backgroundColor: '#E63946' }]} />
            </View>

            {/* Right text */}
            <View style={{ flex: 1 }}>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>DÉPART</Text>
                <Text style={styles.routeAddress} numberOfLines={3}>
                  {order.departTexte || '—'}
                </Text>
              </View>
              <View style={[styles.routeItem, { marginTop: 20 }]}>
                <Text style={styles.routeLabel}>DESTINATION</Text>
                <Text style={styles.routeAddress} numberOfLines={3}>
                  {order.destinationTexte || '—'}
                </Text>
              </View>
            </View>
          </View>

          {distance && (
            <View style={styles.distanceRow}>
              <Text style={styles.distanceText}>📏 ~{distance} km estimés</Text>
            </View>
          )}
        </View>

        {/* NAVIGATE BUTTON */}
        <TouchableOpacity
          style={[styles.mapsBtn, !hasCoords && styles.mapsBtnDisabled]}
          onPress={openMaps}
          disabled={!hasCoords}
        >
          <Text style={styles.mapsBtnText}>🗺️ Lancer la navigation Google Maps</Text>
        </TouchableOpacity>

        {/* ORDER DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails commande</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>COLIS</Text>
              <Text style={styles.detailValue}>
                {PKG_ICONS[order.packageType] || '📦'} {order.packageType || '—'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>VÉHICULE</Text>
              <Text style={styles.detailValue}>
                {VEHICLE_ICONS[order.vehicleType] || '🚗'} {order.vehicleType || '—'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>TAILLE</Text>
              <Text style={styles.detailValue}>{order.packageSize || '—'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>PRIX</Text>
              <Text style={[styles.detailValue, { color: BLUE, fontWeight: '700' }]}>
                {order.prix} MAD
              </Text>
            </View>
          </View>

          <View style={styles.clientRow}>
            <Text style={styles.clientName}>👤 {order.clientNom}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${order.clientTelephone}`)}>
              <Text style={styles.clientPhone}>📞 {order.clientTelephone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 26, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  orderBadge: {
    backgroundColor: '#EEF1FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderBadgeText: { color: BLUE, fontWeight: '700', fontSize: 13 },

  scroll: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },

  // Driver
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { fontSize: 48, marginRight: 14 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  driverRating: { fontSize: 13, color: '#666', marginTop: 3 },
  assignedBadge: {
    backgroundColor: '#EAFAF1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  assignedBadgeText: { color: SUCCESS, fontWeight: '700', fontSize: 11 },

  // Route
  routeContainer: { flexDirection: 'row' },
  connector: {
    width: 20,
    alignItems: 'center',
    marginRight: 14,
    paddingTop: 4,
  },
  connDot: { width: 10, height: 10, borderRadius: 5 },
  connLine: { flex: 1, width: 2, backgroundColor: '#E0E0E0', marginVertical: 4 },
  routeItem: {},
  routeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BDBDBD',
    letterSpacing: 1,
    marginBottom: 3,
  },
  routeAddress: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', lineHeight: 20 },
  distanceRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    paddingLeft: 34,
  },
  distanceText: { fontSize: 14, color: '#555', fontWeight: '600' },

  // Maps button
  mapsBtn: {
    backgroundColor: BLUE,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  mapsBtnDisabled: { backgroundColor: '#BDBDBD', shadowOpacity: 0 },
  mapsBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Details grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  detailItem: {
    backgroundColor: BG,
    borderRadius: 10,
    padding: 10,
    minWidth: '45%',
    flex: 1,
  },
  detailLabel: { fontSize: 10, color: '#999', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  detailValue: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },

  // Client
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  clientName: { fontSize: 14, color: '#333', fontWeight: '600' },
  clientPhone: { fontSize: 13, color: BLUE, fontWeight: '600' },
});
