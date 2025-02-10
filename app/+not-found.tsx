import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>404</Text>
      <Text h4 style={styles.subtitle}>您访问的页面不存在</Text>
      <Button
        title="返回首页"
        onPress={() => router.replace('/(tabs)')}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  title: {
    color: '#dc3545',
    marginBottom: 10,
    fontSize: 48,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#6c757d',
    marginBottom: 30,
    fontSize: 20
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 15,
    width: 200
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  buttonContainer: {
    marginTop: 20
  }
});
