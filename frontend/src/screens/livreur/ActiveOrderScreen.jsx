import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { WS_URL } from '../../config/constants';
import { updateCommandeStatus } from '../../redux/slices/commandesSlice';

const CORAL   = '#FF6B5B';
const SUCCESS = '#22C55E';
const DARK    = '#1C1C1E';
const GRAY    = '#8E8EA0';
const LIGHT   = '#F5F5F7';

export default function ActiveOrderScreen({ navigation }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const { activeCommande } = useSelector((s) => s.commandes);

  const socketRef = useRef(null);
  const mapRef    = useRef(null);
  const posInterval = useRef(null);

  const [livreurPos, setLivreurPos]   = useState(null);
  const [pickupImage, setPickupImage] = useState(null);
  const [otp, setOtp]                 = useState('');
  const [loading, setLoading]         = useState(false);
  const [otpError, setOtpError]       = useState('');

  const commande = activeCommande;

  useEffect(() => {
    if (!commande) return;

    const socket = io(`${WS_URL}/tracking`, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('tracking.join', { commandeId: commande.id, role: 'livreur' });
    });

    socket.on('connect_error', (e) => console.error('WS tracking error', e.message));

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [commande?.id]);

  useEffect(() => {
    if (!commande || !['en_cours_pickup', 'colis_recupere'].includes(commande.status)) return;

    const startEmitting = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      posInterval.current = setInterval(async () => {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLivreurPos({ lat: loc.coords.latitude, lng: loc.coords.longitude });
          socketRef.current?.emit('livreur.position.update', {
            livreurId: user.id.toString(),
            commandeId: commande.id.toString(),
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            speed: loc.coords.speed,
            heading: loc.coords.heading,
          });
        } catch {}
      }, 3000);
    };

    startEmitting();
    return () => { if (posInterval.current) clearInterval(posInterval.current); };
  }, [commande?.id, commande?.status]);

  if (!commande) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: GRAY }}>Aucune commande active</Text>
      </SafeAreaView>
    );
  }

  const isPickupPhase   = commande.status === 'en_cours_pickup';
  const isDeliveryPhase = commande.status === 'colis_recupere';

  const handlePickupImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie dans les paramètres.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) setPickupImage(result.assets[0].uri);
  };

  const handleConfirmPickup = async () => {
    if (!pickupImage) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: pickupImage, type: 'image/jpeg', name: 'pickup.jpg' });
      await apiClient.post(`/commandes/${commande.id}/upload-pickup-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await apiClient.patch(`/commandes/${commande.id}/status`, { status: 'colis_recupere' });
      dispatch(updateCommandeStatus({ commandeId: commande.id, status: 'colis_recupere' }));
    } catch (e) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (otp.length !== 4) {
      setOtpError('Le code doit être 4 chiffres');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      await apiClient.post(`/commandes/${commande.id}/confirm-delivery`, { otpCode: otp });
      dispatch(updateCommandeStatus({ commandeId: commande.id, status: 'livree' }));
      Alert.alert('Livraison confirmée !', `Commande ${commande.numero} livrée avec succès`, [
        { text: 'OK', onPress: () => navigation.navigate('LivreurHome') },
      ]);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Erreur';
      setOtpError(msg);
    } finally {
      setLoading(false);
    }
  };

  const destLat = isPickupPhase ? commande.pickupLat : commande.deliveryLat;
  const destLng = isPickupPhase ? commande.pickupLng : commande.deliveryLng;

  return (
    <SafeAreaView style={st.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={st.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
              <Ionicons name="arrow-back" size={22} color={DARK} />
            </TouchableOpacity>
            <Text style={st.headerTitle}>{commande.numero}</Text>
            <View style={[st.statusBadge,
              { backgroundColor: isPickupPhase ? 'rgba(255,107,91,0.1)' : 'rgba(34,197,94,0.1)' }
            ]}>
              <Text style={[st.statusText, { color: isPickupPhase ? CORAL : SUCCESS }]}>
                {isPickupPhase ? 'Pickup en cours' : 'Livraison en cours'}
              </Text>
            </View>
          </View>

          {/* Info card */}
          <View style={st.infoCard}>
            {commande.isUrgent && (
              <View style={st.urgentBadge}>
                <Ionicons name="flash" size={14} color="#E63946" />
                <Text style={st.urgentText}>URGENT</Text>
              </View>
            )}
            <Text style={st.clientName}>{commande.clientName}</Text>
            <Text style={st.clientPhone}>{commande.clientPhone}</Text>
            <Text style={st.packageType}>{commande.packageType}</Text>
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
                  title="Ma position"
                  pinColor={CORAL}
                />
              )}
              {destLat && destLng && (
                <Marker
                  coordinate={{ latitude: destLat, longitude: destLng }}
                  title={isPickupPhase ? 'Pickup' : 'Livraison'}
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

          {/* Phase 1: Pickup */}
          {isPickupPhase && (
            <View style={st.section}>
              <Text style={st.sectionTitle}>Adresse de pickup</Text>
              <Text style={st.addressText}>{commande.pickupAddress}</Text>

              <TouchableOpacity style={st.uploadBtn} onPress={handlePickupImage}>
                <Ionicons name="camera-outline" size={20} color={CORAL} />
                <Text style={st.uploadBtnText}>
                  {pickupImage ? 'Changer la photo' : 'Photo du colis (requis)'}
                </Text>
              </TouchableOpacity>

              {pickupImage && (
                <Image source={{ uri: pickupImage }} style={st.previewImg} />
              )}

              <TouchableOpacity
                style={[st.confirmBtn, !pickupImage && st.confirmBtnDisabled]}
                onPress={handleConfirmPickup}
                disabled={!pickupImage || loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      <Text style={st.confirmBtnText}>Confirmer le pickup</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          )}

          {/* Phase 2: Delivery */}
          {isDeliveryPhase && (
            <View style={st.section}>
              {/* Pickup done summary */}
              <View style={st.historySection}>
                <Text style={st.sectionTitle}>Pickup effectué</Text>
                <Text style={st.addressText}>{commande.pickupAddress}</Text>
              </View>

              <View style={st.divider} />

              <Text style={st.sectionTitle}>Adresse de livraison</Text>
              <Text style={st.addressText}>{commande.deliveryAddress}</Text>

              {/* OTP */}
              <Text style={st.fieldLabel}>Code OTP du client</Text>
              <TextInput
                style={[st.otpInput, otpError && st.otpInputError]}
                placeholder="XXXX"
                placeholderTextColor={GRAY}
                value={otp}
                onChangeText={(v) => { setOtp(v.replace(/\D/g, '').slice(0, 4)); setOtpError(''); }}
                keyboardType="number-pad"
                maxLength={4}
              />
              {otpError ? <Text style={st.fieldError}>{otpError}</Text> : null}

              <TouchableOpacity
                style={[st.confirmBtn, otp.length !== 4 && st.confirmBtnDisabled]}
                onPress={handleConfirmDelivery}
                disabled={otp.length !== 4 || loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      <Text style={st.confirmBtnText}>Confirmer la livraison</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  backBtn:     { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: DARK, flex: 1 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  statusText:  { fontSize: 12, fontWeight: '700' },
  infoCard:    { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16 },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(230,57,70,0.08)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  urgentText:  { fontSize: 11, fontWeight: '800', color: '#E63946' },
  clientName:  { fontSize: 17, fontWeight: '800', color: DARK },
  clientPhone: { fontSize: 13, color: GRAY, marginTop: 2 },
  packageType: { fontSize: 13, color: GRAY, marginTop: 4 },
  mapContainer:{ height: 220, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  map:         { flex: 1 },
  section:     { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 12 },
  historySection: { marginBottom: 8 },
  divider:     { height: 1, backgroundColor: '#ECECF0', marginVertical: 8 },
  sectionTitle:{ fontSize: 13, fontWeight: '700', color: GRAY, textTransform: 'uppercase', letterSpacing: 0.6 },
  addressText: { fontSize: 15, color: DARK, fontWeight: '500' },
  fieldLabel:  { fontSize: 12, fontWeight: '700', color: GRAY, textTransform: 'uppercase', letterSpacing: 0.6 },
  otpInput:    {
    backgroundColor: LIGHT,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ECECF0',
    padding: 14,
    fontSize: 24,
    fontWeight: '800',
    color: DARK,
    textAlign: 'center',
    letterSpacing: 8,
  },
  otpInputError:    { borderColor: '#E63946' },
  fieldError:       { fontSize: 12, color: '#E63946', fontWeight: '500' },
  confirmBtn:       {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SUCCESS,
    borderRadius: 12,
    height: 52,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
  uploadBtn:   {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,107,91,0.08)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,107,91,0.2)',
    borderStyle: 'dashed',
  },
  uploadBtnText: { fontSize: 14, color: CORAL, fontWeight: '600' },
  previewImg:    { width: '100%', height: 160, borderRadius: 12, resizeMode: 'cover' },
});
