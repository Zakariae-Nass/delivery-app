import React from 'react';
import { View, Text, Switch } from 'react-native';
import { s, SUCCESS, GRAY_LABEL, GRAY_DIV, SUCCESS_BG } from '../../styles/livreurHomeStyles';

export default function StatusCard({ isOnline, onToggle, isVerified }) {
  return (
    <View style={[s.statusCard, isOnline && s.statusCardOnline]}>
      <View style={s.statusLeft}>
        <View style={[s.statusDot, { backgroundColor: isOnline ? SUCCESS : GRAY_LABEL }]} />
        <View>
          <Text style={s.statusTitle}>
            {isOnline ? 'Disponible' : 'Hors ligne'}
          </Text>
          <Text style={s.statusSubtitle}>
            {!isVerified
              ? 'En attente de validation'
              : isOnline
              ? 'Vous recevez des commandes'
              : 'Activez pour recevoir des commandes'}
          </Text>
        </View>
      </View>
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        disabled={!isVerified}
        trackColor={{ false: GRAY_DIV, true: SUCCESS_BG }}
        thumbColor={isOnline ? SUCCESS : GRAY_LABEL}
        ios_backgroundColor={GRAY_DIV}
      />
    </View>
  );
}
