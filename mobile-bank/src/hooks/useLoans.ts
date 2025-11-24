import { useCallback, useEffect, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { fetchLoansByAccount } from '../api/loan';
import { useBankStore } from '../store/useBankStore';

export const useLoans = (accountId?: number) => {
  const { loans, setLoans, loading, setLoading } = useBankStore();

  const loadLoans = useCallback(async () => {
    if (!accountId) {
      console.log('useLoans: No accountId provided, clearing loans');
      setLoans([]);
      return;
    }
    try {
      console.log('useLoans: Loading loans for accountId:', accountId);
      setLoading('loans', true);
      const response = await fetchLoansByAccount(accountId);
      // Filter loans by accountId in case API returns loans from multiple accounts
      const filteredResponse = Array.isArray(response) 
        ? response.filter((loan) => loan.accountId === accountId)
        : [];
      console.log('useLoans: Setting loans:', filteredResponse);
      setLoans(filteredResponse);
    } catch (error: any) {
      console.error('Error fetching loans:', error);
      Toast.show({ 
        type: 'error', 
        text1: 'Could not load loans', 
        text2: error.message || 'Please try again later' 
      });
      setLoans([]);
    } finally {
      setLoading('loans', false);
    }
  }, [accountId, setLoading, setLoans]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const filteredLoans = useMemo(() => (accountId ? loans.filter((loan) => loan.accountId === accountId) : loans), [
    accountId,
    loans,
  ]);

  return { loans: filteredLoans, loading: loading.loans, refresh: loadLoans };
};
