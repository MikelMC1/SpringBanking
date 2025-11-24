import { apiClient, endpoints } from './client';
import { Account, LoginResponse, UserProfile } from '../types';

export const getUserProfile = async (email: string): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>(`${endpoints.users}/profile`, {
    params: { email }, // send email as query parameter
  });
  return data;
};

export const getAccountsByEmail = async (email: string): Promise<Account[]> => {
  try {
    const { data } = await apiClient.get<Account[]>(
      `${endpoints.accounts}/account/by-email`,
      {
        params: { email },
      }
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch accounts for email ${email}`, error);
    throw error;
  }
};





export const loginWithEmail = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(`${endpoints.users}/auth/login`, { email, password });
  console.log('Login response:', data); // Debug API response
  return data;
};

export const registerUser = async (fullName: string, email: string, password: string): Promise<void> => {
  await apiClient.post(`${endpoints.users}/user`, { fullName, email, password });
};


