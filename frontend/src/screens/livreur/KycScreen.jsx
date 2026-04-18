import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import apiClient from '../../api/axios.config';
import { updateProfileField } from '../../redux/slices/profileSlice';

const CORAL = '#FF6B35';
const DARK  = '#1A1A2E';
const GRAY  = '#8E8EA0';
const LIGHT = '#F5F7FF';

export default function KycScreen({ navigation }) {
  const dispatch = useDispatch();

  const [step,          setStep]          = useState(1);
  const [cinNumber,     setCinNumber]     = useState('');
  const [cinImage,      setCinImage]      = useState(null);
  const [licenceNumber, setLicenceNumber] = useState('');
  const [licenceImage,  setLicenceImage]  = useState(null);
  const [submitting,    setSubmitting]    = useState(false);

  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la galerie requis');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setter(result.assets[0].uri);
  };

  const isStep1Valid = cinNumber.trim().length >= 4 && cinImage;
  const isStep2Valid = licenceNumber.trim().length >= 4 && licenceImage;

  const handleBack = () => (step === 1 ? navigation.goBack() : setStep(1));

  const handleCta = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      const cinFilename = cinImage.split('/').pop();
      const licFilename = licenceImage.split('/').pop();
      form.append('file', { uri: cinImage, name: cinFilename, type: 'image/jpeg' });
      form.append('cinNumber', cinNumber.trim());
      form.append('licenceNumber', licenceNumber.trim());
      form.append('licenceFile', { uri: licenceImage, name: licFilename, type: 'image/jpeg' });

      const { data } = await apiClient.post('/livreurs/me/kyc', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateProfileField({ kycDocumentUrl: data.kycDocumentUrl, kycStatus: 'pending' }));
      Alert.alert(
        'Documents soumis',
        'Votre dossier KYC a été soumis pour vérification.',
        [{ text: 'OK', onPress: () => navigation.navigate('DriverProfile') }]
      );
    } catch (e) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Échec de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const valid = step === 1 ? isStep1Valid : isStep2Valid;

  return (
    <SafeAreaView style={st.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity onPress={handleBack} style={st.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={st.title}>Vérification KYC</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step indicator */}
      <View style={st.steps}>
        {[1, 2].map((s) => (
          <View key={s} style={st.stepItem}>
            <View style={[st.stepCircle, step >= s && st.stepCircleActive]}>
              {step > s
                ? <Ionicons name="checkmark" size={14} color="#fff" />
                : <Text style={[st.stepNum, step >= s && st.stepNumActive]}>{s}</Text>
              }
            </View>
            <Text style={[st.stepLabel, step >= s && st.stepLabelActive]}>
              {s === 1 ? 'CIN' : 'Permis'}
            </Text>
          </View>
        ))}
        <View style={st.stepLine} />
      </View>

      <ScrollView
        contentContainerStyle={st.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={st.sectionTitle}>
          {step === 1 ? 'Carte Nationale d\'Identité' : 'Permis de Conduire'}
        </Text>
        <Text style={st.sectionSub}>
          {step === 1
            ? 'Entrez votre numéro CIN et téléchargez une photo de votre CIN.'
            : 'Entrez votre numéro de permis et téléchargez une photo.'}
        </Text>

        <View style={st.formCard}>
          <Text style={st.fieldLabel}>
            {step === 1 ? 'Numéro CIN' : 'Numéro de permis'}
          </Text>
          <TextInput
            style={st.input}
            value={step === 1 ? cinNumber : licenceNumber}
            onChangeText={step === 1 ? setCinNumber : setLicenceNumber}
            placeholder={step === 1 ? 'Ex: AB123456' : 'Ex: MAR-2023-001'}
            autoCapitalize="characters"
            placeholderTextColor={GRAY}
          />

          <Text style={st.fieldLabel}>
            {step === 1 ? 'Photo CIN' : 'Photo permis'}
          </Text>
          <TouchableOpacity
            style={st.uploadBtn}
            onPress={() => pickImage(step === 1 ? setCinImage : setLicenceImage)}
          >
            {(step === 1 ? cinImage : licenceImage) ? (
              <Image
                source={{ uri: step === 1 ? cinImage : licenceImage }}
                style={st.uploadPreview}
              />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={32} color={CORAL} />
                <Text style={st.uploadText}>Appuyer pour sélectionner</Text>
                <Text style={st.uploadHint}>JPG, PNG acceptés</Text>
              </>
            )}
          </TouchableOpacity>
          {(step === 1 ? cinImage : licenceImage) && (
            <TouchableOpacity
              style={st.changeBtn}
              onPress={() => pickImage(step === 1 ? setCinImage : setLicenceImage)}
            >
              <Text style={st.changeBtnText}>Changer la photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <View style={st.ctaWrap}>
        <TouchableOpacity
          style={[st.ctaBtn, !valid && st.ctaBtnDisabled]}
          onPress={handleCta}
          disabled={!valid || submitting}
        >
          {submitting
            ? <ActivityIndicator color="#fff" />
            : <Text style={st.ctaBtnText}>
                {step === 1 ? 'Continuer' : 'Soumettre pour approbation'}
              </Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:         { flex: 1, backgroundColor: LIGHT },
  header:       { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:        { flex: 1, fontSize: 20, fontWeight: '800', color: DARK, textAlign: 'center' },
  steps:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff', gap: 24, position: 'relative' },
  stepItem:     { alignItems: 'center', gap: 6, zIndex: 1 },
  stepCircle:   { width: 32, height: 32, borderRadius: 16, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ECECF0' },
  stepCircleActive: { backgroundColor: CORAL, borderColor: CORAL },
  stepNum:      { fontSize: 14, fontWeight: '700', color: GRAY },
  stepNumActive:{ color: '#fff' },
  stepLabel:    { fontSize: 12, fontWeight: '600', color: GRAY },
  stepLabelActive:{ color: CORAL },
  stepLine:     { position: 'absolute', top: 36, left: '25%', right: '25%', height: 2, backgroundColor: '#ECECF0', zIndex: 0 },
  scroll:       { padding: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 8, marginTop: 8 },
  sectionSub:   { fontSize: 14, color: GRAY, marginBottom: 20 },
  formCard:     { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 4 },
  fieldLabel:   { fontSize: 13, color: GRAY, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input:        { backgroundColor: LIGHT, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: DARK, borderWidth: 1, borderColor: '#ECECF0' },
  uploadBtn:    { backgroundColor: LIGHT, borderRadius: 16, borderWidth: 2, borderColor: '#ECECF0', borderStyle: 'dashed', paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginTop: 4, overflow: 'hidden' },
  uploadPreview:{ width: '100%', height: 180, borderRadius: 14 },
  uploadText:   { fontSize: 15, fontWeight: '600', color: CORAL, marginTop: 10 },
  uploadHint:   { fontSize: 12, color: GRAY, marginTop: 4 },
  changeBtn:    { alignSelf: 'center', marginTop: 8 },
  changeBtnText:{ fontSize: 13, color: CORAL, fontWeight: '600' },
  ctaWrap:      { padding: 16, paddingBottom: 32, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ECECF0' },
  ctaBtn:       { backgroundColor: CORAL, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  ctaBtnDisabled:{ opacity: 0.5 },
  ctaBtnText:   { fontSize: 16, fontWeight: '800', color: '#fff' },
});
