import { View, TextInput } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholder?: string;
};

export function AuthField({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  placeholder,
}: Props) {
  const theme = useAppTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText
        variant="caption"
        weight="600"
        style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        placeholderTextColor={theme.semantic.mutedText}
        style={{
          borderWidth: 1,
          borderColor: error ? '#dc2626' : theme.semantic.border,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.md,
          color: theme.semantic.text,
          fontSize: theme.typography.body,
          backgroundColor: theme.semantic.surface,
        }}
      />
      {error !== undefined && error !== '' && (
        <AppText variant="caption" style={{ color: '#dc2626' }}>
          {error}
        </AppText>
      )}
    </View>
  );
}
