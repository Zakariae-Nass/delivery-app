import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import DrawerMenu from '../../components/DrawerMenu';

const CORAL    = '#FF6B35';
const DARK     = '#1A1A2E';
const GRAY     = '#8E8EA0';
const LIGHT    = '#F5F5F7';
const GRAY_DIV = '#ECECF0';

const AGENCY_MENU_ITEMS = [
  { key: 'AgenceDashboard', label: 'Dashboard',     icon: 'home-outline' },
  { key: 'OrdersList',      label: 'Mes Commandes', icon: 'list-outline' },
  { key: 'AgencyWallet',    label: 'Mon Wallet',    icon: 'wallet-outline' },
  { key: 'AgencyProfile',   label: 'Mon Profil',    icon: 'person-outline' },
  { key: 'Notifications',   label: 'Notifications', icon: 'notifications-outline' },
];

export default function AgencyProfileScreen({ navigation }) {
  const { user } = useSelector((s) => s.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);

  const [editUsername, setEditUsername] = useState('');
  const [editPhone,    setEditPhone]    = useState('');

  const initials = (user?.username || 'AG').slice(0, 2).toUpperCase();

  const openEdit = () => {
    setEditUsername(user?.username || '');
    setEditPhone(user?.phone || '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editUsername.trim()) return Alert.alert('Erreur', 'Le nom est requis');
    setSaving(true);
    try {
      await apiClient.patch('/agences/me', {
        username: editUsername.trim(),
        phone: editPhone.trim(),
      });
      setEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (e) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={st.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <ScrollView showsVerticalScrollIndicator={false}>
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
            <View style={st.avatarFallback}>
              <Text style={st.avatarInitials}>{initials}</Text>
            </View>
            <Text style={st.profileName}>{user?.username || 'Agence'}</Text>
            <Text style={st.profileEmail}>{user?.email}</Text>
          </View>

          {/* Info Card */}
          <View style={st.infoCard}>
            <Text style={st.infoCardTitle}>Informations</Text>
            {[
              { icon: 'business-outline', label: 'Nom agence', value: user?.username },
              { icon: 'mail-outline',     label: 'Email',      value: user?.email },
              { icon: 'call-outline',     label: 'Téléphone',  value: user?.phone || '—' },
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

              <Text style={st.editLabel}>Nom agence</Text>
              <TextInput
                style={st.editInput}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Nom de l'agence"
              />

              <Text style={st.editLabel}>Téléphone</Text>
              <TextInput
                style={st.editInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="06XXXXXXXX"
                keyboardType="phone-pad"
              />

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
      </SafeAreaView>

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="AgencyProfile"
        driverName={user?.username || ''}
        driverEmail={user?.email || ''}
        menuItems={AGENCY_MENU_ITEMS}
        profileScreenName="AgencyProfile"
      />
    </View>
  );
}

const st = StyleSheet.create({
  root:           { flex: 1, backgroundColor: LIGHT },
  header:         { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:        { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:          { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  avatarSection:  { alignItems: 'center', paddingVertical: 28, backgroundColor: '#fff', marginBottom: 12 },
  avatarFallback: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,107,53,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: CORAL },
  profileName:    { fontSize: 20, fontWeight: '800', color: DARK },
  profileEmail:   { fontSize: 14, color: GRAY, marginTop: 4 },
  infoCard:       { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 4 },
  infoCardTitle:  { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 8 },
  infoRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F5', gap: 12 },
  infoIconWrap:   { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,107,53,0.1)', justifyContent: 'center', alignItems: 'center' },
  infoTextWrap:   { flex: 1 },
  infoLabel:      { fontSize: 12, color: GRAY, fontWeight: '500' },
  infoValue:      { fontSize: 15, color: DARK, fontWeight: '600', marginTop: 1 },
  editOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  editSheet:      { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  editTitle:      { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 20 },
  editLabel:      { fontSize: 13, color: GRAY, fontWeight: '600', marginBottom: 6 },
  editInput:      { backgroundColor: LIGHT, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: DARK, marginBottom: 16, borderWidth: 1, borderColor: GRAY_DIV },
  editActions:    { flexDirection: 'row', gap: 12 },
  cancelBtn:      { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: LIGHT, alignItems: 'center', borderWidth: 1, borderColor: GRAY_DIV },
  cancelBtnText:  { fontSize: 15, fontWeight: '700', color: GRAY },
  saveBtn:        { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: CORAL, alignItems: 'center' },
  saveBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
