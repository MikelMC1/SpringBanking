import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

interface ActionItem {
  label: string;
  description?: string;
  onPress: () => void;
}

interface Props {
  actions: ActionItem[];
}

const QuickActionGrid: React.FC<Props> = ({ actions }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable key={action.label} style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]} onPress={action.onPress}>
          <Text style={[styles.label, { color: theme.colors.text }]}>{action.label}</Text>
          {!!action.description && <Text style={[styles.description, { color: theme.colors.muted }]}>{action.description}</Text>}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    marginRight: 12,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
  },
});

export default QuickActionGrid;
