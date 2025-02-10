import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Icon } from '@rneui/themed';
import { LineChart } from 'react-native-chart-kit';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { RideRecord } from '../types/RideRecord';
import { saveRideRecord } from '../services/RecordStorage';

export default function SpeedometerScreen() {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [speedData, setSpeedData] = useState<number[]>([]);
  const [isRiding, setIsRiding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [path, setPath] = useState<RideRecord['path']>([]);
  const [weatherInfo, setWeatherInfo] = useState<RideRecord['weather']>({
    temp: 0,
    condition: '未知',
    humidity: 0,
    windSpeed: 0
  });

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const isMountedRef = useRef(true);

  // 实时定位监听
  useEffect(() => {
    isMountedRef.current = true;
    
    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMountedRef.current || status !== 'granted') return;

        subscriptionRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High },
          location => {
            if (!isMountedRef.current) return;
            const newSpeed = location.coords.speed ? location.coords.speed * 3.6 : 0;
            setSpeed(Math.round(newSpeed * 10) / 10);
            setSpeedData(prev => [...prev.slice(-29), newSpeed]); // 保留最近30个数据点
            
            if (location) {
              const dist = calculateDistance(location, location);
              setDistance(prev => prev + dist / 1000);
            }
            setPath(prev => [...prev, {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: Date.now()
            }]);

            if (path.length === 0) { // 首次定位时获取天气
              fetchWeather(location.coords.latitude, location.coords.longitude);
            }
          },
          error => handleLocationError(error)
        );
      } catch (error) {
        console.error('定位服务异常:', error);
      }
    };

    startTracking();
    
    return () => {
      isMountedRef.current = false;
      if (subscriptionRef.current) {
        if (typeof subscriptionRef.current.remove === 'function') {
          subscriptionRef.current.remove();
        }
        subscriptionRef.current = null;
      }
    };
  }, []);

  // 时间计数器
  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 计算两点间距离
  const calculateDistance = (prev: Location.LocationObject, current: Location.LocationObject) => {
    const R = 6371e3;
    const φ1 = prev.coords.latitude * Math.PI/180;
    const φ2 = current.coords.latitude * Math.PI/180;
    const Δφ = (current.coords.latitude - prev.coords.latitude) * Math.PI/180;
    const Δλ = (current.coords.longitude - prev.coords.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // 时间格式化
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 下拉刷新处理函数
  const onRefresh = () => {
    setRefreshing(true);
    setTime(0);
    setDistance(0);
    setSpeedData([]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLocationError = (error: Error) => {
    console.error('定位错误:', error);
    Alert.alert(
      '定位服务异常',
      '无法获取位置信息，请检查设备定位设置',
      [{ text: '确定', onPress: () => subscriptionRef.current?.remove() }]
    );
  };

  // 停止骑行时保存记录
  const handleStopRiding = async () => {
    const record: RideRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: time,
      distance: Number(distance.toFixed(2)),
      avgSpeed: Number((distance / (time / 3600)).toFixed(1)) || 0,
      maxSpeed: Number(Math.max(...speedData).toFixed(1)),
      path,
      weather: weatherInfo
    };
    
    await saveRideRecord(record);
    setPath([]);
    setWeatherInfo({ temp: 0, condition: '未知', humidity: 0, windSpeed: 0 });
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric&lang=zh_cn`
      );
      const data = await response.json();
      setWeatherInfo({
        temp: data.main.temp,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('获取天气失败:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          progressBackgroundColor="#fff"
        />
      }
    >
      <LinearGradient colors={['#f7f9fc', '#e3f2fd']} style={styles.gradient}>
        {/* 主速度仪表盘 */}
        <Card containerStyle={styles.mainCard}>
          <Text style={styles.speedValue}>{speed.toFixed(1)}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="clock" type="material-community" color="#666" size={20} />
              <Text style={styles.statValue}>{formatTime(time)}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="map-marker-distance" type="material-community" color="#666" size={20} />
              <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            </View>
          </View>
        </Card>

        {/* 实时速度曲线 */}
        <Card containerStyle={[styles.chartCard, { overflow: 'hidden' }]}>
          <Text style={styles.sectionTitle}>速度变化曲线</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: [],
                datasets: [{ data: speedData }]
              }}
              width={Dimensions.get('window').width - 48}
              height={180}
              chartConfig={{
                backgroundColor: theme.colors.white,
                backgroundGradientFrom: theme.colors.white,
                backgroundGradientTo: theme.colors.white,
                decimalPlaces: 0,
                color: () => theme.colors.primary,
                labelColor: () => '#666',
              }}
              bezier
              withDots={false}
              withInnerLines={false}
              style={styles.chart}
            />
          </View>
        </Card>

        {/* 运动数据概览 */}
        <View style={styles.dataGrid}>
          <Card containerStyle={styles.dataCard}>
            <Icon name="speedometer" type="material-community" size={24} color="#4CAF50" />
            <Text style={styles.dataValue}>{(distance/time*3.6).toFixed(1) || 0}</Text>
            <Text style={styles.dataLabel}>平均速度</Text>
          </Card>
          <Card containerStyle={styles.dataCard}>
            <Icon name="arrow-up" type="material-community" size={24} color="#FF9800" />
            <Text style={styles.dataValue}>{Math.max(...speedData).toFixed(1)}</Text>
            <Text style={styles.dataLabel}>最高速度</Text>
          </Card>
          <Card containerStyle={styles.dataCard}>
            <Icon name="altimeter" type="material-community" size={24} color="#2196F3" />
            <Text style={styles.dataValue}>--</Text>
            <Text style={styles.dataLabel}>当前海拔</Text>
          </Card>
          <Card containerStyle={styles.dataCard}>
            <Icon name="fire" type="material-community" size={24} color="#E91E63" />
            <Text style={styles.dataValue}>{(distance * 60).toFixed(0)}</Text>
            <Text style={styles.dataLabel}>卡路里</Text>
          </Card>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={[styles.button, isRiding ? styles.stopButton : styles.startButton]}
            onPress={() => {
              if (isRiding) {
                handleStopRiding();
              }
              setIsRiding(!isRiding);
              if (!isRiding) {
                setTime(0);
                setDistance(0);
                setSpeedData([]);
              }
            }}
          >
            <Icon 
              name={isRiding ? "pause" : "play-arrow"} 
              size={28} 
              color="white" 
            />
            <Text style={styles.buttonText}>
              {isRiding ? "暂停骑行" : "开始骑行"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16
  },
  gradient: {
    flex: 1,
    paddingBottom: 24
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    alignItems: 'center'
  },
  speedValue: {
    fontSize: 64,
    fontWeight: '300',
    color: theme.colors.primary,
    marginTop: 16
  },
  speedUnit: {
    fontSize: 20,
    color: '#666',
    marginBottom: 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 8
  },
  chartCard: {
    borderRadius: 24,
    marginTop: 16,
    padding: 16,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: -8,
    marginTop: -8
  },
  chart: {
    borderRadius: 16
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16
  },
  dataCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  dataValue: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginVertical: 8
  },
  dataLabel: {
    color: '#666',
    fontSize: 14
  },
  controlButtons: {
    marginTop: 24,
    paddingHorizontal: 24
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '500'
  }
}); 