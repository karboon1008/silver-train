import type { PropsWithChildren } from 'react';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { Screen } from '@/core/components/screen';
import { useAppTheme } from '@/core/theme/theme-provider';

type AuthFormShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  alternateLabel?: string;
  alternateActionLabel?: string;
  onPressAlternate?: () => void;
}>;

export function AuthFormShell({
  children,
  eyebrow,
  title,
  description,
  alternateLabel,
  alternateActionLabel,
  onPressAlternate,
}: AuthFormShellProps) {
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={{ justifyContent: 'center' }}>
      <AppCard style={{ gap: theme.spacing.lg }}>
        <AppText tone="accent" variant="label" weight="700">
          {eyebrow}
        </AppText>
        <AppText variant="display" weight="700">
          {title}
        </AppText>
        <AppText tone="muted">{description}</AppText>
        {children}
        {alternateLabel && alternateActionLabel && onPressAlternate ? (
          <AppText tone="muted">
            {alternateLabel}{' '}
            <AppText tone="accent" weight="700" onPress={onPressAlternate}>
              {alternateActionLabel}
            </AppText>
          </AppText>
        ) : null}
      </AppCard>
    </Screen>
  );
}
