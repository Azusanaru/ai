import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ActivityIndicator } from 'react-native';

export default function MapView({ path }: { path: Array<{latitude: number, longitude: number}> }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAmjOFytLq1s9O0ckIWEiNu2jLwmetnKks"
  });

  if (!isLoaded) return <ActivityIndicator size="large" />;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: 300 }}
      center={path[0]}
      zoom={13}
    >
      {path.map((point, index) => (
        <Marker
          key={index}
          position={point}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 0
          }}
        />
      ))}
    </GoogleMap>
  );
} 