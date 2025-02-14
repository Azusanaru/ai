import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ViewStyle } from 'react-native';
import { Card, ListItem, Avatar } from '@rneui/themed';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';

const WeatherScreen = () => {
  // 模拟数据
  const currentWeather = {
    temp: 12,
    condition: '晴',
    humidity: 45,
    windSpeed: 3.5,
    feelsLike: 10,
    uvIndex: 3
  };

  const hourlyForecast = [
    { time: '现在', temp: 12, icon: 'sunny' },
    { time: '15時', temp: 13, icon: 'partly-cloudy' },
    { time: '18時', temp: 9, icon: 'night' },
  ];

  const weeklyForecast = [
    { day: '今天', max: 12, min: 0, icon: 'sunny' },
    { day: '明天', max: 10, min: -1, icon: 'snow' },
    { day: '周三', max: 8, min: 2, icon: 'rain' },
  ];

  const WeatherDetail = ({ icon, title, value }) => (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#e3f2fd', '#f8f9fa']}
        style={StyleSheet.absoluteFill}
      />
      {/* 当前天气模块 */}
      <Card containerStyle={styles.mainCard}>
        <View style={styles.header}>
          <Text style={styles.location}>上海市</Text>
          <MaterialIcons name="location-on" size={20} color="#666" />
        </View>
        
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{currentWeather.temp}</Text>
          <Text style={styles.tempUnit}>°C</Text>
        </View>

        <Text style={styles.condition}>{currentWeather.condition}</Text>
        
        <View style={styles.detailGrid}>
          <WeatherDetail icon="thermometer" title="体感温度" value={`${currentWeather.feelsLike}°`} />
          <WeatherDetail icon="water-percent" title="湿度" value={`${currentWeather.humidity}%`} />
          <WeatherDetail icon="weather-windy" title="风速" value={`${currentWeather.windSpeed}m/s`} />
          <WeatherDetail icon="weather-sunny" title="紫外线" value={currentWeather.uvIndex} />
        </View>

        <MaterialCommunityIcons 
          name="weather-sunny" 
          size={48}
          color="rgba(33, 150, 243, 0.1)" 
          style={styles.backgroundIcon}
        />
      </Card>

      {/* 小时预报 */}
      <Card containerStyle={styles.sectionCard}>
        <Text style={styles.sectionTitle}>24小时预报</Text>
        <View style={styles.hourlyContainer}>
          <LineChart
            data={{
              labels: hourlyForecast.map(i => i.time),
              datasets: [{
                data: hourlyForecast.map(i => i.temp)
              }]
            }}
            width={Dimensions.get('window').width - 32}
            height={120}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            style={[styles.chart as ViewStyle, { marginHorizontal: 16 }]}
            withDots={false}
            withInnerLines={false}
          />
        </View>
      </Card>

      {/* 七日预报 */}
      <Card containerStyle={styles.sectionCard}>
        <Text style={styles.sectionTitle}>七日预报</Text>
        {weeklyForecast.map((item, i) => (
          <ListItem key={i} containerStyle={styles.forecastItem}>
            <Text style={styles.forecastDay}>{item.day}</Text>
            <MaterialCommunityIcons 
              name={`weather-${item.icon}`} 
              size={28} 
              color="#666" 
            />
            <View style={styles.tempRange}>
              <Text style={styles.maxTemp}>{item.max}°</Text>
              <Text style={styles.minTemp}>{item.min}°</Text>
            </View>
          </ListItem>
        ))}
      </Card>

      {/* 生活指数 */}
      <Card containerStyle={styles.sectionCard}>
        <Text style={styles.sectionTitle}>生活指数</Text>
        <View style={styles.indexContainer}>
          <View style={styles.indexItem}>
            <MaterialCommunityIcons name="tshirt-crew" size={24} color="#666" />
            <Text style={styles.indexText}>建议穿羽绒服</Text>
          </View>
          <View style={styles.indexItem}>
            <MaterialCommunityIcons name="umbrella" size={24} color="#666" />
            <Text style={styles.indexText}>无需带伞</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  location: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginRight: 8
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8
  },
  temp: {
    fontSize: 48,
    fontWeight: '300',
    color: theme.colors.primary
  },
  tempUnit: {
    fontSize: 24,
    color: '#666',
    marginLeft: 4
  },
  condition: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  detailTitle: {
    color: '#666',
    marginLeft: 8,
    marginRight: 4
  },
  detailValue: {
    fontWeight: '500',
    color: '#333'
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 16,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  hourlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hourItem: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    width: '30%'
  },
  hourTime: {
    color: '#666',
    marginBottom: 8
  },
  hourTemp: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  forecastItem: {
    paddingVertical: 12,
    backgroundColor: 'transparent'
  },
  forecastDay: {
    width: 80,
    color: '#333'
  },
  tempRange: {
    flexDirection: 'row',
    gap: 16
  },
  maxTemp: {
    color: '#e53935',
    fontWeight: '500'
  },
  minTemp: {
    color: '#1e88e5',
    fontWeight: '500'
  },
  indexContainer: {
    flexDirection: 'row',
    gap: 16
  },
  indexItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8
  },
  indexText: {
    marginTop: 8,
    color: '#666'
  },
  backgroundIcon: {
    position: 'absolute',
    right: -30,
    top: -20,
    opacity: 0.3
  },
  chart: {
    marginVertical: 16,
    borderRadius: 12,
    alignSelf: 'center'
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default WeatherScreen; 