import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { s, FILTERS, MOCK_CANDIDATURES, WHITE } from '../../styles/candidaturesStyles';

export default function FilterChips({ activeFilter, onFilterChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.filterRow}
    >
      {FILTERS.map(f => {
        const isActive = activeFilter === f.key;
        const count = f.key === 'all'
          ? MOCK_CANDIDATURES.length
          : MOCK_CANDIDATURES.filter(c => c.statut === f.key).length;
        return (
          <TouchableOpacity
            key={f.key}
            style={[s.filterChip, isActive && { backgroundColor: f.color, borderColor: f.color }]}
            onPress={() => onFilterChange(f.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.filterChipText, isActive && s.filterChipTextActive]}>
              {f.label}
            </Text>
            <View style={[s.filterCount, isActive && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <Text style={[s.filterCountText, isActive && { color: WHITE }]}>{count}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
