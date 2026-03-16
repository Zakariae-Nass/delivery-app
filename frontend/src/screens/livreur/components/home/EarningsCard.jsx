import React from 'react';
import { View, Text } from 'react-native';
import { s } from '../../styles/livreurHomeStyles';

export default function EarningsCard({ stats }) {
  return (
    <View style={s.earningsCard}>
      <View>
        <Text style={s.earningsLabel}>Gains cette semaine</Text>
        <Text style={s.earningsValue}>{stats.gainsSemaine} MAD</Text>
      </View>
      <View style={s.earningsDivider} />
      <View style={s.earningsRight}>
        <Text style={s.earningsLabel}>Total livraisons</Text>
        <Text style={s.totalValue}>{stats.totalLivraisons} 🏆</Text>
      </View>
    </View>
  );
}
