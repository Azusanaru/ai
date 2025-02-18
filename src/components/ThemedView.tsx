import React from 'react';
import { View, ViewProps, StyleSheet, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props extends ViewProps {
  elevated?: boolean;
}

export default function ThemedView({ style, elevated = false, ...props }: Props) {
  const theme = useTheme();
  
  return (
    <View
      style={[
        styles.base,
        elevated ? styles.elevated as any : {},
        { backgroundColor: theme.colors.surface },
        style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
  },
  elevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }) as any,
}); 