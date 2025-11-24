import { apiClient, endpoints } from './client';
import { Loan } from '../types';

export const fetchLoansByAccount = async (accountId: number) => {
  try {
    const url = `${endpoints.loans}/loan/account/${accountId}`;
    console.log('Fetching loans from:', url);
    const { data } = await apiClient.get<Loan[]>(url);
    console.log('Loans fetched:', data);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchLoansByAccount:', error);
    throw error;
  }
};

export const getLoanById = async (loanId: number) => {
  const { data } = await apiClient.get<Loan>(`${endpoints.loans}/loan/${loanId}`);
  return data;
};

export const createLoan = async (payload: Partial<Loan>) => {
  const { data } = await apiClient.post<Loan>(`${endpoints.loans}/loan`, payload);
  return data;
};
