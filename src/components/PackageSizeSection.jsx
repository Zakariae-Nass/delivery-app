import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SIZE_DEFAULT, VEHICLE_TYPES, COLORS } from '../config/constants';

export default function PackageSizeSection({
  sizeTab, setSizeTab,
  packageSize, setPackageSize,
  customWeight, setCustomWeight,
  customDimensions, setCustomDimensions,
  vehicleType, vehicleLimit,
  isSizeDisabled,
  customWeightExceeds,
  errors,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Taille du colis</Text>

      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segBtn, sizeTab === 'default' && styles.segBtnActive]}
          onPress={() => setSizeTab('default')}
        >
          <Text style={[styles.segBtnText, sizeTab === 'default' && styles.segBtnTextActive]}>Defaut</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, sizeTab === 'custom' && styles.segBtnActive]}
          onPress={() => setSizeTab('custom')}
        >
          <Text style={[styles.segBtnText, sizeTab === 'custom' && styles.segBtnTextActive]}>Personnalise</Text>
        </TouchableOpacity>
      </View>

      {sizeTab === 'default' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {SIZE_DEFAULT.map(s => {
            const selected = packageSize === s.id;
            const disabled = isSizeDisabled(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.sizeCard,
                  selected && !disabled && styles.sizeCardSelected,
                  disabled && styles.sizeCardDisabled,
                ]}
                onPress={() => !disabled && setPackageSize(s.id)}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.7}
              >
                {selected && !disabled && (
                  <View style={styles.sizeCheck}>
                    <Text style={styles.sizeCheckText}>✓</Text>
                  </View>
                )}
                {disabled && (
                  <View style={styles.sizeLock}>
                    <Text>🔒</Text>
                  </View>
                )}
                <Text style={[
                  styles.sizeIcon,
                  s.id === 'medium' && { fontSize: 34 },
                  s.id === 'large' && { fontSize: 40 },
                ]}>
                  {s.icon}
                </Text>
                <Text style={[
                  styles.sizeLabel,
                  selected && !disabled && styles.sizeLabelSelected,
                  disabled && styles.sizeLabelDisabled,
                ]}>
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
              style={[styles.input, (errors.customWeight || customWeightExceeds) && styles.inputError]}
              value={customWeight}
              onChangeText={setCustomWeight}
              placeholder="0.0"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
            />
            {customWeightExceeds && !errors.customWeight ? (
              <Text style={styles.fieldError}>
                Poids max pour {VEHICLE_TYPES.find(v => v.id === vehicleType)?.label} : {vehicleLimit.maxWeightKg} kg
              </Text>
            ) : errors.customWeight ? (
              <Text style={styles.fieldError}>{errors.customWeight}</Text>
            ) : null}
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
  );
}

const styles = StyleSheet.create({
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

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
    borderRadius: 10,
    padding: 3,
    marginTop: 12,
  },
  segBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  segBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  segBtnText: { fontSize: 13, color: '#999', fontWeight: '500' },
  segBtnTextActive: { color: COLORS.blue, fontWeight: '700' },

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
  sizeCardSelected: { borderColor: COLORS.blue },
  sizeCardDisabled: { opacity: 0.4 },
  sizeCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.blue, justifyContent: 'center', alignItems: 'center',
  },
  sizeCheckText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  sizeLock: { position: 'absolute', top: 8, right: 8 },
  sizeIcon: { fontSize: 28, marginBottom: 6 },
  sizeLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  sizeLabelSelected: { color: COLORS.blue },
  sizeLabelDisabled: { color: '#999' },
  sizeDim: { fontSize: 11, color: '#999', marginTop: 3, textAlign: 'center' },

  customRow: { flexDirection: 'row', marginTop: 14 },
  customLabel: { fontSize: 12, color: '#666', marginBottom: 6, fontWeight: '600' },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputError: { borderColor: '#E63946' },
  fieldError: { color: '#E63946', fontSize: 11, marginTop: 4 },
});
