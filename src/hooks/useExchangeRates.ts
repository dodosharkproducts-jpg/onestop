import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ExchangeRate {
  id: string;
  currency_code: string;
  currency_name: string;
  main_rate: number;
  buy_percentage: number;
  sell_percentage: number;
  updated_at: string;
  created_at: string;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();

    const subscription = supabase
      .channel('exchange_rates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exchange_rates',
        },
        () => {
          fetchRates();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchRates() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('currency_code', { ascending: true });

      if (fetchError) throw fetchError;
      setRates(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  }

  async function updateRate(
    currencyCode: string,
    updates: {
      main_rate?: number;
      buy_percentage?: number;
      sell_percentage?: number;
    }
  ) {
    try {
      const { error: updateError } = await supabase
        .from('exchange_rates')
        .update(updates)
        .eq('currency_code', currencyCode);

      if (updateError) throw updateError;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update rate',
      };
    }
  }

  return { rates, loading, error, updateRate, refetch: fetchRates };
}
