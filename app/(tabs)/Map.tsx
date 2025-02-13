import OriginalMapScreen from '../../src/screens/MapScreen';
import { useEffect } from 'react';
import { MapService } from '../../src/services/MapService';

export default function MapScreen() {
  useEffect(() => {
    const initNavigation = async () => {
      try {
        const service = MapService.init({
          apiKey: process.env.GOOGLE_MAPS_API_KEY!,
          defaultCenter: { lat: 31.2304, lng: 121.4737 },
          libraries: ['places', 'geometry']
        });
        
        await service.calculateRoute(
          { lat: 31.2304, lng: 121.4737 },
          { lat: 31.2369, lng: 121.4993 },
          window.google.maps.TravelMode.DRIVING
        );
      } catch (error) {
        console.error('导航初始化失败:', error);
      }
    };

    if (window.google?.maps) {
      initNavigation();
    }
  }, []);

  return <OriginalMapScreen />;
} 