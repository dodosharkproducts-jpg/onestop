import { TrendingUp, TrendingDown, Percent } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, formatCurrency } from '../utils/currencyCalculations';

interface RateComparisonCardProps {
  rates: ExchangeRate[];
}

export function RateComparisonCard({ rates }: RateComparisonCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-osl-navy-100">
      <div className="flex items-center gap-2 mb-4">
        <Percent className="w-6 h-6 text-osl-navy-600" />
        <h3 className="text-xl font-bold text-osl-navy-800">Rate Comparison</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Percentage difference between buy and sell rates
      </p>

      <div className="space-y-4">
        {rates.map((rate) => {
          const { buyRate, sellRate } = calculateRates(
            rate.main_rate,
            rate.buy_percentage,
            rate.sell_percentage
          );
          const difference = sellRate - buyRate;
          const percentageDiff = (difference / rate.main_rate) * 100;

          return (
            <div
              key={rate.id}
              className="bg-gradient-to-r from-osl-navy-50 to-osl-yellow-50 rounded-lg p-4 border border-osl-navy-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-osl-navy-800 text-lg">
                  {rate.currency_code}
                </span>
                <span className="text-sm text-gray-600">{rate.currency_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Buy</div>
                    <div className="text-sm font-semibold text-green-800">
                      {formatCurrency(buyRate, 4)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Sell</div>
                    <div className="text-sm font-semibold text-blue-800">
                      {formatCurrency(sellRate, 4)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-osl-navy-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Spread:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-osl-navy-800">
                      {formatCurrency(difference, 4)}
                    </span>
                    <span className="text-xs bg-osl-yellow-200 text-osl-navy-800 px-2 py-1 rounded font-semibold">
                      {percentageDiff.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
