/*
  # Create Exchange Rates Table

  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key) - Unique identifier for each currency rate record
      - `currency_code` (text, unique) - Currency code (LAK, MMK, THB)
      - `currency_name` (text) - Full currency name for display
      - `main_rate` (numeric) - The base exchange rate against USD
      - `buy_percentage` (numeric) - Percentage margin for buy rate (e.g., 1.0 for 1%)
      - `sell_percentage` (numeric) - Percentage margin for sell rate (e.g., 1.0 for 1%)
      - `updated_at` (timestamptz) - Timestamp of last rate update
      - `created_at` (timestamptz) - Timestamp of record creation

  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access (users can view rates)
    - Add policy for public write access (admin can update rates)
    - Note: In production, you would want to add proper authentication for admin updates

  3. Initial Data
    - Insert default rates for LAK, MMK, and THB with initial values
    - Set default buy and sell percentages to 1%

  4. Important Notes
    - The buy_rate and sell_rate are calculated in the application using formulas:
      - Buy Rate = main_rate × (1 - buy_percentage / 100)
      - Sell Rate = main_rate × (1 + sell_percentage / 100)
    - Timestamps are automatically managed with DEFAULT now()
*/

-- Create the exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code text UNIQUE NOT NULL,
  currency_name text NOT NULL,
  main_rate numeric(15, 4) NOT NULL DEFAULT 0,
  buy_percentage numeric(5, 2) NOT NULL DEFAULT 1.0,
  sell_percentage numeric(5, 2) NOT NULL DEFAULT 1.0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read exchange rates (public access)
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates
  FOR SELECT
  TO public
  USING (true);

-- Policy: Anyone can insert exchange rates
CREATE POLICY "Anyone can insert exchange rates"
  ON exchange_rates
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Anyone can update exchange rates
CREATE POLICY "Anyone can update exchange rates"
  ON exchange_rates
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy: Anyone can delete exchange rates
CREATE POLICY "Anyone can delete exchange rates"
  ON exchange_rates
  FOR DELETE
  TO public
  USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update
DROP TRIGGER IF EXISTS update_exchange_rates_updated_at ON exchange_rates;
CREATE TRIGGER update_exchange_rates_updated_at
  BEFORE UPDATE ON exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial default exchange rates
INSERT INTO exchange_rates (currency_code, currency_name, main_rate, buy_percentage, sell_percentage)
VALUES 
  ('LAK', 'Lao Kip', 21500.0000, 1.00, 1.00),
  ('MMK', 'Myanmar Kyat', 4000.0000, 1.00, 1.00),
  ('THB', 'Thai Baht', 33.0000, 1.00, 1.00)
ON CONFLICT (currency_code) DO NOTHING;