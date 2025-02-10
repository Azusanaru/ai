import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import * as Location from 'expo-location';

export default function SpeedometerScreen() {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  let subscription: Location.LocationSubscription;

  useEffect(() => {
    let lastPosition: Location.LocationObject | null = null;
    
    const calculateDistance = (prev: Location.LocationObject, current: Location.LocationObject) => {
      const R = 6371e3;
      const φ1 = prev.coords.latitude * Math.PI/180;
      const φ2 = current.coords.latitude * Math.PI/180;
      const Δφ = (current.coords.latitude - prev.coords.latitude) * Math.PI/180;
      const Δλ = (current.coords.longitude - prev.coords.longitude) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      return R * c;
    };

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        (location: Location.LocationObject) => {
          const newSpeed = location.coords.speed ? location.coords.speed * 3.6 : 0;
          setSpeed(Math.round(newSpeed * 10) / 10);

          if (lastPosition) {
            const meters = calculateDistance(lastPosition, location);
            setDistance(prev => prev + meters / 1000);
          }
          lastPosition = location;
        }
      );
    })();

    return () => subscription?.remove();
  }, []);

  return (
    <Card>
      <Card.Title style={styles.cardTitle}>骑行数据</Card.Title>
      <Text h1 style={styles.speedText}>
        {speed.toFixed(1)}
      </Text>
      <Text style={styles.unitText}>km/h</Text>
      
      <Button
        title="开始记录"
        icon={{
          name: 'play-circle-outline',
          type: 'material-community',
          color: 'white',
        }}
        buttonStyle={styles.startButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  mainCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center'
  },
  speedText: {
    fontSize: 64,
    fontWeight: '300',
    color: '#2196F3',
    marginVertical: 10
  },
  metricLabel: {
    fontSize: 18,
    color: '#666'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%'
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333'
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  unitText: {
    fontSize: 18,
    color: '#666'
  },
  startButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 15,
    marginTop: 20
  }
}); 