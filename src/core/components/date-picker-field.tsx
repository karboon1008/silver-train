import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

import type DateTimePickerType from '@react-native-community/datetimepicker';
import type { DateTimePickerAndroid as DateTimePickerAndroidType } from '@react-native-community/datetimepicker';

function isoToDate(iso: string): Date {
  return iso ? new Date(`${iso}T00:00:00`) : new Date();
}

function dateToIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

type Props = {
  label: string;
  value: string; // YYYY-MM-DD, empty = unset
  onChange: (iso: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function DatePickerField({ label, value, onChange, minimumDate, maximumDate }: Props) {
  const theme = useAppTheme();
  const [showIos, setShowIos] = useState(false);

  const labelStyle = { textTransform: 'uppercase' as const, letterSpacing: 0.5 };

  // ── Web ──────────────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="caption" weight="600" style={labelStyle}>
          {label}
        </AppText>
        {React.createElement('input', {
          type: 'date',
          value: value || '',
          min: minimumDate ? dateToIso(minimumDate) : undefined,
          max: maximumDate ? dateToIso(maximumDate) : undefined,
          onChange: (e: { target: { value: string } }) => {
            if (e.target.value) onChange(e.target.value);
          },
          style: {
            width: '100%',
            padding: `${theme.spacing.md}px`,
            border: `1px solid ${theme.semantic.border}`,
            borderRadius: `${theme.radii.sm}px`,
            backgroundColor: theme.semantic.surface,
            color: value ? theme.semantic.text : theme.semantic.mutedText,
            fontSize: `${theme.typography.body}px`,
            boxSizing: 'border-box',
            cursor: 'pointer',
            outline: 'none',
          },
        })}
      </View>
    );
  }

  // ── iOS ──────────────────────────────────────────────────────────────────
  if (Platform.OS === 'ios') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DateTimePicker = require('@react-native-community/datetimepicker')
      .default as typeof DateTimePickerType;

    return (
      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="caption" weight="600" style={labelStyle}>
          {label}
        </AppText>
        <Pressable
          onPress={() => setShowIos((v) => !v)}
          style={{
            borderWidth: 1,
            borderColor: showIos ? theme.semantic.accent : theme.semantic.border,
            borderRadius: theme.radii.sm,
            padding: theme.spacing.md,
            backgroundColor: theme.semantic.surface,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AppText
            variant="body"
            style={{ color: value ? theme.semantic.text : theme.semantic.mutedText }}
          >
            {value || 'Select date'}
          </AppText>
          <AppText variant="body" tone="muted">📅</AppText>
        </Pressable>
        {showIos && (
          <>
            <DateTimePicker
              value={isoToDate(value)}
              mode="date"
              display="spinner"
              onChange={(_event, selected) => {
                if (selected) onChange(dateToIso(selected));
              }}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
            <Pressable
              onPress={() => setShowIos(false)}
              style={{ alignItems: 'flex-end', paddingRight: theme.spacing.sm }}
            >
              <AppText variant="body" tone="accent" weight="600">Done</AppText>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  // ── Android ──────────────────────────────────────────────────────────────
  function openAndroid() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { DateTimePickerAndroid } = require('@react-native-community/datetimepicker') as {
      DateTimePickerAndroid: typeof DateTimePickerAndroidType;
    };
    DateTimePickerAndroid.open({
      value: isoToDate(value),
      mode: 'date',
      minimumDate,
      maximumDate,
      onChange: (_event, selected) => {
        if (selected) onChange(dateToIso(selected));
      },
    });
  }

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText variant="caption" weight="600" style={labelStyle}>
        {label}
      </AppText>
      <Pressable
        onPress={openAndroid}
        style={{
          borderWidth: 1,
          borderColor: theme.semantic.border,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.md,
          backgroundColor: theme.semantic.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AppText
          variant="body"
          style={{ color: value ? theme.semantic.text : theme.semantic.mutedText }}
        >
          {value || 'Select date'}
        </AppText>
        <AppText variant="body" tone="muted">📅</AppText>
      </Pressable>
    </View>
  );
}
