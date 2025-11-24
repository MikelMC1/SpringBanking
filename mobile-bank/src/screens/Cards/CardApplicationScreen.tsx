import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Dropdown from '../../components/common/Dropdown';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useTheme } from '../../theme';
import { useAccounts } from '../../hooks/useAccounts';
import { useAuthStore } from '../../store/useAuthStore';
import { applyForCard } from '../../api/card';
import Toast from 'react-native-toast-message';
import { CardType, Account } from '../../types';

const cardTypeOptions = [
  { label: 'Debit Card', value: 'DEBIT' },
  { label: 'Credit Card', value: 'CREDIT' },
  { label: 'Pre-paid Card', value: 'PRE_PAID' },
];

const CardApplicationScreen = () => {
  const { theme } = useTheme();
  const { accounts } = useAccounts();
  const { fullName } = useAuthStore();
  const defaultAccount = useMemo(() => accounts[0]?.accountId, [accounts]);
  const [accountId, setAccountId] = useState<number | undefined>(defaultAccount);
  const [cardType, setCardType] = useState<CardType>('DEBIT');
  const [loading, setLoading] = useState(false);

  const accountOptions = useMemo(() => {
    return accounts.map((account: Account) => ({
      label: `${account.accountType || 'Account'} - ${account.accountId}`,
      value: String(account.accountId),
    }));
  }, [accounts]);

  const handleSubmit = async () => {
    if (!accountId) {
      Toast.show({ type: 'error', text1: 'Please select an account' });
      return;
    }
    if (!fullName) {
      Toast.show({ type: 'error', text1: 'User information not available' });
      return;
    }
    try {
      setLoading(true);
      await applyForCard({ accountId, fullName, cardType: cardType as any });
      Toast.show({ type: 'success', text1: 'Card application sent' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Could not apply for card', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>New card</Text>
      
      <View>
        <Text style={[styles.label, { color: theme.colors.muted }]}>Full name</Text>
        <View style={[styles.readOnlyField, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.readOnlyText, { color: theme.colors.text }]}>{fullName || 'Loading...'}</Text>
        </View>
      </View>

      <Dropdown
        label="Account"
        value={accountId ? String(accountId) : ''}
        options={accountOptions}
        onSelect={(value) => setAccountId(Number(value))}
        placeholder="Select an account"
      />

      <Dropdown
        label="Card type"
        value={cardType}
        options={cardTypeOptions}
        onSelect={(value) => setCardType(value as CardType)}
        placeholder="Select card type"
      />

      <PrimaryButton label="Submit" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  readOnlyField: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 16,
  },
});

export default CardApplicationScreen;
