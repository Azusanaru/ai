import { ExpoRoot } from 'expo-router';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';

// 修改获取项目根目录的方式
const projectRoot = __dirname; // 直接使用Node.js的__dirname

// 核心路由配置
export default function Root() {
  return <ExpoRoot context={require.context(`${projectRoot}/app`)} />;
}

// 平台差异化布局
export function Layout() {
  return Platform.select({
    // 统一使用Stack导航
    default: (
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="+not-found" 
          options={{ title: '页面不存在' }}
        />
      </Stack>
    )
  });
}

// Web布局组件
const WebLayout = () => (
  <View style={styles.webContainer}>
    <Stack
      screenOptions={{
        headerStyle: styles.webHeader,
        headerTitleStyle: styles.webHeaderTitle,
        contentStyle: styles.webContent
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          contentStyle: styles.webTabContent
        }}
      />
    </Stack>
  </View>
);

// 移动端布局组件
const MobileLayout = () => (
  <Stack>
    <Stack.Screen
      name="(tabs)"
      options={{
        headerShown: false,
        contentStyle: styles.mobileContent
      }}
    />
  </Stack>
);

// 样式配置
const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%'
  },
  webHeader: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  webHeaderTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600'
  },
  webContent: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24
  },
  webTabContent: {
    paddingTop: 20
  },
  mobileContent: {
    backgroundColor: '#ffffff'
  }
});
