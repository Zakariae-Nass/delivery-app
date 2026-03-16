import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { MOCK_COMMANDES_LIVREUR, MOCK_STATS_LIVREUR } from '../../config/mockData';

import DrawerMenu from '../../components/DrawerMenu';
import { s, WHITE, CORAL, SUCCESS, WARNING } from './styles/livreurHomeStyles';
import DriverHeader from './components/home/DriverHeader';
import StatusCard from './components/home/StatusCard';
import EarningsCard from './components/home/EarningsCard';
import MiniStat from './components/home/MiniStat';
import OrderCard from './components/home/OrderCard';

export default function LivreurHomeScreen({ navigation }) {
  const [isOnline,   setIsOnline]   = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <DriverHeader
          onMenuOpen={() => setDrawerOpen(true)}
          navigation={navigation}
        />

        {/* ── Status Toggle ── */}
        <StatusCard isOnline={isOnline} onToggle={setIsOnline} />

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          <MiniStat icon="📦" label="Aujourd'hui"  value={`${MOCK_STATS_LIVREUR.commandesAujourdhui}`}  color={CORAL}   />
          <MiniStat icon="💰" label="Gains / jour"  value={`${MOCK_STATS_LIVREUR.gainsAujourdhui} MAD`} color={SUCCESS} />
          <MiniStat icon="⭐" label="Note"          value={`${MOCK_STATS_LIVREUR.note}/5`}              color={WARNING} />
        </View>

        {/* ── Earnings Card ── */}
        <EarningsCard stats={MOCK_STATS_LIVREUR} />

        {/* ── Orders Section ── */}
        {isOnline ? (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Commandes disponibles</Text>
              <View style={s.liveBadge}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>LIVE</Text>
              </View>
            </View>

            <View style={s.ordersList}>
              {MOCK_COMMANDES_LIVREUR.map(commande => (
                <OrderCard
                  key={commande.id}
                  commande={commande}
                  applied={appliedIds.includes(commande.id)}
                  onApply={() => setAppliedIds(prev => [...prev, commande.id])}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={s.offlineBox}>
            <Text style={s.offlineEmoji}>😴</Text>
            <Text style={s.offlineTitle}>Vous êtes hors ligne</Text>
            <Text style={s.offlineSub}>
              Activez le switch ci-dessus pour commencer à recevoir des commandes.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="LivreurHome"
        driverName="Youssef Benali"
        driverEmail="youssef@delivtrack.ma"
      />
    </View>
  );
}
