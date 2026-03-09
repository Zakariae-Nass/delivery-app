import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useApp } from '../../context/AppContext';
import { simulateDriversApplying } from '../../utils/simulationData';

const BLUE = '#4361EE';
const BLUE_LIGHT = '#EEF1FF';
const BG = '#F5F7FF';

const PACKAGE_TYPES = [
  { id: 'general',      icon: '📦', label: 'Colis général' },
  { id: 'vetements',    icon: '👗', label: 'Vêtements' },
  { id: 'electronique', icon: '📱', label: 'Électronique' },
  { id: 'alimentation', icon: '🍔', label: 'Alimentation' },
  { id: 'medical',      icon: '💊', label: 'Médical' },
  { id: 'documents',    icon: '📄', label: 'Documents' },
];

const VEHICLE_TYPES = [
  { id: 'moto',    icon: '🏍️', label: 'Moto' },
  { id: 'voiture', icon: '🚗', label: 'Voiture' },
  { id: 'camion',  icon: '🚛', label: 'Camion' },
];

const SIZE_DEFAULT = [
  { id: 'small',  icon: '📦', label: 'Small',  dim: 'Max 14x22x18 cm', weight: 'Max 3.5 kg' },
  { id: 'medium', icon: '📦', label: 'Medium', dim: 'Max 25x35x30 cm', weight: 'Max 10 kg' },
  { id: 'large',  icon: '📦', label: 'Large',  dim: 'Max 50x60x50 cm', weight: 'Max 30 kg' },
];

