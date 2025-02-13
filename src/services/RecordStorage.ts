import AsyncStorage from '@react-native-async-storage/async-storage';
import { RideRecord } from '../types/RideRecord';

const STORAGE_KEY = '@rideRecords';

export const saveRideRecord = async (record: RideRecord) => {
  try {
    const existingRecords = await getRideRecords();
    const newRecords = [...existingRecords, record];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  } catch (error) {
    console.error('保存骑行记录失败:', error);
  }
};

export const getRideRecords = async (): Promise<RideRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('读取骑行记录失败:', error);
    return [];
  }
};

export const clearRideRecords = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

export const deleteRideRecord = async (id: string): Promise<boolean> => {
  try {
    const records = await getRideRecords();
    const updatedRecords = records.filter(record => record.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    return true;
  } catch (error) {
    console.error('删除记录失败:', error);
    return false;
  }
}; 