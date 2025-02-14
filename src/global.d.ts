declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace google.maps {
}

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_MAPS_API_KEY: string;
  }
}

declare module 'expo-speech';
declare module 'expo-av';

declare global {
  interface Window {
    google: {
      maps: {
        loaded: boolean;
        DirectionsService: {
          new (): {
            route: (
              request: google.maps.DirectionsRequest,
              callback: (
                result: google.maps.DirectionsResult | null,
                status: google.maps.DirectionsStatus
              ) => void
            ) => void;
          };
        };
        DirectionsRenderer: new () => google.maps.DirectionsRenderer;
        DirectionsStatus: {
          OK: string;
          NOT_FOUND: string;
          ZERO_RESULTS: string;
        };
        TravelMode: typeof google.maps.TravelMode;
        Map: new (el: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        LatLngBounds: new () => google.maps.LatLngBounds;
      }
    }
  }
}

declare module '@/config/map' {
  export const MAP_CONFIG: {
    DEFAULT_CENTER: google.maps.LatLngLiteral;
    ZOOM: number;
  };
}

declare module '@expo/vector-icons' {
  export interface IconProps {
    name: 
      | 'weather-sunny'
      | 'weather-partly-cloudy'
      | 'weather-night'
      | 'weather-snowy'
      | 'weather-rainy';
  }
} 