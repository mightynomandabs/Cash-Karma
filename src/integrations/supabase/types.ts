export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          karma_points: number | null
          level: number | null
          total_given: number | null
          total_received: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          karma_points?: number | null
          level?: number | null
          total_given?: number | null
          total_received?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          karma_points?: number | null
          level?: number | null
          total_given?: number | null
          total_received?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drops: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string | null
          amount: number
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id?: string | null
          amount: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string | null
          amount?: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drops_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          upi_id: string
          status: string
          razorpay_payout_id: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          upi_id: string
          status?: string
          razorpay_payout_id?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          upi_id?: string
          status?: string
          razorpay_payout_id?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_payout_methods: {
        Row: {
          id: string
          user_id: string
          upi_id: string
          is_verified: boolean
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          upi_id: string
          is_verified?: boolean
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          upi_id?: string
          is_verified?: boolean
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payout_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reactions: {
        Row: {
          id: string
          drop_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          drop_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          drop_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          period_type: string
          category: string
          score: number
          rank: number | null
          period_start: string
          period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period_type: string
          category: string
          score?: number
          rank?: number | null
          period_start: string
          period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period_type?: string
          category?: string
          score?: number
          rank?: number | null
          period_start?: string
          period_end?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      social_stories: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_anonymous: boolean
          is_approved: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          is_anonymous?: boolean
          is_approved?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_anonymous?: boolean
          is_approved?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      story_reactions: {
        Row: {
          id: string
          story_id: string
          user_id: string
          reaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          reaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          reaction_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_reactions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "social_stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_rank: {
        Args: {
          p_user_id: string
          p_period_type?: string
          p_category?: string
        }
        Returns: number | null
      }
      get_user_wallet_balance: {
        Args: {
          p_user_id: string
        }
        Returns: {
          pending_balance: number
          total_earned: number
          total_withdrawn: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (DatabaseWithoutInternals["public"]["Tables"])
    ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions])[TableName] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (DatabaseWithoutInternals["public"]["Tables"])
    ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions])[TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Tables"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Tables"] },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
    ? keyof (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Tables"] }
  ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions["schema"]])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (DatabaseWithoutInternals["public"]["Tables"])
    ? (DatabaseWithoutInternals["public"]["Tables"][PublicTableNameOrOptions])[TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (DatabaseWithoutInternals["public"]["Enums"])
    | { schema: keyof DatabaseWithoutInternals["public"]["Enums"] },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Enums"] }
    ? keyof (DatabaseWithoutInternals["public"]["Enums"][PublicEnumNameOrOptions["schema"]])
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals["public"]["Enums"] }
  ? (DatabaseWithoutInternals["public"]["Enums"][PublicEnumNameOrOptions["schema"]])[EnumName]
  : PublicEnumNameOrOptions extends keyof (DatabaseWithoutInternals["public"]["Enums"])
    ? (DatabaseWithoutInternals["public"]["Enums"][PublicEnumNameOrOptions])[EnumName]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
