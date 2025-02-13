import * as React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MapService } from '../services/MapService';
import { useEffect } from 'react';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 31.2304, lng: 121.4737 };

export default function MapView() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry']
  });

  useEffect(() => {
    if (isLoaded) {
      MapService.init({
        apiKey: process.env.GOOGLE_MAPS_API_KEY!,
        defaultCenter: DEFAULT_CENTER,
        libraries: ['places', 'geometry']
      });
      console.log('Google Maps API状态:', window.google.maps ? '已加载' : '未加载');
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

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