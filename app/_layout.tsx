import { ThemeProvider } from '@rneui/themed';
import { theme } from '../src/theme/theme';
import AppNavigator from '../src/navigation/AppNavigator';

export default function RootLayout() {

  return (
    <ThemeProvider theme={theme}>
      <AppNavigator />
    </ThemeProvider>
  );
}
