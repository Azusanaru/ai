import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { FAB } from '@rneui/themed';
import * as Location from 'expo-location';
import { Icon, Input } from '@rneui/themed';
import { theme } from '@/styles/theme';
import type { Theme } from '@rneui/themed';

declare module '@rneui/themed' {
  interface Colors {
    grey2?: string;
    primary: string;
    white: string;
    black: string;
    secondary?: string;
    grey1?: string;
  }
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 31.2304,
  lng: 121.4737
};

const MapScreen = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>();
  const [destination, setDestination] = useState<google.maps.LatLngLiteral>();
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
  const [searchBounds, setSearchBounds] = useState<google.maps.LatLngBounds>();
  const [searchResult, setSearchResult] = useState<google.maps.places.PlaceResult>();

  const safeTheme = theme as Theme;

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
      color: safeTheme.colors.black || '#333',
      paddingHorizontal: 16,
      marginLeft: -8,
      includeFontPadding: false
    },
    searchButton: {
      backgroundColor: safeTheme.colors.primary || '#3385FF',
      borderRadius: 24,
      height: 48,
      minWidth: 80,
      paddingHorizontal: 24
    },
    searchButtonText: {
      color: safeTheme.colors.white || '#FFF',
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

  // 获取当前位置
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('需要位置权限以使用此功能');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const pos = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
    setCurrentLocation(pos);
    map?.panTo(pos);
  };

  // 路线计算结果回调
  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && result) {
      setDirections(result);
    }
  };

  // 开始导航
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

  // 监听地图边界变化
  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setSearchBounds(bounds);
      }
    }
  };

  const handleSearch = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setSearchResult(place);
        map?.panTo(place.geometry.location!);
        map?.setZoom(16);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LoadScript
        googleMapsApiKey="AIzaSyCdIMvnFk7tRGWaBxE_AKBCg_I7PmC-roo"
        libraries={['places']}
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
        >
          {/* 搜索框 */}
          <View style={styles.header}>
            <Input
              containerStyle={styles.searchContainer}
              inputContainerStyle={[styles.inputContainer, { width: '100%' }]}
              leftIcon={{
                type: 'material',
                name: 'search',
                color: safeTheme.colors?.grey2 || '#999',
                containerStyle: { marginLeft: 8 }
              }}
              placeholder="搜索地点、地址"
              placeholderTextColor={safeTheme.colors?.grey2 || '#999'}
              inputStyle={styles.input}
              ref={autocompleteRef}
              renderErrorMessage={false}
            />
            <Button
              title="搜索"
              buttonStyle={styles.searchButton}
              titleStyle={styles.searchButtonText}
              onPress={handleSearch}
              containerStyle={styles.buttonContainer}
            />
          </View>

          {/* 路线服务 */}
          {destination && currentLocation && (
            <DirectionsService
              options={{
                destination: destination,
                origin: currentLocation,
                travelMode: google.maps.TravelMode.DRIVING
              }}
              callback={directionsCallback}
            />
          )}

          {/* 路线显示 */}
          {directions && <DirectionsRenderer directions={directions} />}

          {/* 当前位置标记 */}
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

          {/* 新增搜索结果标记 */}
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
        </GoogleMap>
      </LoadScript>

      {/* 定位按钮 */}
      <FAB
        icon={{ 
          name: 'my-location', 
          color: '#4285F4',
          size: 26,
          style: { marginTop: 2 }
        }}
        color="#fff"
        style={styles.fab}
        onPress={getCurrentLocation}
        size="large"
        animated={true}
      />
    </View>
  );
};

export default MapScreen;
