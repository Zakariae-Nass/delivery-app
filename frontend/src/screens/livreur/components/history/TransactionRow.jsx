import React from 'react';
import { View, Text } from 'react-native';
import { tx_row, SUCCESS, ERROR, SUCCESS_BG, ERROR_BG, CORAL, CORAL_GHOST, fmt } from '../../styles/walletStyles';

export default function TransactionRow({ tx }) {
  const isCredit = tx.type === 'credit';
  return (
    <View style={tx_row.wrap}>
      <View style={[tx_row.iconCircle, { backgroundColor: isCredit ? SUCCESS_BG : ERROR_BG }]}>
        <Text style={[tx_row.arrow, { color: isCredit ? SUCCESS : ERROR }]}>
          {isCredit ? '↓' : '↑'}
        </Text>
      </View>

      <View style={tx_row.info}>
        <Text style={tx_row.desc} numberOfLines={1}>{tx.description}</Text>
        <Text style={tx_row.date}>{tx.date}</Text>
      </View>

      <View style={tx_row.right}>
        <Text style={[tx_row.amount, { color: isCredit ? SUCCESS : ERROR }]}>
          {isCredit ? '+' : '-'}{fmt(tx.montant)}
        </Text>
        {tx.commande && (
          <View style={tx_row.cmdPill}>
            <Text style={tx_row.cmdText}>#{tx.commande}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
