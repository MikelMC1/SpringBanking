import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loan } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useTheme } from '../../theme';

interface Props {
  loan: Loan;
}

const LoanSummary: React.FC<Props> = ({ loan }) => {
  const { theme } = useTheme();
  const isPaidOff = loan.status === 'PAID_OFF' || loan.remainingAmount <= 0;
  const opacity = isPaidOff ? 0.5 : 1;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface, 
        shadowColor: theme.colors.shadow,
        opacity,
      }
    ]}>
      <View style={styles.content}>
        <View>
          <Text style={[styles.label, { color: theme.colors.muted }]}>Remaining</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{formatCurrency(loan.remainingAmount)}</Text>
        </View>
        <View>
          <Text style={[styles.label, { color: theme.colors.muted }]}>Interest</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{loan.interestRate}%</Text>
        </View>
      </View>
      {isPaidOff && (
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '20' }]}>
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
          <Text style={[styles.statusText, { color: theme.colors.success }]}>PAID OFF</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LoanSummary;
