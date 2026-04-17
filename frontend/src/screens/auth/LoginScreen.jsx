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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useLogin from '../../hooks/useLogin';
import { s, WHITE, CORAL, GRAY_LABEL } from './LoginScreen.styles';

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error, handleClearError } = useLogin();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState(null);

  const handleEmailChange    = (v) => { setEmail(v);    if (error) handleClearError(); };
  const handlePasswordChange = (v) => { setPassword(v); if (error) handleClearError(); };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !loading;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView edges={['top']} />

        {/* ── Logo / Brand ── */}
        <View style={s.brand}>
          <View style={s.logoWrap}>
            <Text style={s.logoEmoji}>🚚</Text>
          </View>
          <Text style={s.appName}>DelivTrack</Text>
          <Text style={s.tagline}>La livraison intelligente au Maroc</Text>
        </View>

        {/* ── Form Card ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Connexion</Text>
          <Text style={s.cardSubtitle}>Bienvenue ! Connectez-vous à votre compte</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Email</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputWrapFocused]}>
              <Text style={s.inputIcon}>✉️</Text>
              <TextInput
                style={s.input}
                placeholder="votre@email.com"
                placeholderTextColor={GRAY_LABEL}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Mot de passe</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputWrapFocused]}>
              <Text style={s.inputIcon}>🔒</Text>
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={GRAY_LABEL}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mot de passe oublié */}
          <TouchableOpacity style={s.forgotRow} activeOpacity={0.7}>
            <Text style={s.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Message d'erreur */}
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* Bouton connexion */}
          <TouchableOpacity
            style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
            onPress={() => handleLogin({ email: email.trim(), password })}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={WHITE} size="small" />
              : <Text style={s.submitText}>Se connecter</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={s.footerLink}> S'inscrire</Text>
          </TouchableOpacity>
        </View>

        <SafeAreaView edges={['bottom']} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
