import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { theme } from '@/theme';

export function TextField(props: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minHeight: theme.sizing.inputHeight,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingVertical: theme.spacing.sm,
  },
});
