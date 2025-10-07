export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exchange_rates: {
        Row: {
          id: string
          currency_code: string
          currency_name: string
          main_rate: number
          buy_percentage: number
          sell_percentage: number
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          currency_code: string
          currency_name: string
          main_rate: number
          buy_percentage: number
          sell_percentage: number
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          currency_code?: string
          currency_name?: string
          main_rate?: number
          buy_percentage?: number
          sell_percentage?: number
          updated_at?: string
          created_at?: string
        }
      }
    }
  }
}
