import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Platform-aware secure storage
 * Uses SecureStore on native platforms and localStorage on web
 */
class Storage {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage.getItem error:', error);
        return null;
      }
    }
    
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore.getItemAsync error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('localStorage.setItem error:', error);
      }
      return;
    }
    
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore.setItemAsync error:', error);
    }
  }

  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('localStorage.removeItem error:', error);
      }
      return;
    }
    
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore.deleteItemAsync error:', error);
    }
  }
}

export const storage = new Storage();
