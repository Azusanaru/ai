import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarLabelStyle: { fontSize: 12 }
      }}
    >
      <Tabs.Screen
        name="speedometer"
        options={{
          title: '码表',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="speed" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '地图',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '记录',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: '天气',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="cloud" size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
} 