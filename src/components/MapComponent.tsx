import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const SHANGHAI_REGION = {
  latitude: 31.2304,
  longitude: 121.4737,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapComponent() {
  return (
    <MapView
      style={styles.map}
      initialRegion={SHANGHAI_REGION}
      showsUserLocation
      showsMyLocationButton
      toolbarEnabled
    >
      <Marker
        coordinate={SHANGHAI_REGION}
        title="上海中心"
        description="中国上海市陆家嘴"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
}); 