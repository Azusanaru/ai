import React, { useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  Marker, 
  useJsApiLoader 
} from '@react-google-maps/api';
import { View, StyleSheet } from 'react-native';
import { MAP_CONFIG } from '@/config/map';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const CENTER = { lat: 31.2304, lng: 121.4737 };

declare global {
  interface Window {
    google: any;
  }
}

const MAP_STYLE = require('@/assets/mapStyle.json');

export default function NavigationMap({ path }: {
  path: Array<google.maps.LatLngLiteral>
}) {
  const mapRef = useRef<GoogleMap>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: MAP_CONFIG.LIBRARIES
  });

  useEffect(() => {
    if (mapRef.current && path.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(p => bounds.extend(p));
      mapRef.current.fitBounds(bounds);
    }
  }, [path]);

  if (!isLoaded) return <View style={styles.loader} />;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={CENTER}
      zoom={13}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true
      }}
      ref={mapRef}
    >
      {path.map((point, i) => (
        <Marker
          key={i}
          position={point}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: i === 0 ? '#34A853' : '#4285F4',
            fillOpacity: 1
          }}
        />
      ))}
    </GoogleMap>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#f0f3f4'
  }
}); 