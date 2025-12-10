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
      technical_issues: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          category: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status: 'open' | 'in_progress' | 'resolved' | 'blocked';
          environment: string | null;
          reporter_id: string;
          assigned_to: string | null;
          attachment_url: string | null;
          resolution_summary: string | null;
          tags: string[] | null;
          expected_behavior: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          category: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status?: 'open' | 'in_progress' | 'resolved' | 'blocked';
          environment?: string | null;
          reporter_id: string;
          assigned_to?: string | null;
          attachment_url?: string | null;
          resolution_summary?: string | null;
          tags?: string[] | null;
          expected_behavior?: string | null;
        };
        Update: Partial<Database['public']['Tables']['technical_issues']['Insert']>;
      };
      feedback_entries: {
        Row: {
          id: string;
          created_at: string;
          sentiment: 'positive' | 'neutral' | 'negative';
          category: string;
          message: string;
          channel: 'web' | 'slack' | 'email' | 'other';
          submitted_by: string | null;
          is_anonymous: boolean;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          sentiment: 'positive' | 'neutral' | 'negative';
          category: string;
          message: string;
          channel?: 'web' | 'slack' | 'email' | 'other';
          submitted_by?: string | null;
          is_anonymous?: boolean;
          metadata?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['feedback_entries']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'member';
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'member';
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
    Functions: {};
    Enums: {};
  };
}
