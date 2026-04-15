import React from 'react';
import { View, Text } from 'react-native';
import { stat } from '../../styles/livreurHomeStyles';

export default function MiniStat({ icon, label, value, color }) {
  return (
    <View style={stat.card}>
      <Text style={stat.icon}>{icon}</Text>
      <Text style={[stat.value, { color }]}>{value}</Text>
      <Text style={stat.label}>{label}</Text>
    </View>
  );
}
