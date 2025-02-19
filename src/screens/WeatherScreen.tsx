import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Card, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LineChart } from "react-native-chart-kit";
import * as Location from "expo-location";
import {
  fetchWeather,
  weatherCodeToText,
  WeatherData,
  getWeatherIcon,
} from "../services/WeatherService";
import Animated from "react-native";

const WeatherScreen = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("需要位置权限获取天气");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const data = await fetchWeather(
        location.coords.latitude,
        location.coords.longitude,
      );

      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const WeatherDetail = ({
    icon,
    title,
    value,
  }: {
    icon: string;
    title: string;
    value: string;
  }) => (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={theme.colors.primary}
      />
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 40,
    },
    card: {
      marginBottom: 16,
      borderRadius: 12,
      elevation: 2,
      backgroundColor: "#FFF",
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    detailTitle: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "bold",
    },
    detailValue: {
      flex: 1,
      fontSize: 16,
    },
    tempContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    tempText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    conditionText: {
      fontSize: 16,
      marginLeft: 8,
    },
    detailGrid: {
      flexDirection: "row",
      marginTop: 8,
    },
    errorText: {
      color: "#ff0000",
      marginTop: 16,
    },
    dailyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8
    },
    dayText: {
      flex: 1,
      fontSize: 16,
      color: '#333'
    },
    tempRange: {
      flexDirection: 'row',
      gap: 4
    },
    chart: {
      marginVertical: 8,
      borderRadius: 8
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingText: {
      marginTop: 16,
      color: theme.colors.onSurface
    },
    animatedView: {
      // Add any necessary styles for the animated view
    }
  });

  if (!weatherData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>正在加载天气数据...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons
          name="weather-cloudy-alert"
          size={48}
          color={theme.colors.error}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 当前天气模块 */}
      <Card style={styles.card}>
        <Card.Title
          title={`当前天气 - ${weatherData?.location?.name || '未知位置'}`}
          titleStyle={{ color: theme.colors.primary }}
          left={() => (
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={theme.colors.primary}
            />
          )}
        />
        <Card.Content>
          {weatherData.timelines.hourly?.length > 0 ? (
            <>
              <View style={styles.tempContainer}>
                <Text style={styles.tempText}>
                  {weatherData.timelines.hourly[0].values.temperature}°C
                </Text>
                <Text style={styles.conditionText}>
                  {weatherCodeToText(
                    weatherData.timelines.hourly[0].values.weatherCode,
                  )}
                </Text>
              </View>

              <View style={styles.detailGrid}>
                <WeatherDetail
                  icon="weather-windy"
                  title="风速"
                  value={`${weatherData.timelines.hourly[0].values.windSpeed} m/s`}
                />
                <WeatherDetail
                  icon="water-percent"
                  title="湿度"
                  value={`${weatherData.timelines.hourly[0].values.humidity}%`}
                />
                <WeatherDetail
                  icon="weather-sunny"
                  title="紫外线"
                  value={weatherData.timelines.hourly[0].values.uvIndex.toString()}
                />
              </View>
            </>
          ) : (
            <Text style={styles.errorText}>暂无小时数据</Text>
          )}
        </Card.Content>
      </Card>

      {/* 24小时预报图表 */}
      <Card style={styles.card}>
        <Card.Title
          title="24小时预报"
          left={() => <MaterialCommunityIcons name="chart-line" size={24} />}
        />
        <Card.Content>
          {weatherData.timelines.hourly?.length > 0 ? (
            <LineChart
              data={{
                labels: weatherData.timelines.hourly
                  .slice(0, 24)
                  .map(h => new Date(h.time).getHours() + "时"),
                datasets: [{
                  data: weatherData.timelines.hourly
                    .slice(0, 24)
                    .map(h => h.values.temperature)
                }]
              }}
              width={Dimensions.get("window").width - 32}
              height={220}
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
            />
          ) : (
            <Text style={styles.errorText}>无可用图表数据</Text>
          )}
        </Card.Content>
      </Card>

      {/* 七日预报 */}
      <Card style={styles.card}>
        <Card.Title
          title="七日预报"
          left={() => <MaterialCommunityIcons name="calendar" size={24} />}
        />
        <Card.Content>
          {weatherData.timelines.daily?.length > 0 ? (
            weatherData.timelines.daily.slice(0, 7).map((day, i) => (
              <View key={i} style={styles.dailyItem}>
                <Text style={styles.dayText}>
                  {new Date(day.time).toLocaleDateString("zh-CN", {
                    weekday: "short",
                  })}
                </Text>
                <MaterialCommunityIcons
                  name={getWeatherIcon(day.values.weatherCodeDay)}
                  size={24}
                />
                <Text style={styles.tempRange}>
                  {Math.round(day.values.temperatureMax)}° /{" "}
                  {Math.round(day.values.temperatureMin)}°
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.errorText}>暂无预报数据</Text>
          )}
        </Card.Content>
      </Card>

      {/* Example of using Animated.View with useNativeDriver */}
      <Animated.View 
        style={[styles.animatedView, animatedStyle]}
        useNativeDriver={true}
      />
    </ScrollView>
  );
};

export default WeatherScreen;
