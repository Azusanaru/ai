import { createTheme, ThemeOptions } from '@rneui/themed';

// 扩展主题类型
declare module '@rneui/themed' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      white: string;
      divider: string;
      // 添加其他需要的颜色
    };
  }
}

export const theme = createTheme({
  components: {
    Button: {
      buttonStyle: {
        borderRadius: 20,
      },
      titleStyle: {
        fontWeight: '600',
      },
      containerStyle: {
        margin: 8,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    ListItem: {
      containerStyle: {
        paddingVertical: 12,
      },
    },
  },
  colors: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    background: '#f5f5f5',
    white: '#ffffff',
    divider: '#e0e0e0',
  },
}); 