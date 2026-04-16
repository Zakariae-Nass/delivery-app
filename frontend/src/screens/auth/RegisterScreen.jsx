/**
 * RegisterScreen.jsx
 *
 * Écran d'inscription — branché sur le backend réel.
 *
 * Corrections par rapport à la version précédente :
 * 1. Champ "nom" → état `username` (le backend attend `username`, pas `nom`)
 * 2. Champ "telephone" → état `phone` (le backend attend `phone`)
 * 3. handleRegister appelle authService.register() avec les bons champs
 *    et la bonne route (/auth/register/agency ou /auth/register/delivery)
 * 4. Gestion des erreurs API (email déjà utilisé, username pris, etc.)
 *
 * Ce qui N'A PAS changé :
 * → Tout l'UI (labels, placeholders, styles, sélection de rôle, barre de force)
 * → Le label affiché est toujours "Nom de l'agence" / "Nom complet"
 *   mais la valeur est stockée dans `username` pour correspondre au backend
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../../config/theme';
import { authService } from '../../services/auth.service';

const ROLES = [
  { value: 'agence',  icon: '🏢', label: 'Agence',  desc: 'Je crée des livraisons' },
  { value: 'livreur', icon: '🛵', label: 'Livreur', desc: 'Je livre des colis' },
];

export default function RegisterScreen({ navigation }) {
  const [role,         setRole]         = useState('agence');
  const [username,     setUsername]     = useState('');   // ← était "nom"
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');   // ← était "telephone"
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const isFormValid = username.trim() && email.trim() && phone.trim() && password.length >= 6;

  // ── Handler principal ──────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      // authService.register mappe le rôle vers la bonne route :
      // 'livreur' → POST /auth/register/delivery
      // 'agence'  → POST /auth/register/agency
      await authService.register({
        username: username.trim(),
        email:    email.trim(),
        password,
        phone:    phone.trim(),
        role,
      });

      // Succès → informer l'utilisateur et rediriger vers Login
      Alert.alert(
        '✅ Compte créé !',
        'Votre compte a été créé avec succès. Connectez-vous maintenant.',
        [{ text: 'Se connecter', onPress: () => navigation.navigate('Login') }]
      );

    } catch (err) {
      // NestJS retourne { message: "...", statusCode: 409/400 }
      // Cas courants : email déjà utilisé (409), username déjà pris (400)
      const msg =
        err?.response?.data?.message ||
        "Une erreur est survenue. Réessayez.";
      setError(Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setLoading(false);
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

          {/* ── Message d'erreur API ── */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* Bouton */}
          <TouchableOpacity
            style={[styles.btnPrimary, !isFormValid && styles.btnDisabled]}
            onPress={handleRegister}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },

  // Header
  header: { marginBottom: Spacing.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backIcon: { fontSize: 20, color: Colors.textPrimary },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },

  // Role
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.lg },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  roleIcon: { fontSize: 32, marginBottom: Spacing.sm },
  roleLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  roleLabelActive: { color: Colors.textPrimary },
  roleDesc: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  roleDescActive: { color: Colors.textSecondary },
  roleCheckmark: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: Radius.full,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  roleCheckmarkText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Card
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },

  // Input
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
  },
  inputIcon: { fontSize: 16, marginRight: Spacing.sm },
  prefixText: { color: Colors.textSecondary, fontSize: FontSize.md, marginRight: 2 },
  input: { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },

  // Password strength
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
  },
  strengthLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
    width: 35,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  // Error box
  errorBox: {
    backgroundColor: '#2A1215',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#4A1520',
  },
  errorText: {
    fontSize: FontSize.sm,
    color: '#FF6B6B',
    lineHeight: 18,
  },

  // Bouton
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: { opacity: 0.45 },
  btnPrimaryText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  footerLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
