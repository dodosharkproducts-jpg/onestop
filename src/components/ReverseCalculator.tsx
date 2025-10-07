import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, formatCurrency } from '../utils/currencyCalculations';

interface ReverseCalculatorProps {
  rates: ExchangeRate[];
}

export function ReverseCalculator({ rates }: ReverseCalculatorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(rates[0]?.currency_code || 'LAK');
  const [localAmount, setLocalAmount] = useState<string>('1000');
  const [rateType, setRateType] = useState<'buy' | 'sell'>('buy');

  const selectedRate = rates.find((r) => r.currency_code === selectedCurrency);

  let usdEquivalent = 0;
  if (selectedRate) {
    const { buyRate, sellRate } = calculateRates(
      selectedRate.main_rate,
      selectedRate.buy_percentage,
      selectedRate.sell_percentage
    );
    const rate = rateType === 'buy' ? buyRate : sellRate;
    const amount = parseFloat(localAmount || '0');
    usdEquivalent = rate > 0 ? amount / rate : 0;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-osl-navy-100">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-6 h-6 text-osl-navy-600" />
        <h3 className="text-xl font-bold text-osl-navy-800">Reverse Calculator</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Calculate USD equivalent from local currency
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Currency
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
          >
            {rates.map((rate) => (
              <option key={rate.id} value={rate.currency_code}>
                {rate.currency_code} - {rate.currency_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setRateType('buy')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                rateType === 'buy'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Buy Rate
            </button>
            <button
              onClick={() => setRateType('sell')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                rateType === 'sell'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sell Rate
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local Currency Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={localAmount}
            onChange={(e) => setLocalAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="bg-gradient-to-br from-osl-yellow-50 to-osl-yellow-100 rounded-lg p-6 border-2 border-osl-yellow-300">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">USD Equivalent</div>
            <div className="text-3xl font-bold text-osl-navy-800">
              ${formatCurrency(usdEquivalent, 2)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {formatCurrency(parseFloat(localAmount || '0'), 2)} {selectedCurrency} ={' '}
              {formatCurrency(usdEquivalent, 2)} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
