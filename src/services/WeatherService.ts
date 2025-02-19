import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = 'sSE6Qq7cNeBPZYOXV5LeA33JbNnOjdaj';

export interface WeatherData {
  timelines: {
    hourly: Array<{
      time: string;
      values: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        weatherCode: number;
        uvIndex: number;
      };
    }>;
    daily: Array<{
      time: string;
      values: {
        temperatureMax: number;
        temperatureMin: number;
        weatherCodeDay: number;
      };
    }>;
  };
  location?: {
    lat: number;
    lon: number;
    name: string;
  };
}

export const fetchWeather = async (lat: number, lon: number) => {
  try {
    const response = await axios.post(
      'https://api.tomorrow.io/v4/timelines',
      {
        location: `${lat},${lon}`,
        fields: [
          'temperature',
          'humidity',
          'windSpeed',
          'weatherCode',
          'uvIndex',
          'temperatureMax',
          'temperatureMin',
          'weatherCodeDay'
        ],
        units: 'metric',
        timesteps: ['current', '1h', '1d'],
        startTime: 'now',
        endTime: 'nowPlus5d'
      },
      {
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return response.data.data as WeatherData;
  } catch (error) {
    if (error.response?.data?.errorCode === 403003) {
      throw new Error('免费套餐限制：预报时间不能超过5天');
    }
    
    let errorMessage = '无法获取天气数据';
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      
      switch(status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
        case 403:
          errorMessage = 'API密钥无效或权限不足';
          break;
        case 429:
          errorMessage = '请求过于频繁';
          break;
        default:
          errorMessage = `服务器错误: ${status}`;
      }
      
      console.error('详细错误信息:', {
        status,
        errorCode: errorData?.code,
        message: errorData?.message,
        documentation: errorData?.documentation
      });
    }
    
    throw new Error(errorMessage);
  }
};

// 天气代码转文字描述
export const weatherCodeToText = (code: number) => {
  const codes: { [key: number]: string } = {
    1000: '晴',
    1100: '多云',
    1101: '阴',
    2000: '雾',
    4000: '小雨',
    4001: '大雨',
    5000: '小雪',
    5001: '大雪',
    6000: '冻雨',
    8000: '雷暴'
  };
  return codes[code] || '未知天气';
};

export const getWeatherIcon = (code: number): keyof typeof MaterialCommunityIcons.glyphMap => {
  const iconMap = {
    1000: 'weather-sunny',
    1100: 'weather-partly-cloudy',
    1101: 'weather-cloudy',
    2000: 'weather-fog',
    4000: 'weather-pouring',
    4001: 'weather-rainy',
    5000: 'weather-snowy',
    5001: 'weather-snowy-heavy',
    6000: 'weather-hail',
    8000: 'weather-lightning'
  } as const;

  return iconMap[code] || 'weather-cloudy-alert';
};

const MAX_RETRIES = 2;
let retryCount = 0;

const fetchWithRetry = async (lat: number, lon: number) => {
  while (retryCount < MAX_RETRIES) {
    try {
      return await fetchWeather(lat, lon);
    } catch (error) {
      if (error.message.includes('429')) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      } else {
        throw error;
      }
    }
  }
  throw new Error('超过最大重试次数');
};