import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, List, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    uvIndex: number;
  };
}

const WeatherScreen = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const API_KEY = process.env.TOMORROW_IO_API_KEY;

  const getWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?apikey=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('获取天气数据失败:', error);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, []);

  const currentWeather = {
    temp: 12,
    condition: '晴',
    humidity: 45,
    windSpeed: 3.5,
    feelsLike: 10,
    uvIndex: 3
  };

  const hourlyForecast = [
    { time: '现在', temp: 12, icon: 'weather-sunny' },
    { time: '15時', temp: 13, icon: 'weather-partly-cloudy' },
    { time: '18時', temp: 9, icon: 'weather-night' },
  ];

  const weeklyForecast = [
    { day: '今天', max: 12, min: 0, icon: 'weather-sunny' },
    { day: '明天', max: 10, min: -1, icon: 'weather-snowy' },
    { day: '周三', max: 8, min: 2, icon: 'weather-pouring' },
  ];

  const WeatherDetail = ({ icon, title, value }: { 
    icon: string;
    title: string;
    value: string;
  }) => (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons 
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap} 
        size={24} 
        color={theme.colors.primary} 
      />
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#e3f2fd', '#f8f9fa']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* 当前天气模块 */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title
          title="天气信息"
          titleStyle={styles.cardTitle}
          left={() => <MaterialCommunityIcons name="weather-cloudy" size={24} />}
        />
        <Card.Content>
          <View style={styles.header}>
            <Text style={[styles.location, theme.fonts.titleLarge]}>
              上海市
              <MaterialCommunityIcons name="map-marker" size={16} />
            </Text>
          </View>

          <View style={styles.tempContainer}>
            <Text style={theme.fonts.displayMedium}>{weatherData ? weatherData.current.temp : '加载中...'}</Text>
            <Text style={theme.fonts.bodyLarge}>°C</Text>
          </View>
          {weatherData && weatherData.current && (
            <Text style={[styles.condition, theme.fonts.titleMedium]}>
              {weatherData.current.condition}
            </Text>
          )}

          {weatherData && weatherData.current && (
            <View style={styles.detailGrid}>
              <WeatherDetail icon="thermometer" title="体感温度" value={`${weatherData.current.feelsLike}°`} />
              <WeatherDetail icon="water-percent" title="湿度" value={`${weatherData.current.humidity}%`} />
              <WeatherDetail icon="weather-windy" title="风速" value={`${weatherData.current.windSpeed}m/s`} />
              <WeatherDetail icon="weather-sunny" title="紫外线" value={weatherData.current.uvIndex.toString()} />
            </View>
          )}
        </Card.Content>
      </Card>

      {/* 小时预报 */}
      <Card style={styles.card}>
        <Card.Title
          title="24小时预报"
          titleStyle={styles.cardTitle}
          left={() => <MaterialCommunityIcons name="clock" size={24} />}
        />
        <Card.Content>
          <LineChart
            data={{
              labels: hourlyForecast.map(i => i.time),
              datasets: [{ data: hourlyForecast.map(i => i.temp) }]
            }}
            width={Dimensions.get('window').width - 32}
            height={160}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: () => theme.colors.primary,
              labelColor: () => theme.colors.onSurface,
            }}
            bezier
            style={styles.chart}
            withDots={false}
            withInnerLines={false}
          />
        </Card.Content>
      </Card>

      {/* 七日预报 */}
      <Card style={styles.card}>
        <Card.Title
          title="七日预报"
          titleStyle={styles.cardTitle}
          left={() => <MaterialCommunityIcons name="calendar" size={24} />}
        />
        <Card.Content>
          {weeklyForecast.map((item, i) => (
            <List.Item
              key={i}
              title={item.day}
              left={() => (
                <MaterialCommunityIcons 
                  name={item.icon as typeof MaterialCommunityIcons.defaultProps.name} 
                  size={28} 
                  color={theme.colors.onSurface}
                />
              )}
              right={() => (
                <View style={styles.tempRange}>
                  <Text style={styles.maxTemp}>{item.max}°</Text>
                  <Text style={styles.minTemp}>{item.min}°</Text>
                </View>
              )}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2
  },
  cardTitle: {
    marginLeft: -8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8
  },
  condition: {
    marginBottom: 16
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  detailItem: {
    width: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8
  },
  detailTitle: {
    marginTop: 8,
    fontSize: 12,
    color: '#666'
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8
  },
  tempRange: {
    flexDirection: 'row',
    gap: 8
  },
  maxTemp: {
    color: '#e53935',
    fontWeight: '500'
  },
  minTemp: {
    color: '#1e88e5',
    fontWeight: '500'
  }
});

export default WeatherScreen; 