declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace google.maps {
  type Libraries = ("places" | "geometry")[];
  type TravelMode = "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT";
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
      }
    }
  }
} 