import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useAddressSearch from '../hooks/useAddressSearch';

const BLUE = '#4361EE';

export default function AddressAutocomplete({
  label,
  dotColor,
  initialValue,
  onAddressSelected,
  onAddressCleared,
  error,
  isGpsLoading = false,
}) {
  const search = useAddressSearch({ initialValue, onAddressSelected, onAddressCleared });

  return (
    <View>
      {/* Label */}
      <Text style={ac.label}>{label}</Text>

      {/* GPS loading state */}
      {isGpsLoading ? (
        <View style={ac.gpsRow}>
          <ActivityIndicator size="small" color={BLUE} />
          <Text style={ac.gpsText}>📍 Détection de votre position...</Text>
        </View>
      ) : search.selected ? (
        /* ── STATE 1: Address validated ── */
        <View style={[ac.selectedPill, error && ac.selectedPillError]}>
          <View style={[ac.pillDot, { backgroundColor: dotColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={ac.pillShortName} numberOfLines={1}>
              {search.selected.shortName}
            </Text>
            <Text style={ac.pillFullName} numberOfLines={1}>
              {search.selected.text.slice(0, 60)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={search.handleEdit}
            style={ac.editBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={ac.editBtnText}>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── STATE 2/3: Typing or empty ── */
        <View style={[ac.inputWrapper, error && ac.inputWrapperError]}>
          <TextInput
            ref={search.inputRef}
            style={ac.input}
            value={search.inputText}
            onChangeText={search.handleChangeText}
            placeholder="Rechercher une adresse..."
            placeholderTextColor="#BDBDBD"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {search.loading && (
            <ActivityIndicator size="small" color={BLUE} style={ac.inputSpinner} />
          )}
        </View>
      )}

      {/* Error message */}
      {error ? <Text style={ac.errorText}>{error}</Text> : null}

      {/* ── Suggestions list (inline, no z-index issues) ── */}
      {search.showSuggestions && search.suggestions.length > 0 && (
        <View style={ac.suggestionsList}>
          {search.suggestions.map((s, idx) =>
            s.noResult ? (
              <View key="noresult" style={ac.noResultRow}>
                <Text style={ac.noResultText}>
                  😕  Aucun résultat. Essayez d'ajouter la ville.
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                key={s.id}
                style={[
                  ac.suggestionRow,
                  idx < search.suggestions.length - 1 && ac.suggestionBorder,
                ]}
                onPress={() => search.handleSelect(s)}
                activeOpacity={0.7}
              >
                <Text style={ac.suggestionPin}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={ac.suggestionShort} numberOfLines={1}>
                    {s.shortName}
                  </Text>
                  <Text style={ac.suggestionFull} numberOfLines={1}>
                    {s.text.slice(0, 50)}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ac = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BDBDBD',
    letterSpacing: 1,
    marginBottom: 6,
  },

  // GPS loading
  gpsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  gpsText: { fontSize: 13, color: BLUE },

  // Input wrapper
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    minHeight: 44,
  },
  inputWrapperError: { borderColor: '#E63946' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 11, fontSize: 13, color: '#333' },
  inputSpinner: { marginRight: 10 },

  // Selected pill
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF5',
    borderWidth: 1.5,
    borderColor: '#2DC653',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    minHeight: 44,
  },
  selectedPillError: { borderColor: '#E63946', backgroundColor: '#FFF5F5' },
  pillDot:       { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  pillShortName: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  pillFullName:  { fontSize: 11, color: '#999', marginTop: 1 },
  editBtn:       { padding: 4 },
  editBtnText:   { fontSize: 16 },

  // Error
  errorText: { fontSize: 11, color: '#E63946', marginTop: 4 },

  // Suggestions container
  suggestionsList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 10,
  },
  suggestionBorder:  { borderBottomWidth: 1, borderBottomColor: '#F0F0F5' },
  suggestionPin:     { fontSize: 15 },
  suggestionShort:   { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  suggestionFull:    { fontSize: 11, color: '#999', marginTop: 1 },

  // No result
  noResultRow:  { paddingHorizontal: 14, paddingVertical: 16, alignItems: 'center' },
  noResultText: { fontSize: 12, color: '#999', textAlign: 'center' },
});
