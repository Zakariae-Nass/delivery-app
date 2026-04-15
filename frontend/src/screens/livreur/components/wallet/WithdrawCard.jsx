import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { s, fmt } from '../../styles/walletStyles';

export default function WithdrawCard({ solde, withdrawAmount, onChangeAmount, withdrawSent, onSubmit }) {
  const [focusedInput, setFocusedInput] = useState(false);

  return (
    <View style={s.withdrawCard}>
      <Text style={s.withdrawTitle}>Demande de retrait</Text>
      <Text style={s.withdrawSubtitle}>
        Le retrait sera traité par l'administrateur sous 24–48h
      </Text>

      {withdrawSent ? (
        <View style={s.withdrawSuccess}>
          <Text style={s.withdrawSuccessText}>
            ✅ Demande envoyée ! L'admin va traiter votre retrait sous 48h.
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Montant à retirer (MAD)</Text>
            <TextInput
              style={[s.amountInput, focusedInput && s.amountInputFocused]}
              value={withdrawAmount}
              onChangeText={onChangeAmount}
              placeholder="0,00"
              placeholderTextColor={s.inputLabel.color}
              keyboardType="decimal-pad"
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
            />
            <Text style={s.inputHint}>Solde max disponible : {fmt(solde)}</Text>
          </View>

          <View style={s.bankRow}>
            <Text style={s.bankIcon}>🏦</Text>
            <View style={s.bankInfo}>
              <Text style={s.bankLabel}>Compte bancaire enregistré</Text>
              <Text style={s.bankRib}>RIB : ****  ****  **** 4521</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              s.submitBtn,
              (!withdrawAmount || parseFloat(withdrawAmount.replace(',', '.')) <= 0) && s.submitBtnDisabled,
            ]}
            onPress={onSubmit}
            activeOpacity={0.85}
          >
            <Text style={s.submitBtnText}>Envoyer la demande →</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
