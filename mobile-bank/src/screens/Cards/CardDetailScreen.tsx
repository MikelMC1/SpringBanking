import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../../navigation/types';
import { useBankStore } from '../../store/useBankStore';
import CardDisplay from '../../components/cards/CardDisplay';
import { useTheme } from '../../theme';
import Toast from 'react-native-toast-message';
import { triggerHaptic } from '../../utils/haptics';
import { freezeCard, blockCard, reportCardLost, reportCardStolen } from '../../api/card';
import { useCards } from '../../hooks/useCards';

const CardDetailScreen: React.FC<RootStackScreenProps<'CardDetails'>> = ({ route, navigation }) => {
  const { cardId } = route.params;
  const { cards, updateCard } = useBankStore();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<string | null>(null);
  const card = useMemo(() => cards.find((item) => item.cardId === cardId), [cardId, cards]);
  const accountId = card?.accountId;
  const { refresh } = useCards(accountId);

  if (!card) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.muted }}>Card not found</Text>
      </View>
    );
  }

  const updateCardInStore = (updatedCard: typeof card) => {
    if (!updatedCard) return;
    setCards(cards.map(c => c.cardId === updatedCard.cardId ? updatedCard : c));
  };

  const handleFreeze = async () => {
    if (!card) return;
    triggerHaptic.medium();
    
    const isFrozen = card.status === 'FROZEN';
    const action = isFrozen ? 'Unfreeze Card' : 'Freeze Card';
    const message = isFrozen 
      ? 'Are you sure you want to unfreeze this card?'
      : 'This will temporarily disable your card. You can unfreeze it anytime.';

    Alert.alert(
      action,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isFrozen ? 'Unfreeze' : 'Freeze',
          style: isFrozen ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setLoading('freeze');
              const updatedCard = await freezeCard(cardId);
              updateCard(updatedCard);
              await refresh();
              Toast.show({ 
                type: 'success', 
                text1: isFrozen ? 'Card unfrozen' : 'Card frozen', 
                text2: isFrozen ? 'Your card is now active' : 'Your card has been temporarily disabled' 
              });
            } catch (error: any) {
              Toast.show({ 
                type: 'error', 
                text1: 'Action failed', 
                text2: error?.response?.data?.message || error?.message || 'Please try again' 
              });
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleBlock = async () => {
    if (!card) return;
    triggerHaptic.medium();
    Alert.alert(
      'Block Card',
      'This will permanently block your card. You will need to request a new card. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading('block');
              const updatedCard = await blockCard(cardId);
              updateCard(updatedCard);
              await refresh();
              Toast.show({ type: 'success', text1: 'Card blocked', text2: 'Your card has been permanently blocked' });
            } catch (error: any) {
              Toast.show({ 
                type: 'error', 
                text1: 'Action failed', 
                text2: error?.response?.data?.message || error?.message || 'Please try again' 
              });
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleReportLost = async () => {
    if (!card) return;
    triggerHaptic.medium();
    Alert.alert(
      'Report Lost Card',
      'Report this card as lost? It will be immediately blocked and you will need to request a new card.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report Lost',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading('lost');
              const updatedCard = await reportCardLost(cardId);
              updateCard(updatedCard);
              await refresh();
              Toast.show({ type: 'success', text1: 'Card reported', text2: 'Your card has been blocked. Please request a new card.' });
            } catch (error: any) {
              Toast.show({ 
                type: 'error', 
                text1: 'Action failed', 
                text2: error?.response?.data?.message || error?.message || 'Please try again' 
              });
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleReportStolen = async () => {
    if (!card) return;
    triggerHaptic.medium();
    Alert.alert(
      'Report Stolen Card',
      'Report this card as stolen? It will be immediately blocked and you will need to request a new card.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report Stolen',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading('stolen');
              const updatedCard = await reportCardStolen(cardId);
              updateCard(updatedCard);
              await refresh();
              Toast.show({ type: 'success', text1: 'Card reported', text2: 'Your card has been blocked. Please request a new card.' });
            } catch (error: any) {
              Toast.show({ 
                type: 'error', 
                text1: 'Action failed', 
                text2: error?.response?.data?.message || error?.message || 'Please try again' 
              });
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  const isFrozen = card?.status === 'FROZEN';
  const isBlocked = card?.status === 'BLOCKED' || card?.status === 'LOST' || card?.status === 'STOLEN';

  const cardActions = [
    {
      id: 'freeze',
      label: isFrozen ? 'Unfreeze Card' : 'Freeze Card',
      icon: isFrozen ? 'snow-outline' : 'snow',
      color: isFrozen ? theme.colors.success : '#f59e0b',
      onPress: handleFreeze,
      disabled: isBlocked,
      loading: loading === 'freeze',
    },
    {
      id: 'block',
      label: 'Block Card',
      icon: 'ban-outline',
      color: theme.colors.danger,
      onPress: handleBlock,
      disabled: isBlocked,
      loading: loading === 'block',
    },
    {
      id: 'lost',
      label: 'Report Lost',
      icon: 'alert-circle-outline',
      color: '#f59e0b',
      onPress: handleReportLost,
      disabled: isBlocked,
      loading: loading === 'lost',
    },
    {
      id: 'stolen',
      label: 'Report Stolen',
      icon: 'warning-outline',
      color: theme.colors.danger,
      onPress: handleReportStolen,
      disabled: isBlocked,
      loading: loading === 'stolen',
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 16 }
      ]}
      showsVerticalScrollIndicator={false}
    > 
      <CardDisplay card={card} />
      
      {/* Card Status */}
      {card.status && card.status !== 'ACTIVE' && (
        <View style={[styles.statusCard, { 
          backgroundColor: card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'STOLEN' 
            ? theme.colors.danger + '15' 
            : '#f59e0b15' 
        }]}>
          <Ionicons 
            name={card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'STOLEN' ? 'ban' : 'snow'} 
            size={20} 
            color={card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'STOLEN' 
              ? theme.colors.danger 
              : '#f59e0b'} 
          />
          <Text style={[styles.statusText, { 
            color: card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'STOLEN' 
              ? theme.colors.danger 
              : '#f59e0b' 
          }]}>
            Card is {card.status.toLowerCase()}
          </Text>
        </View>
      )}

      {/* Account Info */}
      <View style={[styles.meta, { backgroundColor: theme.colors.surface }]}> 
        <View style={styles.metaRow}>
          <View style={[styles.metaIconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.accent} />
          </View>
          <View style={styles.metaContent}>
            <Text style={[styles.label, { color: theme.colors.muted }]}>Account</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>#{card.accountId}</Text>
          </View>
        </View>
      </View>

      {/* Card Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Card Management</Text>
        <View style={styles.actionsGrid}>
          {cardActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: action.disabled ? theme.colors.border : action.color + '30',
                  opacity: action.disabled || action.loading ? 0.5 : 1,
                },
              ]}
              onPress={action.onPress}
              disabled={action.disabled || action.loading}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + '15' }]}>
                {action.loading ? (
                  <Text style={{ color: action.color }}>...</Text>
                ) : (
                  <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
                )}
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
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
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    padding: 20,
    borderRadius: 20,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 12,
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CardDetailScreen;
