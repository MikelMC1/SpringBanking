import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../types';
import { useTheme } from '../../theme';
import { maskCardNumber } from '../../utils/format';

interface Props {
  card: Card;
  onPress?: () => void;
}

const CardListItem: React.FC<Props> = ({ card, onPress }) => {
  const { theme } = useTheme();
  const maskedNumber = maskCardNumber(card.maskedNumber ?? card.cardNumber);
  const lastFour = maskedNumber.split(' ').pop() || '****';

  const getCardIcon = (cardType: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      DEBIT: 'card-outline',
      CREDIT: 'card',
      PRE_PAID: 'wallet-outline',
    };
    return iconMap[cardType] || 'card-outline';
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent + '15' }]}>
        <Ionicons name={getCardIcon(card.cardType)} size={24} color={theme.colors.accent} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.cardType, { color: theme.colors.text }]}>{card.cardType}</Text>
        <Text style={[styles.cardNumber, { color: theme.colors.muted }]}>
          •••• •••• •••• {lastFour}
        </Text>
        <Text style={[styles.expiry, { color: theme.colors.muted }]}>
          Expires {card.expMonth}/{card.expYear}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  cardType: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 13,
    marginBottom: 2,
    letterSpacing: 1,
  },
  expiry: {
    fontSize: 12,
  },
});

export default CardListItem;

