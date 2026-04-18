import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setCommandes } from '../../redux/slices/commandesSlice';
import { setProfile } from '../../redux/slices/profileSlice';
import DrawerMenu from '../../components/DrawerMenu';
import { s, WHITE, CORAL, SUCCESS, WARNING } from './styles/livreurHomeStyles';
import DriverHeader from './components/home/DriverHeader';
import StatusCard from './components/home/StatusCard';
import MiniStat from './components/home/MiniStat';
import OrderCard from './components/home/OrderCard';

export default function LivreurHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: commandes, activeCommande } = useSelector((s) => s.commandes);
  const { profile } = useSelector((s) => s.profile);

  const [isOnline, setIsOnline]   = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, commandesRes] = await Promise.all([
        apiClient.get('/livreurs/me'),
        apiClient.get('/commandes/available'),
      ]);
      dispatch(setProfile(profileRes.data));
      dispatch(setCommandes(commandesRes.data));
      setIsOnline(profileRes.data.status === 'online');
    } catch (e) {
      console.error('HomeScreen fetch error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleStatus = async (val) => {
    if (!profile?.isVerified && val) return;
    try {
      await apiClient.patch('/livreurs/me/status', { status: val ? 'online' : 'offline' });
      setIsOnline(val);
    } catch (e) {
      console.error('Status toggle error', e);
    }
  };

  const handleApply = async (commandeId) => {
    setApplyingId(commandeId);
    try {
      await apiClient.post(`/commandes/${commandeId}/apply`);
      setAppliedIds((prev) => [...prev, commandeId]);
    } catch (e) {
      console.error('Apply error', e);
    } finally {
      setApplyingId(null);
    }
  };

  const todayLivrees = commandes.filter((c) => c.status === 'livree').length;
  const note = profile?.averageNote ? Number(profile.averageNote).toFixed(1) : '0.0';

  if (profile && !profile.isVerified) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Ionicons name="shield-outline" size={64} color={WARNING} />
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', marginTop: 16, textAlign: 'center' }}>
            En attente de validation
          </Text>
          <Text style={{ fontSize: 14, color: '#8E8EA0', marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            Votre compte est en cours de validation. Vous pourrez accepter des commandes une fois approuvé.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor={CORAL}
          />
        }
      >
        <DriverHeader onMenuOpen={() => setDrawerOpen(true)} navigation={navigation} />

        <StatusCard
          isOnline={isOnline}
          onToggle={handleToggleStatus}
          isVerified={profile?.isVerified}
        />

        <View style={s.statsRow}>
          <MiniStat icon="cube-outline"     label="Aujourd'hui" value={`${todayLivrees}`}   color={CORAL}   />
          <MiniStat icon="wallet-outline"   label="Note"        value={`${note}/5`}          color={WARNING} />
          <MiniStat icon="checkmark-circle-outline" label="Note moy." value={note}           color={SUCCESS} />
        </View>

        {loading ? (
          <ActivityIndicator color={CORAL} size="large" style={{ marginTop: 40 }} />
        ) : isOnline ? (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Commandes disponibles</Text>
              <View style={s.liveBadge}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>LIVE</Text>
              </View>
            </View>

            {commandes.length === 0 ? (
              <View style={s.offlineBox}>
                <Ionicons name="cube-outline" size={48} color="#8E8EA0" />
                <Text style={s.offlineTitle}>Aucune commande disponible</Text>
                <Text style={s.offlineSub}>Revenez plus tard</Text>
              </View>
            ) : (
              <View style={s.ordersList}>
                {commandes.map((commande) => (
                  <OrderCard
                    key={commande.id}
                    commande={commande}
                    applied={appliedIds.includes(commande.id)}
                    applying={applyingId === commande.id}
                    onApply={() => handleApply(commande.id)}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={s.offlineBox}>
            <Ionicons name="moon-outline" size={56} color="#8E8EA0" />
            <Text style={s.offlineTitle}>Vous êtes hors ligne</Text>
            <Text style={s.offlineSub}>
              Activez le switch ci-dessus pour commencer à recevoir des commandes.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="LivreurHome"
        driverName={user?.username || ''}
        driverEmail={user?.email || ''}
      />
    </View>
  );
}
