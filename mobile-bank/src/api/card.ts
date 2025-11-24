import { apiClient, endpoints } from './client';
import { Card } from '../types';

export const fetchCardsByAccount = async (accountId: number) => {
  try {
    const url = `${endpoints.cards}/card/account/${accountId}`;
    console.log('Fetching cards from:', url);
    const { data } = await apiClient.get<Card[]>(url);
    console.log('Cards fetched:', data);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchCardsByAccount:', error);
    throw error;
  }
};

export const applyForCard = async (payload: Partial<Card> & { accountId: number; fullName: string }) => {
  return apiClient.post(`${endpoints.cards}/Card`, payload);
};

export const freezeCard = async (cardId: number): Promise<Card> => {
  try {
    const { data } = await apiClient.patch<Card>(`${endpoints.cards}/card/${cardId}/freeze`);
    return data;
  } catch (error: any) {
    console.error('Error freezing card:', error);
    throw error;
  }
};

export const blockCard = async (cardId: number): Promise<Card> => {
  try {
    const { data } = await apiClient.patch<Card>(`${endpoints.cards}/card/${cardId}/block`);
    return data;
  } catch (error: any) {
    console.error('Error blocking card:', error);
    throw error;
  }
};

export const reportCardLost = async (cardId: number): Promise<Card> => {
  try {
    const { data } = await apiClient.patch<Card>(`${endpoints.cards}/card/${cardId}/report-lost`);
    return data;
  } catch (error: any) {
    console.error('Error reporting card lost:', error);
    throw error;
  }
};

export const reportCardStolen = async (cardId: number): Promise<Card> => {
  try {
    const { data } = await apiClient.patch<Card>(`${endpoints.cards}/card/${cardId}/report-stolen`);
    return data;
  } catch (error: any) {
    console.error('Error reporting card stolen:', error);
    throw error;
  }
};
