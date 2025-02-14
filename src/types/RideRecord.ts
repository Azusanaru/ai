export interface RideRecord {
  id: string;
  date: string;
  duration: number; // 单位：秒
  distance: number; // 单位：公里
  avgSpeed: number; // 平均速度 km/h
  maxSpeed: number; // 最高速度
  path: Array<{
    lat: number;
    lng: number;
  }>;
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
}

export function isValidRecord(record: any): record is RideRecord {
  return record?.path?.every((p: any) => 
    typeof p?.lat === 'number' && 
    typeof p?.lng === 'number' &&
    Math.abs(p.lat) <= 90 &&
    Math.abs(p.lng) <= 180
  );
} 