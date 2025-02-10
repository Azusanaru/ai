import React, { useState, useEffect, FC } from 'react';
import { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE,  } from 'react-native-maps';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { Icon } from '@expo/vector-icons';
import { Overlay } from '@rneui/themed';
import { theme } from '../theme/theme';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type MapScreenType = FC;

let MapScreen: MapScreenType;

if (Platform.OS === 'web') {
  MapScreen = require('./MapScreen.web').default;
} else {
  MapScreen = require('./MapScreen.native').default;
}

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 31.2304,    // 上海纬度
    longitude: 121.4737,  // 上海经度
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [polylineCoords, setPolylineCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription;

    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      
      // ...其他逻辑...
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
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region} showsUserLocation>
        <Polyline
          coordinates={polylineCoords}
          strokeColor="#2196F3"
          strokeWidth={6}
        />
      </MapView>
      <MapControls />
    </View>
  );
};

const MapControls = () => (
  <Overlay isVisible={true} overlayStyle={styles.controlsOverlay}>
    <Icon
      name="my-location"
      type="material"
      color={theme.colors.primary}
      containerStyle={styles.controlIcon}
    />
    <Icon
      name="layers"
      type="material"
      color={theme.colors.primary}
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
  }
});

export default MapScreen; 