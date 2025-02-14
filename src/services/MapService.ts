import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '../config/map';

type MapConfig = {
  apiKey: string;
  defaultCenter: google.maps.LatLngLiteral;
  libraries: google.maps.Libraries;
};

export class MapService {
  private static instance: MapService;
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;

  private constructor(config: MapConfig) {
    if (!config.apiKey) {
      throw new Error('API密钥未配置');
    }
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
  }

  static init() {
    if (!window.google?.maps) {
      throw new Error('请通过useMaps钩子加载API');
    }
    
    if (!this.instance) {
      this.instance = new MapService({
        apiKey: GOOGLE_MAPS_CONFIG.apiKey,
        defaultCenter: GOOGLE_MAPS_CONFIG.defaultCenter,
        libraries: GOOGLE_MAPS_CONFIG.libraries
      });
    }
    return this.instance;
  }

  async calculateRoute(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    travelMode: google.maps.TravelMode
  ) {
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin,
          destination,
          travelMode,
          provideRouteAlternatives: true
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            this.directionsRenderer.setDirections(result);
            resolve(result);
          } else {
            reject(`路线计算失败: ${status}`);
          }
        }
      );
    });
  }

  static async checkMapsAPI() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.google?.maps) {
          resolve(true);
        } else {
          setTimeout(check, 500);
        }
      };
      check();
    });
  }
} 