import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../config/constants';
import NotifCard from '../../components/NotifCard';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAllRead } = useApp();

  useEffect(() => {
    markAllRead();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotifCard notif={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  list: { padding: 16, paddingBottom: 40 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '500' },
});
