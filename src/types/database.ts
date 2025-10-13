export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      theses: {
        Row: {
          id: string;
          user_id: string | null;
          text: string;
          summary: string | null;
          tickers_long: Json | null;
          tickers_short: Json | null;
          rationale: string | null;
          confidence_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          text: string;
          summary?: string | null;
          tickers_long?: Json | null;
          tickers_short?: Json | null;
          rationale?: string | null;
          confidence_level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          text?: string;
          summary?: string | null;
          tickers_long?: Json | null;
          tickers_short?: Json | null;
          rationale?: string | null;
          confidence_level?: string | null;
          created_at?: string;
        };
      };
      paper_trades: {
        Row: {
          id: string;
          thesis_id: string;
          ticker: string;
          direction: 'long' | 'short';
          quantity: number;
          entry_price: number;
          current_price: number | null;
          pnl: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thesis_id: string;
          ticker: string;
          direction: 'long' | 'short';
          quantity: number;
          entry_price: number;
          current_price?: number | null;
          pnl?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          thesis_id?: string;
          ticker?: string;
          direction?: 'long' | 'short';
          quantity?: number;
          entry_price?: number;
          current_price?: number | null;
          pnl?: number | null;
          created_at?: string;
        };
      };
      portfolio_snapshots: {
        Row: {
          id: string;
          user_id: string;
          thesis_id: string;
          total_value: number;
          total_pnl: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          thesis_id: string;
          total_value: number;
          total_pnl: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          thesis_id?: string;
          total_value?: number;
          total_pnl?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      trade_direction: 'long' | 'short';
    };
  };
}
