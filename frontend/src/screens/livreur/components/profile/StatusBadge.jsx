import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KYC_BADGE, bdg } from '../../styles/driverProfileStyles';

export default function StatusBadge({ status, onPress }) {
  const cfg = KYC_BADGE[status] || KYC_BADGE.not_verified;

  const badge = (
    <View style={[
      bdg.pill,
      { backgroundColor: cfg.bg, borderColor: cfg.color },
      status === 'approved' && bdg.pillDark,
    ]}>
      <View style={[bdg.dot, { backgroundColor: cfg.color }]} />
      <Text style={[bdg.text, { color: cfg.textColor || cfg.color }]}>
        {cfg.label}
      </Text>
    </View>
  );

  if (cfg.tappable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {badge}
      </TouchableOpacity>
    );
  }
  return badge;
}
