export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          category: string | null
          city: string | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          discounted_price: number | null
          district: string | null
          expiry_date: string
          id: string
          image_url: string | null
          is_active: boolean
          listing_type: string | null
          location: string | null
          merchant_id: string
          original_price: number | null
          points_required: number | null
          redemption_mode: string | null
          store_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          district?: string | null
          expiry_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          listing_type?: string | null
          location?: string | null
          merchant_id: string
          original_price?: number | null
          points_required?: number | null
          redemption_mode?: string | null
          store_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          district?: string | null
          expiry_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          listing_type?: string | null
          location?: string | null
          merchant_id?: string
          original_price?: number | null
          points_required?: number | null
          redemption_mode?: string | null
          store_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          current_plan: string | null
          district: string | null
          email: string
          id: string
          is_premium: boolean | null
          name: string
          payment_method: string | null
          phone_number: string | null
          plan_amount: number | null
          plan_selected_at: string | null
          plan_status: string | null
          role: Database["public"]["Enums"]["user_role"]
          store_location: string | null
          store_name: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          current_plan?: string | null
          district?: string | null
          email: string
          id: string
          is_premium?: boolean | null
          name: string
          payment_method?: string | null
          phone_number?: string | null
          plan_amount?: number | null
          plan_selected_at?: string | null
          plan_status?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          current_plan?: string | null
          district?: string | null
          email?: string
          id?: string
          is_premium?: boolean | null
          name?: string
          payment_method?: string | null
          phone_number?: string | null
          plan_amount?: number | null
          plan_selected_at?: string | null
          plan_status?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          id: string
          offer_id: string
          redeemed_at: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          offer_id: string
          redeemed_at?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          offer_id?: string
          redeemed_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          points_awarded: number
          referral_code: string
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_awarded?: number
          referral_code: string
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          points_awarded?: number
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          points: number
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          points: number
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          points?: number
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_offers: {
        Row: {
          created_at: string
          current_redemptions: number
          description: string
          expiry_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          max_redemptions: number | null
          points_required: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_redemptions?: number
          description: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_redemptions?: number | null
          points_required: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_redemptions?: number
          description?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_redemptions?: number | null
          points_required?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          id: string
          points_used: number
          reward_offer_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_used: number
          reward_offer_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_used?: number
          reward_offer_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_offer_id_fkey"
            columns: ["reward_offer_id"]
            isOneToOne: false
            referencedRelation: "reward_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_offers: {
        Row: {
          id: string
          offer_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          offer_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          offer_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          city: string | null
          created_at: string
          description: string | null
          district: string | null
          email: string | null
          id: string
          is_active: boolean
          location: string | null
          name: string
          phone_number: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          phone_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          phone_number?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          current_points: number
          id: string
          level_name: string
          referral_code: string
          total_earned_points: number
          total_redeemed_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_points?: number
          id?: string
          level_name?: string
          referral_code: string
          total_earned_points?: number
          total_redeemed_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_points?: number
          id?: string
          level_name?: string
          referral_code?: string
          total_earned_points?: number
          total_redeemed_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          activity_description: string
          activity_type: string
          points_amount: number
          reference_id?: string
          reference_type?: string
          target_user_id: string
        }
        Returns: undefined
      }
      email_exists: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      generate_referral_code: {
        Args: { user_name: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profile_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          customer_count: number
          merchant_count: number
          total_count: number
        }[]
      }
      phone_exists: {
        Args: { phone_to_check: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "customer" | "merchant" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
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
    Enums: {
      user_role: ["customer", "merchant", "super_admin"],
    },
  },
} as const
