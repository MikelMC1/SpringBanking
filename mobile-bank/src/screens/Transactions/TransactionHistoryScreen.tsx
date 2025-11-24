import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabScreenProps } from '../../navigation/types';
import { useBankStore } from '../../store/useBankStore';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionRow from '../../components/transactions/TransactionRow';
import { useTheme } from '../../theme';
import { formatCurrency, formatCompactCurrency } from '../../utils/format';
import { triggerHaptic } from '../../utils/haptics';

const timeFilters = ['ALL', 'TODAY', 'WEEK', 'MONTH'] as const;

const timeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  ALL: 'calendar-outline',
  TODAY: 'today-outline',
  WEEK: 'calendar-number-outline',
  MONTH: 'calendar-outline',
};

const getTimeFilterLabel = (filter: string): string => {
  const labels: Record<string, string> = {
    ALL: 'All Time',
    TODAY: 'Today',
    WEEK: 'This Week',
    MONTH: 'This Month',
  };
  return labels[filter] || filter;
};

const TransactionHistoryScreen: React.FC<TabScreenProps<'Activity'>> = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedAccountId } = useBankStore();
  const { transactions, loading, refresh } = useTransactions(selectedAccountId);
  const [timeFilter, setTimeFilter] = useState<(typeof timeFilters)[number]>('ALL');

  // Date filtering helper
  const isWithinTimeRange = (dateString?: string | Date, range: typeof timeFilters[number] = 'ALL'): boolean => {
    if (range === 'ALL' || !dateString) return true;
    
    const transactionDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (Number.isNaN(transactionDate.getTime())) return false;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const transactionDay = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
    
    switch (range) {
      case 'TODAY':
        return transactionDay.getTime() === today.getTime();
      case 'WEEK': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return transactionDate >= weekAgo;
      }
      case 'MONTH': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return transactionDate >= monthAgo;
      }
      default:
        return true;
    }
  };

  const filtered = transactions.filter((txn) => {
    // Time filter
    const timestamp = txn.creationDate ?? (txn as any).createdAt;
    return isWithinTimeRange(timestamp, timeFilter);
  });

  const summary = useMemo(() => {
    const totalIncome = filtered
      .filter(t => ['DEPOSIT', 'PAYMENT'].includes(t.transactionType) && t.transactionStatus === 'APPROVED')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = filtered
      .filter(t => ['WITHDRAW', 'TRANSFER', 'LOAN_PAYMENT'].includes(t.transactionType) && t.transactionStatus === 'APPROVED')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { totalIncome, totalExpense, count: filtered.length };
  }, [filtered]);

  const handleTimeFilterChange = (value: string) => {
    triggerHaptic.selection();
    setTimeFilter(value as typeof timeFilters[number]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: theme.colors.background }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Activity</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.muted }]}>
          {summary.count} {summary.count === 1 ? 'transaction' : 'transactions'}
        </Text>
      </View>

      {/* Summary Cards */}
      {filtered.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.summaryIcon, { backgroundColor: theme.colors.success + '20' }]}>
              <Ionicons name="arrow-down-circle" size={20} color={theme.colors.success} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Income</Text>
              <Text 
                style={[styles.summaryValue, { color: theme.colors.success }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {formatCompactCurrency(summary.totalIncome)}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.summaryIcon, { backgroundColor: theme.colors.danger + '20' }]}>
              <Ionicons name="arrow-up-circle" size={20} color={theme.colors.danger} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>Expense</Text>
              <Text 
                style={[styles.summaryValue, { color: theme.colors.danger }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {formatCompactCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: theme.colors.muted }]}>Time Period</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {timeFilters.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.chip,
                  {
                    backgroundColor: timeFilter === time ? theme.colors.accent : theme.colors.surface,
                    borderColor: timeFilter === time ? theme.colors.accent : theme.colors.border,
                  },
                ]}
                onPress={() => handleTimeFilterChange(time)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={timeIcons[time]}
                  size={16}
                  color={timeFilter === time ? '#fff' : theme.colors.text}
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, { color: timeFilter === time ? '#fff' : theme.colors.text }]}>
                  {getTimeFilterLabel(time)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.transactionId)}
        renderItem={({ item }) => (
          <View style={[styles.transactionCard, { backgroundColor: theme.colors.surface }]}>
            <TransactionRow transaction={item} />
          </View>
        )}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.muted} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>No transactions found</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        }
        removeClippedSubviews={Platform.OS === 'ios'}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
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
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  transactionCard: {
    borderRadius: 16,
    marginBottom: 12,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 48,
  },
});

export default TransactionHistoryScreen;
