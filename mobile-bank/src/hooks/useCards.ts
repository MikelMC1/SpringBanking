import { useCallback, useEffect, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { fetchCardsByAccount } from '../api/card';
import { useBankStore } from '../store/useBankStore';

export const useCards = (accountId?: number) => {
  const { cards, setCards, loading, setLoading } = useBankStore();

  const loadCards = useCallback(async () => {
    if (!accountId) {
      console.log('useCards: No accountId provided, clearing cards');
      setCards([]);
      return;
    }
    try {
      console.log('useCards: Loading cards for accountId:', accountId);
      setLoading('cards', true);
      const response = await fetchCardsByAccount(accountId);
      // Filter cards by accountId in case API returns cards from multiple accounts
      const filteredResponse = Array.isArray(response) 
        ? response.filter((card) => card.accountId === accountId)
        : [];
      console.log('useCards: Setting cards:', filteredResponse);
      setCards(filteredResponse);
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      Toast.show({ 
        type: 'error', 
        text1: 'Unable to fetch cards', 
        text2: error.message || 'Please try again later' 
      });
      setCards([]);
    } finally {
      setLoading('cards', false);
    }
  }, [accountId, setCards, setLoading]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const filteredCards = useMemo(() => {
    if (!accountId) return [];
    return cards.filter((card) => card.accountId === accountId);
  }, [accountId, cards]);

  return { cards: filteredCards, loading: loading.cards, refresh: loadCards };
};
