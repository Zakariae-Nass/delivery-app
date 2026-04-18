import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
  const [fieldErrors,  setFieldErrors]  = useState({});

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailChange = useCallback((v) => {
    setEmail(v);
    if (error) handleClearError();
    setFieldErrors((e) => ({ ...e, email: null }));
  }, [error, handleClearError]);

  const handlePasswordChange = useCallback((v) => {
    setPassword(v);
    if (error) handleClearError();
    setFieldErrors((e) => ({ ...e, password: null }));
  }, [error, handleClearError]);

  const handleSubmit = () => {
    const errs = {};
    if (!validateEmail(email.trim())) errs.email = 'Adresse email invalide';
    if (password.length < 8) errs.password = 'Minimum 8 caractères';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    handleLogin({ email: email.trim(), password });
  };

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

        <View style={s.brand}>
          <View style={s.logoWrap}>
            <Ionicons name="car-sport" size={40} color={CORAL} />
          </View>
          <Text style={s.appName}>DelivTrack</Text>
          <Text style={s.tagline}>La livraison intelligente au Maroc</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Connexion</Text>
          <Text style={s.cardSubtitle}>Bienvenue ! Connectez-vous à votre compte</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Email</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputWrapFocused]}>
              <Ionicons name="mail-outline" size={20} color={GRAY_LABEL} style={s.inputIconImg} />
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
            {fieldErrors.email ? (
              <Text style={s.fieldError}>{fieldErrors.email}</Text>
            ) : null}
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <Text style={s.fieldLabel}>Mot de passe</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputWrapFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={GRAY_LABEL} style={s.inputIconImg} />
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
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={GRAY_LABEL}
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password ? (
              <Text style={s.fieldError}>{fieldErrors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={s.forgotRow} activeOpacity={0.7}>
            <Text style={s.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {error ? (
            <View style={s.errorBox}>
              <Ionicons name="warning-outline" size={16} color="#E63946" />
              <Text style={s.errorText}> {error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={WHITE} size="small" />
              : <Text style={s.submitText}>Se connecter</Text>
            }
          </TouchableOpacity>
        </View>

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
