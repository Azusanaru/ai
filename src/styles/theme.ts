import { createTheme } from '@rneui/themed';
import type { Theme } from '@rneui/themed';

export const theme: Theme = createTheme({
  colors: {
    primary: '#3385FF',
    secondary: '#FF6B6B',
    white: '#FFFFFF',
    black: '#333333',
    grey1: '#F5F5F5',
    grey2: '#999999'
  },
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        borderRadius: 24
      }
    },
    Input: {
      containerStyle: {
        paddingHorizontal: 0
      }
    }
  }
}); 