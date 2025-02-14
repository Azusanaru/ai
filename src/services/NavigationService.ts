import { 
  GoogleMap
} from '@react-google-maps/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAP_CONFIG } from '@/config/map';
import { MapService } from '@/services/MapService';

type RouteOptimizationParams = {
  maxSlope: number;
  preferredDistance: number;
  historicalRoutes: any[];
};

type DirectionsStep = google.maps.DirectionsStep & {
  elevation?: { value: number };
};

export class GoogleNavigation {
  private static readonly REQUIRED_LIBRARIES = MAP_CONFIG.LIBRARIES;
  
  private mapRef: GoogleMap | null = null;
  private directions: google.maps.DirectionsResult | null = null;
  private isAPILoaded = false;

  constructor() {
    // 移除立即检查
  }

  async init() {
    await MapService.checkMapsAPI();
    if (!window.google?.maps) {
      throw new Error('Google Maps API未加载');
    }
    this.isAPILoaded = true;
  }

  // 路径规划（带离线缓存）
  async planRoute(origin: google.maps.LatLngLiteral, 
                destination: google.maps.LatLngLiteral,
                params: RouteOptimizationParams) {
    if (!this.isAPILoaded) {
      await this.init();
    }
    const cacheKey = `route_${origin.lat},${origin.lng}_${destination.lat},${destination.lng}`;
    
    // 尝试获取缓存
    const cached = await this.getCachedRoute(cacheKey);
    if (cached) return cached;

    // 在线请求
    return new Promise((resolve, reject) => {
      new window.google.maps.DirectionsService().route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.BICYCLING,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      }, (result: google.maps.DirectionsResult, status: string) => {
        if (status === 'OK' && result) {
          this.cacheRoute(cacheKey, result);
          resolve(this.optimizeRoutes(result, params));
        } else {
          reject(status);
        }
      });
    });
  }

  // 协同过滤优化
  private optimizeRoutes(routes: google.maps.DirectionsResult, 
                        params: RouteOptimizationParams) {
    return routes.routes
      .map(route => ({
        ...route,
        score: this.calculateRouteScore(route, params)
      }))
      .sort((a, b) => b.score - a.score);
  }

  private calculateRouteScore(route: google.maps.DirectionsRoute, 
                            params: RouteOptimizationParams) {
    const distance = route.legs[0].distance?.value || 0;
    const elevation = this.calculateElevation(route);
    return (1 / Math.abs(distance - params.preferredDistance)) * 
           (1 / (elevation * params.maxSlope));
  }

  // 离线缓存管理
  private async cacheRoute(key: string, data: any) {
    await AsyncStorage.setItem(key, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  }

  private async getCachedRoute(key: string) {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    const { timestamp, ...data } = JSON.parse(cached);
    if (Date.now() - timestamp > 86400_000) return null; // 24小时缓存
    
    return data;
  }

  // 高程计算
  private calculateElevation(route: google.maps.DirectionsRoute) {
    return route.legs[0].steps.reduce((sum, step) => 
      sum + ((step as DirectionsStep).elevation?.value || 0), 0);
  }
} 