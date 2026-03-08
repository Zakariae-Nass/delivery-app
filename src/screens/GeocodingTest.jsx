import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function GeocodingTest() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);   // { lat, lng, displayName }
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // ─── Géocodage via Nominatim ───────────────────────────────────────────────
  const geocode = async (customAddress) => {
    const query = (customAddress || address).trim();
    if (!query) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;

      const response = await fetch(url, {
        headers: { 'User-Agent': 'DeliveryAppTest/1.0' },
      });

      const data = await response.json();

      if (data.length === 0) {
        // ❌ Adresse introuvable → dans l'app réelle : bloquer la sauvegarde
        setError(`Adresse introuvable.\nVérifiez l'orthographe ou ajoutez plus de détails.`);
        addHistory(query, null);
      } else {
        const found = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          type: data[0].type,
        };
        setResult(found);
        addHistory(query, found);
      }
    } catch (e) {
      setError('Erreur réseau. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const addHistory = (query, found) => {
    setHistory((prev) => [
      { query, found, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  };

  // ─── Ouvrir Google Maps avec les coordonnées ───────────────────────────────
  const openInMaps = () => {
    if (!result) return;
    const url = `https://www.google.com/maps?q=${result.lat},${result.lng}`;
    Linking.openURL(url);
  };

  // ─── Ouvrir navigation GPS (comme le livreur) ─────────────────────────────
  const openNavigation = () => {
    if (!result) return;
    const url =
      Platform.OS === 'ios'
        ? `maps://?daddr=${result.lat},${result.lng}`
        : `google.navigation:q=${result.lat},${result.lng}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback Google Maps web
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${result.lat},${result.lng}`
        );
      }
    });
  };

  // ─── Tests rapides ─────────────────────────────────────────────────────────
  const quickTests = [
    { label: '✅ Hay Riad Rabat',         value: 'Hay Riad, Rabat, Maroc' },
    { label: '✅ Bd Mohammed V Casa',     value: 'Boulevard Mohammed V, Casablanca, Maroc' },
    { label: '✅ Médina Marrakech',       value: 'Medina, Marrakech, Maroc' },
    { label: '⚠️ Faute de frappe',        value: 'Hay Riad Roue 10 Rabat' },
    { label: '❌ Adresse inventée',       value: 'Rue Fictive XYZ 9999 Maroc' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📦 Test Géocodage</Text>
          <Text style={styles.headerSub}>
            Nominatim / OpenStreetMap — Gratuit
          </Text>
        </View>

        {/* ── SAISIE ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ADRESSE À TESTER</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="ex: Hay Riad, Rabat, Maroc"
            placeholderTextColor="#555"
            returnKeyType="search"
            onSubmitEditing={() => geocode()}
          />
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={() => geocode()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>TESTER L'ADRESSE</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── TESTS RAPIDES ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TESTS RAPIDES</Text>
          <View style={styles.quickTests}>
            {quickTests.map((t, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickBtn}
                onPress={() => {
                  setAddress(t.value);
                  geocode(t.value);
                }}
              >
                <Text style={styles.quickBtnText}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── RÉSULTAT ── */}
        {error && (
          <View style={[styles.card, styles.cardError]}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>ADRESSE INTROUVABLE</Text>
            <Text style={styles.errorText}>{error}</Text>
            <View style={styles.divider} />
            <Text style={styles.errorHint}>
              → Dans l'app réelle : bloquer la sauvegarde et demander à l'agence de corriger.
            </Text>
          </View>
        )}

        {result && (
          <View style={[styles.card, styles.cardSuccess]}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>ADRESSE TROUVÉE</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultKey}>LAT</Text>
              <Text style={styles.resultVal}>{result.lat}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultKey}>LNG</Text>
              <Text style={styles.resultVal}>{result.lng}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultKey}>ADRESSE</Text>
              <Text style={[styles.resultVal, { fontSize: 11, color: '#aaa' }]}>
                {result.displayName}
              </Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.hintText}>
              💾 Ces coordonnées sont sauvegardées en BDD → le livreur les utilise pour la navigation.
            </Text>

            {/* Boutons navigation */}
            <TouchableOpacity style={styles.btnPrimary} onPress={openInMaps}>
              <Text style={styles.btnPrimaryText}>🗺️ VOIR SUR GOOGLE MAPS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: '#1a73e8', marginTop: 10 }]}
              onPress={openNavigation}
            >
              <Text style={styles.btnPrimaryText}>🚗 NAVIGUER (vue livreur)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── HISTORIQUE ── */}
        {history.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>HISTORIQUE DES TESTS</Text>
            {history.map((h, i) => (
              <View key={i} style={styles.historyItem}>
                <View style={styles.historyTop}>
                  <Text style={styles.historyQuery} numberOfLines={1}>
                    {h.query}
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      h.found ? styles.badgeOk : styles.badgeErr,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {h.found ? 'OK' : 'FAIL'}
                    </Text>
                  </View>
                </View>
                {h.found && (
                  <Text style={styles.historyCoords}>
                    {h.found.lat.toFixed(4)}, {h.found.lng.toFixed(4)} · {h.time}
                  </Text>
                )}
                {!h.found && (
                  <Text style={[styles.historyCoords, { color: '#ff4d4d' }]}>
                    Introuvable · {h.time}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── EXPLICATION ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>COMMENT ÇA MARCHE ?</Text>
          <Text style={styles.explainText}>
            <Text style={{ color: '#00e5a0' }}>1. Agence tape l'adresse</Text>
            {'\n'}→ L'app appelle Nominatim gratuitement
            {'\n\n'}
            <Text style={{ color: '#00e5a0' }}>2. Adresse introuvable ?</Text>
            {'\n'}→ Erreur immédiate, l'agence corrige
            {'\n\n'}
            <Text style={{ color: '#00e5a0' }}>3. Adresse trouvée ?</Text>
            {'\n'}→ lat/lng sauvegardés en base de données
            {'\n\n'}
            <Text style={{ color: '#00e5a0' }}>4. Livreur reçoit la commande</Text>
            {'\n'}→ App ouvre navigation GPS avec les coordonnées exactes
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  // Cards
  card: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardError: {
    borderColor: '#4d0000',
    backgroundColor: '#1a0000',
  },
  cardSuccess: {
    borderColor: '#004d2a',
    backgroundColor: '#001a0f',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 2,
    marginBottom: 12,
  },

  // Input
  input: {
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: '#00e5a0',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#1a3d30',
  },
  btnPrimaryText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },

  // Quick tests
  quickTests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickBtn: {
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  quickBtnText: {
    color: '#aaa',
    fontSize: 11,
  },

  // Error
  errorIcon: { fontSize: 32, textAlign: 'center', marginBottom: 8 },
  errorTitle: {
    color: '#ff4d4d',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  errorText: {
    color: '#ff9999',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorHint: {
    color: '#ff6666',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Success
  successIcon: { fontSize: 32, textAlign: 'center', marginBottom: 8 },
  successTitle: {
    color: '#00e5a0',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 12,
  },
  resultKey: {
    color: '#555',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    width: 60,
    paddingTop: 2,
  },
  resultVal: {
    color: '#00e5a0',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  hintText: {
    color: '#555',
    fontSize: 11,
    marginBottom: 14,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 12,
  },

  // History
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  historyQuery: {
    color: '#ccc',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  historyCoords: {
    color: '#555',
    fontSize: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeOk: { backgroundColor: '#001a0f', borderColor: '#004d2a' },
  badgeErr: { backgroundColor: '#1a0000', borderColor: '#4d0000' },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#fff',
  },

  // Explain
  explainText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 22,
  },
});