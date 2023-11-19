import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as math from 'mathjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Lấy lịch sử từ AsyncStorage khi ứng dụng khởi chạy
    getHistoryFromStorage();
  }, []);

  const evaluateExpression = () => {
    try {
      const evalResult = math.evaluate(expression);
      setResult(evalResult.toString());

      // Lưu trữ biểu thức và kết quả vào lịch sử và AsyncStorage
      const newHistory = [...history, { expression, result: evalResult }];
      setHistory(newHistory);
      saveHistoryToStorage(newHistory);
      setExpression('');
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  const getHistoryFromStorage = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history from storage:', error);
    }
  };

  const saveHistoryToStorage = async (newHistory) => {
    try {
      await AsyncStorage.setItem('history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history to storage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter expression"
        value={expression}
        onChangeText={(text) => setExpression(text)}
      />
      <Button title="Evaluate" onPress={evaluateExpression} />
      <Text>Result: {result}</Text>

      <Text>History:</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{`${item.expression} = ${item.result}`}</Text>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 60,
    padding: 5,
  },
});
