import React, { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, ScrollView, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccounts } from '../../hooks/useAccounts';
import { TabScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { useAuthStore } from '../../store/useAuthStore';
import { useBankStore } from '../../store/useBankStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { setAuthToken } from '../../api/client';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { triggerHaptic } from '../../utils/haptics';

const AccountsScreen: React.FC<TabScreenProps<'Profile'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts, loading, fetchAccounts } = useAccounts();
  const { fullName, email, logout } = useAuthStore();
  const { clearAll } = useBankStore();
  const { hideBalances, setHideBalances } = useSettingsStore();

  const handleLogout = () => {
    triggerHaptic.medium();
    clearAll();
    setAuthToken(undefined);
    logout();
  };

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  }, [accounts]);

  const getAccountIcon = (accountType?: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      SAVINGS: 'wallet-outline',
      CHECKING: 'card-outline',
      SALARY: 'cash-outline',
      DEPOSIT: 'trending-up-outline',
    };
    return iconMap[accountType || ''] || 'wallet-outline';
  };

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content, 
        { 
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }
      ]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAccounts} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <LinearGradient
        colors={[theme.colors.accent, theme.colors.accent + 'DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <View style={[styles.avatarContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
        </View>
        {fullName && (
          <Text style={styles.profileName}>{fullName}</Text>
        )}
        {email && (
          <Text style={styles.profileEmail}>{email}</Text>
        )}
        <View style={styles.totalBalanceContainer}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceValue}>{formatCurrency(totalBalance)}</Text>
        </View>
      </LinearGradient>

      {/* Profile Info Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.infoRow}>
          <View style={[styles.infoIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
            <Ionicons name="person-outline" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Full Name</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{fullName || '—'}</Text>
          </View>
        </View>
        <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.infoRow}>
          <View style={[styles.infoIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{email || '—'}</Text>
          </View>
        </View>
        <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.infoRow}>
          <View style={[styles.infoIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Accounts</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{accounts.length} linked</Text>
          </View>
        </View>
      </View>

      {/* Settings Card */}
      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.settingsHeader}>
          <Ionicons name="settings-outline" size={20} color={theme.colors.accent} />
          <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>Settings</Text>
        </View>
        <View style={[styles.infoDivider, { backgroundColor: theme.colors.border, marginLeft: 0 }]} />
        <View style={styles.infoRow}>
          <View style={[styles.infoIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.colors.muted }]}>Hide Balances</Text>
            <Text style={[styles.infoDescription, { color: theme.colors.muted }]}>
              Hold to reveal balance amounts
            </Text>
          </View>
          <Switch
            value={hideBalances}
            onValueChange={(value) => {
              triggerHaptic.selection();
              setHideBalances(value);
            }}
            trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
            thumbColor="#fff"
            ios_backgroundColor={theme.colors.border}
          />
        </View>
      </View>

      {/* Accounts Section */}
      <View style={styles.accountsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>My Accounts</Text>
          {accounts.length > 0 && (
            <Text style={[styles.accountCount, { color: theme.colors.muted }]}>{accounts.length}</Text>
          )}
        </View>
        {accounts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="wallet-outline" size={48} color={theme.colors.muted} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No accounts yet</Text>
          </View>
        ) : (
          accounts.map((item) => (
            <TouchableOpacity
              key={item.accountId}
              style={[styles.accountCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => {
                triggerHaptic.light();
                navigation.navigate('AccountDetails', { accountId: item.accountId });
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.accountIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
                <Ionicons name={getAccountIcon(item.accountType)} size={24} color={theme.colors.accent} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={[styles.accountType, { color: theme.colors.text }]}>
                  {item.accountType || 'Account'}
                </Text>
                <Text style={[styles.accountId, { color: theme.colors.muted }]}>
                  #{item.accountId}
                </Text>
              </View>
              <View style={styles.accountBalanceContainer}>
                <Text style={[styles.accountBalance, { color: theme.colors.text }]}>
                  {formatCurrency(Number(item.balance))}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.danger + '30' }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
        <Text style={[styles.logoutText, { color: theme.colors.danger }]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 20,
  },
  profileHeader: {
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  totalBalanceContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  totalBalanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalBalanceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
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
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    marginLeft: 56,
  },
  accountsSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  accountCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
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
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountId: {
    fontSize: 13,
  },
  accountBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
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
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoDescription: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AccountsScreen;
