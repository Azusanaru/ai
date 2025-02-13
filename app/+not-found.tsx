import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>404</Text>
      <Text style={styles.h4}>您访问的页面不存在</Text>
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
  h1: { fontSize: 24, fontWeight: 'bold' },
  h4: { fontSize: 16 },
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
