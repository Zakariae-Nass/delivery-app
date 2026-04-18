import { Ionicons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { WS_URL, STATUS_CONFIG } from '../../config/constants';
import { setActiveCommande } from '../../redux/slices/commandesSlice';

const CORAL   = '#FF6B5B';
const SUCCESS = '#22C55E';
const DARK    = '#1C1C1E';
const GRAY    = '#8E8EA0';
const LIGHT   = '#F5F5F7';

export default function OrderTrackingScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const commandeId = route?.params?.commandeId;
  const { activeCommande } = useSelector((s) => s.commandes);

  const socketRef = useRef(null);
  const mapRef    = useRef(null);
  const [livreurPos, setLivreurPos] = useState(null);
  const [commande, setCommande]     = useState(activeCommande);

  useEffect(() => {
    if (commandeId && !commande) {
      apiClient.get(`/commandes/${commandeId}`).then(({ data }) => {
        setCommande(data);
        dispatch(setActiveCommande(data));
      });
    }
  }, [commandeId]);

  useEffect(() => {
    if (!commande) return;

    const socket = io(`${WS_URL}/tracking`, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('tracking.join', { commandeId: commande.id, role: 'agence' });
    });

    socket.on('tracking.location', ({ lat, lng }) => {
      setLivreurPos({ lat, lng });
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [commande?.id]);

  if (!commande) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: GRAY }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_CONFIG[commande.status] || {};
  const destLat = commande.deliveryLat;
  const destLng = commande.deliveryLng;

  return (
    <SafeAreaView style={st.root}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Ionicons name="arrow-back" size={22} color={DARK} />
          </TouchableOpacity>
          <Text style={st.headerTitle}>{commande.numero}</Text>
          <View style={[st.statusBadge, { backgroundColor: statusCfg.bg || LIGHT }]}>
            <Text style={[st.statusText, { color: statusCfg.color || GRAY }]}>
              {statusCfg.label || commande.status}
            </Text>
          </View>
        </View>

        {/* Map */}
        <View style={st.mapContainer}>
          <MapView
            ref={mapRef}
            style={st.map}
            initialRegion={{
              latitude: destLat || 33.5,
              longitude: destLng || -7.6,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {livreurPos && (
              <Marker
                coordinate={{ latitude: livreurPos.lat, longitude: livreurPos.lng }}
                title="Livreur"
                pinColor={CORAL}
              />
            )}
            {destLat && destLng && (
              <Marker
                coordinate={{ latitude: destLat, longitude: destLng }}
                title="Destination"
                pinColor={SUCCESS}
              />
            )}
            {livreurPos && destLat && destLng && (
              <Polyline
                coordinates={[
                  { latitude: livreurPos.lat, longitude: livreurPos.lng },
                  { latitude: destLat, longitude: destLng },
                ]}
                strokeColor={CORAL}
                strokeWidth={2}
                lineDashPattern={[10, 5]}
              />
            )}
          </MapView>
        </View>

        {/* Commande info */}
        <View style={st.infoCard}>
          <Text style={st.infoTitle}>Informations commande</Text>
          <Row label="Client" value={commande.clientName} />
          <Row label="Téléphone" value={commande.clientPhone} />
          <Row label="Colis" value={commande.packageType} />
          <Row label="Pickup" value={commande.pickupAddress} />
          <Row label="Livraison" value={commande.deliveryAddress} />
          {commande.livreur && (
            <Row label="Livreur" value={commande.livreur.username} />
          )}
        </View>

        {/* Pickup image if available */}
        {commande.pickupImageUrl && (
          <View style={st.imageCard}>
            <Text style={st.imageLabel}>Photo pickup</Text>
            <Image
              source={{ uri: `${WS_URL}${commande.pickupImageUrl}` }}
              style={st.image}
            />
          </View>
        )}

        {commande.deliveryImageUrl && (
          <View style={st.imageCard}>
            <Text style={st.imageLabel}>Photo livraison</Text>
            <Image
              source={{ uri: `${WS_URL}${commande.deliveryImageUrl}` }}
              style={st.image}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View style={st.row}>
      <Text style={st.rowLabel}>{label}</Text>
      <Text style={st.rowValue}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  root:   { flex: 1, backgroundColor: LIGHT },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  backBtn:      { padding: 4 },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: DARK, flex: 1 },
  statusBadge:  { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  statusText:   { fontSize: 12, fontWeight: '700' },
  mapContainer: { height: 260, margin: 16, borderRadius: 16, overflow: 'hidden' },
  map:          { flex: 1 },
  infoCard:     { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16 },
  infoTitle:    { fontSize: 14, fontWeight: '700', color: GRAY, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  row:          { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ECECF0' },
  rowLabel:     { fontSize: 13, color: GRAY },
  rowValue:     { fontSize: 13, color: DARK, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  imageCard:    { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16 },
  imageLabel:   { fontSize: 13, fontWeight: '700', color: GRAY, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  image:        { width: '100%', height: 180, borderRadius: 12, resizeMode: 'cover' },
});
