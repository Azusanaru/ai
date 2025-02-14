import React, { useState, useEffect, FC, useRef } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, View} from 'react-native';
import { Icon } from '@rneui/themed';
import { Overlay } from '@rneui/themed';
import { theme } from '../theme/theme';
import { GoogleNavigation } from '../services/NavigationService';
import { Button } from '@rneui/themed';
import useMaps from '../hooks/useMaps';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type MapScreenType = FC;

const MapScreen: MapScreenType = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 31.2304,    // 上海纬度
    longitude: 121.4737,  // 上海经度
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [polylineCoords, setPolylineCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const navigationService = useRef(new GoogleNavigation());
  const { isLoaded } = useMaps();

  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription;

    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      
      // 初始化导航服务
      if (isLoaded) {
        await navigationService.current.planRoute(
          { lat: 31.2304, lng: 121.4737 },
          { lat: 31.2222, lng: 121.4812 },
          {
            maxSlope: 0.1,
            preferredDistance: 5000,
            historicalRoutes: []
          }
        );
      }

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        (location) => {
          if (isMounted) {
            setPolylineCoords(prev => [...prev, {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }]);
          }
        }
      );
    };

    init();
    
    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [isLoaded]);

  return (
    <View style={styles.container}>
      <NavigationMap path={polylineCoords.map(coord => ({ lat: coord.latitude, lng: coord.longitude }))} />
      <MapControls />
      <Button
        title="开始导航"
        containerStyle={styles.navButton}
        onPress={() => {/* 导航逻辑 */}}
      />
    </View>
  );
};

const MapControls = () => (
  <Overlay isVisible={true} overlayStyle={styles.controlsOverlay}>
    <Icon
      name="my-location"
      type="material"
      color={theme.colors?.primary || '#007AFF'}
      containerStyle={styles.controlIcon}
    />
    <Icon
      name="layers"
      type="material"
      color={theme.colors?.primary || '#007AFF'}
      containerStyle={styles.controlIcon}
    />
  </Overlay>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  controlIcon: {
    margin: 10
  },
  navButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '80%'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});

export default MapScreen; 