import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s, fmt } from '../../styles/walletStyles';

export default function BalanceCard({ solde, soldeBloque, showWithdraw, onRetirer, onHistoryOpen }) {
  return (
    <View style={s.balanceCard}>
      <Text style={s.balanceLabel}>Solde disponible</Text>
      <Text style={s.balanceAmount}>{fmt(solde)}</Text>

      <View style={s.blockedRow}>
        <Text style={s.blockedIcon}>🔒</Text>
        <Text style={s.blockedText}>Solde bloqué : {fmt(soldeBloque)}</Text>
      </View>

      <View style={s.balanceDivider} />

      <View style={s.balanceBtns}>
        <TouchableOpacity
          style={[s.withdrawBtn, showWithdraw && s.withdrawBtnActive]}
          onPress={onRetirer}
          activeOpacity={0.85}
        >
          <Text style={s.withdrawBtnText}>Retirer →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.historyBtn} onPress={onHistoryOpen} activeOpacity={0.85}>
          <Text style={s.historyBtnText}>Historique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
