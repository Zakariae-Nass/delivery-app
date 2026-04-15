import React from 'react';
import { View, Text, Switch } from 'react-native';
import { s, SUCCESS, GRAY_LABEL, GRAY_DIV, SUCCESS_BG } from '../../styles/livreurHomeStyles';

export default function StatusCard({ isOnline, onToggle }) {
  return (
    <View style={[s.statusCard, isOnline && s.statusCardOnline]}>
      <View style={s.statusLeft}>
        <View style={[s.statusDot, { backgroundColor: isOnline ? SUCCESS : GRAY_LABEL }]} />
        <View>
          <Text style={s.statusTitle}>
            {isOnline ? 'Disponible' : 'Hors ligne'}
          </Text>
          <Text style={s.statusSubtitle}>
            {isOnline
              ? 'Vous recevez des commandes'
              : 'Activez pour recevoir des commandes'}
          </Text>
        </View>
      </View>
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        trackColor={{ false: GRAY_DIV, true: SUCCESS_BG }}
        thumbColor={isOnline ? SUCCESS : GRAY_LABEL}
        ios_backgroundColor={GRAY_DIV}
      />
    </View>
  );
}
