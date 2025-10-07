import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, convertUSD, formatCurrency, formatDateTime } from '../utils/currencyCalculations';
import { RateComparisonCard } from './RateComparisonCard';
import { ReverseCalculator } from './ReverseCalculator';

interface UserViewProps {
  rates: ExchangeRate[];
}

const QUICK_AMOUNTS = [1, 10, 50, 100, 500, 1000];

export function UserView({ rates }: UserViewProps) {
  const [usdAmount, setUsdAmount] = useState<string>('100');

  const latestUpdate = rates.reduce((latest, rate) => {
    const rateTime = new Date(rate.updated_at).getTime();
    const latestTime = new Date(latest).getTime();
    return rateTime > latestTime ? rate.updated_at : latest;
  }, rates[0]?.updated_at || new Date().toISOString());

  const handleQuickAmount = (amount: number) => {
    setUsdAmount(amount.toString());
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-osl-navy-800 via-osl-navy-700 to-osl-navy-800 rounded-xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="w-8 h-8 text-osl-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Currency Exchange Calculator</h2>
        </div>
        <p className="text-osl-navy-200">
          Live exchange rates for LAK, MMK, and THB
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-osl-navy-100">
        <label className="block text-lg font-semibold text-osl-navy-800 mb-4">
          Enter USD Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <DollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <input
            type="number"
            step="0.01"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="Enter amount in USD"
            className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-osl-navy-300 rounded-lg focus:ring-4 focus:ring-osl-navy-200 focus:border-osl-navy-500 transition-all"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-3">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAmount(amount)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  usdAmount === amount.toString()
                    ? 'bg-osl-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {rates.map((rate) => {
          const { buyRate, sellRate } = calculateRates(
            rate.main_rate,
            rate.buy_percentage,
            rate.sell_percentage
          );
          const usd = parseFloat(usdAmount) || 0;
          const buyAmount = convertUSD(usd, buyRate);
          const sellAmount = convertUSD(usd, sellRate);

          return (
            <div
              key={rate.id}
              className="bg-white rounded-xl shadow-lg border-2 border-osl-navy-100 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-br from-osl-navy-700 to-osl-navy-600 p-5">
                <h3 className="text-2xl font-bold text-white mb-1">{rate.currency_code}</h3>
                <p className="text-osl-navy-100 text-sm">{rate.currency_name}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">We Buy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(buyRate, 4)}
                    </div>
                    <div className="text-sm text-green-700">
                      per 1 USD
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">We Sell</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(sellRate, 4)}
                    </div>
                    <div className="text-sm text-blue-700">
                      per 1 USD
                    </div>
                  </div>
                </div>

                {usd > 0 && (
                  <div className="bg-gradient-to-br from-osl-yellow-50 to-osl-yellow-100 rounded-lg p-4 border-2 border-osl-yellow-300">
                    <div className="text-sm font-semibold text-osl-navy-800 mb-3">
                      Your ${formatCurrency(usd, 2)} USD equals:
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Buy:</span>
                        <span className="text-lg font-bold text-green-800">
                          {formatCurrency(buyAmount, 2)} {rate.currency_code}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sell:</span>
                        <span className="text-lg font-bold text-blue-800">
                          {formatCurrency(sellAmount, 2)} {rate.currency_code}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-6">
        <RateComparisonCard rates={rates} />
        <ReverseCalculator rates={rates} />
      </div>

      <div className="bg-osl-navy-50 border-2 border-osl-navy-200 rounded-lg p-6 text-center mt-6">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-osl-navy-800">Last updated:</span>{' '}
          {formatDateTime(latestUpdate)}
        </p>
      </div>
    </div>
  );
}
