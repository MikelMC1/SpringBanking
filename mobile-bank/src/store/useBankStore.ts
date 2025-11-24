import { create } from 'zustand';
import { Account, Card, Loan, Transaction } from '../types';

interface BankState {
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  selectedAccountId?: number;
  loading: Record<'accounts' | 'transactions' | 'cards' | 'loans', boolean>;
  setAccounts: (accounts: Account[]) => void;
  updateAccount: (account: Account) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setCards: (cards: Card[]) => void;
  updateCard: (card: Card) => void;
  setLoans: (loans: Loan[]) => void;
  setLoading: (key: keyof BankState['loading'], value: boolean) => void;
  setSelectedAccount: (accountId?: number) => void;
  clearAll: () => void;
}

export const useBankStore = create<BankState>((set) => ({
  accounts: [],
  transactions: [],
  cards: [],
  loans: [],
  selectedAccountId: undefined,
  loading: { accounts: false, transactions: false, cards: false, loans: false },
  setAccounts: (accounts) => set({ accounts }),
  updateAccount: (account) =>
    set((state) => ({
      accounts: state.accounts.map((item) => (item.accountId === account.accountId ? { ...item, ...account } : item)),
    })),
  setTransactions: (transactions) => set({ transactions }),
  setCards: (cards) => set({ cards }),
  updateCard: (card) =>
    set((state) => ({
      cards: state.cards.map((item) => (item.cardId === card.cardId ? { ...item, ...card } : item)),
    })),
  setLoans: (loans) => set({ loans }),
  setLoading: (key, value) => set((state) => ({ loading: { ...state.loading, [key]: value } })),
  setSelectedAccount: (selectedAccountId) => set({ selectedAccountId }),
  clearAll: () => set({ 
    accounts: [], 
    transactions: [], 
    cards: [], 
    loans: [], 
    selectedAccountId: undefined 
  }),
}));
