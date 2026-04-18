import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { stat } from '../../styles/livreurHomeStyles';

export default function MiniStat({ icon, label, value, color }) {
  return (
    <View style={stat.card}>
      <Ionicons name={icon} size={20} color={color} style={{ marginBottom: 6 }} />
      <Text style={[stat.value, { color }]}>{value}</Text>
      <Text style={stat.label}>{label}</Text>
    </View>
  );
}
