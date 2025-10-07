import { useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, formatCurrency, formatDateTime } from '../utils/currencyCalculations';

interface AdminViewProps {
  rates: ExchangeRate[];
  onUpdateRate: (
    currencyCode: string,
    updates: {
      main_rate?: number;
      buy_percentage?: number;
      sell_percentage?: number;
    }
  ) => Promise<{ success: boolean; error?: string }>;
}

export function AdminView({ rates, onUpdateRate }: AdminViewProps) {
  const [editingRates, setEditingRates] = useState<Record<string, Partial<ExchangeRate>>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const handleInputChange = (currencyCode: string, field: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return;

    setEditingRates((prev) => ({
      ...prev,
      [currencyCode]: {
        ...prev[currencyCode],
        [field]: numValue,
      },
    }));
  };

  const getCurrentValue = (rate: ExchangeRate, field: keyof ExchangeRate): number => {
    return (editingRates[rate.currency_code]?.[field] as number) ?? (rate[field] as number);
  };

  const handleSave = async (currencyCode: string) => {
    const updates = editingRates[currencyCode];
    if (!updates) return;

    const result = await onUpdateRate(currencyCode, updates);

    if (result.success) {
      setSaveStatus((prev) => ({ ...prev, [currencyCode]: 'success' }));
      setEditingRates((prev) => {
        const newState = { ...prev };
        delete newState[currencyCode];
        return newState;
      });
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [currencyCode]: null }));
      }, 3000);
    } else {
      setSaveStatus((prev) => ({ ...prev, [currencyCode]: 'error' }));
      setErrorMessages((prev) => ({
        ...prev,
        [currencyCode]: result.error || 'Failed to update',
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-osl-navy-800 to-osl-navy-700 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-osl-navy-200">Manage exchange rates and margins</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {rates.map((rate) => {
          const mainRate = getCurrentValue(rate, 'main_rate');
          const buyPercentage = getCurrentValue(rate, 'buy_percentage');
          const sellPercentage = getCurrentValue(rate, 'sell_percentage');
          const { buyRate, sellRate } = calculateRates(mainRate, buyPercentage, sellPercentage);
          const hasChanges = !!editingRates[rate.currency_code];

          return (
            <div
              key={rate.id}
              className="bg-white rounded-lg shadow-md border-2 border-osl-navy-100 overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-osl-navy-700 to-osl-navy-600 p-4">
                <h3 className="text-xl font-bold text-white">{rate.currency_code}</h3>
                <p className="text-osl-navy-100 text-sm">{rate.currency_name}</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Rate (USD = 1)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={mainRate}
                    onChange={(e) => handleInputChange(rate.currency_code, 'main_rate', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Buy %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={buyPercentage}
                      onChange={(e) =>
                        handleInputChange(rate.currency_code, 'buy_percentage', e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sell %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sellPercentage}
                      onChange={(e) =>
                        handleInputChange(rate.currency_code, 'sell_percentage', e.target.value)
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="bg-osl-navy-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-osl-navy-800 mb-2">Calculated Rates</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Buy Rate:</span>
                    <span className="font-bold text-osl-navy-800">
                      {formatCurrency(buyRate, 4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sell Rate:</span>
                    <span className="font-bold text-osl-navy-800">
                      {formatCurrency(sellRate, 4)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSave(rate.currency_code)}
                  disabled={!hasChanges}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    hasChanges
                      ? 'bg-osl-yellow-500 hover:bg-osl-yellow-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {saveStatus[rate.currency_code] === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Saved Successfully
                    </>
                  ) : saveStatus[rate.currency_code] === 'error' ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Error Saving
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>

                {saveStatus[rate.currency_code] === 'error' && (
                  <p className="text-sm text-red-600 text-center">
                    {errorMessages[rate.currency_code]}
                  </p>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Last updated: {formatDateTime(rate.updated_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
