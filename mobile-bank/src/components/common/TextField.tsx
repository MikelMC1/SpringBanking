import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, Platform } from 'react-native';
import { useTheme } from '../../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const TextField = forwardRef<TextInput, Props>(({ label, error, style, ...rest }, ref) => {
  const { theme } = useTheme();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={theme.colors.muted}
        style={[
          styles.input,
          { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border },
          style,
        ]}
        {...rest}
      />
      {!!error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
    ...(Platform.OS === 'ios' && {
      // Support Dynamic Type on iOS
      allowFontScaling: true,
    }),
  },
  error: {
    marginTop: 6,
    fontSize: 12,
  },
});

export default TextField;
