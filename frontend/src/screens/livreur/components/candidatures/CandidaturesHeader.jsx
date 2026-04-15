import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s } from '../../styles/candidaturesStyles';

export default function CandidaturesHeader({ onBack, onMenuOpen }) {
  return (
    <SafeAreaView edges={['top']} style={s.header}>
      <TouchableOpacity style={s.iconBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={s.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={s.headerTitle}>Mes Candidatures</Text>
      <TouchableOpacity style={s.iconBtn} onPress={onMenuOpen} activeOpacity={0.7}>
        <Text style={s.hamburgerIcon}>☰</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
