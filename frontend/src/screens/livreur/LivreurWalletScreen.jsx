import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import DrawerMenu from '../../components/DrawerMenu';
import { s, WHITE, SUCCESS, CORAL, WARNING, MOCK_TRANSACTIONS } from './styles/walletStyles';
import WalletHeader from './components/wallet/WalletHeader';
import BalanceCard from './components/home/BalanceCard';
import MiniStat from './components/home/MiniStat';
import WithdrawCard from './components/wallet/WithdrawCard';
import TransactionRow from './components/history/TransactionRow';
import HistorySheet from './components/history/HistorySheet';
import useWallet from '../../hooks/useWallet';

export default function LivreurWalletScreen({ navigation }) {
  const {
    solde,
    withdrawAmount,
    setWithdrawAmount,
    withdrawSent,
    setWithdrawSent,
    handleWithdrawSubmit,
  } = useWallet(85.00);

  const [soldeBloque]                        = useState(0);
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [showWithdraw,   setShowWithdraw]   = useState(false);
  const [historyOpen,    setHistoryOpen]    = useState(false);
  const [historyFilter,  setHistoryFilter]  = useState('all');

  const openHistory  = () => setHistoryOpen(true);
  const closeHistory = () => setHistoryOpen(false);

  const handleRetirer = () => {
    setWithdrawSent(false);
    setShowWithdraw(prev => !prev);
  };

  const historyData = historyFilter === 'all'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter(t => t.type === (historyFilter === 'credits' ? 'credit' : 'debit'));

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <WalletHeader onMenuOpen={() => setDrawerOpen(true)} />

        {/* ── Balance Card ── */}
        <BalanceCard
          solde={solde}
          soldeBloque={soldeBloque}
          showWithdraw={showWithdraw}
          onRetirer={handleRetirer}
          onHistoryOpen={openHistory}
        />

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          <MiniStat icon="💰" label="Ce mois"    value="255 MAD" color={SUCCESS} />
          <MiniStat icon="📦" label="Livraisons" value="12"      color={CORAL}   />
          <MiniStat icon="⭐" label="Commission" value="15%"     color={WARNING} />
        </View>

        {/* ── Withdraw Section ── */}
        {showWithdraw && (
          <WithdrawCard
            solde={solde}
            withdrawAmount={withdrawAmount}
            onChangeAmount={setWithdrawAmount}
            withdrawSent={withdrawSent}
            onSubmit={handleWithdrawSubmit}
          />
        )}

        {/* ── Transactions Section ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Transactions récentes</Text>
          <TouchableOpacity onPress={openHistory} activeOpacity={0.7}>
            <Text style={s.seeAllText}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        <View style={s.txList}>
          {MOCK_TRANSACTIONS.slice(0, 4).map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={navigation}
        activeScreen="Wallet"
        driverName="Youssef Benali"
        driverEmail="youssef@delivtrack.ma"
      />

      {/* ── History Bottom Sheet ── */}
      <HistorySheet
        visible={historyOpen}
        onClose={closeHistory}
        historyData={historyData}
        historyFilter={historyFilter}
        onFilterChange={setHistoryFilter}
      />
    </View>
  );
}
