import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { getRideRecords } from '../services/RecordStorage';
import { RideRecord } from '../types/RideRecord';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Text, Avatar, Icon, List } from 'react-native-paper';
import { getWeatherIcon } from '../types/weather';

export default function RecordListScreen() {
  const [records, setRecords] = useState<RideRecord[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
          <List.Item
            title={new Date(item.date).toLocaleDateString()}
            description={`距离: ${item.distance.toFixed(2)}km | 均速: ${item.avgSpeed.toFixed(1)}km/h`}
            left={props => (
              <Avatar.Image
                source={{ uri: getWeatherIcon(item.weather.condition) }}
                size={36}
                style={styles.weatherIcon}
              />
            )}
            right={props => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('RecordDetail', { record: item })}
            style={styles.listItem}
          />
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
  },
  listItem: {
    backgroundColor: '#fff',
    marginVertical: 4,
    paddingVertical: 12
  }
}); 