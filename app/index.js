import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// 使用文件系统路由配置
export default function App() {
  return <ExpoRoot context={require.context('./app')} />;
}

// 注册根组件
registerRootComponent(App);
