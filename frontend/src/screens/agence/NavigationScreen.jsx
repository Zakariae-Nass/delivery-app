import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, PKG_ICONS, VEHICLE_ICONS } from '../../config/constants';
import useNavigation from '../../hooks/useNavigation';
import { styles } from './styles/NavigationScreen.styles';

export default function NavigationScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { order, distance, openMaps, hasCoords } = useNavigation(orderId);

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#999' }}>Commande introuvable</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrdersList')} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.blue, fontWeight: '700' }}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const driver = order.assignedDriver;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
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
        {driver && (
          <View style={styles.card}>
            <View style={styles.driverRow}>
              <Text style={styles.driverAvatar}>{driver.avatar}</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverRating}>⭐ {driver.rating} · {driver.trips} courses</Text>
              </View>
              <View style={styles.assignedBadge}>
                <Text style={styles.assignedBadgeText}>Livreur assigne</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.routeContainer}>
            <View style={styles.connector}>
              <View style={[styles.connDot, { backgroundColor: COLORS.blue }]} />
              <View style={styles.connLine} />
              <View style={[styles.connDot, { backgroundColor: COLORS.danger }]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>DEPART</Text>
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
              <Text style={styles.distanceText}>📏 ~{distance} km estimes</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.mapsBtn, !hasCoords && styles.mapsBtnDisabled]}
          onPress={openMaps}
          disabled={!hasCoords}
        >
          <Text style={styles.mapsBtnText}>🗺️ Lancer la navigation Google Maps</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details commande</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>COLIS</Text>
              <Text style={styles.detailValue}>
                {PKG_ICONS[order.packageType] || '📦'} {order.packageType || '—'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>VEHICULE</Text>
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
              <Text style={[styles.detailValue, { color: COLORS.blue, fontWeight: '700' }]}>
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
