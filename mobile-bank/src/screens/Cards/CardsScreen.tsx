import React, { useMemo, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabScreenProps } from '../../navigation/types';
import { useAccounts } from '../../hooks/useAccounts';
import { useBankStore } from '../../store/useBankStore';
import { useCards } from '../../hooks/useCards';
import CardDisplay from '../../components/cards/CardDisplay';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useTheme } from '../../theme';

const CardsScreen: React.FC<TabScreenProps<'Cards'>> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { accounts, loading: accountsLoading } = useAccounts();
  const { selectedAccountId } = useBankStore();
  const accountId = useMemo(() => selectedAccountId ?? accounts[0]?.accountId, [accounts, selectedAccountId]);
  const { cards, loading, refresh } = useCards(accountId);
  const [showBlockedCards, setShowBlockedCards] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('CardsScreen - accountId:', accountId);
    console.log('CardsScreen - cards:', cards);
    console.log('CardsScreen - loading:', loading);
  }, [accountId, cards, loading]);

  const isLoading = accountsLoading || (loading && cards.length === 0);
  const hasAccount = !!accountId;

  const filteredCards = useMemo(() => {
    if (showBlockedCards) return cards;
    return cards.filter(card => {
      const status = card.status || 'ACTIVE';
      return status !== 'BLOCKED' && status !== 'LOST' && status !== 'STOLEN';
    });
  }, [cards, showBlockedCards]);

  const activeCards = useMemo(() => {
    return cards.filter(card => {
      const status = card.status || 'ACTIVE';
      return status === 'ACTIVE' || status === 'FROZEN';
    });
  }, [cards]);

  const blockedCards = useMemo(() => {
    return cards.filter(card => {
      const status = card.status || 'ACTIVE';
      return status === 'BLOCKED' || status === 'LOST' || status === 'STOLEN';
    });
  }, [cards]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {!hasAccount && !accountsLoading ? (
        <View style={[styles.emptyContainer, { paddingTop: insets.top + 48 }]}>
          <Text style={[styles.emptyText, { color: theme.colors.muted }]}>No account selected</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
            Please select an account to view cards
          </Text>
        </View>
      ) : (
        <>
          {blockedCards.length > 0 && (
            <View style={[styles.filterContainer, { 
              paddingTop: insets.top + 16,
              paddingHorizontal: 24,
              paddingBottom: 12,
              backgroundColor: theme.colors.background,
            }]}>
              <View style={styles.filterRow}>
                <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
                  Show blocked cards ({blockedCards.length})
                </Text>
                <Switch
                  value={showBlockedCards}
                  onValueChange={setShowBlockedCards}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor="#fff"
                  ios_backgroundColor={theme.colors.border}
                />
              </View>
            </View>
          )}
          <FlatList
            data={filteredCards}
            refreshing={isLoading}
            onRefresh={refresh}
            keyExtractor={(item) => String(item.cardId)}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('CardDetails', { cardId: item.cardId })}
                activeOpacity={0.7}
              >
                <CardDisplay card={item} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={[styles.emptyContainer, { paddingTop: insets.top + 48 }]}>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  {showBlockedCards ? 'No cards yet' : 'No active cards'}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.muted }]}>
                  {hasAccount ? 'Do you want to apply for a card?' : 'Select an account to view cards'}
                </Text>
                {hasAccount && (
                  <PrimaryButton 
                    label="Apply for card" 
                    onPress={() => navigation.navigate('CardApplication')} 
                    style={styles.applyButton}
                  />
                )}
              </View>
            }
            contentContainerStyle={[
              styles.listContent,
              { 
                paddingTop: blockedCards.length > 0 ? 0 : Math.max(insets.top + 16, 24),
                paddingBottom: insets.bottom + 24,
              }
            ]}
            showsVerticalScrollIndicator={false}
          />
        </>
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
    paddingBottom: 16,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  applyButton: {
    height: 44,
    minWidth: 200,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CardsScreen;
