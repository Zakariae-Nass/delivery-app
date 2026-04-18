import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setProfile, updateProfileField } from '../../redux/slices/profileSlice';
import DrawerMenu from '../../components/DrawerMenu';

const CORAL = '#FF6B35';
const DARK  = '#1A1A2E';
const GRAY  = '#8E8EA0';
const LIGHT = '#F5F7FF';

const VEHICLE_OPTIONS = ['moto', 'voiture', 'camion'];

export default function DriverProfileScreen({ navigation }) {
  const dispatch  = useDispatch();
  const { user }  = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.profile);

  const [refreshing, setRefreshing] = useState(false);
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editUsername, setEditUsername] = useState('');
  const [editPhone,    setEditPhone]    = useState('');
  const [editVehicle,  setEditVehicle]  = useState('moto');

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/livreurs/me');
      dispatch(setProfile(data));
    } catch (e) {
      console.error('Profile fetch error', e);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const openEdit = () => {
    setEditUsername(profile?.username || user?.username || '');
    setEditPhone(profile?.phone || '');
    setEditVehicle(profile?.vehicleType || 'moto');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editUsername.trim()) return Alert.alert('Erreur', 'Le nom est requis');
    setSaving(true);
    try {
      const { data } = await apiClient.patch('/livreurs/me', {
        username: editUsername.trim(),
        phone: editPhone.trim(),
        vehicleType: editVehicle,
      });
      dispatch(updateProfileField(data));
      setEditing(false);
    } catch (e) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie requis');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    setUploading(true);
    try {
      const uri = result.assets[0].uri;
      const filename = uri.split('/').pop();
      const form = new FormData();
      form.append('file', { uri, name: filename, type: 'image/jpeg' });
      const { data } = await apiClient.post('/livreurs/me/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateProfileField({ photoUrl: data.photoUrl }));
    } catch (e) {
      Alert.alert('Erreur', 'Échec du téléchargement de la photo');
    } finally {
      setUploading(false);
    }
  };

  const kycStatusConfig = {
    not_verified: { label: 'Non vérifié', color: '#E63946', bg: '#FFF0F0', icon: 'close-circle-outline' },
    pending:      { label: 'En attente',  color: '#FF9F1C', bg: '#FFF8EE', icon: 'time-outline' },
    approved:     { label: 'Approuvé',    color: '#2DC653', bg: '#EAFAF1', icon: 'checkmark-circle-outline' },
    rejected:     { label: 'Rejeté',      color: '#E63946', bg: '#FFF0F0', icon: 'close-circle-outline' },
  };

  const kycStatus = profile?.kycStatus || 'not_verified';
  const kycCfg = kycStatusConfig[kycStatus] || kycStatusConfig.not_verified;
  const photoUrl = profile?.photoUrl;
  const initials = (profile?.username || user?.username || 'L').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={st.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} tintColor={CORAL} />
        }
      >
        {/* Header */}
        <View style={st.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={st.iconBtn}>
            <Ionicons name="menu-outline" size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={st.title}>Mon Profil</Text>
          <TouchableOpacity onPress={openEdit} style={st.iconBtn}>
            <Ionicons name="create-outline" size={22} color={CORAL} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={st.avatarSection}>
          <TouchableOpacity onPress={handlePickPhoto} style={st.avatarWrap} disabled={uploading}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={st.avatarImg} />
            ) : (
              <View style={st.avatarFallback}>
                <Text style={st.avatarInitials}>{initials}</Text>
              </View>
            )}
            <View style={st.cameraBtn}>
              {uploading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="camera" size={14} color="#fff" />
              }
            </View>
          </TouchableOpacity>
          <Text style={st.profileName}>{profile?.username || user?.username}</Text>
          <Text style={st.profileEmail}>{profile?.email || user?.email}</Text>
        </View>

        {/* KYC Status */}
        <View style={[st.kycCard, { backgroundColor: kycCfg.bg }]}>
          <Ionicons name={kycCfg.icon} size={20} color={kycCfg.color} />
          <View style={st.kycInfo}>
            <Text style={[st.kycLabel, { color: kycCfg.color }]}>Statut KYC: {kycCfg.label}</Text>
            {(kycStatus === 'not_verified' || kycStatus === 'rejected') && (
              <Text style={st.kycSub}>Soumettez vos documents pour être vérifié</Text>
            )}
          </View>
          {(kycStatus === 'not_verified' || kycStatus === 'rejected') && (
            <TouchableOpacity
              onPress={() => navigation.navigate('KycVerification')}
              style={[st.kycBtn, { backgroundColor: kycCfg.color }]}
            >
              <Text style={st.kycBtnText}>Soumettre</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={st.infoCard}>
          <Text style={st.infoCardTitle}>Informations</Text>
          {[
            { icon: 'person-outline',   label: 'Nom',     value: profile?.username },
            { icon: 'mail-outline',     label: 'Email',   value: profile?.email },
            { icon: 'call-outline',     label: 'Téléphone', value: profile?.phone || '—' },
            { icon: 'bicycle-outline',  label: 'Véhicule',  value: profile?.vehicleType || '—' },
            { icon: 'star-outline',     label: 'Note',    value: `${Number(profile?.averageNote || 0).toFixed(1)} / 5` },
          ].map((row) => (
            <View key={row.label} style={st.infoRow}>
              <View style={st.infoIconWrap}>
                <Ionicons name={row.icon} size={18} color={CORAL} />
              </View>
              <View style={st.infoTextWrap}>
                <Text style={st.infoLabel}>{row.label}</Text>
                <Text style={st.infoValue}>{row.value || '—'}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Modal */}
      {editing && (
        <View style={st.editOverlay}>
          <View style={st.editSheet}>
            <Text style={st.editTitle}>Modifier le profil</Text>

            <Text style={st.editLabel}>Nom</Text>
            <TextInput
              style={st.editInput}
              value={editUsername}
              onChangeText={setEditUsername}
              placeholder="Nom complet"
            />

            <Text style={st.editLabel}>Téléphone</Text>
            <TextInput
              style={st.editInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="06XXXXXXXX"
              keyboardType="phone-pad"
            />

            <Text style={st.editLabel}>Type de véhicule</Text>
            <View style={st.vehicleRow}>
              {VEHICLE_OPTIONS.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[st.vehicleChip, editVehicle === v && st.vehicleChipActive]}
                  onPress={() => setEditVehicle(v)}
                >
                  <Text style={[st.vehicleChipText, editVehicle === v && st.vehicleChipTextActive]}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={st.editActions}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setEditing(false)}>
                <Text style={st.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.saveBtn} onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={st.saveBtnText}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="DriverProfile"
        driverName={profile?.username || user?.username || ''}
        driverEmail={profile?.email || user?.email || ''}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:         { flex: 1, backgroundColor: LIGHT },
  header:       { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:        { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  avatarSection:{ alignItems: 'center', paddingVertical: 24, backgroundColor: '#fff', marginBottom: 12 },
  avatarWrap:   { position: 'relative', marginBottom: 12 },
  avatarImg:    { width: 90, height: 90, borderRadius: 45 },
  avatarFallback:{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#EEF1FF', justifyContent: 'center', alignItems: 'center' },
  avatarInitials:{ fontSize: 32, fontWeight: '800', color: '#4361EE' },
  cameraBtn:    { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: CORAL, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  profileName:  { fontSize: 20, fontWeight: '800', color: DARK },
  profileEmail: { fontSize: 14, color: GRAY, marginTop: 4 },
  kycCard:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, gap: 12 },
  kycInfo:      { flex: 1 },
  kycLabel:     { fontSize: 14, fontWeight: '700' },
  kycSub:       { fontSize: 12, color: GRAY, marginTop: 2 },
  kycBtn:       { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  kycBtnText:   { color: '#fff', fontWeight: '700', fontSize: 12 },
  infoCard:     { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 4 },
  infoCardTitle:{ fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 8 },
  infoRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F5', gap: 12 },
  infoIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,107,53,0.1)', justifyContent: 'center', alignItems: 'center' },
  infoTextWrap: { flex: 1 },
  infoLabel:    { fontSize: 12, color: GRAY, fontWeight: '500' },
  infoValue:    { fontSize: 15, color: DARK, fontWeight: '600', marginTop: 1 },
  editOverlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  editSheet:    { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  editTitle:    { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 20 },
  editLabel:    { fontSize: 13, color: GRAY, fontWeight: '600', marginBottom: 6 },
  editInput:    { backgroundColor: LIGHT, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: DARK, marginBottom: 16, borderWidth: 1, borderColor: '#ECECF0' },
  vehicleRow:   { flexDirection: 'row', gap: 10, marginBottom: 24 },
  vehicleChip:  { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: LIGHT, alignItems: 'center', borderWidth: 1, borderColor: '#ECECF0' },
  vehicleChipActive: { backgroundColor: 'rgba(255,107,53,0.1)', borderColor: CORAL },
  vehicleChipText:   { fontSize: 13, fontWeight: '600', color: GRAY },
  vehicleChipTextActive: { color: CORAL },
  editActions:  { flexDirection: 'row', gap: 12 },
  cancelBtn:    { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: LIGHT, alignItems: 'center', borderWidth: 1, borderColor: '#ECECF0' },
  cancelBtnText:{ fontSize: 15, fontWeight: '700', color: GRAY },
  saveBtn:      { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: CORAL, alignItems: 'center' },
  saveBtnText:  { fontSize: 15, fontWeight: '700', color: '#fff' },
});
