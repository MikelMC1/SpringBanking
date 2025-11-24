import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';

interface Props extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ label, loading, style, disabled, onPress, ...rest }) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const handlePress = (e: any) => {
    if (!isDisabled && Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.accent, opacity: isDisabled ? 0.6 : 1 }, style]}
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={handlePress}
      {...rest}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minWidth: 120,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default PrimaryButton;
