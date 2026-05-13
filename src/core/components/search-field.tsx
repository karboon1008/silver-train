import { TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type SearchFieldProps = TextInputProps & {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function SearchField({
  label,
  containerStyle,
  placeholder = 'Search',
  placeholderTextColor,
  style,
  ...props
}: SearchFieldProps) {
  const theme = useAppTheme();

  return (
    <View style={[{ gap: theme.spacing.sm }, containerStyle]}>
      {label ? (
        <AppText tone="muted" variant="label" weight="600">
          {label}
        </AppText>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          borderRadius: theme.radii.pill,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          backgroundColor: theme.semantic.surface,
          paddingHorizontal: theme.spacing.md,
          minHeight: 52,
        }}
      >
        <AppText tone="muted">Search</AppText>
        <TextInput
          {...props}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? theme.semantic.mutedText}
          style={[
            {
              flex: 1,
              color: theme.semantic.text,
              fontSize: theme.typography.body,
              paddingVertical: theme.spacing.md,
            },
            style,
          ]}
        />
      </View>
    </View>
  );
}
