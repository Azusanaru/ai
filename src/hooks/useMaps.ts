import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '../config/map';

export default function useMaps() {
  return useJsApiLoader({
    ...GOOGLE_MAPS_CONFIG,
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey
  });
} 