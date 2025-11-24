import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../types';
import { useTheme } from '../../theme';
import { maskCardNumber } from '../../utils/format';

interface Props {
  card: Card;
}

const CardDisplay: React.FC<Props> = ({ card }) => {
  const { theme } = useTheme();
  const [showCvv, setShowCvv] = useState(false);
  const maskedNumber = maskCardNumber(card.maskedNumber ?? card.cardNumber);
  const cvvLabel = showCvv ? `CVV ${card.cvv ?? '***'}` : 'Hold to reveal CVV';
  
  const isBlocked = card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'STOLEN';
  const isFrozen = card.status === 'FROZEN';
  const statusOpacity = isBlocked ? 0.5 : isFrozen ? 0.7 : 1;

  const getStatusBadge = () => {
    if (isBlocked) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(239, 68, 68, 0.3)' }]}>
          <Ionicons name="ban" size={12} color="#fff" />
          <Text style={styles.statusText}>BLOCKED</Text>
        </View>
      );
    }
    if (isFrozen) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.3)' }]}>
          <Ionicons name="snow" size={12} color="#fff" />
          <Text style={styles.statusText}>FROZEN</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Pressable 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          opacity: statusOpacity,
        }
      ]} 
      onLongPress={() => setShowCvv((prev) => !prev)}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>{card.cardType}</Text>
        {getStatusBadge()}
      </View>
      <Text style={styles.number}>{maskedNumber}</Text>
      <Text style={styles.meta}>
        EXP {card.expMonth}/{card.expYear}
      </Text>
      <Text style={styles.meta}>{cvvLabel}</Text>
      <Text style={styles.name}>{card.fullName}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brand: {
    color: '#cbd5f5',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  number: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 3,
    marginBottom: 12,
  },
  meta: {
    color: '#e2e8f0',
    fontSize: 13,
    marginBottom: 4,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
});

export default CardDisplay;
