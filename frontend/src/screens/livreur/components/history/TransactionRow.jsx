import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';
import { tx_row, SUCCESS, ERROR, SUCCESS_BG, ERROR_BG, CORAL, CORAL_GHOST } from '../../styles/walletStyles';

const fmt = (n) => Number(n).toFixed(2) + ' MAD';

export default function TransactionRow({ tx }) {
  const isCredit = tx.type === 'credit';
  const date = tx.createdAt
    ? new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : tx.date || '';

  return (
    <View style={tx_row.wrap}>
      <View style={[tx_row.iconCircle, { backgroundColor: isCredit ? SUCCESS_BG : ERROR_BG }]}>
        <Ionicons
          name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={20}
          color={isCredit ? SUCCESS : ERROR}
        />
      </View>

      <View style={tx_row.info}>
        <Text style={tx_row.desc} numberOfLines={1}>{tx.description}</Text>
        <Text style={tx_row.date}>{date}</Text>
      </View>

      <View style={tx_row.right}>
        <Text style={[tx_row.amount, { color: isCredit ? SUCCESS : ERROR }]}>
          {isCredit ? '+' : '-'}{fmt(tx.montant)}
        </Text>
      </View>
    </View>
  );
}
