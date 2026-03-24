import type { TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { theme } from '@/theme';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

export function TextField({ style, ...props }: TextFieldProps) {
  return (
    <View style={[styles.wrapper, style]}>
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
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
    padding: 0,
    margin: 0,
    textAlignVertical: 'center',
    height: '100%',
  },
});
