import type { PropsWithChildren } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-provider';

export type AppTextTone = 'default' | 'muted' | 'accent' | 'inverse';
export type AppTextVariant = 'display' | 'title' | 'body' | 'label' | 'caption';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: AppTextTone;
    variant?: AppTextVariant;
    weight?: TextStyle['fontWeight'];
    style?: StyleProp<TextStyle>;
  }
>;

const variantStyles: Record<AppTextVariant, TextStyle> = {
  display: {
    fontSize: 28,
    lineHeight: 34,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
};

function getToneColor(
  tone: AppTextTone,
  theme: ReturnType<typeof useAppTheme>,
): string {
  switch (tone) {
    case 'muted':
      return theme.semantic.mutedText;
    case 'accent':
      return theme.semantic.accent;
    case 'inverse':
      return theme.semantic.background;
    case 'default':
    default:
      return theme.semantic.text;
  }
}

export function AppText({
  children,
  style,
  tone = 'default',
  variant = 'body',
  weight = '400',
  ...props
}: AppTextProps) {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        variantStyles[variant],
        {
          color: getToneColor(tone, theme),
          fontWeight: weight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
