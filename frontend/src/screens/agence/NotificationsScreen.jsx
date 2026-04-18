import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { markAllRead } from '../../redux/slices/notificationsSlice';

const DARK  = '#1A1A2E';
const GRAY  = '#8E8EA0';
const LIGHT = '#F5F7FF';
const CORAL = '#FF6B35';

const NOTIF_ICONS = {
  new_application:     { icon: 'person-add-outline',    color: '#4361EE', bg: '#EEF1FF' },
  commande_assigned:   { icon: 'checkmark-circle-outline', color: '#2DC653', bg: '#EAFAF1' },
  status_changed:      { icon: 'swap-horizontal-outline', color: '#FF9F1C', bg: '#FFF8EE' },
  selection_timer:     { icon: 'time-outline',           color: CORAL,     bg: 'rgba(255,107,53,0.1)' },
  default:             { icon: 'notifications-outline',  color: GRAY,      bg: LIGHT },
};

export default function NotificationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list: notifications } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(markAllRead());
  }, [dispatch]);

  const renderItem = ({ item }) => {
    const cfg = NOTIF_ICONS[item.type] || NOTIF_ICONS.default;
    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View style={[st.card, !item.read && st.cardUnread]}>
        <View style={[st.iconWrap, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={20} color={cfg.color} />
        </View>
        <View style={st.cardBody}>
          <Text style={st.cardTitle} numberOfLines={2}>{item.title || item.message || 'Notification'}</Text>
          {item.body ? <Text style={st.cardBody2} numberOfLines={2}>{item.body}</Text> : null}
          {date ? <Text style={st.cardDate}>{date}</Text> : null}
        </View>
        {!item.read && <View style={st.unreadDot} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={st.root}>
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={st.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {notifications.length === 0 ? (
        <View style={st.empty}>
          <Ionicons name="notifications-off-outline" size={52} color={GRAY} />
          <Text style={st.emptyTitle}>Aucune notification</Text>
          <Text style={st.emptySub}>Vous serez notifié des nouvelles candidatures ici</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={st.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:       { flex: 1, backgroundColor: LIGHT },
  header:     { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:      { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  list:       { padding: 16, gap: 10 },
  card:       { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: CORAL },
  iconWrap:   { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardBody:   { flex: 1 },
  cardTitle:  { fontSize: 14, fontWeight: '700', color: DARK, lineHeight: 20 },
  cardBody2:  { fontSize: 13, color: GRAY, marginTop: 3, lineHeight: 18 },
  cardDate:   { fontSize: 11, color: GRAY, marginTop: 5 },
  unreadDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL, marginTop: 4 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: DARK },
  emptySub:   { fontSize: 14, color: GRAY, textAlign: 'center', paddingHorizontal: 32 },
});
