import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

const BLUE    = '#4361EE';
const WARNING = '#FF9F1C';
const SUCCESS = '#2DC653';
const DANGER  = '#E63946';
const BG      = '#F5F7FF';

const STATUS_CONFIG = {
  'En attente': { color: WARNING,  bg: '#FFF8EE', dots: [true,  false, false] },
  'Assigné':    { color: BLUE,     bg: '#EEF1FF', dots: [true,  true,  false] },
  'En cours':   { color: BLUE,     bg: '#EEF1FF', dots: [true,  true,  false] },
  'Livré':      { color: SUCCESS,  bg: '#EAFAF1', dots: [true,  true,  true]  },
};

const PKG_ICONS = {
  general: '📦', vetements: '👗', electronique: '📱',
  alimentation: '🍔', medical: '💊', documents: '📄',
};

const VEHICLE_ICONS = { moto: '🏍️', voiture: '🚗', camion: '🚛' };

function StatusBadge({ statut }) {
  const cfg = STATUS_CONFIG[statut] || STATUS_CONFIG['En attente'];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>{statut}</Text>
    </View>
  );
}

function ProgressDots({ statut }) {
  const cfg = STATUS_CONFIG[statut] || STATUS_CONFIG['En attente'];
  return (
    <View style={styles.progressRow}>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[0] ? cfg.color : '#E0E0E0' }]} />
      <View style={styles.progressLineWrapper}>
        <View style={[styles.progressLine, { backgroundColor: cfg.dots[1] ? cfg.color : '#E0E0E0' }]} />
      </View>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[1] ? cfg.color : '#E0E0E0' }]} />
      <View style={styles.progressLineWrapper}>
        <View style={[styles.progressLine, { backgroundColor: cfg.dots[2] ? cfg.color : '#E0E0E0' }]} />
      </View>
      <View style={[styles.progressDot, { backgroundColor: cfg.dots[2] ? cfg.color : '#E0E0E0' }]} />
    </View>
  );
}

function cityShort(address) {
  if (!address) return '—';
  return address.split(',')[0].trim();
}

function OrderCard({ order, navigation }) {
  const hasApplicants = order.applicants && order.applicants.length > 0;
  const isAssigned    = order.statut === 'Assigné';
  const driver        = order.assignedDriver;

  return (
    <View style={styles.orderCard}>
      {/* TOP ROW */}
      <View style={styles.cardTopRow}>
        <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
        <StatusBadge statut={order.statut} />
      </View>

      {/* PROGRESS */}
      <ProgressDots statut={order.statut} />

      {/* ROUTE ROW */}
      <View style={styles.routeRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.routeLabel}>DÉPART</Text>
          <Text style={styles.routeCity} numberOfLines={1}>{cityShort(order.departTexte)}</Text>
        </View>
        <Text style={styles.arrowIcon}>→</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.routeLabel}>DESTINATION</Text>
          <Text style={styles.routeCity} numberOfLines={1}>{cityShort(order.destinationTexte)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* DETAILS ROW */}
      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>{PKG_ICONS[order.packageType] || '📦'} {order.packageType || '—'}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>{VEHICLE_ICONS[order.vehicleType] || '🚗'} {order.vehicleType || '—'}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>💰 {order.prix} MAD</Text>
        </View>
        <TouchableOpacity
          style={[styles.detailChip, styles.phoneChip]}
          onPress={() => Linking.openURL(`tel:${order.clientTelephone}`)}
        >
          <Text style={[styles.detailText, { color: BLUE }]}>📞 {order.clientTelephone}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.clientName}>{order.clientNom}</Text>

      {/* ── BOTTOM BANNER ── */}
      {isAssigned && driver ? (
        <>
          <View style={styles.divider} />
          <View style={styles.assignedBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.assignedBannerLabel}>Livreur assigné</Text>
              <Text style={styles.assignedBannerDriver}>
                {driver.avatar} {driver.name} · ⭐ {driver.rating}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.navigate('Navigation', { orderId: order.id })}
            >
              <Text style={styles.navBtnText}>🗺️ Navigation</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : order.statut === 'En attente' && hasApplicants ? (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.applicantsBanner}
            onPress={() => navigation.navigate('DriverSelection', { orderId: order.id })}
          >
            <Text style={styles.applicantsBannerText}>
              👥 {order.applicants.length} livreur{order.applicants.length > 1 ? 's' : ''} ont postulé — Voir et choisir →
            </Text>
          </TouchableOpacity>
        </>
      ) : order.statut === 'En attente' ? (
        <>
          <View style={styles.divider} />
          <Text style={styles.waitingText}>⏳ En attente de livreurs...</Text>
        </>
      ) : null}
    </View>
  );
}

export default function OrdersListScreen({ navigation }) {
  const { orders, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      {/* ── HEADER ── */}
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
          {/* Bell */}
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

          {/* Add */}
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
            <Text style={styles.emptyBtnText}>Créer une commande</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <OrderCard order={item} navigation={navigation} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          // Re-render cards when order data changes (new applicants)
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
    backgroundColor: '#EEF1FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  countText: { fontSize: 12, color: BLUE, fontWeight: '600' },

  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FF',
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
    backgroundColor: DANGER,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BLUE,
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

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderId: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressDot: { width: 10, height: 10, borderRadius: 5 },
  progressLineWrapper: { flex: 1, paddingHorizontal: 2 },
  progressLine: { height: 2, borderRadius: 1 },

  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  routeLabel: { fontSize: 10, color: '#BDBDBD', fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  routeCity: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  arrowIcon: { fontSize: 20, color: '#BDBDBD', marginHorizontal: 8 },

  divider: { height: 1, backgroundColor: '#F0F0F5', marginVertical: 10 },

  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  detailChip: {
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  phoneChip: { backgroundColor: '#EEF1FF' },
  detailText: { fontSize: 12, color: '#666' },
  clientName: { fontSize: 13, color: '#999', fontStyle: 'italic' },

  // Waiting banner
  waitingText: { fontSize: 13, color: '#999', textAlign: 'center', paddingVertical: 4 },

  // Applicants banner
  applicantsBanner: {
    backgroundColor: '#FFF8EE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  applicantsBannerText: { fontSize: 13, color: WARNING, fontWeight: '600' },

  // Assigned banner
  assignedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  assignedBannerLabel: { fontSize: 10, color: BLUE, fontWeight: '700', letterSpacing: 0.5 },
  assignedBannerDriver: { fontSize: 13, color: '#1A1A2E', fontWeight: '600', marginTop: 2 },
  navBtn: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginLeft: 10,
  },
  navBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  emptySubtitle: { fontSize: 15, color: '#999', marginBottom: 28 },
  emptyBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
