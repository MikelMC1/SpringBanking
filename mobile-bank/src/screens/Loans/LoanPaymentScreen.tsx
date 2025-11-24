import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackScreenProps } from '../../navigation/types';
import TextField from '../../components/common/TextField';
import PrimaryButton from '../../components/common/PrimaryButton';
import { payLoan } from '../../api/transaction';
import { getLoanById } from '../../api/loan';
import { useAccounts } from '../../hooks/useAccounts';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme';
import { formatCurrency, formatDate } from '../../utils/format';
import { triggerHaptic } from '../../utils/haptics';
import { Loan } from '../../types';

const LoanPaymentScreen: React.FC<RootStackScreenProps<'LoanPayment'>> = ({ route, navigation }) => {
  const { loanId, accountId } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts } = useAccounts();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loadingLoan, setLoadingLoan] = useState(true);

  const account = accounts.find(acc => acc.accountId === accountId);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoadingLoan(true);
        const loanData = await getLoanById(loanId);
        setLoan(loanData);
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Failed to load loan', text2: error.message });
      } finally {
        setLoadingLoan(false);
      }
    };
    fetchLoan();
  }, [loanId]);

  const handlePay = async () => {
    if (!amount) {
      Toast.show({ type: 'error', text1: 'Enter an amount' });
      return;
    }
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Toast.show({ type: 'error', text1: 'Enter a valid positive amount' });
      return;
    }
    if (loan && amountNum > loan.remainingAmount) {
      Toast.show({ type: 'error', text1: 'Amount exceeds remaining balance', text2: `Maximum: ${formatCurrency(loan.remainingAmount)}` });
      return;
    }
    if (account && amountNum > account.balance) {
      Toast.show({ type: 'error', text1: 'Insufficient funds', text2: `Available: ${formatCurrency(account.balance)}` });
      return;
    }

    try {
      setLoading(true);
      await payLoan({ loanId, accountId, amount: amountNum, transactionMethod: 'APP' });
      triggerHaptic.success();
      Toast.show({ type: 'success', text1: 'Loan payment scheduled', text2: 'Your payment will be processed shortly' });
      navigation.goBack();
    } catch (error: any) {
      triggerHaptic.error();
      Toast.show({ type: 'error', text1: 'Payment failed', text2: error?.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  const amountNum = Number(amount) || 0;
  const isPaidOff = loan?.status === 'PAID_OFF' || (loan && loan.remainingAmount <= 0);
  const isValidAmount = amountNum > 0 && (!loan || amountNum <= loan.remainingAmount) && (!account || amountNum <= account.balance);
  const remainingAfterPayment = loan ? loan.remainingAmount - amountNum : 0;

  if (loadingLoan) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.muted }]}>Loading loan details...</Text>
      </View>
    );
  }

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
          colors={['#f59e0b', '#d97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="card" size={48} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Loan Payment</Text>
          <Text style={styles.headerSubtitle}>Make a payment towards your loan</Text>
        </LinearGradient>

        {/* Loan Info Card */}
        {loan && (
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.accent} />
              <Text style={[styles.infoCardTitle, { color: theme.colors.text }]}>Loan Details</Text>
            </View>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Remaining Balance</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {formatCurrency(loan.remainingAmount)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Interest Rate</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {loan.interestRate}%
                </Text>
              </View>
              {loan.nextPaymentDate && (
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Next Payment</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {formatDate(loan.nextPaymentDate)}
                  </Text>
                </View>
              )}
              {loan.status && (
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Status</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {loan.status.replace('_', ' ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Account Info Card */}
        {account && (
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="wallet-outline" size={24} color={theme.colors.accent} />
              <Text style={[styles.infoCardTitle, { color: theme.colors.text }]}>Payment Account</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Account</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {account.accountType || 'Account'} #{accountId}
                </Text>
              </View>
              <View style={styles.infoRight}>
                <Text style={[styles.infoLabel, { color: theme.colors.muted, textAlign: 'right' }]}>Available Balance</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text, textAlign: 'right' }]}>
                  {formatCurrency(account.balance)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {isPaidOff ? (
          <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.paidOffCard, { backgroundColor: theme.colors.success + '15' }]}>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
              <Text style={[styles.paidOffTitle, { color: theme.colors.text }]}>Loan Paid Off</Text>
              <Text style={[styles.paidOffSubtitle, { color: theme.colors.muted }]}>
                This loan has been fully paid. No further payments are required.
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Form Card */}
            <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Amount</Text>
              
              <TextField 
                label="Amount" 
                keyboardType="decimal-pad" 
                value={amount} 
                onChangeText={setAmount}
                placeholder="0.00"
              />
              
              {isValidAmount && loan && (
                <View style={[styles.amountPreview, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.amountRow}>
                    <Text style={[styles.amountPreviewLabel, { color: theme.colors.muted }]}>Payment Amount</Text>
                    <Text style={[styles.amountPreviewValue, { color: theme.colors.text }]}>
                      {formatCurrency(amountNum)}
                    </Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  <View style={styles.amountRow}>
                    <Text style={[styles.amountPreviewLabel, { color: theme.colors.muted }]}>Remaining After Payment</Text>
                    <Text style={[styles.amountPreviewValue, { color: remainingAfterPayment > 0 ? theme.colors.text : '#22c55e' }]}>
                      {formatCurrency(remainingAfterPayment)}
                    </Text>
                  </View>
                </View>
              )}

              {loan && (
                <View style={styles.quickAmounts}>
                  <Text style={[styles.quickAmountLabel, { color: theme.colors.muted }]}>Quick Amounts</Text>
                  <View style={styles.quickAmountButtons}>
                    {[
                      loan.remainingAmount * 0.25,
                      loan.remainingAmount * 0.5,
                      loan.remainingAmount * 0.75,
                      loan.remainingAmount,
                    ].map((quickAmount, index) => {
                      const isSelected = Math.abs(Number(amount) - quickAmount) < 0.01;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.quickAmountButton,
                            { 
                              backgroundColor: isSelected ? theme.colors.accent : theme.colors.background,
                              borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                            }
                          ]}
                          onPress={() => {
                            setAmount(quickAmount.toFixed(2));
                            triggerHaptic.selection();
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.quickAmountText, 
                              { color: isSelected ? '#fff' : theme.colors.text }
                            ]}
                          >
                            {formatCurrency(quickAmount)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton 
                label="Pay Loan" 
                onPress={handlePay} 
                loading={loading}
                disabled={!isValidAmount}
                style={styles.submitButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
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
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
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
  quickAmounts: {
    marginTop: 20,
  },
  quickAmountLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  paidOffCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
  },
  paidOffTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  paidOffSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LoanPaymentScreen;
