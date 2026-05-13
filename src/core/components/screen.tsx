import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '../theme/theme-provider';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
}>;

export function Screen({
  children,
  scroll = false,
  contentContainerStyle,
  style,
  scrollProps,
}: ScreenProps) {
  const theme = useAppTheme();
  const baseStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.semantic.background,
  };
  const paddedContent: ViewStyle = {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  };

  if (scroll) {
    return (
      <SafeAreaView style={[baseStyle, style]}>
        <ScrollView
          {...scrollProps}
          contentContainerStyle={[paddedContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[baseStyle, style]}>
      <View style={[{ flex: 1 }, paddedContent, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}
