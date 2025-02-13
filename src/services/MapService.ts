import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

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
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
  }

  static init(config: MapConfig) {
    if (!config.apiKey) {
      throw new Error('必须提供Google Maps API密钥');
    }
    
    if (!this.instance) {
      if (!window.google?.maps) {
        throw new Error('请先加载Google Maps API');
      }
      this.instance = new MapService(config);
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