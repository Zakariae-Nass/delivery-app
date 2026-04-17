import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, VIOLET_BG, isValid } from './styles/kycStyles';
import StepProgress from './components/history/StepProgress';
import PhoneIllustration from './components/kyc/PhoneIllustration';
import FormInput from './components/shared/FormInput';
import UploadField from './components/kyc/UploadField';
import { pickImageFromLibrary } from '../../services/media.service';

export default function KycScreen({ navigation }) {
  const [step,          setStep]          = useState(1);
  const [cinNumber,     setCinNumber]     = useState('');
  const [cinImage,      setCinImage]      = useState(null);
  const [licenceNumber, setLicenceNumber] = useState('');
  const [licenceImage,  setLicenceImage]  = useState(null);

  const pickImage = async (setter) => {
    const uri = await pickImageFromLibrary({ aspect: undefined });
    if (uri) setter(uri);
  };

  const handleBack = () => (step === 1 ? navigation.goBack() : setStep(1));

  const handleCta = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigation.navigate('DriverProfile', {
        kycStatus: 'pending',
        kycData: { cinNumber, cinImage, licenceNumber, licenceImage },
      });
    }
  };

  const valid = isValid(step, cinNumber, licenceNumber);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={VIOLET_BG} />

      {/* ── Top bar ── */}
      <SafeAreaView edges={['top']} style={s.topArea}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack} activeOpacity={0.7}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>KYC Verification</Text>
          <View style={{ width: 40 }} />
        </View>
        <StepProgress step={step} />
      </SafeAreaView>

      {/* ── Body ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.illustrationArea}>
          {step === 1 ? <PhoneIllustration type="cin" /> : <PhoneIllustration type="licence" />}
        </View>

        <Text style={s.title}>
          {step === 1 ? 'Upload your CIN' : 'Upload your Licence'}
        </Text>
        <Text style={s.subtitle}>
          {step === 1
            ? 'Enter your CIN number and upload a photo of your national identity card.'
            : 'Enter your licence number and upload a photo of your driving licence.'}
        </Text>

        <View style={s.formCard}>
          {step === 1 ? (
            <>
              <FormInput
                label="CIN Number"
                value={cinNumber}
                onChange={setCinNumber}
                placeholder="e.g. AB123456"
                autoCapitalize="characters"
              />
              <UploadField
                label="Upload CIN Image"
                uri={cinImage}
                onPress={() => pickImage(setCinImage)}
              />
            </>
          ) : (
            <>
              <FormInput
                label="Licence Number"
                value={licenceNumber}
                onChange={setLicenceNumber}
                placeholder="e.g. MAR-2023-001"
                autoCapitalize="characters"
              />
              <UploadField
                label="Upload Licence Image"
                uri={licenceImage}
                onPress={() => pickImage(setLicenceImage)}
              />
            </>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── CTA button ── */}
      <SafeAreaView edges={['bottom']} style={s.ctaContainer}>
        <TouchableOpacity
          style={[s.ctaBtn, !valid && s.ctaBtnDisabled]}
          onPress={handleCta}
          activeOpacity={0.85}
          disabled={!valid}
        >
          <Text style={s.ctaBtnText}>
            {step === 1 ? 'Continue →' : 'Submit for Approval'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
