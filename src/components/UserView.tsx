import { TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import type { ExchangeRate } from '../hooks/useExchangeRates';
import { calculateRates, formatCurrency, formatDateTime } from '../utils/currencyCalculations';
import { RateComparisonCard } from './RateComparisonCard';
import { ReverseCalculator } from './ReverseCalculator';

interface UserViewProps {
  rates: ExchangeRate[];
}

export function UserView({ rates }: UserViewProps) {
  const latestUpdate = rates.reduce((latest, rate) => {
    const rateTime = new Date(rate.updated_at).getTime();
    const latestTime = new Date(latest).getTime();
    return rateTime > latestTime ? rate.updated_at : latest;
  }, rates[0]?.updated_at || new Date().toISOString());

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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {rates.map((rate) => {
          const { buyRate, sellRate } = calculateRates(
            rate.main_rate,
            rate.buy_percentage,
            rate.sell_percentage
          );

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
