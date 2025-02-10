import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import WeatherScreen from '../screens/WeatherScreen';
import ChatScreen from '../screens/ChatScreen';
import SpeedometerScreen from '../screens/SpeedometerScreen';
import RecordScreen from '../screens/RecordScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 4,
          height: 60
        }
      }}
    >
      <Tab.Screen
        name="Speedometer"
        component={SpeedometerScreen}
        options={{
          tabBarLabel: '码表',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="speedometer" size={28} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '地图',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" size={28} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Records"
        component={RecordScreen}
        options={{
          tabBarLabel: '骑行记录',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons 
              name="chart-line" 
              size={28} 
              color={color} 
            />
          )
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarLabel: '天气',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="weather-cloudy" size={28} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: '聊天',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chat" size={28} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
} 