import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { useTheme } from '../../theme';

interface Props {
  transaction: Transaction;
}

const getTransactionIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    DEPOSIT: 'arrow-down-circle',
    WITHDRAW: 'arrow-up-circle',
    TRANSFER: 'swap-horizontal',
    LOAN_PAYMENT: 'card',
    PAYMENT: 'cash',
    CHARGEBACK: 'return-down-back',
  };
  return iconMap[type] || 'receipt';
};

const getStatusColor = (status: string, theme: any): string => {
  const colorMap: Record<string, string> = {
    APPROVED: theme.colors.success,
    PENDING: '#f59e0b',
    FAILED: theme.colors.danger,
    REJECTED: theme.colors.danger,
    REFUNDED: theme.colors.accent,
  };
  return colorMap[status] || theme.colors.muted;
};

const TransactionRow: React.FC<Props> = React.memo(({ transaction }) => {
  const { theme } = useTheme();
  const isDebit = ['WITHDRAW', 'TRANSFER', 'LOAN_PAYMENT'].includes(transaction.transactionType);
  const timestamp = transaction.creationDate ?? (transaction as any).createdAt;
  const iconName = getTransactionIcon(transaction.transactionType);
  const statusColor = getStatusColor(transaction.transactionStatus, theme);
  
  return (
    <View style={styles.row}>
      <View style={[styles.iconContainer, { backgroundColor: (isDebit ? theme.colors.danger : theme.colors.success) + '15' }]}>
        <Ionicons
          name={iconName}
          size={24}
          color={isDebit ? theme.colors.danger : theme.colors.success}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.mainRow}>
          <View style={styles.leftSection}>
            <Text 
              style={[styles.title, { color: theme.colors.text }]}
              allowFontScaling={Platform.OS === 'ios'}
            >
              {transaction.transactionType.replace('_', ' ')}
            </Text>
            <View style={styles.metaRow}>
              <Text 
                style={[styles.date, { color: theme.colors.muted }]}
                allowFontScaling={Platform.OS === 'ios'}
              >
                {formatDate(timestamp)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <Text 
                  style={[styles.statusText, { color: statusColor }]}
                  allowFontScaling={Platform.OS === 'ios'}
                >
                  {transaction.transactionStatus}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text 
              style={[styles.amount, { color: isDebit ? theme.colors.danger : theme.colors.success }]}
              allowFontScaling={Platform.OS === 'ios'}
            >
              {isDebit ? '-' : '+'}
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default TransactionRow;
