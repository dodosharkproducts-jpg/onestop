import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, formatCurrency } from '../utils/currencyCalculations';

interface ReverseCalculatorProps {
  rates: ExchangeRate[];
}

type Currency = 'USD' | string;

export function ReverseCalculator({ rates }: ReverseCalculatorProps) {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>(rates[0]?.currency_code || 'LAK');
  const [amount, setAmount] = useState<string>('100');
  const [rateType, setRateType] = useState<'buy' | 'sell'>('buy');

  const allCurrencies: Currency[] = ['USD', ...rates.map((r) => r.currency_code)];

  const calculateConversion = () => {
    const inputAmount = parseFloat(amount || '0');

    if (fromCurrency === toCurrency) {
      return inputAmount;
    }

    if (fromCurrency === 'USD' && toCurrency !== 'USD') {
      const toRate = rates.find((r) => r.currency_code === toCurrency);
      if (toRate) {
        const { buyRate, sellRate } = calculateRates(
          toRate.main_rate,
          toRate.buy_percentage,
          toRate.sell_percentage
        );
        const rate = rateType === 'buy' ? buyRate : sellRate;
        return inputAmount * rate;
      }
    } else if (fromCurrency !== 'USD' && toCurrency === 'USD') {
      const fromRate = rates.find((r) => r.currency_code === fromCurrency);
      if (fromRate) {
        const { buyRate, sellRate } = calculateRates(
          fromRate.main_rate,
          fromRate.buy_percentage,
          fromRate.sell_percentage
        );
        const rate = rateType === 'buy' ? buyRate : sellRate;
        return rate > 0 ? inputAmount / rate : 0;
      }
    } else if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const fromRate = rates.find((r) => r.currency_code === fromCurrency);
      const toRate = rates.find((r) => r.currency_code === toCurrency);
      if (fromRate && toRate) {
        const fromRates = calculateRates(
          fromRate.main_rate,
          fromRate.buy_percentage,
          fromRate.sell_percentage
        );
        const toRates = calculateRates(
          toRate.main_rate,
          toRate.buy_percentage,
          toRate.sell_percentage
        );
        const fromRateValue = rateType === 'buy' ? fromRates.buyRate : fromRates.sellRate;
        const toRateValue = rateType === 'buy' ? toRates.buyRate : toRates.sellRate;

        const usdAmount = fromRateValue > 0 ? inputAmount / fromRateValue : 0;
        return usdAmount * toRateValue;
      }
    }

    return 0;
  };

  const convertedAmount = calculateConversion();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-osl-navy-100">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-6 h-6 text-osl-navy-600" />
        <h3 className="text-xl font-bold text-osl-navy-800">Reverse Calculator</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Convert between all currencies
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
            >
              {allCurrencies.map((currency) => {
                const rate = rates.find((r) => r.currency_code === currency);
                return (
                  <option key={currency} value={currency}>
                    {currency === 'USD' ? 'USD - US Dollar' : `${currency} - ${rate?.currency_name}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
            >
              {allCurrencies.map((currency) => {
                const rate = rates.find((r) => r.currency_code === currency);
                return (
                  <option key={currency} value={currency}>
                    {currency === 'USD' ? 'USD - US Dollar' : `${currency} - ${rate?.currency_name}`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate Type</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-osl-navy-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="bg-gradient-to-br from-osl-yellow-50 to-osl-yellow-100 rounded-lg p-6 border-2 border-osl-yellow-300">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Converted Amount</div>
            <div className="text-3xl font-bold text-osl-navy-800">
              {formatCurrency(convertedAmount, 2)} {toCurrency}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {formatCurrency(parseFloat(amount || '0'), 2)} {fromCurrency} = {formatCurrency(convertedAmount, 2)} {toCurrency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
