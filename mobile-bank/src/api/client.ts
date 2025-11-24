import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.41:8080';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject({
      message,
      status: error.response?.status,
      details: error.response?.data,
    });
  },
);

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const endpoints = {
  users: '/api/v1',
  accounts: '/api/v2',
  loans: '/api/v3',
  transactions: '/api/v4',
  cards: '/api/v5',
};
