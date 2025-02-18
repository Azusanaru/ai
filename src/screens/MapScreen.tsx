import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import * as Location from 'expo-location';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 35.6762,  // 东京坐标
  lng: 139.6503
};

const LIBRARIES = ['places'] as const;

const JAPAN_BOUNDS = typeof window !== 'undefined' && window.google 
  ? new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(30.0, 130.0),
      new window.google.maps.LatLng(45.0, 145.0)
    )
  : null;

const MapScreen = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();
  const [destination, setDestination] = useState<google.maps.LatLngLiteral>();
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
  const [searchBounds, setSearchBounds] = useState<google.maps.LatLngBounds>();
  const [searchResult, setSearchResult] = useState<google.maps.places.PlaceResult>();
  const [clickedPosition, setClickedPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative'
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10
    },
    searchContainer: {
      flex: 1,
      minWidth: '70%',
      height: 48,
      paddingHorizontal: 0,
      marginRight: 12
    },
    inputContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 28,
      borderBottomWidth: 0,
      paddingHorizontal: 0,
      height: '100%',
      width: '100%'
    },
    input: {
      fontSize: 16,
      color: '#333',
      paddingHorizontal: 16,
      marginLeft: -8,
      includeFontPadding: false
    },
    searchButton: {
      backgroundColor:  '#3385FF',
      borderRadius: 24,
      height: 48,
      minWidth: 80,
      paddingHorizontal: 24
    },
    searchButtonText: {
      color:  '#FFF',
      fontSize: 16,
      fontWeight: '500'
    },
    buttonContainer: {
      // Add any necessary styles for the button container
    },
    fab: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      backgroundColor: '#fff',
      borderRadius: 30,
      width: 56,
      height: 56,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6
    }
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted' && isMounted) {
        const location = await Location.getCurrentPositionAsync({});
        const pos = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        };
        setCurrentLocation(pos);
        map?.panTo(pos);
        map?.setZoom(14);
      }
    })();
    return () => { isMounted = false };
  }, [map]);

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && result) {
      setDirections(result);
    }
  };

  const startNavigation = () => {
    if (autocompleteRef.current && currentLocation) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        setDestination({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  };

  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setSearchBounds(bounds);
      }
    }
  };

  const handleSearch = useCallback(async () => {
    try {
      if (!autocompleteRef.current || !window.google) {
        throw new Error('Google Maps API未加载');
      }

      const place = await autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSearchResult(place);
        map?.panTo(location);
        map?.setZoom(16);
      } else {
        Alert.alert('搜索失败', '未找到该地点');
      }
    } catch (error: any) {
      console.error('搜索出错:', error);
      Alert.alert('搜索错误', error.message);
    }
  }, [map]);

  const debouncedSearch = useCallback(() => {
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    setClickedPosition(position);

    if (currentLocation) {
      setDirections({
        request: {
          origin: currentLocation,
          destination: position,
          travelMode: google.maps.TravelMode.DRIVING
        },
        routes: []
      });
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <LoadScript
        googleMapsApiKey="AIzaSyCdIMvnFk7tRGWaBxE_AKBCg_I7PmC-roo"
        libraries={LIBRARIES as unknown as any[]}
        language="ja"
        region="JP"
        onError={(error) => console.error('地图加载失败:', error)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || defaultCenter}
          zoom={14}
          onLoad={map => setMap(map)}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
          onBoundsChanged={handleBoundsChanged}
          onClick={handleMapClick}
        >
          <View style={styles.header}>
            <Autocomplete
              onLoad={autocomplete => {
                autocompleteRef.current = autocomplete;
                if (window.google && JAPAN_BOUNDS) {
                  autocomplete.setBounds(JAPAN_BOUNDS);
                  autocomplete.setComponentRestrictions({ country: 'jp' });
                }
              }}
              options={{
                types: ['geocode', 'establishment'],
                fields: ['geometry', 'name', 'formatted_address'],
                strictBounds: true
              }}
              onPlaceChanged={debouncedSearch}
            >
              <TextInput
                placeholder="搜索地点"
              />
            </Autocomplete>
            <Button
              title="搜索"
              onPress={handleSearch}
            />
          </View>

          {directions && currentLocation && clickedPosition && (
            <DirectionsService
              options={{
                origin: currentLocation,
                destination: clickedPosition,
                travelMode: google.maps.TravelMode.DRIVING
              }}
              callback={(result, status) => {
                if (status === 'OK' && result) {
                  setDirections(result);
                } else {
                  Alert.alert('路线规划失败', '无法到达该位置');
                }
              }}
            />
          )}

          {directions && <DirectionsRenderer directions={directions} />}

          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeWeight: 2
              }}
            />
          )}

          {searchResult?.geometry && (
            <Marker
              position={searchResult.geometry.location!}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF6B6B',
                strokeColor: '#FFF',
                strokeWeight: 2
              }}
              title={searchResult.name}
            />
          )}

          {clickedPosition && (
            <Marker
              position={clickedPosition}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF6B6B',
                strokeColor: '#FFF',
                strokeWeight: 2
              }}
              title="点击的位置"
            />
          )}
        </GoogleMap>
      </LoadScript>

      <FAB
        icon="map-marker" 
        style={styles.fab}
        onPress={() => {}}
        color="#4285F4"
        theme={{ colors: { accent: '#fff' } }}
      />
    </View>
  );
};

export default MapScreen;
