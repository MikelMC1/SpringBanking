import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList, TabParamList } from './types';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AccountsScreen from '../screens/Accounts/AccountsScreen';
import AccountDetailsScreen from '../screens/Accounts/AccountDetailsScreen';
import TransactionHistoryScreen from '../screens/Transactions/TransactionHistoryScreen';
import TransactionFormScreen from '../screens/Transactions/TransactionFormScreen';
import CardsScreen from '../screens/Cards/CardsScreen';
import CardDetailScreen from '../screens/Cards/CardDetailScreen';
import CardApplicationScreen from '../screens/Cards/CardApplicationScreen';
import LoansScreen from '../screens/Loans/LoansScreen';
import LoanPaymentScreen from '../screens/Loans/LoanPaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface, 
          borderTopColor: theme.colors.border,
          ...(Platform.OS === 'ios' && {
            borderTopWidth: 0.5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }),
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: focused ? 'speedometer' : 'speedometer-outline',
            Profile: focused ? 'person' : 'person-outline',
            Activity: focused ? 'swap-vertical' : 'swap-vertical-outline',
            Cards: focused ? 'card' : 'card-outline',
            Loans: focused ? 'trending-up' : 'trending-up-outline',
          };
          const icon = iconMap[route.name] ?? 'ellipse-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        ...(Platform.OS === 'ios' && {
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={AccountsScreen} />
      <Tab.Screen name="Activity" component={TransactionHistoryScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Loans" component={LoansScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        ...(Platform.OS === 'ios' && {
          animation: 'default',
          animationDuration: 300,
        }),
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
          <Stack.Screen name="TransactionForm" component={TransactionFormScreen} />
          <Stack.Screen name="CardDetails" component={CardDetailScreen} />
          <Stack.Screen name="CardApplication" component={CardApplicationScreen} />
          <Stack.Screen name="LoanPayment" component={LoanPaymentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
