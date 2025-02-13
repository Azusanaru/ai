import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Icon } from '@rneui/themed';
import { LineChart } from 'react-native-chart-kit';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { RideRecord } from '../types/RideRecord';
import { saveRideRecord } from '../services/RecordStorage';
import { calculateDistance } from '../utils/geo';
// import { calculateCalories } from '../utils/calories';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DataItem from '../components/DataItem';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export default function SpeedometerScreen() {
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
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors?.primary || '#007AFF']}
          progressBackgroundColor="#fff"
        />
      }
    >
      <LinearGradient colors={['#f7f9fc', '#e3f2fd']} style={styles.gradient}>
        {/* 骑行状态指示器 */}
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, {backgroundColor: isRiding ? '#4CAF50' : '#F44336'}]} />
          <Text style={styles.statusText}>{isRiding ? '骑行中' : '已停止'}</Text>
        </View>

        {/* 主速度仪表盘 */}
        <Card containerStyle={styles.speedCard}>
          <Text style={styles.speedValue}>{speed.toFixed(1)}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
          <View style={styles.speedStats}>
            <Text style={styles.statusText}>最大 {maxSpeed.toFixed(1)}</Text>
            <Text style={styles.statusText}>平均 {(totalDistance/(time/3600)).toFixed(1)}</Text>
          </View>
        </Card>

        {/* 控制按钮容器 */}
        <Card containerStyle={[styles.chartCard, { overflow: 'hidden' }]}>
          <View style={styles.controlContainer}>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { marginRight: 16 }]}
              onPress={() => {
                setIsPaused(!isPaused);
                if (isPaused) {
                  setPauseTime(prev => prev + (Date.now() - pauseTime));
                } else {
                  setPauseTime(Date.now());
                }
              }}
              disabled={!isRiding}
            >
              <MaterialCommunityIcons 
                name={isPaused ? "play-circle" : "pause-circle"} 
                size={36} 
                color="white" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.controlButton, isRiding ? styles.stopButton : styles.startButton]}
              onPress={handleRideControl}
            >
              <MaterialCommunityIcons 
                name={isRiding ? "stop-circle" : "play-circle"} 
                size={48} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          </View>
        </Card>

        {/* 数据统计行（2个卡片） */}
        <View style={styles.dataGrid}>
          <Card containerStyle={styles.dataCard}>
            <Text style={styles.dataLabel}>骑行距离</Text>
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceValue}>{(totalDistance/1000).toFixed(2)}</Text>
              <Text style={styles.distanceUnit}>km</Text>
              <Text style={styles.distanceSubValue}>（{(totalDistance).toFixed(0)} 米）</Text>
            </View>
          </Card>

          <Card containerStyle={styles.dataCard}>
            <Text style={styles.dataLabel}>骑行时间</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeValue}>{formatTime(time).split(':')[0]}</Text>
              <Text style={styles.timeUnit}>h</Text>
              <Text style={styles.timeValue}>{formatTime(time).split(':')[1]}</Text>
              <Text style={styles.timeUnit}>m</Text>
              <Text style={styles.timeValue}>{formatTime(time).split(':')[2]}</Text>
              <Text style={styles.timeUnit}>s</Text>
            </View>
          </Card>
        </View>

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
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => '#000',
                labelColor: (opacity = 1) => '#666',
              }}
              bezier
              withDots={false}
              withInnerLines={false}
              style={styles.chart}
            />
          </View>
        </Card>

        {/* 运动数据概览（4个卡片） */}
        <View style={styles.dataGrid}>
          <Card containerStyle={styles.dataCard}>
            <Icon name="speedometer" type="material-community" size={24} color="#4CAF50" />
            <View style={styles.metricContainer}>
              <Text style={styles.dataValue}>{(totalDistance/time*3.6).toFixed(1) || 0}</Text>
              <Text style={styles.dataUnit}>km/h</Text>
            </View>
            <Text style={styles.dataLabel}>平均速度</Text>
          </Card>

          <Card containerStyle={styles.dataCard}>
            <Icon name="arrow-up" type="material-community" size={24} color="#FF9800" />
            <View style={styles.metricContainer}>
              <Text style={styles.dataValue}>{maxSpeed.toFixed(1)}</Text>
              <Text style={styles.dataUnit}>km/h</Text>
            </View>
            <Text style={styles.dataLabel}>最高速度</Text>
          </Card>

          <Card containerStyle={styles.dataCard}>
            <Icon name="altimeter" type="material-community" size={24} color="#2196F3" />
            <View style={styles.metricContainer}>
              <Text style={styles.dataValue}>--</Text>
              <Text style={styles.dataUnit}>米</Text>
            </View>
            <Text style={styles.dataLabel}>当前海拔</Text>
          </Card>

          <Card containerStyle={styles.dataCard}>
            <Icon name="fire" type="material-community" size={24} color="#E91E63" />
            <View style={styles.metricContainer}>
              <Text style={styles.dataValue}>{(totalDistance * 60).toFixed(0)}</Text>
              <Text style={styles.dataUnit}>kcal</Text>
            </View>
            <Text style={styles.dataLabel}>卡路里</Text>
          </Card>
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  statusText: {
    color: '#666',
    fontSize: 14
  },
  speedCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center'
  },
  speedValue: {
    fontSize: 64,
    fontWeight: '300',
    color: '#E91E63'
  },
  speedUnit: {
    fontSize: 24,
    color: '#666',
    marginTop: -8
  },
  speedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16
  },
  controlContainer: {
    alignItems: 'center',
    marginVertical: 24
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50'
  },
  stopButton: {
    backgroundColor: '#F44336'
  },
  secondaryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12
  },
  dataCard: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center'
  },
  dataLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8
  },
  dataValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000'
  },
  dataUnit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 2
  },
  timeUnit: {
    fontSize: 12,
    color: '#999',
    marginRight: 8
  },
  distanceContainer: {
    alignItems: 'center'
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000'
  },
  distanceUnit: {
    fontSize: 12,
    color: '#999'
  },
  distanceSubValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4
  }
}); 