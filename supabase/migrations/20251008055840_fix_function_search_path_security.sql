/*
  # Fix Function Search Path Security Issue

  1. Security Fix
    - Drop and recreate the `update_updated_at_column` function with a secure search_path
    - Setting search_path to empty string ('') prevents search path manipulation attacks
    - All schema references are now fully qualified (e.g., pg_catalog.now())

  2. Important Notes
    - This prevents potential security vulnerabilities where an attacker could manipulate
      the search_path to inject malicious functions
    - The function is marked as SECURITY DEFINER safe by using an immutable search_path
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate the function with a secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS update_exchange_rates_updated_at ON exchange_rates;
CREATE TRIGGER update_exchange_rates_updated_at
  BEFORE UPDATE ON exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();