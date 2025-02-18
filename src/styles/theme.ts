import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    primary: '#3385FF',
    secondary: '#FF6B6B',
    white: '#FFFFFF',
    black: '#333333',
    grey1: '#F5F5F5',
    grey2: '#999999',
  },
  // 这里可以添加其他主题属性
};

// 使用StyleSheet创建样式
export const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    padding: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2, // Android阴影
    shadowColor: theme.colors.black, // iOS阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // 其他样式...
}); 