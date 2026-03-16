import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s } from '../../styles/driverProfileStyles';
import StatusBadge from './StatusBadge';

export default function ProfileHeader({ onMenuOpen, kycStatus, onKycPress }) {
  return (
    <SafeAreaView edges={['top']} style={s.header}>
      <TouchableOpacity style={s.hamburgerBtn} onPress={onMenuOpen} activeOpacity={0.7}>
        <Text style={s.hamburgerIcon}>☰</Text>
      </TouchableOpacity>
      <StatusBadge status={kycStatus} onPress={onKycPress} />
    </SafeAreaView>
  );
}
