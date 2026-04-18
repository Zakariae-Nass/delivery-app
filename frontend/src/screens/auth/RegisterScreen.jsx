import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useRegister from '../../hooks/useRegister';

const DARK    = '#1A1A2E';
const CORAL   = '#FF6B35';
const GRAY    = '#8E8EA0';
const LIGHT   = '#F5F7FF';
const SUCCESS = '#2DC653';
const ERROR   = '#E63946';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0[67]\d{8}$/;

const ROLES = [
  { value: 'agence',  iconName: 'business-outline', label: 'Agence',  desc: 'Je crée des livraisons' },
  { value: 'livreur', iconName: 'bicycle-outline',  label: 'Livreur', desc: 'Je livre des colis' },
];

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error, setError } = useRegister();

  const [role,         setRole]         = useState('agence');
  const [username,     setUsername]     = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errs = {};
    if (!username.trim() || username.trim().length < 3) errs.username = 'Minimum 3 caractères';
    if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Email invalide';
    if (!PHONE_REGEX.test(phone.trim())) errs.phone = 'Format: 06/07XXXXXXXX';
    if (password.length < 8) errs.password = 'Minimum 8 caractères';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUsernameChange = useCallback((v) => {
    setUsername(v);
    setError(null);
    if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
  }, [fieldErrors.username]);

  const handleEmailChange = useCallback((v) => {
    setEmail(v);
    setError(null);
    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
  }, [fieldErrors.email]);

  const handlePhoneChange = useCallback((v) => {
    setPhone(v);
    setError(null);
    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
  }, [fieldErrors.phone]);

  const handlePasswordChange = useCallback((v) => {
    setPassword(v);
    setError(null);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
  }, [fieldErrors.password]);

  const onRegister = async () => {
    if (!validateFields()) return;
    const { success } = await handleRegister({
      username: username.trim(),
      email:    email.trim(),
      password,
      phone:    phone.trim(),
      role,
    });
    if (success) {
      Alert.alert(
        'Compte créé',
        'Votre compte a été créé avec succès. Connectez-vous maintenant.',
        [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  const strengthColor =
    password.length === 0 ? '#ECECF0' :
    password.length < 6   ? ERROR :
    password.length < 8   ? '#FF9F1C' : SUCCESS;

  const strengthLabel =
    password.length === 0 ? '' :
    password.length < 6   ? 'Faible' :
    password.length < 8   ? 'Moyen' : 'Fort';

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={st.header}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={DARK} />
            </TouchableOpacity>
            <View>
              <Text style={st.title}>Créer un compte</Text>
              <Text style={st.subtitle}>Rejoignez la communauté DelivTrack</Text>
            </View>
          </View>

          {/* Role selection */}
          <Text style={st.sectionLabel}>Je suis...</Text>
          <View style={st.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[st.roleCard, role === r.value && st.roleCardActive]}
                onPress={() => { setRole(r.value); setError(null); }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={r.iconName}
                  size={28}
                  color={role === r.value ? CORAL : GRAY}
                />
                <Text style={[st.roleLabel, role === r.value && st.roleLabelActive]}>{r.label}</Text>
                <Text style={[st.roleDesc, role === r.value && st.roleDescActive]}>{r.desc}</Text>
                {role === r.value && (
                  <View style={st.roleCheck}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={st.card}>

            {/* Username */}
            <View style={st.inputGroup}>
              <Text style={st.inputLabel}>{role === 'agence' ? "Nom de l'agence" : 'Nom complet'}</Text>
              <View style={[st.inputWrapper, focusedInput === 'username' && st.inputFocused, fieldErrors.username && st.inputError]}>
                <Ionicons name={role === 'agence' ? 'business-outline' : 'person-outline'} size={18} color={GRAY} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder={role === 'agence' ? 'Express Maroc SARL' : 'Youssef Benali'}
                  placeholderTextColor={GRAY}
                  value={username}
                  onChangeText={handleUsernameChange}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {fieldErrors.username ? <Text style={st.fieldErr}>{fieldErrors.username}</Text> : null}
            </View>

            {/* Email */}
            <View style={st.inputGroup}>
              <Text style={st.inputLabel}>Email</Text>
              <View style={[st.inputWrapper, focusedInput === 'email' && st.inputFocused, fieldErrors.email && st.inputError]}>
                <Ionicons name="mail-outline" size={18} color={GRAY} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="votre@email.com"
                  placeholderTextColor={GRAY}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {fieldErrors.email ? <Text style={st.fieldErr}>{fieldErrors.email}</Text> : null}
            </View>

            {/* Phone */}
            <View style={st.inputGroup}>
              <Text style={st.inputLabel}>Téléphone</Text>
              <View style={[st.inputWrapper, focusedInput === 'phone' && st.inputFocused, fieldErrors.phone && st.inputError]}>
                <Ionicons name="call-outline" size={18} color={GRAY} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="06XXXXXXXX"
                  placeholderTextColor={GRAY}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {fieldErrors.phone ? <Text style={st.fieldErr}>{fieldErrors.phone}</Text> : null}
            </View>

            {/* Password */}
            <View style={st.inputGroup}>
              <Text style={st.inputLabel}>Mot de passe</Text>
              <View style={[st.inputWrapper, focusedInput === 'password' && st.inputFocused, fieldErrors.password && st.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color={GRAY} style={st.inputIcon} />
                <TextInput
                  style={st.input}
                  placeholder="Minimum 8 caractères"
                  placeholderTextColor={GRAY}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={GRAY} />
                </TouchableOpacity>
              </View>
              {fieldErrors.password ? <Text style={st.fieldErr}>{fieldErrors.password}</Text> : null}

              {password.length > 0 && (
                <View style={st.strengthRow}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        st.strengthBar,
                        { backgroundColor: password.length >= i * 3 ? strengthColor : '#ECECF0' },
                      ]}
                    />
                  ))}
                  <Text style={[st.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                </View>
              )}
            </View>

            {/* Livreur note */}
            {role === 'livreur' && (
              <View style={st.infoBox}>
                <Ionicons name="information-circle-outline" size={18} color="#4361EE" />
                <Text style={st.infoText}>
                  Après inscription, soumettez votre CIN et permis de conduire pour validation.
                </Text>
              </View>
            )}

            {/* API error */}
            {error ? (
              <View style={st.errorBox}>
                <Ionicons name="warning-outline" size={16} color={ERROR} />
                <Text style={st.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Submit */}
            <TouchableOpacity
              style={[st.btn, loading && st.btnDisabled]}
              onPress={onRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <>
                    <Ionicons name={role === 'agence' ? 'business-outline' : 'bicycle-outline'} size={18} color="#fff" />
                    <Text style={st.btnText}>
                      {role === 'agence' ? 'Créer mon agence' : 'Devenir livreur'}
                    </Text>
                  </>
              }
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={st.footer}>
            <Text style={st.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={st.footerLink}> Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: LIGHT },
  scroll:       { flexGrow: 1, paddingBottom: 32 },
  header:       { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8, gap: 16 },
  backBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  title:        { fontSize: 24, fontWeight: '800', color: DARK },
  subtitle:     { fontSize: 14, color: GRAY, marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: DARK, marginHorizontal: 20, marginTop: 16, marginBottom: 10 },
  roleRow:      { flexDirection: 'row', marginHorizontal: 20, gap: 12, marginBottom: 16 },
  roleCard:     { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, borderWidth: 2, borderColor: '#ECECF0', position: 'relative' },
  roleCardActive:{ borderColor: CORAL, backgroundColor: 'rgba(255,107,53,0.05)' },
  roleLabel:    { fontSize: 15, fontWeight: '700', color: DARK },
  roleLabelActive:{ color: CORAL },
  roleDesc:     { fontSize: 12, color: GRAY, textAlign: 'center' },
  roleDescActive:{ color: CORAL },
  roleCheck:    { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: CORAL, justifyContent: 'center', alignItems: 'center' },
  card:         { backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 20, padding: 20, gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  inputGroup:   { marginBottom: 12 },
  inputLabel:   { fontSize: 13, color: GRAY, fontWeight: '600', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: LIGHT, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#ECECF0', gap: 10 },
  inputFocused: { borderColor: CORAL },
  inputError:   { borderColor: ERROR },
  inputIcon:    {},
  input:        { flex: 1, fontSize: 15, color: DARK },
  fieldErr:     { fontSize: 12, color: ERROR, marginTop: 4, fontWeight: '500' },
  strengthRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  strengthBar:  { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel:{ fontSize: 12, fontWeight: '600', minWidth: 40 },
  infoBox:      { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EEF1FF', borderRadius: 12, padding: 12, gap: 8, marginTop: 4 },
  infoText:     { flex: 1, fontSize: 13, color: '#4361EE', lineHeight: 18 },
  errorBox:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', borderRadius: 12, padding: 12, gap: 8 },
  errorText:    { flex: 1, fontSize: 13, color: ERROR, fontWeight: '500' },
  btn:          { flexDirection: 'row', backgroundColor: CORAL, borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  btnDisabled:  { opacity: 0.6 },
  btnText:      { fontSize: 16, fontWeight: '800', color: '#fff' },
  footer:       { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText:   { fontSize: 14, color: GRAY },
  footerLink:   { fontSize: 14, color: CORAL, fontWeight: '700' },
});
