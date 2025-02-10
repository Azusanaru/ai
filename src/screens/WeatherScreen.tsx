import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ListItem, Avatar } from '@rneui/themed';

const WeatherDetailItem = ({ icon, title, value }) => (
  <ListItem bottomDivider>
    <Avatar icon={{ name: icon, type: 'material-community' }} />
    <ListItem.Content>
      <ListItem.Title>{title}</ListItem.Title>
      <ListItem.Subtitle>{value}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
);

export default function WeatherScreen() {
  return (
    <View style={styles.container}>
      <Card containerStyle={styles.weatherCard}>
        <Text style={styles.title}>天气信息界面</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8'
  },
  weatherCard: {
    borderRadius: 20,
    padding: 20
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  }
}); 