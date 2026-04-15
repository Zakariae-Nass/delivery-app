import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s } from '../../styles/walletStyles';

export default function WalletHeader({ onMenuOpen }) {
  return (
    <SafeAreaView edges={['top']} style={s.header}>
      <TouchableOpacity style={s.iconBtn} onPress={onMenuOpen} activeOpacity={0.7}>
        <Text style={s.hamburgerIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>Mon Wallet</Text>
      <TouchableOpacity style={s.iconBtn} activeOpacity={0.7}>
        <Text style={s.bellIcon}>🔔</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
