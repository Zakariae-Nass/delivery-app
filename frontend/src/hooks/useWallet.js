/**
 * useWallet.js
 *
 * Couche métier pour le portefeuille livreur.
 * Contient la logique de retrait (validation montant, mise à jour solde).
 */

import { useState } from 'react';

export default function useWallet(initialSolde = 0) {
  const [solde,          setSolde]          = useState(initialSolde);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSent,   setWithdrawSent]   = useState(false);

  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount.replace(',', '.'));
    if (!amount || amount <= 0 || amount > solde) return;
    setSolde(prev => Math.max(0, prev - amount));
    setWithdrawSent(true);
    setWithdrawAmount('');
  };

  return {
    solde,
    withdrawAmount,
    setWithdrawAmount,
    withdrawSent,
    setWithdrawSent,
    handleWithdrawSubmit,
  };
}
