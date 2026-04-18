import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { updateCommandeStatus, updateSelectionTimer, setApplications } from '../../redux/slices/commandesSlice';

const CORAL   = '#FF6B35';
const DARK    = '#1A1A2E';
const GRAY    = '#8E8EA0';
const LIGHT   = '#F5F7FF';
const SUCCESS = '#2DC653';
const WARNING = '#FF9F1C';

export default function DriverSelectionScreen({ navigation, route }) {
  const dispatch   = useDispatch();
  const commandeId = route?.params?.commandeId;
  const { applications, selectionTimer } = useSelector((s) => s.commandes);

  const [commande, setCommande]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selecting, setSelecting]   = useState(null);

  const timerSeconds = selectionTimer[commandeId] ?? null;

  const fetchCommande = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/commandes/${commandeId}`);
      setCommande(data);
    } catch (e) {
      console.error('Failed to fetch commande', e);
    } finally {
      setLoading(false);
    }
  }, [commandeId]);

  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/commandes/${commandeId}/applications`);
      dispatch(setApplications({ commandeId, applications: data }));
    } catch (e) {
      console.error('Failed to fetch applications', e);
    }
  }, [commandeId, dispatch]);

  useEffect(() => {
    fetchCommande();
    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, [fetchCommande, fetchApplications]);

  const handleSelect = async (livreurId) => {
    Alert.alert(
      'Confirmer la sélection',
      'Voulez-vous sélectionner ce livreur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setSelecting(livreurId);
            try {
              await apiClient.post(`/commandes/${commandeId}/select/${livreurId}`);
              dispatch(updateCommandeStatus({ commandeId, status: 'en_cours_pickup' }));
              Alert.alert('Livreur sélectionné', 'Le livreur a été notifié.', [
                { text: 'OK', onPress: () => navigation.navigate('OrderTracking', { commandeId }) },
              ]);
            } catch (e) {
              Alert.alert('Erreur', e?.response?.data?.message || 'Erreur lors de la sélection');
            } finally {
              setSelecting(null);
            }
          },
        },
      ]
    );
  };

  const applicants = applications[commandeId] || [];

  const timerText = timerSeconds !== null
    ? `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, '0')}`
    : '--:--';
  const isUrgent = timerSeconds !== null && timerSeconds < 30;

  const renderApplicant = ({ item }) => {
    const livreur = item.livreur || item;
    return (
      <View style={st.driverCard}>
        <View style={st.driverAvatar}>
          <Text style={st.driverInitials}>
            {(livreur.username || 'L').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={st.driverInfo}>
          <Text style={st.driverName}>{livreur.username}</Text>
          <View style={st.driverMeta}>
            <Ionicons name="star" size={13} color={WARNING} />
            <Text style={st.driverRating}>
              {Number(livreur.averageNote || 0).toFixed(1)}
            </Text>
            {livreur.vehicleType && (
              <Text style={st.driverVehicle}>• {livreur.vehicleType}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[st.selectBtn, selecting === livreur.id && { opacity: 0.6 }]}
          onPress={() => handleSelect(livreur.id)}
          disabled={!!selecting}
        >
          {selecting === livreur.id
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={st.selectBtnText}>Sélectionner</Text>
          }
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={st.root}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={st.headerTitle}>Choisir un livreur</Text>
        {commande && (
          <View style={st.orderBadge}>
            <Text style={st.orderBadgeText}>{commande.numero}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={applicants}
        keyExtractor={(item) => String(item.livreur?.id || item.id)}
        renderItem={renderApplicant}
        contentContainerStyle={st.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={st.timerCard}>
            <Text style={[st.timerDisplay, isUrgent && st.timerUrgent]}>{timerText}</Text>
            <Text style={st.timerLabel}>Temps restant pour choisir</Text>
            {timerSeconds !== null && (
              <View style={st.barBg}>
                <View
                  style={[
                    st.barFill,
                    { width: `${Math.max(0, (timerSeconds / 120) * 100)}%` },
                    isUrgent && { backgroundColor: '#E63946' },
                  ]}
                />
              </View>
            )}
            {applicants.length === 0 && !loading && (
              <Text style={st.waitingText}>En attente de livreurs...</Text>
            )}
            {loading && <ActivityIndicator color={CORAL} style={{ marginTop: 12 }} />}
            {applicants.length > 0 && (
              <Text style={st.sectionLabel}>
                {applicants.length} livreur{applicants.length > 1 ? 's' : ''} disponible{applicants.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:         { flex: 1, backgroundColor: LIGHT },
  header:       { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 18, fontWeight: '800', color: DARK },
  orderBadge:   { backgroundColor: LIGHT, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  orderBadgeText:{ fontSize: 12, fontWeight: '700', color: CORAL },
  list:         { paddingHorizontal: 16, paddingBottom: 32 },
  timerCard:    { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, marginTop: 16, alignItems: 'center' },
  timerDisplay: { fontSize: 48, fontWeight: '900', color: CORAL, letterSpacing: 2 },
  timerUrgent:  { color: '#E63946' },
  timerLabel:   { fontSize: 13, color: GRAY, marginTop: 4, marginBottom: 12 },
  barBg:        { width: '100%', height: 6, backgroundColor: '#ECECF0', borderRadius: 3 },
  barFill:      { height: 6, backgroundColor: CORAL, borderRadius: 3 },
  waitingText:  { fontSize: 14, color: GRAY, marginTop: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: DARK, marginTop: 16 },
  driverCard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  driverAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF1FF', justifyContent: 'center', alignItems: 'center' },
  driverInitials:{ fontSize: 18, fontWeight: '800', color: '#4361EE' },
  driverInfo:   { flex: 1 },
  driverName:   { fontSize: 15, fontWeight: '700', color: DARK },
  driverMeta:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  driverRating: { fontSize: 13, fontWeight: '600', color: WARNING },
  driverVehicle:{ fontSize: 12, color: GRAY },
  selectBtn:    { backgroundColor: CORAL, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  selectBtnText:{ color: '#fff', fontWeight: '700', fontSize: 13 },
});
