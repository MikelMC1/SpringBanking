import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type TransactionFlowType = 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER' | 'LOAN_PAYMENT';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  AccountDetails: { accountId: number };
  TransactionForm: { type: TransactionFlowType; accountId?: number };
  CardDetails: { cardId: number };
  CardApplication: undefined;
  LoanPayment: { loanId: number; accountId: number };
};

export type TabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Activity: undefined;
  Cards: undefined;
  Loans: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
