declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace google.maps {
  type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
}

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_MAPS_API_KEY: string;
  }
}

declare module 'expo-speech';
declare module 'expo-av'; 