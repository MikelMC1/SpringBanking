import { useCallback, useEffect, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { fetchTransactions } from '../api/transaction';
import { useBankStore } from '../store/useBankStore';

export const useTransactions = (accountId?: number) => {
  const { transactions, setTransactions, setLoading, loading } = useBankStore();

  const loadTransactions = useCallback(async () => {
    try {
      setLoading('transactions', true);
      const data = await fetchTransactions(accountId);
      setTransactions(data);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Could not fetch transactions', text2: error.message });
    } finally {
      setLoading('transactions', false);
    }
  }, [accountId, setLoading, setTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = useMemo(() => {
    if (!accountId) return transactions;
    return transactions.filter((txn) => txn.accountId === accountId || txn.account2Id === accountId);
  }, [accountId, transactions]);

  return { transactions: filtered, loading: loading.transactions, refresh: loadTransactions };
};
