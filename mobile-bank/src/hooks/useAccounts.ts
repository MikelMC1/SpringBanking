import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { getAccountsByEmail } from '../api/account';
import { useAuthStore } from '../store/useAuthStore';
import { useBankStore } from '../store/useBankStore';

export const useAccounts = () => {
  const { email } = useAuthStore();
  console.log("AUTH EMAIL FROM STORE:", email);  // DEBUG EMAIL
  const { accounts, setAccounts, updateAccount, setLoading, loading, selectedAccountId, setSelectedAccount } =
    useBankStore();
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!email) return;
    try {
      setLoading('accounts', true);
      const accountList = await getAccountsByEmail(email);
      setAccounts(accountList);

      if (!selectedAccountId && accountList.length) {
        setSelectedAccount(accountList[0].accountId);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Unable to load accounts', text2: error.message });
    } finally {
      setLoading('accounts', false);
    }
  }, [email, setAccounts, setLoading, selectedAccountId, setSelectedAccount]);

  const refreshAccount = useCallback(
    async (accountId: number) => {
      try {
        setRefreshing(true);
        // Instead of getAccountById, we refresh by fetching all accounts again
        const accountList = await getAccountsByEmail(email);
        setAccounts(accountList);
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Unable to refresh accounts', text2: error.message });
      } finally {
        setRefreshing(false);
      }
    },
    [email, setAccounts],
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = useMemo(() => accounts.reduce((sum, account) => sum + Number(account.balance ?? 0), 0), [accounts]);

  const activeAccount = useMemo(
    () => accounts.find((acc) => acc.accountId === selectedAccountId),
    [accounts, selectedAccountId],
  );

  const selectAccount = useCallback((accountId: number) => setSelectedAccount(accountId), [setSelectedAccount]);

  return {
    accounts,
    activeAccount,
    totalBalance,
    loading: loading.accounts,
    refreshing,
    fetchAccounts,
    refreshAccount,
    selectAccount,
  };
};
