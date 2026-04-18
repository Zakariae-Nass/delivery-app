import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from '../../api/axios.config';
import { setWallet, setTransactions, setWalletError } from '../../redux/slices/walletSlice';
import DrawerMenu from '../../components/DrawerMenu';
import TransactionRow from './components/history/TransactionRow';
import { s, WHITE, SUCCESS, CORAL } from './styles/walletStyles';

export default function LivreurWalletScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { solde, solde_bloque, transactions, isLoading } = useSelector((s) => s.wallet);

  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [showWithdraw,   setShowWithdraw]   = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing,    setWithdrawing]    = useState(false);
  const [withdrawError,  setWithdrawError]  = useState('');
  const [refreshing,     setRefreshing]     = useState(false);

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

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Le montant doit être supérieur à 0');
      return;
    }
    if (amount > Number(solde)) {
      setWithdrawError('Solde insuffisant');
      return;
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWallet(); }} tintColor={CORAL} />
        }
      >
        {/* Header */}
        <View style={s.topBar || { flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ padding: 8, marginRight: 8 }}>
            <Ionicons name="menu-outline" size={26} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={[s.sectionTitle, { flex: 1, fontSize: 20 }]}>Mon Wallet</Text>
        </View>

        {/* Balance card */}
        <View style={walletSt.balanceCard}>
          <Text style={walletSt.balanceLabel}>Solde disponible</Text>
          <Text style={walletSt.balanceAmount}>{Number(solde).toFixed(2)} MAD</Text>
          {Number(solde_bloque) > 0 && (
            <Text style={walletSt.blockedAmount}>Bloqué: {Number(solde_bloque).toFixed(2)} MAD</Text>
          )}
          <View style={walletSt.actions}>
            <TouchableOpacity
              style={walletSt.withdrawBtn}
              onPress={() => setShowWithdraw((v) => !v)}
            >
              <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />
              <Text style={walletSt.withdrawBtnText}>Retirer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdraw form */}
        {showWithdraw && (
          <View style={walletSt.withdrawForm}>
            <Text style={walletSt.formLabel}>Montant à retirer (MAD)</Text>
            <TextInput
              style={[walletSt.formInput, withdrawError && walletSt.formInputError]}
              value={withdrawAmount}
              onChangeText={(v) => { setWithdrawAmount(v.replace(/[^0-9.]/g, '')); setWithdrawError(''); }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#8E8EA0"
            />
            {withdrawError ? <Text style={walletSt.errorText}>{withdrawError}</Text> : null}
            <TouchableOpacity
              style={[walletSt.confirmWithdrawBtn, withdrawing && { opacity: 0.6 }]}
              onPress={handleWithdraw}
              disabled={withdrawing}
            >
              {withdrawing
                ? <ActivityIndicator color="#fff" />
                : <Text style={walletSt.confirmWithdrawText}>Confirmer le retrait</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Transactions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Historique des transactions</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={CORAL} style={{ marginTop: 20 }} />
        ) : transactions.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Ionicons name="receipt-outline" size={48} color="#8E8EA0" />
            <Text style={{ color: '#8E8EA0', marginTop: 12 }}>Aucune transaction</Text>
          </View>
        ) : (
          <View style={s.txList || { paddingHorizontal: 16, gap: 8 }}>
            {transactions.slice(0, 20).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="Wallet"
        driverName={user?.username || ''}
        driverEmail={user?.email || ''}
      />
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';
const walletSt = StyleSheet.create({
  balanceCard:   { backgroundColor: '#1C1C1E', margin: 16, borderRadius: 20, padding: 24, alignItems: 'center' },
  balanceLabel:  { fontSize: 13, color: '#8E8EA0', fontWeight: '500', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceAmount: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 6 },
  blockedAmount: { fontSize: 13, color: '#F59E0B', fontWeight: '500' },
  actions:       { flexDirection: 'row', marginTop: 20, gap: 12 },
  withdrawBtn:   { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: SUCCESS, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  withdrawBtnText:{ color: '#fff', fontWeight: '700', fontSize: 15 },
  withdrawForm:  { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16, gap: 10 },
  formLabel:     { fontSize: 12, color: '#8E8EA0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput:     { backgroundColor: '#F5F5F7', borderRadius: 12, padding: 14, fontSize: 18, fontWeight: '700', borderWidth: 1.5, borderColor: '#ECECF0' },
  formInputError:{ borderColor: '#E63946' },
  errorText:     { fontSize: 12, color: '#E63946', fontWeight: '500' },
  confirmWithdrawBtn: { backgroundColor: SUCCESS, borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center' },
  confirmWithdrawText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
});
