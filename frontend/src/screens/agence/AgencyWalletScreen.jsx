import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setWallet, setTransactions, setWalletError } from '../../redux/slices/walletSlice';

const CORAL  = '#FF6B35';
const DARK   = '#1A1A2E';
const GRAY   = '#8E8EA0';
const LIGHT  = '#F5F7FF';
const SUCCESS = '#2DC653';
const ERROR   = '#E63946';

function TransactionItem({ tx }) {
  const isCredit = tx.type === 'credit';
  const date = tx.createdAt
    ? new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  return (
    <View style={st.txRow}>
      <View style={[st.txIcon, { backgroundColor: isCredit ? 'rgba(45,198,83,0.1)' : 'rgba(230,57,70,0.1)' }]}>
        <Ionicons
          name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={18}
          color={isCredit ? SUCCESS : ERROR}
        />
      </View>
      <View style={st.txInfo}>
        <Text style={st.txDesc} numberOfLines={1}>{tx.description}</Text>
        <Text style={st.txDate}>{date}</Text>
      </View>
      <Text style={[st.txAmount, { color: isCredit ? SUCCESS : ERROR }]}>
        {isCredit ? '+' : '-'}{Number(tx.montant).toFixed(2)} MAD
      </Text>
    </View>
  );
}

export default function AgencyWalletScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { solde, solde_bloque, transactions, isLoading } = useSelector((s) => s.wallet);

  const [refreshing,     setRefreshing]     = useState(false);
  const [showWithdraw,   setShowWithdraw]   = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing,    setWithdrawing]    = useState(false);
  const [withdrawError,  setWithdrawError]  = useState('');
  const [showDeposit,    setShowDeposit]    = useState(false);
  const [depositAmount,  setDepositAmount]  = useState('');
  const [depositing,     setDepositing]     = useState(false);
  const [depositError,   setDepositError]   = useState('');

  const fetchWallet = useCallback(async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        apiClient.get('/wallet/me'),
        apiClient.get('/wallet/transactions'),
      ]);
      dispatch(setWallet(walletRes.data));
      dispatch(setTransactions(txRes.data));
    } catch (e) {
      dispatch(setWalletError('Impossible de charger le portefeuille'));
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) { setDepositError('Montant invalide'); return; }
    setDepositing(true);
    setDepositError('');
    try {
      await apiClient.post('/wallet/deposit', { montant: amount });
      Alert.alert('Succès', 'Solde rechargé avec succès');
      setDepositAmount('');
      setShowDeposit(false);
      fetchWallet();
    } catch (e) {
      setDepositError(e?.response?.data?.message || 'Erreur lors du rechargement');
    } finally {
      setDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) { setWithdrawError('Montant invalide'); return; }
    if (amount > Number(solde)) { setWithdrawError('Solde insuffisant'); return; }
    setWithdrawing(true);
    setWithdrawError('');
    try {
      await apiClient.post('/wallet/withdraw', { montant: amount });
      Alert.alert('Succès', 'Retrait demandé avec succès');
      setWithdrawAmount('');
      setShowWithdraw(false);
      fetchWallet();
    } catch (e) {
      setWithdrawError(e?.response?.data?.message || 'Erreur lors du retrait');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <SafeAreaView style={st.root}>
      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={st.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </TouchableOpacity>
        <Text style={st.title}>Mon Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionItem tx={item} />}
        contentContainerStyle={st.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWallet(); }} tintColor={CORAL} />
        }
        ListHeaderComponent={
          <>
            {/* Balance card */}
            <View style={st.balanceCard}>
              <Text style={st.balanceLabel}>Solde disponible</Text>
              <Text style={st.balanceAmount}>{Number(solde).toFixed(2)} MAD</Text>
              {Number(solde_bloque) > 0 && (
                <Text style={st.blockedAmount}>Bloqué: {Number(solde_bloque).toFixed(2)} MAD</Text>
              )}
              <View style={st.actionRow}>
                <TouchableOpacity
                  style={[st.actionBtn, { backgroundColor: SUCCESS }]}
                  onPress={() => { setShowDeposit((v) => !v); setShowWithdraw(false); }}
                >
                  <Ionicons name="arrow-down-circle-outline" size={18} color="#fff" />
                  <Text style={st.actionBtnText}>Recharger</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[st.actionBtn, { backgroundColor: CORAL }]}
                  onPress={() => { setShowWithdraw((v) => !v); setShowDeposit(false); }}
                >
                  <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />
                  <Text style={st.actionBtnText}>Retirer</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Deposit form */}
            {showDeposit && (
              <View style={st.withdrawForm}>
                <Text style={st.formLabel}>Montant à ajouter (MAD)</Text>
                <TextInput
                  style={[st.formInput, depositError && st.formInputError]}
                  value={depositAmount}
                  onChangeText={(v) => { setDepositAmount(v.replace(/[^0-9.]/g, '')); setDepositError(''); }}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={GRAY}
                />
                {depositError ? <Text style={st.errorText}>{depositError}</Text> : null}
                <TouchableOpacity
                  style={[st.confirmBtn, { backgroundColor: SUCCESS }, depositing && { opacity: 0.6 }]}
                  onPress={handleDeposit}
                  disabled={depositing}
                >
                  {depositing
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={st.confirmBtnText}>Confirmer le rechargement</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            {/* Withdraw form */}
            {showWithdraw && (
              <View style={st.withdrawForm}>
                <Text style={st.formLabel}>Montant à retirer (MAD)</Text>
                <TextInput
                  style={[st.formInput, withdrawError && st.formInputError]}
                  value={withdrawAmount}
                  onChangeText={(v) => { setWithdrawAmount(v.replace(/[^0-9.]/g, '')); setWithdrawError(''); }}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={GRAY}
                />
                {withdrawError ? <Text style={st.errorText}>{withdrawError}</Text> : null}
                <TouchableOpacity
                  style={[st.confirmBtn, withdrawing && { opacity: 0.6 }]}
                  onPress={handleWithdraw}
                  disabled={withdrawing}
                >
                  {withdrawing
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={st.confirmBtnText}>Confirmer le retrait</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            <Text style={st.sectionTitle}>Historique</Text>

            {isLoading && <ActivityIndicator color={CORAL} style={{ marginVertical: 20 }} />}
            {!isLoading && transactions.length === 0 && (
              <View style={st.empty}>
                <Ionicons name="receipt-outline" size={48} color={GRAY} />
                <Text style={st.emptyText}>Aucune transaction</Text>
              </View>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root:          { flex: 1, backgroundColor: LIGHT },
  header:        { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  iconBtn:       { width: 40, height: 40, borderRadius: 12, backgroundColor: LIGHT, justifyContent: 'center', alignItems: 'center' },
  title:         { flex: 1, fontSize: 20, fontWeight: '800', color: DARK },
  list:          { paddingBottom: 32 },
  balanceCard:   { backgroundColor: DARK, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', gap: 6 },
  balanceLabel:  { fontSize: 13, color: GRAY, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceAmount: { fontSize: 38, fontWeight: '900', color: '#fff' },
  blockedAmount: { fontSize: 13, color: '#F59E0B', fontWeight: '500' },
  actionRow:     { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 12 },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  withdrawForm:  { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 8, gap: 10 },
  formLabel:     { fontSize: 12, color: GRAY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput:     { backgroundColor: LIGHT, borderRadius: 12, padding: 14, fontSize: 18, fontWeight: '700', borderWidth: 1.5, borderColor: '#ECECF0' },
  formInputError:{ borderColor: ERROR },
  errorText:     { fontSize: 12, color: ERROR, fontWeight: '500' },
  confirmBtn:    { backgroundColor: SUCCESS, borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
  sectionTitle:  { fontSize: 16, fontWeight: '800', color: DARK, marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  txRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 14, padding: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  txIcon:        { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txInfo:        { flex: 1 },
  txDesc:        { fontSize: 14, fontWeight: '600', color: DARK },
  txDate:        { fontSize: 12, color: GRAY, marginTop: 2 },
  txAmount:      { fontSize: 15, fontWeight: '800' },
  empty:         { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyText:     { fontSize: 14, color: GRAY },
});
