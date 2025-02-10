import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from '@rneui/themed';

export default function ChatScreen() {
  return (
    <View>
      <Text>聊天界面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10
  },
  messageList: {
    padding: 15
  },
  myBubble: {
    backgroundColor: '#2196F3',
    marginLeft: 60,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15
  },
  otherBubble: {
    backgroundColor: '#e0e0e0',
    marginRight: 60,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15
  }
});

const MessageInput = () => (
  <Input
    placeholder="输入消息..."
    containerStyle={styles.inputContainer}
    inputContainerStyle={styles.input}
    rightIcon={
      <Button
        icon={{ name: 'send', color: 'white' }}
        buttonStyle={styles.sendButton}
        type="clear"
      />
    }
  />
); 