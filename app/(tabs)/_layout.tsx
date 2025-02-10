import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          borderTopWidth: 0,
          elevation: 8
        }
      }}
    >
      <Tabs.Screen
        name="speedometer"
        options={{
          title: '骑行数据',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="speedometer" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '轨迹地图',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: '实时天气',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="weather-cloudy" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '骑友社区',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" size={28} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
