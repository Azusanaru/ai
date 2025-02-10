import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { ListItem, Text, Avatar, Icon, Card } from '@rneui/themed';
import MapView, { Polyline } from 'react-native-maps';
import { getRideRecords } from '../services/RecordStorage';
import { RideRecord } from '../types/RideRecord';
import { formatDuration, getWeatherIcon } from '../utils/format';
import { theme } from '../theme/theme';

export default function RecordScreen() {
  const [records, setRecords] = useState<RideRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RideRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await getRideRecords();
        setRecords(storedRecords.reverse());
        if (storedRecords.length > 0) {
          setSelectedRecord(storedRecords[0]);
        }
      } catch (error) {
        console.error('加载记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {records.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="bike"
                type="material-community"
                size={80}
                color={theme.colors.primary}
              />
              <Text style={styles.emptyText}>暂无骑行记录</Text>
              <Text style={styles.emptySubText}>开始骑行后记录将在此显示</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={records}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <ListItem
                    containerStyle={[
                      styles.listItem,
                      selectedRecord?.id === item.id && styles.selectedItem
                    ]}
                    onPress={() => setSelectedRecord(item)}
                  >
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
                      </View>
                    </ListItem.Content>
                    <Icon 
                      name={selectedRecord?.id === item.id ? "chevron-up" : "chevron-down"} 
                      type="material-community" 
                      color="#666" 
                    />
                  </ListItem>
                )}
              />

              {/* 详情面板 */}
              {selectedRecord && (
                <Card containerStyle={styles.detailCard}>
                  <View style={styles.detailHeader}>
                    <Text h4 style={styles.detailTitle}>骑行详情</Text>
                    <Icon
                      name="close"
                      size={24}
                      color="#666"
                      onPress={() => setSelectedRecord(null)}
                    />
                  </View>

                  {/* 地图展示 */}
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: selectedRecord.path[0]?.latitude || 0,
                        longitude: selectedRecord.path[0]?.longitude || 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    >
                      <Polyline
                        coordinates={selectedRecord.path}
                        strokeColor={theme.colors.primary}
                        strokeWidth={4}
                      />
                    </MapView>
                  </View>

                  {/* 数据统计 */}
                  <View style={styles.dataGrid}>
                    <View style={styles.dataItem}>
                      <Icon name="clock" type="material-community" size={20} color="#666" />
                      <Text style={styles.dataLabel}>骑行时长</Text>
                      <Text style={styles.dataValue}>{formatDuration(selectedRecord.duration)}</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Icon name="map-marker-distance" type="material-community" size={20} color="#666" />
                      <Text style={styles.dataLabel}>总距离</Text>
                      <Text style={styles.dataValue}>{selectedRecord.distance.toFixed(2)} km</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Icon name="speedometer" type="material-community" size={20} color="#666" />
                      <Text style={styles.dataLabel}>最高速度</Text>
                      <Text style={styles.dataValue}>{selectedRecord.maxSpeed.toFixed(1)} km/h</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Icon name="thermometer" type="material-community" size={20} color="#666" />
                      <Text style={styles.dataLabel}>平均温度</Text>
                      <Text style={styles.dataValue}>{selectedRecord.weather.temp}°C</Text>
                    </View>
                  </View>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  listContainer: {
    paddingBottom: 20
  },
  listItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  selectedItem: {
    borderColor: theme.colors.primary,
    borderWidth: 1
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
    fontSize: 14,
    color: '#333'
  },
  duration: {
    fontSize: 14,
    color: '#666'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666'
  },
  detailCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  detailTitle: {
    color: theme.colors.primary,
    fontWeight: '600'
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  dataItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  dataLabel: {
    color: '#666',
    marginTop: 8,
    fontSize: 12
  },
  dataValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginTop: 16
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8
  }
}); 