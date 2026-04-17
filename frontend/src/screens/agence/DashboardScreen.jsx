import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { MOCK_COMMANDES_AGENCE, MOCK_STATS_AGENCE } from '../../config/mockData';
import StatCard from '../../components/StatCard';
import CommandeCard from './components/CommandeCard';
import { styles } from './styles/DashboardScreen.styles';
import { Colors } from '../../config/theme';

const FILTERS = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'livrees', label: 'Livrées' },
];

export default function AgenceDashboardScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('toutes');

  const filteredCommandes = MOCK_COMMANDES_AGENCE.filter((c) => {
    if (activeFilter === 'toutes') return true;
    if (activeFilter === 'en_cours') return ['acceptee', 'en_route', 'pickup'].includes(c.statut);
    if (activeFilter === 'en_attente') return c.statut === 'en_attente';
    if (activeFilter === 'livrees') return c.statut === 'livree';
    return true;
  });

  const handleLogout = () => navigation.replace('Login');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Bonjour 👋</Text>
            <Text style={styles.agenceName}>Express Maroc</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <Text style={styles.avatarText}>EM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats Cards ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard icon="📦" label="Total" value={MOCK_STATS_AGENCE.totalCommandes} color={Colors.info} />
          <StatCard icon="🚴" label="En cours" value={MOCK_STATS_AGENCE.enCours} color={Colors.primary} />
          <StatCard icon="⏳" label="En attente" value={MOCK_STATS_AGENCE.enAttente} color={Colors.warning} />
          <StatCard icon="✅" label="Livrées" value={MOCK_STATS_AGENCE.livrees} color={Colors.success} />
          <StatCard icon="💰" label="Ce mois (MAD)" value={MOCK_STATS_AGENCE.gainsMois} color={Colors.success} />
        </ScrollView>

        {/* ── Bouton Nouvelle Commande ── */}
        <TouchableOpacity style={styles.newCommandeBtn} activeOpacity={0.85} onPress={() => navigation.navigate('CreateOrder')}>
          <Text style={styles.newCommandeIcon}>+</Text>
          <Text style={styles.newCommandeText}>Nouvelle commande</Text>
        </TouchableOpacity>

        {/* ── Section Commandes ── */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.sectionTitle}>Mes commandes</Text>
            <Text style={styles.sectionCount}>{filteredCommandes.length}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('OrdersList')}>
            <Text style={styles.voirTout}>Voir toutes →</Text>
          </TouchableOpacity>
        </View>

        {/* Filtres */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste commandes */}
        <View style={styles.commandesList}>
          {filteredCommandes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Aucune commande pour l'instant</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
                <Text style={styles.emptyLink}>Créer une commande →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredCommandes.map((commande) => (
              <CommandeCard key={commande.id} commande={commande} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