export default function CreateOrderScreen({ navigation }) {
  const { addOrder, setOrders, addNotification } = useApp();

  const [depart, setDepart] = useState({ text: '', lat: null, lng: null });
  const [destination, setDestination] = useState({ text: '', lat: null, lng: null });
  const [departLoading, setDepartLoading] = useState(true);
  const [departGeoError, setDepartGeoError] = useState('');
  const [destGeoError, setDestGeoError] = useState('');

  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');

  const [packageType, setPackageType] = useState('general');
  const [vehicleType, setVehicleType] = useState('voiture');
  const [sizeTab, setSizeTab] = useState('default');
  const [packageSize, setPackageSize] = useState('small');
  const [customWeight, setCustomWeight] = useState('');
  const [customDimensions, setCustomDimensions] = useState('');
  const [prix, setPrix] = useState('');

  const [errors, setErrors] = useState({});

  // ── GPS auto-fill on mount ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setDepartGeoError('Permission GPS refusée');
          setDepartLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = loc.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { 'User-Agent': 'DeliveryApp/1.0' } }
        );
        const data = await res.json();
        const address = data.display_name || `${latitude}, ${longitude}`;
        setDepart({ text: address, lat: latitude, lng: longitude });
      } catch {
        setDepartGeoError('Impossible de récupérer la position');
      } finally {
        setDepartLoading(false);
      }
    })();
  }, []);

  const geocodeField = async (text, setField, setGeoError) => {
    if (!text.trim()) return;
    setGeoError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'DeliveryApp/1.0' } }
      );
      const data = await res.json();
      if (data.length === 0) {
        setGeoError("Adresse introuvable. Vérifiez l'orthographe.");
        setField(prev => ({ ...prev, lat: null, lng: null }));
      } else {
        setField({ text, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch {
      setGeoError('Erreur réseau');
    }
  };

  const validate = () => {
    const e = {};
    if (!depart.text.trim()) e.depart = 'Adresse de départ requise';
    else if (!depart.lat) e.depart = 'Adresse de départ introuvable';
    if (!destination.text.trim()) e.destination = 'Adresse de destination requise';
    else if (!destination.lat) e.destination = 'Adresse de destination introuvable';
    if (!clientNom.trim()) e.clientNom = 'Nom du client requis';
    if (!clientTelephone.trim()) e.clientTelephone = 'Téléphone requis';
    if (!prix.trim()) e.prix = 'Prix requis';
    if (sizeTab === 'custom' && !customWeight.trim()) e.customWeight = 'Poids requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const order = {
      id: Date.now().toString(),
      clientNom,
      clientTelephone,
      departTexte: depart.text,
      departLat: depart.lat,
      departLng: depart.lng,
      destinationTexte: destination.text,
      destinationLat: destination.lat,
      destinationLng: destination.lng,
      packageType,
      vehicleType,
      packageSize: sizeTab === 'custom' ? 'custom' : packageSize,
      customWeight,
      customDimensions,
      prix,
      statut: 'En attente',
      createdAt: new Date().toISOString(),
      applicants: [],
    };

    // 1. Add order to global state
    addOrder(order);

    // 2. Start driver simulation — callbacks fire after 3–8 s each
    simulateDriversApplying((driver) => {
      setOrders(prev =>
        prev.map(o =>
          o.id === order.id
            ? { ...o, applicants: [...(o.applicants || []), driver] }
            : o
        )
      );
      addNotification({
        id: Date.now().toString(),
        orderId: order.id,
        orderShortId: order.id.slice(-4),
        type: 'driver_applied',
        driverName: driver.name,
        driverId: driver.id,
        read: false,
        createdAt: new Date(),
      });
    });

    // 3. Navigate to list (no params needed — order is in context)
    navigation.navigate('OrdersList');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle commande</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ── 1. ADRESSES ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Adresses</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressLine}>
              <View style={[styles.dot, { backgroundColor: BLUE }]} />
              <View style={styles.vertLine} />
              <View style={[styles.dot, { backgroundColor: '#E63946' }]} />
            </View>

            <View style={{ flex: 1 }}>
              {/* DÉPART */}
              <View style={styles.addressField}>
                <Text style={styles.addressLabel}>DÉPART</Text>
                {departLoading ? (
                  <View style={styles.detectingRow}>
                    <ActivityIndicator size="small" color={BLUE} />
                    <Text style={styles.detectingText}>📍 Détection en cours...</Text>
                  </View>
                ) : (
                  <TextInput
                    style={[styles.addressInput, errors.depart && styles.inputError]}
                    value={depart.text}
                    onChangeText={t => setDepart(prev => ({ ...prev, text: t }))}
                    onBlur={() => geocodeField(depart.text, setDepart, setDepartGeoError)}
                    placeholder="Adresse de départ"
                    placeholderTextColor="#BDBDBD"
                    multiline
                  />
                )}
                {(departGeoError || errors.depart) ? (
                  <Text style={styles.fieldError}>{departGeoError || errors.depart}</Text>
                ) : null}
              </View>

              <View style={{ height: 16 }} />

              {/* DESTINATION */}
              <View style={styles.addressField}>
                <Text style={styles.addressLabel}>DESTINATION</Text>
                <TextInput
                  style={[styles.addressInput, errors.destination && styles.inputError]}
                  value={destination.text}
                  onChangeText={t => setDestination(prev => ({ ...prev, text: t }))}
                  onBlur={() => geocodeField(destination.text, setDestination, setDestGeoError)}
                  placeholder="Adresse de destination"
                  placeholderTextColor="#BDBDBD"
                  multiline
                />
                {(destGeoError || errors.destination) ? (
                  <Text style={styles.fieldError}>{destGeoError || errors.destination}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* ── 2. CLIENT ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Client</Text>
          <TextInput
            style={[styles.input, errors.clientNom && styles.inputError]}
            value={clientNom}
            onChangeText={setClientNom}
            placeholder="Nom complet"
            placeholderTextColor="#BDBDBD"
          />
          {errors.clientNom ? <Text style={styles.fieldError}>{errors.clientNom}</Text> : null}

          <TextInput
            style={[styles.input, styles.inputMt, errors.clientTelephone && styles.inputError]}
            value={clientTelephone}
            onChangeText={setClientTelephone}
            placeholder="06XXXXXXXX"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
          />
          {errors.clientTelephone ? <Text style={styles.fieldError}>{errors.clientTelephone}</Text> : null}
        </View>

        {/* ── 3. TYPE DE COLIS ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Type de colis</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {PACKAGE_TYPES.map(pt => {
              const selected = packageType === pt.id;
              return (
                <TouchableOpacity
                  key={pt.id}
                  style={[styles.pkgTypeCard, selected && styles.pkgTypeCardSelected]}
                  onPress={() => setPackageType(pt.id)}
                >
                  <Text style={styles.pkgTypeIcon}>{pt.icon}</Text>
                  <Text style={[styles.pkgTypeLabel, selected && styles.pkgTypeLabelSelected]}>
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── 4. VÉHICULE ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Véhicule</Text>
          <View style={styles.vehicleRow}>
            {VEHICLE_TYPES.map(vt => {
              const selected = vehicleType === vt.id;
              return (
                <TouchableOpacity
                  key={vt.id}
                  style={[styles.vehicleCard, selected && styles.vehicleCardSelected]}
                  onPress={() => setVehicleType(vt.id)}
                >
                  <Text style={styles.vehicleIcon}>{vt.icon}</Text>
                  <Text style={[styles.vehicleLabel, selected && styles.vehicleLabelSelected]}>
                    {vt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── 5. TAILLE DU COLIS ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Taille du colis</Text>

          <View style={styles.segmented}>
            <TouchableOpacity
              style={[styles.segBtn, sizeTab === 'default' && styles.segBtnActive]}
              onPress={() => setSizeTab('default')}
            >
              <Text style={[styles.segBtnText, sizeTab === 'default' && styles.segBtnTextActive]}>
                Défaut
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segBtn, sizeTab === 'custom' && styles.segBtnActive]}
              onPress={() => setSizeTab('custom')}
            >
              <Text style={[styles.segBtnText, sizeTab === 'custom' && styles.segBtnTextActive]}>
                Personnalisé
              </Text>
            </TouchableOpacity>
          </View>

          {sizeTab === 'default' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
              {SIZE_DEFAULT.map(s => {
                const selected = packageSize === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.sizeCard, selected && styles.sizeCardSelected]}
                    onPress={() => setPackageSize(s.id)}
                  >
                    {selected && (
                      <View style={styles.sizeCheck}>
                        <Text style={styles.sizeCheckText}>✓</Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.sizeIcon,
                        s.id === 'medium' && { fontSize: 34 },
                        s.id === 'large' && { fontSize: 40 },
                      ]}
                    >
                      {s.icon}
                    </Text>
                    <Text style={[styles.sizeLabel, selected && styles.sizeLabelSelected]}>
                      {s.label}
                    </Text>
                    <Text style={styles.sizeDim}>{s.dim}</Text>
                    <Text style={styles.sizeDim}>{s.weight}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.customRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.customLabel}>Poids (kg)</Text>
                <TextInput
                  style={[styles.input, errors.customWeight && styles.inputError]}
                  value={customWeight}
                  onChangeText={setCustomWeight}
                  placeholder="0.0"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="numeric"
                />
                {errors.customWeight ? <Text style={styles.fieldError}>{errors.customWeight}</Text> : null}
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.customLabel}>Dimensions (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={customDimensions}
                  onChangeText={setCustomDimensions}
                  placeholder="L x l x H"
                  placeholderTextColor="#BDBDBD"
                />
              </View>
            </View>
          )}
        </View>

        {/* ── 6. PRIX ── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Prix de livraison</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.priceInput, errors.prix && styles.inputError]}
              value={prix}
              onChangeText={setPrix}
              placeholder="0.00"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
            />
            <Text style={styles.currency}>MAD</Text>
          </View>
          {errors.prix ? <Text style={styles.fieldError}>{errors.prix}</Text> : null}
        </View>

        {/* ── 7. SOUMETTRE ── */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Créer la commande</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backBtnText: { fontSize: 26, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },

  addressContainer: { flexDirection: 'row', marginTop: 10 },
  addressLine: { width: 20, alignItems: 'center', marginRight: 14, paddingTop: 22 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  vertLine: { flex: 1, width: 2, backgroundColor: '#E0E0E0', marginVertical: 4 },
  addressField: { flex: 1 },
  addressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BDBDBD',
    letterSpacing: 1,
    marginBottom: 4,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 44,
  },
  detectingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  detectingText: { color: '#999', fontSize: 13 },
  fieldError: { color: '#E63946', fontSize: 11, marginTop: 4 },
  inputError: { borderColor: '#E63946' },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputMt: { marginTop: 10 },

  pkgTypeCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    minWidth: 82,
  },
  pkgTypeCardSelected: { backgroundColor: BLUE, borderColor: BLUE },
  pkgTypeIcon: { fontSize: 24 },
  pkgTypeLabel: { fontSize: 11, color: '#666', marginTop: 5, fontWeight: '500', textAlign: 'center' },
  pkgTypeLabelSelected: { color: '#fff' },

  vehicleRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  vehicleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  vehicleCardSelected: { borderColor: BLUE, backgroundColor: BLUE_LIGHT },
  vehicleIcon: { fontSize: 30 },
  vehicleLabel: { fontSize: 12, color: '#666', marginTop: 6, fontWeight: '500' },
  vehicleLabelSelected: { color: BLUE, fontWeight: '700' },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
    borderRadius: 10,
    padding: 3,
    marginTop: 12,
  },
  segBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  segBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segBtnText: { fontSize: 13, color: '#999', fontWeight: '500' },
  segBtnTextActive: { color: BLUE, fontWeight: '700' },

  sizeCard: {
    width: 130,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  sizeCardSelected: { borderColor: BLUE },
  sizeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeCheckText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sizeIcon: { fontSize: 28, marginBottom: 6 },
  sizeLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  sizeLabelSelected: { color: BLUE },
  sizeDim: { fontSize: 11, color: '#999', marginTop: 3, textAlign: 'center' },

  customRow: { flexDirection: 'row', marginTop: 14 },
  customLabel: { fontSize: 12, color: '#666', marginBottom: 6, fontWeight: '600' },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    backgroundColor: '#FAFAFA',
  },
  currency: { fontSize: 18, fontWeight: '700', color: '#666', marginLeft: 14 },

  submitBtn: {
    backgroundColor: BLUE,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
