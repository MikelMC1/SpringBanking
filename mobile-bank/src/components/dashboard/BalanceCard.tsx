import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCompactCurrency } from '../../utils/format';
import { useTheme } from '../../theme';
import { useSettingsStore } from '../../store/useSettingsStore';

interface Props {
  balance: number;
  subtitle?: string;
}

const BalanceCard: React.FC<Props> = ({ balance, subtitle }) => {
  const { theme } = useTheme();
  const { hideBalances } = useSettingsStore();
  const [isBalanceVisible, setIsBalanceVisible] = useState(!hideBalances);

  useEffect(() => {
    setIsBalanceVisible(!hideBalances);
  }, [hideBalances]);

  return (
    <Pressable
      onPressIn={() => hideBalances && setIsBalanceVisible(true)}
      onPressOut={() => hideBalances && setIsBalanceVisible(false)}
      style={styles.pressable}
    >
      <LinearGradient
        colors={['#1f1f7a', theme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Text style={styles.title} allowFontScaling={Platform.OS === 'ios'}>Total balance</Text>
        <Text 
          style={styles.balance} 
          allowFontScaling={Platform.OS === 'ios'}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {isBalanceVisible ? formatCompactCurrency(balance) : '••••••'}
        </Text>
        {!!subtitle && <Text style={styles.subtitle} allowFontScaling={Platform.OS === 'ios'}>{subtitle}</Text>}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 24,
  },
  container: {
    padding: 24,
    borderRadius: 28,
  },
  title: {
    color: '#dbeafe',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  balance: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 13,
    color: '#cbd5f5',
  },
});

export default BalanceCard;
