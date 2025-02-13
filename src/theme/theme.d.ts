declare module '@/theme' {
  export interface Theme {
    colors: {
      primary: string;
      background: string;
      white: string;
      // 确保所有使用的颜色都有定义
    }
  }
} 