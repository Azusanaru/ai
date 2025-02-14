import { ThemeProvider } from '@rneui/themed';
import { theme } from '../src/theme/theme';
import { useRouter } from 'expo-router';
import AppNavigator from '../src/navigation/AppNavigator';
import { useJsApiLoader } from '@react-google-maps/api';
import ErrorScreen from '@/components/ErrorScreen';
import { GOOGLE_MAPS_CONFIG } from '../src/config/map';

export default function RootLayout() {
  const router = useRouter();

  const { isLoaded, loadError } = useJsApiLoader({
    ...GOOGLE_MAPS_CONFIG,
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    onLoad: () => console.log('Maps API loaded'),
    onError: (err) => console.error('Maps API error:', err)
  });

  if (loadError) {
    return <ErrorScreen error={loadError} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <AppNavigator />
    </ThemeProvider>
  );
}
