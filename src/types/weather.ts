export type WeatherIconType =
  | 'weather-sunny'
  | 'weather-partly-cloudy'
  | 'weather-night'
  | 'weather-snowy'
  | 'weather-pouring';

export type WeatherCondition = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'thunderstorm';

export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<WeatherCondition, string> = {
    clear: '01d',
    clouds: '03d',
    rain: '10d',
    thunderstorm: '11d'
  };
  return `https://openweathermap.org/img/wn/${iconMap[condition as WeatherCondition] || '01d'}@2x.png`;
};

