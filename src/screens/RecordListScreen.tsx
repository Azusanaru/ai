import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ListItem, Text, Avatar, Icon } from '@rneui/themed';
import { getRideRecords } from '../services/RecordStorage';
import { RideRecord } from '../types/RideRecord';
import { useNavigation } from '@react-navigation/native';

export default function RecordListScreen() {
  const [records, setRecords] = useState<RideRecord[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRecords = async () => {
      const storedRecords = await getRideRecords();
      setRecords(storedRecords.reverse());
    };
    loadRecords();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider onPress={() => navigation.navigate('RecordDetail', { record: item })}>
            <Avatar
              source={{ uri: `https://openweathermap.org/img/wn/${getWeatherIcon(item.weather.condition)}.png` }}
              size="medium"
              containerStyle={styles.weatherIcon}
            />
            <ListItem.Content>
              <View style={styles.listHeader}>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Icon name="map-marker-distance" type="material-community" size={16} color="#666" />
                  <Text style={styles.statText}>{item.distance.toFixed(2)} km</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="speedometer" type="material-community" size={16} color="#666" />
                  <Text style={styles.statText}>{item.avgSpeed.toFixed(1)} km/h</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="thermometer" type="material-community" size={16} color="#666" />
                  <Text style={styles.statText}>{item.weather.temp}°C</Text>
                </View>
              </View>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontWeight: '500',
    fontSize: 16
  },
  weatherIcon: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    fontWeight: '500',
    fontSize: 14
  },
  duration: {
    fontSize: 14
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    marginLeft: 5,
    fontSize: 14
  }
}); 