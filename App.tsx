import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  if (!fontsLoaded) {
    return null; // 或者显示加载指示器
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
} 