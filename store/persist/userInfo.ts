import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { UserInfo } from '@/interfaces/general';

interface UserInfoStore {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo) => void;
  getUserInfo: () => UserInfo | undefined;
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
      storage: createJSONStorage(() => localStorage),
    }
  )
);
