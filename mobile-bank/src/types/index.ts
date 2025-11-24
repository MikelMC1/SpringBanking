export type AccountType = 'SAVINGS' | 'CHECKING' | 'SALARY' | 'DEPOSIT';
export type CardType = 'DEBIT' | 'CREDIT' | 'PRE_PAID';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED' | 'LOST' | 'STOLEN';
export type TransactionType = 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER' | 'LOAN_PAYMENT' | 'PAYMENT' | 'CHARGEBACK';
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'FAILED' | 'REJECTED' | 'REFUNDED';
export type TransactionMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'MOBILE_PAYMENT'
  | 'ONLINE_PAYMENT'
  | 'ATM';
export type LoanStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'PAID_OFF' | 'DEFAULTED';

export interface Transaction {
  transactionId: number;
  accountId: number;
  account2Id?: number | null;
  loanId?: number | null;
  amount: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionMethod?: TransactionMethod | null;
  cardId?: number | null;
  creationDate?: string;
}

export interface Card {
  cardId: number;
  accountId: number;
  fullName: string;
  cardType: CardType;
  expMonth: number;
  expYear: number;
  maskedNumber?: string;
  cardNumber?: string;
  cvv?: string | number;
  status?: CardStatus;
}

export interface Loan {
  loanId: number;
  accountId: number;
  loanAmount: number;
  remainingAmount: number;
  interestRate: number;
  termYears?: number;
  nextPaymentDate?: string;
  status?: LoanStatus;
}

export interface Account {
  accountId: number;
  balance: number;
  accountType?: AccountType;
  lastUpdate?: string;
  cards?: Card[];
  transactions?: Transaction[];
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  accounts: Account[];
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    fullName: string;
    id: number;
    accounts: Account[];
  };
}
  


export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}
