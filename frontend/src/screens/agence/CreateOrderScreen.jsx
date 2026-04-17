import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { PACKAGE_TYPES, VEHICLE_TYPES, COLORS } from '../../config/constants';
import useOrderForm from '../../hooks/useOrderForm';
import PackageSizeSection from '../../components/PackageSizeSection';
import UrgentSection from '../../components/UrgentSection';
import { styles } from './styles/CreateOrderScreen.styles';

export default function CreateOrderScreen({ navigation }) {
  const form = useOrderForm(navigation);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle commande</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 1. ADRESSES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Adresses</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressLine}>
              <View style={[styles.dot, { backgroundColor: COLORS.blue }]} />
              <View style={styles.vertLine} />
              <View style={[styles.dot, { backgroundColor: COLORS.danger }]} />
            </View>
            <View style={{ flex: 1, gap: 16 }}>
              <AddressAutocomplete
                label="DEPART"
                dotColor={COLORS.blue}
                isGpsLoading={form.departLoading}
                initialValue={form.depart.lat ? form.depart : null}
                onAddressSelected={(addr) => form.setDepart(addr)}
                onAddressCleared={() => form.setDepart({ text: '', lat: null, lng: null })}
                error={form.errors.depart}
              />
              <AddressAutocomplete
                label="DESTINATION"
                dotColor={COLORS.danger}
                isGpsLoading={false}
                initialValue={null}
                onAddressSelected={(addr) => form.setDestination(addr)}
                onAddressCleared={() => form.setDestination({ text: '', lat: null, lng: null })}
                error={form.errors.destination}
              />
            </View>
          </View>
        </View>

        {/* 2. CLIENT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Client</Text>
          <TextInput
            style={[styles.input, form.errors.clientNom && styles.inputError]}
            value={form.clientNom}
            onChangeText={form.setClientNom}
            placeholder="Nom complet"
            placeholderTextColor="#BDBDBD"
          />
          {form.errors.clientNom ? <Text style={styles.fieldError}>{form.errors.clientNom}</Text> : null}
          <TextInput
            style={[styles.input, styles.inputMt, form.errors.clientTelephone && styles.inputError]}
            value={form.clientTelephone}
            onChangeText={form.setClientTelephone}
            placeholder="06XXXXXXXX"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
          />
          {form.errors.clientTelephone ? <Text style={styles.fieldError}>{form.errors.clientTelephone}</Text> : null}
        </View>

        {/* 3. TYPE DE COLIS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Type de colis</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {PACKAGE_TYPES.map(pt => {
              const selected = form.packageType === pt.id;
              return (
                <TouchableOpacity
                  key={pt.id}
                  style={[styles.pkgTypeCard, selected && styles.pkgTypeCardSelected]}
                  onPress={() => form.setPackageType(pt.id)}
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

        {/* 4. VEHICULE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicule</Text>
          <View style={styles.vehicleRow}>
            {VEHICLE_TYPES.map(vt => {
              const selected = form.vehicleType === vt.id;
              return (
                <TouchableOpacity
                  key={vt.id}
                  style={[styles.vehicleCard, selected && styles.vehicleCardSelected]}
                  onPress={() => form.handleVehicleChange(vt.id)}
                >
                  <Text style={styles.vehicleIcon}>{vt.icon}</Text>
                  <Text style={[styles.vehicleLabel, selected && styles.vehicleLabelSelected]}>
                    {vt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.vehicleLimitText}>{form.vehicleLimit.label}</Text>
        </View>

        {/* 5. TAILLE DU COLIS */}
        <PackageSizeSection
          sizeTab={form.sizeTab}
          setSizeTab={form.setSizeTab}
          packageSize={form.packageSize}
          setPackageSize={form.setPackageSize}
          customWeight={form.customWeight}
          setCustomWeight={form.setCustomWeight}
          customDimensions={form.customDimensions}
          setCustomDimensions={form.setCustomDimensions}
          vehicleType={form.vehicleType}
          vehicleLimit={form.vehicleLimit}
          isSizeDisabled={form.isSizeDisabled}
          customWeightExceeds={form.customWeightExceeds}
          errors={form.errors}
        />

        {/* 6. PRIX */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Prix de livraison</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.priceInput, form.errors.prix && styles.inputError]}
              value={form.prix}
              onChangeText={form.setPrix}
              placeholder="0.00"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
            />
            <Text style={styles.currency}>MAD</Text>
          </View>
          {form.errors.prix ? <Text style={styles.fieldError}>{form.errors.prix}</Text> : null}
        </View>

        {/* 7. URGENT TOGGLE */}
        <UrgentSection
          isUrgent={form.isUrgent}
          toggleUrgent={form.toggleUrgent}
          urgentScale={form.urgentScale}
        />

        {/* 8. SOUMETTRE */}
        <TouchableOpacity
          style={[styles.submitBtn, form.isSubmitDisabled && styles.submitBtnDisabled]}
          onPress={form.handleSubmit}
          activeOpacity={form.isSubmitDisabled ? 1 : 0.85}
        >
          <Text style={styles.submitBtnText}>Creer la commande</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
