import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJson<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
