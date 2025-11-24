import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../../navigation/types';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { useCards } from '../../hooks/useCards';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/format';
import TransactionRow from '../../components/transactions/TransactionRow';
import CardListItem from '../../components/cards/CardListItem';
import PrimaryButton from '../../components/common/PrimaryButton';

const AccountDetailsScreen: React.FC<RootStackScreenProps<'AccountDetails'>> = ({ route, navigation }) => {
  const { accountId } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts } = useAccounts();
  const account = useMemo(() => accounts.find((acc) => acc.accountId === accountId), [accounts, accountId]);
  const { transactions } = useTransactions(accountId);
  const { cards } = useCards(accountId);

  if (!account) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.muted }}>Account not found</Text>
      </View>
    );
  }

  const quickActions = [
    {
      label: 'Deposit',
      icon: 'arrow-down-circle' as keyof typeof Ionicons.glyphMap,
      color: '#22c55e',
      onPress: () => navigation.navigate('TransactionForm', { type: 'DEPOSIT', accountId }),
    },
    {
      label: 'Transfer',
      icon: 'swap-horizontal' as keyof typeof Ionicons.glyphMap,
      color: '#6b5bff',
      onPress: () => navigation.navigate('TransactionForm', { type: 'TRANSFER', accountId }),
    },
    {
      label: 'Withdraw',
      icon: 'arrow-up-circle' as keyof typeof Ionicons.glyphMap,
      color: '#ef4444',
      onPress: () => navigation.navigate('TransactionForm', { type: 'WITHDRAW', accountId }),
    },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.colors.background }} 
      contentContainerStyle={[
        styles.content,
        { 
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Summary */}
      <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}> 
        <Text style={[styles.accountType, { color: theme.colors.muted }]}>{account.accountType}</Text>
        <Text style={[styles.balance, { color: theme.colors.text }]}>{formatCurrency(Number(account.balance))}</Text>
        <Text style={[styles.lastUpdate, { color: theme.colors.muted }]}>
          Updated {new Date(account.lastUpdate ?? '').toLocaleString()}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Linked Cards */}
      <View style={styles.cardsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Linked Cards</Text>
          {cards.length > 0 && (
            <Text style={[styles.cardCount, { color: theme.colors.muted }]}>{cards.length}</Text>
          )}
        </View>
        {cards.length === 0 ? (
          <View style={[styles.emptyCardContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="card-outline" size={32} color={theme.colors.muted} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No cards linked</Text>
            <PrimaryButton 
              label="Apply for Card" 
              onPress={() => navigation.navigate('CardApplication')}
              style={styles.applyButton}
            />
          </View>
        ) : (
          <>
            {cards.map((card) => (
              <CardListItem
                key={card.cardId}
                card={card}
                onPress={() => navigation.navigate('CardDetails', { cardId: card.cardId })}
              />
            ))}
            <TouchableOpacity
              style={[styles.addCardButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('CardApplication')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.colors.accent} />
              <Text style={[styles.addCardText, { color: theme.colors.accent }]}>Apply for new card</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <View style={[styles.emptyTransactionContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="receipt-outline" size={32} color={theme.colors.muted} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No transactions yet</Text>
          </View>
        ) : (
          <View style={[styles.transactions, { backgroundColor: theme.colors.surface }]}>
            {transactions.slice(0, 10).map((txn) => (
              <TransactionRow key={txn.transactionId} transaction={txn} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summary: {
    padding: 24,
    borderRadius: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  accountType: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    marginVertical: 4,
  },
  lastUpdate: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardsSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCardContainer: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyTransactionContainer: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 16,
  },
  applyButton: {
    height: 44,
    minWidth: 160,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsSection: {
    gap: 12,
  },
  transactions: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default AccountDetailsScreen;
