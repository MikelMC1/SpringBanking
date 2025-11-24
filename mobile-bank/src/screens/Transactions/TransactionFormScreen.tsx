import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TextField from '../../components/common/TextField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { RootStackScreenProps } from '../../navigation/types';
import { useAccounts } from '../../hooks/useAccounts';
import { deposit, payLoan, transfer, withdraw } from '../../api/transaction';
import { useTransactions } from '../../hooks/useTransactions';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { triggerHaptic } from '../../utils/haptics';

const TransactionFormScreen: React.FC<RootStackScreenProps<'TransactionForm'>> = ({ route, navigation }) => {
  const { type, accountId } = route.params;
  const { accounts } = useAccounts();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { refresh } = useTransactions(accountId);
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [loanId, setLoanId] = useState('');
  const [loading, setLoading] = useState(false);

  const sourceAccountId = useMemo(() => accountId ?? accounts[0]?.accountId, [accountId, accounts]);
  const sourceAccount = useMemo(() => accounts.find(acc => acc.accountId === sourceAccountId), [accounts, sourceAccountId]);

  const getTransactionConfig = () => {
    const configs = {
      DEPOSIT: {
        icon: 'arrow-down-circle' as keyof typeof Ionicons.glyphMap,
        title: 'Deposit',
        subtitle: 'Add money to your account',
        gradient: ['#22c55e', '#16a34a'] as const,
        actionLabel: 'Deposit',
      },
      WITHDRAW: {
        icon: 'arrow-up-circle' as keyof typeof Ionicons.glyphMap,
        title: 'Withdraw',
        subtitle: 'Take money from your account',
        gradient: ['#ef4444', '#dc2626'] as const,
        actionLabel: 'Withdraw',
      },
      TRANSFER: {
        icon: 'swap-horizontal' as keyof typeof Ionicons.glyphMap,
        title: 'Transfer',
        subtitle: 'Send money to another account',
        gradient: ['#6b5bff', '#5b4bff'] as const,
        actionLabel: 'Transfer',
      },
      LOAN_PAYMENT: {
        icon: 'card' as keyof typeof Ionicons.glyphMap,
        title: 'Loan Payment',
        subtitle: 'Make a payment towards your loan',
        gradient: ['#f59e0b', '#d97706'] as const,
        actionLabel: 'Pay Loan',
      },
    };
    return configs[type] || configs.DEPOSIT;
  };

  const config = getTransactionConfig();

  const handleSubmit = async () => {
    if (!sourceAccountId) {
      Toast.show({ type: 'error', text1: 'Select an account first' });
      return;
    }
    if (!amount) {
      Toast.show({ type: 'error', text1: 'Enter an amount' });
      return;
    }
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Toast.show({ type: 'error', text1: 'Enter a valid positive amount' });
      return;
    }
    if (type === 'TRANSFER' && !toAccount) {
      Toast.show({ type: 'error', text1: 'Recipient account required' });
      return;
    }
    if (type === 'TRANSFER') {
      const toAccountNum = Number(toAccount);
      if (isNaN(toAccountNum) || toAccountNum <= 0) {
        Toast.show({ type: 'error', text1: 'Enter a valid recipient account ID' });
        return;
      }
    }
    if (type === 'LOAN_PAYMENT' && !loanId) {
      Toast.show({ type: 'error', text1: 'Loan id required' });
      return;
    }
    if (type === 'LOAN_PAYMENT') {
      const loanIdNum = Number(loanId);
      if (isNaN(loanIdNum) || loanIdNum <= 0) {
        Toast.show({ type: 'error', text1: 'Enter a valid loan ID' });
        return;
      }
    }
    try {
      setLoading(true);
      const payload: { accountId: number; amount: number; transactionMethod: string } = {
        accountId: sourceAccountId,
        amount: amountNum,
        transactionMethod: 'APP',
      };

      switch (type) {
        case 'WITHDRAW':
          await withdraw(payload);
          break;
        case 'DEPOSIT':
          await deposit(payload);
          break;
        case 'TRANSFER':
          await transfer({ ...payload, account2Id: Number(toAccount) });
          break;
        case 'LOAN_PAYMENT':
          await payLoan({ ...payload, loanId: Number(loanId) });
          break;
        default:
          break;
      }
      triggerHaptic.success();
      Toast.show({ type: 'success', text1: `${config.title} successful` });
      // Refresh transactions to show the new one
      await refresh();
      navigation.goBack();
    } catch (error: any) {
      triggerHaptic.error();
      Toast.show({ 
        type: 'error', 
        text1: 'Transaction failed', 
        text2: error?.response?.data?.message || error?.message || 'Unknown error' 
      });
      // Refresh transactions even on failure to show the failed transaction
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const amountNum = Number(amount) || 0;
  const isValidAmount = amountNum > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { 
            backgroundColor: theme.colors.background,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 24,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={config.icon} size={48} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <Text style={styles.headerSubtitle}>{config.subtitle}</Text>
        </LinearGradient>

        {/* Account Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>From Account</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {sourceAccount?.accountType || 'Account'} #{sourceAccountId ?? '—'}
              </Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={[styles.infoLabel, { color: theme.colors.muted, textAlign: 'right' }]}>Balance</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text, textAlign: 'right' }]}>
                {formatCurrency(sourceAccount?.balance || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Transaction Details</Text>
          
          <TextField 
            label="Amount" 
            keyboardType="decimal-pad" 
            value={amount} 
            onChangeText={setAmount}
            placeholder="0.00"
          />
          
          {isValidAmount && (
            <View style={[styles.amountPreview, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.amountPreviewLabel, { color: theme.colors.muted }]}>Total</Text>
              <Text style={[styles.amountPreviewValue, { color: theme.colors.text }]}>
                {formatCurrency(amountNum)}
              </Text>
            </View>
          )}

          {type === 'TRANSFER' && (
            <TextField 
              label="Recipient Account ID" 
              keyboardType="number-pad" 
              value={toAccount} 
              onChangeText={setToAccount}
              placeholder="Enter account ID"
            />
          )}
          
          {type === 'LOAN_PAYMENT' && (
            <TextField 
              label="Loan ID" 
              keyboardType="number-pad" 
              value={loanId} 
              onChangeText={setLoanId}
              placeholder="Enter loan ID"
            />
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            label={config.actionLabel} 
            onPress={handleSubmit} 
            loading={loading}
            disabled={!isValidAmount || (type === 'TRANSFER' && !toAccount) || (type === 'LOAN_PAYMENT' && !loanId)}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  amountPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  amountPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountPreviewValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default TransactionFormScreen;
