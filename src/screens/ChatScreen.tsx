import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '今天天气不错，适合骑行！', isMe: true, time: '10:30' },
    { id: 2, text: '是的，风速也很合适', isMe: false, time: '10:31' },
    { id: 3, text: '下午3点老地方见', isMe: false, time: '10:32' },
    { id: 4, text: '没问题，带好装备', isMe: true, time: '10:33' },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: message, isMe: true, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 聊天列表 */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View>
            {/* 时间分隔线 */}
            {(index === 0 || messages[index-1].time !== item.time) && (
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            )}

            {/* 消息气泡 */}
            <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
              {!item.isMe && (
                <Avatar.Image
                  size={36}
                  source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.avatar}
                />
              )}
              <View>
                <Text style={item.isMe ? styles.myText : styles.otherText}>
                  {item.text}
                </Text>
                <Text style={styles.timeStamp}>
                  {item.time}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.plusButton}>
          <Ionicons name="add-circle" size={32} color={'#007AFF'} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="输入消息..."
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
        >
          <MaterialIcons 
            name={message ? "send" : "tag-faces"} 
            size={28} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  listContent: {
    paddingVertical: 16
  },
  timeContainer: {
    alignSelf: 'center',
    backgroundColor: '#d8d8d8',
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  timeText: {
    color: '#666',
    fontSize: 12
  },
  bubble: {
    maxWidth: '80%',
    minHeight: 40,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8
  },
  myBubble: {
    backgroundColor: '#9eea6a',
    borderTopRightRadius: 2
  },
  otherBubble: {
    backgroundColor: 'white',
    borderTopLeftRadius: 2,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  avatar: {
    marginRight: 8
  },
  myText: {
    color: '#000',
    fontSize: 16
  },
  otherText: {
    color: '#333',
    fontSize: 16
  },
  timeStamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd'
  },
  plusButton: {
    marginHorizontal: 4
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16
  },
  sendButton: {
    marginHorizontal: 4,
    padding: 4
  }
}); 