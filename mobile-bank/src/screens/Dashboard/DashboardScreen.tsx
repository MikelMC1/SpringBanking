import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BalanceCard from '../../components/dashboard/BalanceCard';
import QuickActionGrid from '../../components/dashboard/QuickActionGrid';
import SectionHeader from '../../components/common/SectionHeader';
import Skeleton from '../../components/common/Skeleton';
import TransactionRow from '../../components/transactions/TransactionRow';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { TabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { formatCompactCurrency } from '../../utils/format';
import { useSettingsStore } from '../../store/useSettingsStore';

const DashboardScreen: React.FC<TabScreenProps<'Dashboard'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts, activeAccount, totalBalance, loading, selectAccount } = useAccounts();
  const { transactions, loading: txLoading } = useTransactions(activeAccount?.accountId);
  const { hideBalances } = useSettingsStore();
  const [visibleBalances, setVisibleBalances] = useState<Set<number>>(new Set());

  // Update visible balances when hideBalances setting changes
  useEffect(() => {
    if (!hideBalances) {
      // If balances are not hidden, show all
      setVisibleBalances(new Set(accounts.map(acc => acc.accountId)));
    } else {
      // If balances are hidden, clear visible set
      setVisibleBalances(new Set());
    }
  }, [hideBalances, accounts]);

  const actions = [
    { label: 'Deposit', onPress: () => navigation.navigate('TransactionForm', { type: 'DEPOSIT', accountId: activeAccount?.accountId }) },
    { label: 'Transfer', onPress: () => navigation.navigate('TransactionForm', { type: 'TRANSFER', accountId: activeAccount?.accountId }) },
    { label: 'Withdraw', onPress: () => navigation.navigate('TransactionForm', { type: 'WITHDRAW', accountId: activeAccount?.accountId }) },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }} 
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <BalanceCard balance={totalBalance} subtitle={`Linked accounts: ${accounts.length}`} />
      <SectionHeader title="Accounts" actionLabel="View all" onActionPress={() => navigation.navigate('Profile')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountRow}>
        {loading && !accounts.length ? (
          <Skeleton style={{ width: 200, height: 120, marginRight: 16 }} />
        ) : (
          accounts.map((account) => {
            const isBalanceVisible = visibleBalances.has(account.accountId) || !hideBalances;
            return (
              <Pressable
                key={account.accountId}
                style={[
                  styles.accountCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: activeAccount?.accountId === account.accountId ? theme.colors.accent : theme.colors.border,
                  },
                ]}
                onPress={() => selectAccount(account.accountId)}
                onPressIn={() => {
                  if (hideBalances) {
                    setVisibleBalances(prev => new Set(prev).add(account.accountId));
                  }
                }}
                onPressOut={() => {
                  if (hideBalances) {
                    setVisibleBalances(prev => {
                      const next = new Set(prev);
                      next.delete(account.accountId);
                      return next;
                    });
                  }
                }}
              >
                <Text style={[styles.accountLabel, { color: theme.colors.muted }]}>{account.accountType}</Text>
                <Text 
                  style={[styles.accountBalance, { color: theme.colors.text }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {isBalanceVisible ? formatCompactCurrency(Number(account.balance)) : '•••••'}
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
      <SectionHeader title="Quick actions" />
      <QuickActionGrid actions={actions.map((action) => ({ ...action, description: 'Tap to start' }))} />
      <SectionHeader title="Recent activity" actionLabel="History" onActionPress={() => navigation.navigate('Activity')} />
      <View style={[styles.transactions, { backgroundColor: theme.colors.surface }]}>
        {txLoading && !transactions.length ? (
          <Skeleton style={{ height: 60, marginBottom: 12 }} />
        ) : (
          <FlatList
            data={transactions.slice(0, 5)}
            keyExtractor={(item) => String(item.transactionId)}
            renderItem={({ item }) => <TransactionRow transaction={item} />}
            scrollEnabled={false}
            removeClippedSubviews={Platform.OS === 'ios'}
            ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border }} />}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 12,
  },
  accountRow: {
    marginBottom: 12,
  },
  accountCard: {
    width: 180,
    padding: 16,
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 2,
  },
  accountLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: '600',
  },
  transactions: {
    borderRadius: 24,
    paddingHorizontal: 16,
  },
});

export default DashboardScreen;
