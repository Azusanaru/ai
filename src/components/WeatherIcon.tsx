import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WeatherIcon = ({ size }: { size: number }) => {
  const validSize = Math.max(24, Math.min(size, 150)); // 限制在24-150之间
  return <MaterialCommunityIcons size={validSize} />;
}

export default WeatherIcon; 