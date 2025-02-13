import React, { useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  Marker, 
  Polyline,
  useJsApiLoader 
} from '@react-google-maps/api';
import { View, StyleSheet } from 'react-native';
import { LIBRARIES } from '@/config/map';

// 类型声明
declare global {
  interface Window {
    google: any;
    __MAP_LIBRARIES__: ["places", "geometry"];
  }
}

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 31.2304, lng: 121.4737 }; // 上海坐标
const MAP_STYLE = require('@/assets/mapStyle.json');

type Props = {
  path: Array<{ latitude: number; longitude: number }>;
  onMapReady?: (map: google.maps.Map) => void;
};

export default function MapView({ path, onMapReady }: Props) {
  const mapRef = useRef<google.maps.Map>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: window.__MAP_LIBRARIES__
  });

  // 初始化地图边界
  useEffect(() => {
    if (mapRef.current && path.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(p => bounds.extend(p));
      mapRef.current.fitBounds(bounds);
    }
  }, [path]);

  // 地图加载回调
  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    onMapReady?.(map);
  };

  if (!isLoaded) return <View style={styles.loader} />;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={DEFAULT_CENTER}
      zoom={13}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true
      }}
      onLoad={handleLoad}
    >
      <Polyline
        path={path.map(p => ({ lat: p.latitude, lng: p.longitude }))}
        options={{
          strokeColor: '#2196F3',
          strokeOpacity: 1.0,
          strokeWeight: 4
        }}
      />
      
      {path.map((point, index) => (
        <Marker
          key={index}
          position={{ lat: point.latitude, lng: point.longitude }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: index === 0 ? 6 : 4,
            fillColor: index === 0 ? '#34A853' : '#4285F4',
            fillOpacity: 1,
            strokeWeight: 0
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