import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';

export const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#FF6B6B',
  },
  fonts: {
    ...DefaultTheme.fonts,
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '500' as '500'
    },
    displayMedium: {
      fontSize: 36,
      fontWeight: '700' as '700'
    },
    bodyLarge: {
      fontSize: 18,
      lineHeight: 24
    },
    titleMedium: {
      fontSize: 18,
      fontWeight: '500'
    }
  },
};


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={theme as ThemeProp}>{children}</PaperProvider>
);

// 添加统一的阴影样式
export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2
}; 