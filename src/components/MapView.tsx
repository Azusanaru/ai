import * as React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MapService } from '../services/MapService';
import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import useMaps from '../hooks/useMaps';
import { GOOGLE_MAPS_CONFIG } from '../config/map';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 31.2304, lng: 121.4737 };

export default function MapView() {
  const { isLoaded } = useMaps();

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<Error | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const map = new window.google.maps.Map(
        document.getElementById('map')!,
        {
          center: GOOGLE_MAPS_CONFIG.defaultCenter,
          zoom: 13,
          ...GOOGLE_MAPS_CONFIG
        }
      );
    }
  }, [isLoaded]);

  if (mapError) {
    return <View style={styles.errorContainer}>
      <Text>地图加载失败，请检查网络连接</Text>
    </View>;
  }

  if (!isLoaded) return <LoadingView />;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={DEFAULT_CENTER}
      zoom={13}
      options={{
        disableDefaultUI: true,
        zoomControl: true
      }}
    />
  );
}

const styles = {
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}; 