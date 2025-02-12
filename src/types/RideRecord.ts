export interface RideRecord {
  id: string;
  date: string;
  duration: number; // 单位：秒
  distance: number; // 单位：公里
  avgSpeed: number; // 平均速度 km/h
  maxSpeed: number; // 最高速度
  path: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
}

export function isValidRideRecord(record: any): record is RideRecord {
  return (
    typeof record?.distance === 'number' &&
    typeof record?.maxSpeed === 'number' &&
    Array.isArray(record?.path) &&
    record.weather?.temp !== undefined
  );
} 