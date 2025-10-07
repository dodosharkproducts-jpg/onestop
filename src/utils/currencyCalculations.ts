export interface CalculatedRates {
  buyRate: number;
  sellRate: number;
}

export function calculateRates(
  mainRate: number,
  buyPercentage: number,
  sellPercentage: number
): CalculatedRates {
  const buyRate = mainRate * (1 - buyPercentage / 100);
  const sellRate = mainRate * (1 + sellPercentage / 100);

  return {
    buyRate: Number(buyRate.toFixed(4)),
    sellRate: Number(sellRate.toFixed(4)),
  };
}

export function convertUSD(usdAmount: number, rate: number): number {
  return Number((usdAmount * rate).toFixed(2));
}

export function formatCurrency(amount: number, decimals: number = 2): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
