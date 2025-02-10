import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Card, Icon } from '@rneui/themed';
import MapView, { Polyline } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme/theme';
import RecordDetailScreenNative from './RecordDetailScreen.native';
import RecordDetailScreenWeb from './RecordDetailScreen.web';

type Props = {
  route: RouteProp<RootStackParamList, 'RecordDetail'>;
};

export default Platform.select({
  web: RecordDetailScreenWeb,
  default: RecordDetailScreenNative
});

// 样式定义和工具函数... 