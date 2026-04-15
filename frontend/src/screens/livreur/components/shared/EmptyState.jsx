import React from 'react';
import { View, Text } from 'react-native';
import { empty, FILTERS } from '../../styles/candidaturesStyles';

export default function EmptyState({ filter }) {
  const isFiltered = filter !== 'all';
  const cfg = FILTERS.find(f => f.key === filter);
  return (
    <View style={empty.wrap}>
      <Text style={empty.emoji}>{isFiltered ? '🔍' : '📋'}</Text>
      <Text style={empty.title}>
        {isFiltered ? `Aucune candidature "${cfg?.label}"` : 'Aucune candidature'}
      </Text>
      <Text style={empty.subtitle}>
        {isFiltered
          ? 'Essaie un autre filtre.'
          : "Postule à des commandes depuis l'accueil"}
      </Text>
    </View>
  );
}
