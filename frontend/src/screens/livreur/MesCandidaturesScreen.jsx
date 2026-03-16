import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import DrawerMenu from '../../components/DrawerMenu';
import { s, WHITE, STATUS_CFG, MOCK_CANDIDATURES } from './styles/candidaturesStyles';
import CandidaturesHeader from './components/candidatures/CandidaturesHeader';
import FilterChips from './components/candidatures/FilterChips';
import CandidatureCard from './components/candidatures/CandidatureCard';
import EmptyState from './components/shared/EmptyState';

export default function MesCandidaturesScreen({ navigation }) {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const displayed = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? MOCK_CANDIDATURES
      : MOCK_CANDIDATURES.filter(c => c.statut === activeFilter);

    return [...filtered].sort(
      (a, b) => (STATUS_CFG[a.statut]?.sort ?? 9) - (STATUS_CFG[b.statut]?.sort ?? 9),
    );
  }, [activeFilter]);

  const selectedCmd  = MOCK_CANDIDATURES.find(c => c.statut === 'selectionne');
  const showFeatured = activeFilter === 'all' && !!selectedCmd;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <CandidaturesHeader
          onBack={() => navigation.goBack()}
          onMenuOpen={() => setDrawerOpen(true)}
        />

        {/* ── Filter chips ── */}
        <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* ── Featured banner ── */}
        {showFeatured && (
          <View style={s.featuredSection}>
            <View style={s.featuredLabel}>
              <View style={s.featuredDot} />
              <Text style={s.featuredLabelText}>Commande sélectionnée</Text>
            </View>
            <CandidatureCard
              candidature={selectedCmd}
              featured
              onVoirDetails={() => {}}
            />
          </View>
        )}

        {/* ── Main list ── */}
        {displayed.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <>
            {showFeatured && displayed.length > 1 && (
              <View style={s.restLabel}>
                <Text style={s.restLabelText}>Autres candidatures</Text>
              </View>
            )}
            <View style={s.list}>
              {displayed
                .filter(c => showFeatured ? c.statut !== 'selectionne' : true)
                .map(c => (
                  <CandidatureCard
                    key={c.id}
                    candidature={c}
                    onVoirDetails={() => {}}
                  />
                ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="MesCandidatures"
        driverName="Youssef Benali"
        driverEmail="youssef@delivtrack.ma"
      />
    </View>
  );
}
