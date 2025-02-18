import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { ThemeProvider } from 'react-native-paper';
import { LoadScript } from '@react-google-maps/api';
import 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  const router = useRouter();
  
  // 访问环境变量
  const APP_ROOT = Constants.expoConfig?.extra?.EXPO_ROUTER_APP_ROOT;

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