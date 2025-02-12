import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8
  },
  label: {
    color: '#666',
    fontSize: 14
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333'
  }
}); 