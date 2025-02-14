import React, { useWindowDimensions } from 'react';
import WeatherIcon from '../components/WeatherIcon';

const ResponsiveComponent = () => {
  const { width } = useWindowDimensions();
  
  // 添加安全计算
  const iconSize = Math.floor(width * 0.15);
  return <WeatherIcon size={iconSize} />;
}

export default ResponsiveComponent; 