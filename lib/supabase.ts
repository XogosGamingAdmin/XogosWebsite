import { createClient } from "@supabase/supabase-js";

// These will be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Database features will not work. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      board_member_profiles: {
        Row: {
          user_id: string;
          rss_topic: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          rss_topic?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          rss_topic?: string;
          updated_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          user_id: string;
          task: string;
          completed: boolean;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task: string;
          completed?: boolean;
          created_at?: string;
          created_by: string;
        };
        Update: {
          task?: string;
          completed?: boolean;
        };
      };
      xogos_statistics: {
        Row: {
          id: number;
          accounts: number;
          active_users: number;
          total_hours: number;
          last_updated: string;
          updated_by: string;
        };
        Insert: {
          id?: number;
          accounts: number;
          active_users: number;
          total_hours: number;
          last_updated?: string;
          updated_by: string;
        };
        Update: {
          accounts?: number;
          active_users?: number;
          total_hours?: number;
          last_updated?: string;
          updated_by?: string;
        };
      };
      xogos_financials: {
        Row: {
          id: number;
          revenue: number;
          expenses: number;
          monthly_payments: number;
          yearly_payments: number;
          lifetime_members: number;
          last_updated: string;
          updated_by: string;
        };
        Insert: {
          id?: number;
          revenue: number;
          expenses: number;
          monthly_payments: number;
          yearly_payments: number;
          lifetime_members: number;
          last_updated?: string;
          updated_by: string;
        };
        Update: {
          revenue?: number;
          expenses?: number;
          monthly_payments?: number;
          yearly_payments?: number;
          lifetime_members?: number;
          last_updated?: string;
          updated_by?: string;
        };
      };
    };
  };
};
