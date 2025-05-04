import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo } from '@/interfaces/general';
import { compressToBase64, decompressFromBase64 } from 'lz-string';

const MAGIC_MARKER = '$:';

interface UserInfoStore {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo) => void;
  getUserInfo: () => UserInfo | undefined;
}

// Custom storage with compression and base64 encoding
const compressedStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;

      // Check if it starts with our compression marker
      if (value.startsWith(MAGIC_MARKER)) {
        const compressedData = value.substring(MAGIC_MARKER.length);
        const decompressed = decompressFromBase64(compressedData);
        if (decompressed) {
          return JSON.parse(decompressed);
        }
      }

      // Check if the value might be from the old Zustand format
      if (value.startsWith('{') && value.includes('"state"')) {
        try {
          // This is likely a valid JSON in Zustand format
          return JSON.parse(value);
        } catch {
          // Invalid JSON, return null
          return null;
        }
      }

      // If we can't parse it as JSON, clear it and return null
      localStorage.removeItem(name);
      return null;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      // If all else fails, clean up and return null
      try {
        localStorage.removeItem(name);
      } catch {}
      return null;
    }
  },

  setItem: (name: string, value: any) => {
    try {
      // Add a marker so we know it's compressed
      const stringValue = JSON.stringify(value);
      const compressed = MAGIC_MARKER + compressToBase64(stringValue);
      localStorage.setItem(name, compressed);
    } catch (error) {
      console.error('Failed to compress data, storing uncompressed:', error);
      try {
        // Fallback to storing uncompressed
        localStorage.setItem(name, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to store data:', e);
      }
    }
  },

  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },
};

// Utility function to clear any corrupted storage
const clearCorruptedStorage = () => {
  try {
    const userInfoKey = 'userInfo';
    const value = localStorage.getItem(userInfoKey);
    if (value && !value.startsWith(MAGIC_MARKER) && !value.startsWith('{')) {
      localStorage.removeItem(userInfoKey);
      console.log('Cleared corrupted storage');
    }
  } catch {}
};

// Clear corrupted storage on init
if (typeof window !== 'undefined') {
  clearCorruptedStorage();
}

export const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set, get) => ({
      userInfo: undefined as UserInfo | undefined,
      setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
      getUserInfo: () => get().userInfo,
    }),
    {
      name: 'userInfo',
      storage: compressedStorage,
    }
  )
);
