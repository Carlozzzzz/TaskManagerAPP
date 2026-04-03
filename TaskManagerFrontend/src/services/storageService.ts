// src/services/storageService.ts
import { Preferences } from '@capacitor/preferences';

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    // Use Capacitor on mobile, localStorage on web
    if (this.isCapacitorAvailable()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (this.isCapacitorAvailable()) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.isCapacitorAvailable()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  async clear(): Promise<void> {
    if (this.isCapacitorAvailable()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  }

  private isCapacitorAvailable(): boolean {
    return typeof (window as any).Capacitor !== 'undefined';
  }
}

export const storageService = new StorageService();
