import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  hideBalances: boolean;
  setHideBalances: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hideBalances: true, // Default to hidden
      setHideBalances: (value) => set({ hideBalances: value }),
    }),
    {
      name: 'mobile-bank-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

