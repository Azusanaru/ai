declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace google.maps {
  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface Place {
    place_id: string;
    name?: string;
    location?: LatLng;
  }

  interface DirectionsRequest {
    origin: string | LatLng | Place;
    destination: string | LatLng | Place;
    travelMode: TravelMode;
    provideRouteAlternatives?: boolean;
    unitSystem?: UnitSystem;
    waypoints?: DirectionsWaypoint[];
    optimizeWaypoints?: boolean;
  }

  interface DirectionsWaypoint {
    location: string | LatLng | Place;
    stopover?: boolean;
  }

  interface DirectionsResult {
    routes: DirectionsRoute[];
    available_travel_modes: TravelMode[];
    geocoded_waypoints: DirectionsGeocodedWaypoint[];
  }

  interface DirectionsGeocodedWaypoint {
    geocoder_status: string;
    place_id: string;
    types: string[];
    partial_match?: boolean;
  }

  interface DirectionsRoute {
    overview_path: LatLng[];
    legs: DirectionsLeg[];
    bounds: LatLngBounds;
    copyrights: string;
  }

  interface DirectionsLeg {
    steps: DirectionsStep[];
    distance: Distance;
    duration: Duration;
    start_address: string;
    end_address: string;
    start_location: LatLng;
    end_location: LatLng;
  }

  interface DirectionsStep {
    path: LatLng[];
    travel_mode: TravelMode;
    instructions: string;
    distance: Distance;
    duration: Duration;
  }

  enum DirectionsStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    ZERO_RESULTS = 'ZERO_RESULTS',
    MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: MapTypeId;
    disableDefaultUI?: boolean;
    zoomControl?: boolean;
    scaleControl?: boolean;
  }

  enum MapTypeId {
    ROADMAP = 'roadmap',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
    TERRAIN = 'terrain'
  }

  enum TravelMode {
    DRIVING = 'DRIVING',
    WALKING = 'WALKING',
    BICYCLING = 'BICYCLING',
    TRANSIT = 'TRANSIT'
  }

  enum UnitSystem {
    METRIC = 0,
    IMPERIAL = 1
  }

  class DirectionsService {
    route(
      request: DirectionsRequest,
      callback: (
        result: DirectionsResult | null,
        status: DirectionsStatus
      ) => void
    ): void;
  }

  class DirectionsRenderer {
    constructor(options?: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult | null): void;
  }

  interface DirectionsRendererOptions {
    map?: Map;
    directions?: DirectionsResult;
    routeIndex?: number;
    panel?: Element;
    suppressMarkers?: boolean;
  }

  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    fitBounds(bounds: LatLngBounds): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
  }

  class LatLngBounds {
    extend(latLng: LatLng | LatLngLiteral): void;
    contains(latLng: LatLng | LatLngLiteral): boolean;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
  }

  interface Distance {
    text: string;
    value: number;
  }

  interface Duration {
    text: string;
    value: number;
  }
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
                status: google.maps.DirectionsStatus[keyof google.maps.DirectionsStatus]
              ) => void
            ) => void;
          };
        };
        DirectionsRenderer: new () => google.maps.DirectionsRenderer;
        DirectionsStatus: {
          OK: string;
          NOT_FOUND: string;
          ZERO_RESULTS: string;
          [key: string]: string;
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
    API_KEY: string;
    MAP_ID?: string;
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

  interface MaterialCommunityIconName {
    'weather-sunny': string;
    'weather-partly-cloudy': string;
    'weather-night': string;
    'weather-snowy': string;
    'weather-pouring': string;
  }
}

import type { MD3Theme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeFont {
      fontWeight: 
        | '100' | '200' | '300' | '400' 
        | '500' | '600' | '700' | '800' 
        | '900' | 'normal' | 'bold';
    }
    interface Theme extends MD3Theme {
      roundness: number;
      colors: MD3Theme['colors'] & {
        primaryContainer: string;
        secondaryContainer: string;
        surfaceVariant: string;
      };
    }
  }
}

interface Distance {
  text: string;
  value: number;
}

interface Duration {
  text: string;
  value: number;
}

interface PromiseConstructor {
  all<T>(values: readonly (T | Promise<T>)[]): Promise<T[]>;
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
  reject<T = never>(reason?: any): Promise<T>;
}

declare var Promise: PromiseConstructor; 