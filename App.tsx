import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';
import { useFonts } from 'expo-font';
import ErrorBoundary from './src/components/ErrorBoundary';
import { LoadScript } from '@react-google-maps/api';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // 或者显示加载指示器
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <LoadScript
            googleMapsApiKey="AIzaSyAmjOFytLq1s9O0ckIWEiNu2jLwmetnKks"
            libraries={['places']}
          >
            <AppNavigator />
          </LoadScript>
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
} 