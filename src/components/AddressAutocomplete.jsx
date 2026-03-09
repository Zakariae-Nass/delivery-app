import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

const BLUE = '#4361EE';

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildShortName(item) {
  const a = item.address || {};
  const parts = [
    a.suburb || a.neighbourhood || a.quarter || a.hamlet,
    a.city   || a.town          || a.village || a.county,
    a.state,
  ].filter(Boolean);
  return (
    parts.slice(0, 2).join(', ') ||
    item.display_name.split(',').slice(0, 2).join(',').trim()
  );
}

function shortFromText(text) {
  return text.split(',').slice(0, 2).join(',').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AddressAutocomplete({
  label,
  dotColor,
  initialValue,       // { text, lat, lng } | null
  onAddressSelected,  // (addr: { text, lat, lng }) => void
  onAddressCleared,   // () => void
  error,              // string | null
  isGpsLoading = false,
}) {
  const [inputText,       setInputText]       = useState('');
  const [suggestions,     setSuggestions]     = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [selected,        setSelected]        = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // ── React to initialValue changes (GPS pre-fill) ─────────────────────────
  useEffect(() => {
    if (initialValue?.lat) {
      const shortName = shortFromText(initialValue.text);
      setSelected({
        text:      initialValue.text,
        lat:       initialValue.lat,
        lng:       initialValue.lng,
        shortName,
      });
      setInputText(shortName);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [initialValue]);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // ── Nominatim search ─────────────────────────────────────────────────────
  const searchAddress = async (text) => {
    setLoading(true);
    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(text)}` +
        `&format=json&limit=5&countrycodes=ma&addressdetails=1`;
      const res  = await fetch(url, { headers: { 'User-Agent': 'DeliveryApp/1.0' } });
      const data = await res.json();

      if (data.length === 0) {
        setSuggestions([{ id: 'noresult', noResult: true }]);
      } else {
        setSuggestions(
          data.slice(0, 5).map((item, idx) => ({
            id:        item.place_id?.toString() || String(idx),
            text:      item.display_name,
            lat:       parseFloat(item.lat),
            lng:       parseFloat(item.lon),
            shortName: buildShortName(item),
          }))
        );
      }
      setShowSuggestions(true);
    } catch {
      setSuggestions([{ id: 'noresult', noResult: true }]);
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Text change handler ──────────────────────────────────────────────────
  const handleChangeText = (text) => {
    setInputText(text);
    setSelected(null);
    onAddressCleared();

    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => searchAddress(text), 500);
  };

  // ── Select a suggestion ──────────────────────────────────────────────────
  const handleSelect = (suggestion) => {
    if (suggestion.noResult) return;
    setSelected(suggestion);
    setInputText(suggestion.shortName);
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressSelected({ text: suggestion.text, lat: suggestion.lat, lng: suggestion.lng });
    Keyboard.dismiss();
  };

  // ── Edit (clear selection) ───────────────────────────────────────────────
  const handleEdit = () => {
    setSelected(null);
    setInputText('');
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressCleared();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
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
      ) : selected ? (
        /* ── STATE 1: Address validated ── */
        <View style={[ac.selectedPill, error && ac.selectedPillError]}>
          <View style={[ac.pillDot, { backgroundColor: dotColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={ac.pillShortName} numberOfLines={1}>
              {selected.shortName}
            </Text>
            <Text style={ac.pillFullName} numberOfLines={1}>
              {selected.text.slice(0, 60)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleEdit}
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
            ref={inputRef}
            style={ac.input}
            value={inputText}
            onChangeText={handleChangeText}
            placeholder="Rechercher une adresse..."
            placeholderTextColor="#BDBDBD"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {loading && (
            <ActivityIndicator size="small" color={BLUE} style={ac.inputSpinner} />
          )}
        </View>
      )}

      {/* Error message */}
      {error ? <Text style={ac.errorText}>{error}</Text> : null}

      {/* ── Suggestions list (inline, no z-index issues) ── */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={ac.suggestionsList}>
          {suggestions.map((s, idx) =>
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
                  idx < suggestions.length - 1 && ac.suggestionBorder,
                ]}
                onPress={() => handleSelect(s)}
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
