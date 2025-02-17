import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';
import { useFonts } from 'expo-font';
import { LoadScript } from '@react-google-maps/api';
import 'react-native-gesture-handler';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // 或者显示加载指示器
  }

  return (
      <ThemeProvider>
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
  );
} 