import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, useTheme, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { RideRecord } from '../types/RideRecord';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function SpeedometerScreen() {
  const theme = useTheme();
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [speedData, setSpeedData] = useState<number[]>([]);
  const [isRiding, setIsRiding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [path, setPath] = useState<Array<{latitude: number, longitude: number, timestamp: number}>>([]);
  const [weatherInfo, setWeatherInfo] = useState<RideRecord['weather']>({
    temp: 0,
    condition: '未知',
    humidity: 0,
    windSpeed: 0
  });
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);
  const isMountedRef = useRef(true);
  const navigation = useNavigation();
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const abortControllerRef = useRef<AbortController>();
  let lastPosition: Location.LocationObject | null = null;

  // 实时定位监听
  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const startTracking = async () => {
      try {
        // 检查中止信号
        if (abortController.signal.aborted) return;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (abortController.signal.aborted) return;

        // 清理旧订阅
        subscriptionRef.current?.remove();
        
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10
          },
          location => {
            // 定位成功回调
          }
        ).catch(error => {
          console.error('定位错误:', error);
          return null; // 返回null保持类型一致
        });
        
        if (subscription) {
          subscriptionRef.current = subscription;
        }

      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('启动定位失败:', error);
        }
      }
    };

    if (isRiding) {
      startTracking();
    }

    return () => {
      // 中止所有异步操作
      abortController.abort();
      // 清理订阅
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [isRiding]);

  // 时间计数器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRiding && !isPaused) {
      timer = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRiding, isPaused]);

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

  // 停止骑行时保存记录
  const handleStopRiding = async () => {
    // 注释掉数据保存部分
    /*
    const record: RideRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: actualDuration,
      distance: totalDistance,
      avgSpeed: totalDistance / (actualDuration / 3600),
      maxSpeed: Number(maxSpeed.toFixed(1)),
      path,
      weather: weatherInfo
    };
    await saveRideRecord(record);
    */
    
    // 保留状态重置
    setPath([]);
    setWeatherInfo({ temp: 0, condition: '未知', humidity: 0, windSpeed: 0 });
    setIsRiding(false);
    setIsPaused(false);
    setPauseTime(0);
    // 导航到记录界面
    navigation.navigate('Records' as never);
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

  const handleRideControl = () => {
    if (isRiding) {
      handleStopRiding();
    } else {
      // 重置数据
      setTime(0);
      setTotalDistance(0);
      setMaxSpeed(0);
      setPath([]);
      setIsRiding(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          progressBackgroundColor={theme.colors.surface}
        />
      }
    >
      <LinearGradient 
        colors={[theme.colors.primaryContainer, theme.colors.secondaryContainer]} 
        style={styles.gradient}
      >
        {/* 状态指示器 */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusContent}>
              <MaterialCommunityIcons 
                name={isRiding ? 'motion-sensor' : 'power-plug-off'} 
                size={24} 
                color={theme.colors.onSurface}
              />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                {isRiding ? '实时监测中' : '设备未连接'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* 主仪表盘 */}
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.speedContainer}>
              <Text variant="displayLarge" style={styles.speedValue}>
                {speed.toFixed(1)}
              </Text>
              <Text variant="titleMedium" style={styles.speedUnit}>km/h</Text>
            </View>
            
            <ProgressBar 
              progress={speed / 40} 
              color={theme.colors.primary} 
              style={styles.progressBar}
            />
            
            <View style={styles.speedStats}>
              <View style={styles.statItem}>
                <Text variant="labelMedium">最大</Text>
                <Text variant="titleMedium">{maxSpeed.toFixed(1)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="labelMedium">平均</Text>
                <Text variant="titleMedium">{(totalDistance/(time/3600)).toFixed(1)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* 控制面板 */}
        <Card style={styles.controlCard}>
          <Card.Content>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleRideControl}
              >
                <MaterialCommunityIcons 
                  name={isRiding ? 'stop-circle' : 'play-circle'} 
                  size={48} 
                  color={theme.colors.onSecondary}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* 数据卡片组 */}
        <View style={styles.dataGrid}>
          <Card style={styles.dataCard}>
            <Card.Content>
              <View style={styles.dataContent}>
                <MaterialCommunityIcons 
                  name="map-marker-distance" 
                  size={24} 
                  color={theme.colors.primary}
                />
                <Text variant="titleLarge">{(totalDistance/1000).toFixed(2)}</Text>
                <Text variant="bodyMedium">公里</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.dataCard}>
            <Card.Content>
              <View style={styles.dataContent}>
                <MaterialCommunityIcons 
                  name="timer-outline" 
                  size={24} 
                  color={theme.colors.primary}
                />
                <Text variant="titleLarge">{formatTime(time)}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* 图表卡片 */}
        <Card style={styles.chartCard}>
          <Card.Title 
            title="速度曲线" 
            titleVariant="titleLarge"
            right={() => <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.onSurface}/>}
          />
          <Card.Content>
            <LineChart
              data={{
                labels: speedData.map((_, i) => `${i * 5}s`),
                datasets: [{ data: speedData }]
              }}
              width={Dimensions.get('window').width - 32}
              height={160}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surfaceVariant,
                decimalPlaces: 0,
                color: () => theme.colors.primary,
                labelColor: () => theme.colors.onSurface,
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  mainCard: {
    borderRadius: 24,
    marginBottom: 16,
  },
  speedContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  speedValue: {
    fontSize: 64,
    lineHeight: 72,
  },
  speedUnit: {
    marginTop: -8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 16,
  },
  speedStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  controlCard: {
    borderRadius: 24,
    marginBottom: 16,
  },
  controlRow: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  controlButton: {
    borderRadius: 40,
    padding: 12,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dataCard: {
    flex: 1,
    borderRadius: 16,
  },
  dataContent: {
    alignItems: 'center',
    gap: 4,
  },
  chartCard: {
    borderRadius: 24,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
}); 