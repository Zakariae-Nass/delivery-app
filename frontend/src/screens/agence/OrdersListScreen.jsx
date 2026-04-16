import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../config/constants';
import OrderCard from '../../components/OrderCard';

export default function OrdersListScreen({ navigation }) {
  const { orders, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes Commandes</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {orders.length} commande{orders.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreateOrder')}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Aucune commande</Text>
          <Text style={styles.emptySubtitle}>pour l'instant</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('CreateOrder')}
          >
            <Text style={styles.emptyBtnText}>Creer une commande</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <OrderCard order={item} navigation={navigation} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          extraData={orders}
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
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  countBadge: {
    backgroundColor: COLORS.blueLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  countText: { fontSize: 12, color: COLORS.blue, fontWeight: '600' },

  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: { fontSize: 20 },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.blue,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: Platform.OS === 'android' ? 34 : 36,
  },

  list: { padding: 16, paddingBottom: 40 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  emptySubtitle: { fontSize: 15, color: '#999', marginBottom: 28 },
  emptyBtn: {
    backgroundColor: COLORS.blue,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: COLORS.blue,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
