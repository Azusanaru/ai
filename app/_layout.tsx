
import { ThemeProvider } from '@rneui/themed';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';
import AppNavigator from '../src/navigation/AppNavigator';

export default function RootLayout() {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <AppNavigator />
    </ThemeProvider>
  );
}
