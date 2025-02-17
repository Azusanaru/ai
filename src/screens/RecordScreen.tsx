import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import { List } from 'react-native-paper';
import { getRideRecords, deleteRideRecord } from '../services/RecordStorage';
import { RideRecord } from '../types/RideRecord';
import { formatDuration, getWeatherIcon } from '../utils/format';
import { theme } from '../theme/theme';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native';
import { Card } from 'react-native-paper';

export default function RecordScreen() {
  const [records, setRecords] = useState<RideRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<RideRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const storedRecords = await getRideRecords();
        const validRecords = storedRecords.filter(record => 
          record.distance !== null &&
          record.maxSpeed !== null &&
          record.weather?.temp !== null
        );
        
        setRecords(validRecords.reverse());
        setSelectedRecord(validRecords[0] || null);
      } catch (error) {
        console.error('加载记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      loadRecords();
    }
  }, [isFocused]);

  const handleDelete = useCallback(() => {
    if (!selectedRecord) {
      Alert.alert('错误', '未选择有效记录');
      return;
    }

    Alert.alert(
      '删除记录',
      `确定要删除 ${new Date(selectedRecord.date).toLocaleDateString()} 的记录吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              const success = await deleteRideRecord(selectedRecord.id);
              if (success) {
                // 更新记录列表
                setRecords(prev => prev.filter(r => r.id !== selectedRecord.id));
                // 关闭详情面板
                setSelectedRecord(null);
                // 显示成功提示
                Alert.alert('成功', '记录已删除');
              }
            } catch (error) {
              Alert.alert('错误', '删除失败，请重试');
            }
          }
        }
      ]
    );
  }, [selectedRecord?.id]);

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
            <FlatList
              data={records}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.description}
                  left={props => <List.Icon {...props} icon="bike" />}
                  right={props => <Text>{item.value}</Text>}
                />
              )}
            />
          )}

          {/* 详情面板 */}
          {selectedRecord && (
            <Card style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Card.Title title="骑行详情" />
                <View style={styles.headerButtons}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.iconButton,
                      pressed && { opacity: 0.6 }
                    ]}
                    onPress={handleDelete}
                  >
                    <Icon
                      name="delete"
                      size={24}
                      color="#ff4444"
                    />
                  </Pressable>
                  <Icon
                    name="close"
                    size={24}
                    color="#666"
                    onPress={() => setSelectedRecord(null)}
                  />
                </View>
              </View>

              {/* 地图展示 */}
            

              {/* 数据统计 */}
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Icon name="clock" type="material-community" size={20} color="#666" />
                  <Text style={styles.dataLabel}>骑行时长</Text>
                  <Text style={styles.dataValue}>
                    {selectedRecord?.duration ? formatDuration(selectedRecord.duration) : '--'}
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Icon name="map-marker-distance" type="material-community" size={20} color="#666" />
                  <Text style={styles.dataLabel}>总距离</Text>
                  <Text style={styles.dataValue}>
                    {selectedRecord?.distance?.toFixed(2) ?? '--'} km
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Icon name="speedometer" type="material-community" size={20} color="#666" />
                  <Text style={styles.dataLabel}>最高速度</Text>
                  <Text style={styles.dataValue}>
                    {selectedRecord?.maxSpeed?.toFixed(1) ?? '--'} km/h
                  </Text>
                </View>
                <View style={styles.dataItem}>
                  <Icon name="thermometer" type="material-community" size={20} color="#666" />
                  <Text style={styles.dataLabel}>平均温度</Text>
                  <Text style={styles.dataValue}>
                    {selectedRecord?.weather?.temp ?? '--'}°C
                  </Text>
                </View>
              </View>
            </Card>
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
    margin: 16
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8
  },
  detailTitle: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 18
  },
  mapContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16
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
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffeeee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
}); 