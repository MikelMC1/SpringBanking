import React, { useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabScreenProps } from '../../navigation/types';
import { useAccounts } from '../../hooks/useAccounts';
import { useBankStore } from '../../store/useBankStore';
import { useLoans } from '../../hooks/useLoans';
import LoanSummary from '../../components/loans/LoanSummary';
import { useTheme } from '../../theme';

const LoansScreen: React.FC<TabScreenProps<'Loans'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts, loading: accountsLoading } = useAccounts();
  const { selectedAccountId } = useBankStore();
  const accountId = useMemo(() => selectedAccountId ?? accounts[0]?.accountId, [accounts, selectedAccountId]);
  const { loans, loading, refresh } = useLoans(accountId);

  const isLoading = accountsLoading || (loading && loans.length === 0);
  const hasAccount = !!accountId;

  // Debug logging
  useEffect(() => {
    console.log('LoansScreen - accountId:', accountId);
    console.log('LoansScreen - loans:', loans);
    console.log('LoansScreen - loading:', loading);
  }, [accountId, loans, loading]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {!hasAccount && !accountsLoading ? (
        <View style={[styles.emptyContainer, { paddingTop: insets.top + 48 }]}>
          <Ionicons name="wallet-outline" size={64} color={theme.colors.muted} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No account selected</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
            Please select an account to view loans
          </Text>
        </View>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => String(item.loanId)}
          refreshing={isLoading}
          onRefresh={refresh}
          renderItem={({ item }) => {
            const isPaidOff = item.status === 'PAID_OFF' || item.remainingAmount <= 0;
            return (
              <TouchableOpacity 
                onPress={() => {
                  if (!isPaidOff) {
                    navigation.navigate('LoanPayment', { loanId: item.loanId, accountId: item.accountId });
                  }
                }}
                activeOpacity={isPaidOff ? 1 : 0.7}
                disabled={isPaidOff}
              >
                <LoanSummary loan={item} />
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={[
            styles.listContent,
            { 
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 24,
            }
          ]}
          ListEmptyComponent={
            <View style={[styles.emptyContainer, { paddingTop: insets.top + 48 }]}>
              <Ionicons name="document-text-outline" size={64} color={theme.colors.muted} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No loans found</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
                {hasAccount ? 'You don\'t have any active loans' : 'Select an account to view loans'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoansScreen;
