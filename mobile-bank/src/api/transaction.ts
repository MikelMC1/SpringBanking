import { apiClient, endpoints } from './client';
import { Transaction } from '../types';

export interface TransactionPayload {
  accountId: number;
  amount: number;
  transactionMethod?: string;
  account2Id?: number | null;
  loanId?: number | null;
  cardId?: number | null;
}

// Fetch transactions, optionally by account
export const fetchTransactions = async (accountId?: number): Promise<Transaction[]> => {
  try {
    const url = accountId
      ? `${endpoints.transactions}/transaction/account/${accountId}`
      : `${endpoints.transactions}/transaction`;
    const { data } = await apiClient.get<Transaction[]>(url);
    return data;
  } catch (error: any) {
    console.error(`Failed to fetch transactions${accountId ? ` for account ${accountId}` : ''}`, error.response?.data || error.message);
    throw error;
  }
};

// Withdraw money
export const withdraw = async (payload: TransactionPayload): Promise<void> => {
  try {
    const body: any = {
      accountId: payload.accountId,
      amount: payload.amount,
    };
    if (payload.transactionMethod) {
      body.transactionMethod = payload.transactionMethod;
    }
    if (payload.account2Id) {
      body.account2Id = payload.account2Id;
    }
    if (payload.cardId) {
      body.cardId = payload.cardId;
    }
    const response = await apiClient.patch(`${endpoints.transactions}/transaction/withdraw`, body);
    console.log('Withdraw response:', response.data);
  } catch (error: any) {
    console.error(`Failed to withdraw from account ${payload.accountId}`, error.response?.data || error.message);
    throw error;
  }
};

// Deposit money
export const deposit = async (payload: TransactionPayload): Promise<void> => {
  try {
    const body: any = {
      accountId: payload.accountId,
      amount: payload.amount,
    };
    if (payload.transactionMethod) {
      body.transactionMethod = payload.transactionMethod;
    }
    const response = await apiClient.patch(`${endpoints.transactions}/transaction/deposit`, body);
    console.log('Deposit response:', response.data);
  } catch (error: any) {
    console.error(`Failed to deposit to account ${payload.accountId}`, error.response?.data || error.message);
    throw error;
  }
};

// Transfer money
export const transfer = async (payload: TransactionPayload & { account2Id: number }): Promise<void> => {
  try {
    const body: any = {
      accountId: payload.accountId,
      account2Id: payload.account2Id,
      amount: payload.amount,
    };
    if (payload.transactionMethod) {
      body.transactionMethod = payload.transactionMethod;
    }
    if (payload.cardId) {
      body.cardId = payload.cardId;
    }
    const response = await apiClient.patch(`${endpoints.transactions}/transaction/transfer`, body);
    console.log('Transfer response:', response.data);
  } catch (error: any) {
    console.error(`Failed to transfer from account ${payload.accountId} to ${payload.account2Id}`, error.response?.data || error.message);
    throw error;
  }
};

// Pay loan
export const payLoan = async (payload: TransactionPayload & { loanId: number }): Promise<void> => {
  try {
    const body: any = {
      accountId: payload.accountId,
      loanId: payload.loanId,
      amount: payload.amount,
    };
    if (payload.transactionMethod) {
      body.transactionMethod = payload.transactionMethod;
    }
    if (payload.cardId) {
      body.cardId = payload.cardId;
    }
    const response = await apiClient.patch(`${endpoints.transactions}/transaction/payment/loan`, body);
    console.log('Loan payment response:', response.data);
  } catch (error: any) {
    console.error(`Failed to pay loan ${payload.loanId} from account ${payload.accountId}`, error.response?.data || error.message);
    throw error;
  }
};
