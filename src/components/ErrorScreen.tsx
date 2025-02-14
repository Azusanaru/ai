import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';

export default function ErrorScreen({ error }: { error: Error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>地图加载失败</Text>
      <Text style={styles.errorText}>{error.message}</Text>
      <Button
        title="返回首页"
        onPress={() => router.replace('/(tabs)')}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    color: '#ff4444',
    marginBottom: 10
  },
  errorText: {
    color: '#666',
    marginBottom: 20
  },
  button: {
    width: 200
  }
}); 