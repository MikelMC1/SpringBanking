import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  email: string;
  token?: string;
  fullName?: string;
  isAuthenticated: boolean;
  setSession: (payload: { email: string; token?: string; fullName?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: '',
      token: undefined,
      fullName: undefined,
      isAuthenticated: false,
      setSession: ({ email, token, fullName }) =>
        set({ email, token, fullName, isAuthenticated: true }),
      logout: () => set({ email: '', token: undefined, fullName: undefined, isAuthenticated: false }),
    }),
    {
      name: 'mobile-bank-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ email: state.email, token: state.token, fullName: state.fullName }),
    },
  ),
);
