import OriginalMapScreen from '../../src/screens/MapScreen';
import { useEffect } from 'react';
import { MapService } from '../../src/services/MapService';
import { GoogleNavigation } from '../../src/services/NavigationService';
import { useJsApiLoader } from '@react-google-maps/api';

export default function MapScreen() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry']
  });

  useEffect(() => {
    const navigation = new GoogleNavigation();
    
    const init = async () => {
      try {
        await navigation.init();
        await navigation.planRoute(
          { lat: 31.2304, lng: 121.4737 },
          { lat: 31.2369, lng: 121.4993 },
          window.google.maps.TravelMode.DRIVING
        );
      } catch (error) {
        console.error('初始化失败:', error);
      }
    };

    if (isLoaded) {
      init();
    }
  }, [isLoaded]);

  return <OriginalMapScreen />;
} 