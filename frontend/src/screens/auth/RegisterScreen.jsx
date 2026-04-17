import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors } from '../../config/theme';
import useRegister from '../../hooks/useRegister';
import { styles } from './RegisterScreen.styles';

const ROLES = [
  { value: 'agence',  icon: '🏢', label: 'Agence',  desc: 'Je crée des livraisons' },
  { value: 'livreur', icon: '🛵', label: 'Livreur', desc: 'Je livre des colis' },
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

  const isFormValid = username.trim() && email.trim() && phone.trim() && password.length >= 6;

  const onRegister = async () => {
    if (!isFormValid) return;
    const { success } = await handleRegister({
      username: username.trim(),
      email:    email.trim(),
      password,
      phone:    phone.trim(),
      role,
    });
    if (success) {
      Alert.alert(
        '✅ Compte créé !',
        'Votre compte a été créé avec succès. Connectez-vous maintenant.',
        [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté DelivTrack</Text>
        </View>

        {/* Sélection rôle */}
        <Text style={styles.sectionLabel}>Je suis...</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.roleCard, role === r.value && styles.roleCardActive]}
              onPress={() => { setRole(r.value); setError(null); }}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text style={[styles.roleLabel, role === r.value && styles.roleLabelActive]}>
                {r.label}
              </Text>
              <Text style={[styles.roleDesc, role === r.value && styles.roleDescActive]}>
                {r.desc}
              </Text>
              {role === r.value && (
                <View style={styles.roleCheckmark}>
                  <Text style={styles.roleCheckmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Formulaire */}
        <View style={styles.card}>

          {/* Nom / Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {role === 'agence' ? "Nom de l'agence" : 'Nom complet'}
            </Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'username' && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>{role === 'agence' ? '🏢' : '👤'}</Text>
              <TextInput
                style={styles.input}
                placeholder={role === 'agence' ? 'Express Maroc SARL' : 'Youssef Benali'}
                placeholderTextColor={Colors.textMuted}
                value={username}
                onChangeText={(v) => { setUsername(v); setError(null); }}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'email' && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={(v) => { setEmail(v); setError(null); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Téléphone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Téléphone</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'phone' && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>📱</Text>
              <Text style={styles.prefixText}>+212 </Text>
              <TextInput
                style={styles.input}
                placeholder="6 12 34 56 78"
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={(v) => { setPhone(v); setError(null); }}
                keyboardType="phone-pad"
                onFocus={() => setFocusedInput('phone')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'password' && styles.inputWrapperFocused
            ]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 caractères"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={(v) => { setPassword(v); setError(null); }}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Barre de force du mot de passe */}
            {password.length > 0 && (
              <View style={styles.passwordStrength}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      password.length >= i * 3 && {
                        backgroundColor: password.length >= 8
                          ? Colors.success
                          : password.length >= 6
                          ? Colors.warning
                          : Colors.error,
                      },
                    ]}
                  />
                ))}
                <Text style={styles.strengthLabel}>
                  {password.length < 6 ? 'Faible' : password.length < 8 ? 'Moyen' : 'Fort'}
                </Text>
              </View>
            )}
          </View>

          {/* Note documents pour livreurs */}
          {role === 'livreur' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📋</Text>
              <Text style={styles.infoText}>
                Après inscription, vous devrez soumettre votre CIN et permis de conduire pour validation.
              </Text>
            </View>
          )}

          {/* Message d'erreur API */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* Bouton */}
          <TouchableOpacity
            style={[styles.btnPrimary, !isFormValid && styles.btnDisabled]}
            onPress={onRegister}
            disabled={loading || !isFormValid}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.btnPrimaryText}>
                  {role === 'agence' ? '🏢 Créer mon agence' : '🛵 Devenir livreur'}
                </Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}> Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
