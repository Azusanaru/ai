import Constants from 'expo-constants';

const MAP_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;
const WEATHER_API_KEY = Constants.expoConfig?.extra?.tomorrowIoApiKey;

// Google Maps 初始化配置
export const mapConfig = {
  apiKey: MAP_API_KEY,
  libraries: ['places']
};

// 天气请求示例
export async function fetchWeather(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lng}&apikey=${WEATHER_API_KEY}`
    );
    return await response.json();
  } catch (error) {
    console.error('Weather API Error:', error);
    return null;
  }
} 