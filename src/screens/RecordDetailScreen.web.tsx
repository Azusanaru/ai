import React from 'react';
import { View, Text } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export default function RecordDetailScreenWeb({ route }: { route: RouteProp<RootStackParamList, 'RecordDetail'> }) {
  const { record } = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.webWarning}>地图功能在网页端暂不可用</Text>
        {/* 显示其他数据 */}
      </Card>
    </View>
  );
}

const styles = {
  container: { padding: 20 },
  webWarning: { color: '#f00', textAlign: 'center' }
}; 