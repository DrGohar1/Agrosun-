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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_email: string
          actor_id: string | null
          created_at: string
          id: string
          target: string
        }
        Insert: {
          action: string
          actor_email?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          target?: string
        }
        Update: {
          action?: string
          actor_email?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          target?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          description_ar: string | null
          description_de: string
          description_en: string | null
          description_fr: string
          description_it: string
          id: string
          logo_url: string | null
          name: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_de?: string
          description_en?: string | null
          description_fr?: string
          description_it?: string
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_de?: string
          description_en?: string | null
          description_fr?: string
          description_it?: string
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          assigned_to: string
          company: string | null
          contacted_at: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          internal_notes: string
          message: string
          name: string
          phone: string | null
          product: string | null
          source: string
          status: string
        }
        Insert: {
          assigned_to?: string
          company?: string | null
          contacted_at?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          internal_notes?: string
          message: string
          name: string
          phone?: string | null
          product?: string | null
          source?: string
          status?: string
        }
        Update: {
          assigned_to?: string
          company?: string | null
          contacted_at?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          internal_notes?: string
          message?: string
          name?: string
          phone?: string | null
          product?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          cover_url: string
          created_at: string
          gallery: Json
          id: string
          name_ar: string
          name_de: string
          name_en: string
          name_fr: string
          name_it: string
          place_ar: string
          place_de: string
          place_en: string
          place_fr: string
          place_it: string
          points_ar: string
          points_de: string
          points_en: string
          points_fr: string
          points_it: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          cover_url?: string
          created_at?: string
          gallery?: Json
          id?: string
          name_ar?: string
          name_de?: string
          name_en: string
          name_fr?: string
          name_it?: string
          place_ar?: string
          place_de?: string
          place_en?: string
          place_fr?: string
          place_it?: string
          points_ar?: string
          points_de?: string
          points_en?: string
          points_fr?: string
          points_it?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          cover_url?: string
          created_at?: string
          gallery?: Json
          id?: string
          name_ar?: string
          name_de?: string
          name_en?: string
          name_fr?: string
          name_it?: string
          place_ar?: string
          place_de?: string
          place_en?: string
          place_fr?: string
          place_it?: string
          points_ar?: string
          points_de?: string
          points_en?: string
          points_fr?: string
          points_it?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      partners: {
        Row: {
          country: string | null
          created_at: string
          id: string
          kind: string
          logo_url: string | null
          name: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          kind?: string
          logo_url?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          kind?: string
          logo_url?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description_ar: string | null
          description_de: string
          description_en: string | null
          description_fr: string
          description_it: string
          featured: boolean
          gallery: Json
          id: string
          image_alt_ar: string
          image_alt_en: string
          image_url: string | null
          in_season: boolean
          name_ar: string
          name_de: string
          name_en: string
          name_fr: string
          name_it: string
          packaging: string | null
          packaging_de: string
          packaging_fr: string
          packaging_it: string
          season_months: Json
          slug: string
          sort_order: number
          specs: Json
          tons: number
          updated_at: string
          views: number
          visible: boolean
        }
        Insert: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_de?: string
          description_en?: string | null
          description_fr?: string
          description_it?: string
          featured?: boolean
          gallery?: Json
          id?: string
          image_alt_ar?: string
          image_alt_en?: string
          image_url?: string | null
          in_season?: boolean
          name_ar?: string
          name_de?: string
          name_en: string
          name_fr?: string
          name_it?: string
          packaging?: string | null
          packaging_de?: string
          packaging_fr?: string
          packaging_it?: string
          season_months?: Json
          slug: string
          sort_order?: number
          specs?: Json
          tons?: number
          updated_at?: string
          views?: number
          visible?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          description_ar?: string | null
          description_de?: string
          description_en?: string | null
          description_fr?: string
          description_it?: string
          featured?: boolean
          gallery?: Json
          id?: string
          image_alt_ar?: string
          image_alt_en?: string
          image_url?: string | null
          in_season?: boolean
          name_ar?: string
          name_de?: string
          name_en?: string
          name_fr?: string
          name_it?: string
          packaging?: string | null
          packaging_de?: string
          packaging_fr?: string
          packaging_it?: string
          season_months?: Json
          slug?: string
          sort_order?: number
          specs?: Json
          tons?: number
          updated_at?: string
          views?: number
          visible?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          display_name: string
          phone: string
          preferences: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          display_name?: string
          phone?: string
          preferences?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          display_name?: string
          phone?: string
          preferences?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_banners: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          media_type: string
          page: string
          sort_order: number
          subtitle_ar: string | null
          subtitle_de: string
          subtitle_en: string | null
          subtitle_fr: string
          subtitle_it: string
          title_ar: string | null
          title_de: string
          title_en: string | null
          title_fr: string
          title_it: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          media_type?: string
          page: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_de?: string
          subtitle_en?: string | null
          subtitle_fr?: string
          subtitle_it?: string
          title_ar?: string | null
          title_de?: string
          title_en?: string | null
          title_fr?: string
          title_it?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          media_type?: string
          page?: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_de?: string
          subtitle_en?: string | null
          subtitle_fr?: string
          subtitle_it?: string
          title_ar?: string | null
          title_de?: string
          title_en?: string | null
          title_fr?: string
          title_it?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          company_name: string
          created_at: string
          developer_avatar_url: string
          developer_name: string
          developer_url: string
          email: string
          facebook_url: string
          hero_cta: Json
          hero_media_type: string
          hero_media_url: string
          hero_subtitle_ar: string
          hero_subtitle_de: string
          hero_subtitle_en: string
          hero_subtitle_fr: string
          hero_subtitle_it: string
          hero_title_ar: string
          hero_title_de: string
          hero_title_en: string
          hero_title_fr: string
          hero_title_it: string
          hq_address: string
          hq_address_de: string
          hq_address_fr: string
          hq_address_it: string
          id: string
          instagram_url: string
          iqf_address: string
          iqf_address_de: string
          iqf_address_fr: string
          iqf_address_it: string
          legal_name: string
          linkedin_url: string
          logo_url: string
          maps_url: string
          packhouse_address: string
          packhouse_address_de: string
          packhouse_address_fr: string
          packhouse_address_it: string
          phone: string
          published: boolean
          section_visibility: Json
          slogan_ar: string
          slogan_de: string
          slogan_en: string
          slogan_fr: string
          slogan_it: string
          stats: Json
          theme: Json
          updated_at: string
          whatsapp: string
          youtube_url: string
        }
        Insert: {
          company_name?: string
          created_at?: string
          developer_avatar_url?: string
          developer_name?: string
          developer_url?: string
          email?: string
          facebook_url?: string
          hero_cta?: Json
          hero_media_type?: string
          hero_media_url?: string
          hero_subtitle_ar?: string
          hero_subtitle_de?: string
          hero_subtitle_en?: string
          hero_subtitle_fr?: string
          hero_subtitle_it?: string
          hero_title_ar?: string
          hero_title_de?: string
          hero_title_en?: string
          hero_title_fr?: string
          hero_title_it?: string
          hq_address?: string
          hq_address_de?: string
          hq_address_fr?: string
          hq_address_it?: string
          id?: string
          instagram_url?: string
          iqf_address?: string
          iqf_address_de?: string
          iqf_address_fr?: string
          iqf_address_it?: string
          legal_name?: string
          linkedin_url?: string
          logo_url?: string
          maps_url?: string
          packhouse_address?: string
          packhouse_address_de?: string
          packhouse_address_fr?: string
          packhouse_address_it?: string
          phone?: string
          published?: boolean
          section_visibility?: Json
          slogan_ar?: string
          slogan_de?: string
          slogan_en?: string
          slogan_fr?: string
          slogan_it?: string
          stats?: Json
          theme?: Json
          updated_at?: string
          whatsapp?: string
          youtube_url?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          developer_avatar_url?: string
          developer_name?: string
          developer_url?: string
          email?: string
          facebook_url?: string
          hero_cta?: Json
          hero_media_type?: string
          hero_media_url?: string
          hero_subtitle_ar?: string
          hero_subtitle_de?: string
          hero_subtitle_en?: string
          hero_subtitle_fr?: string
          hero_subtitle_it?: string
          hero_title_ar?: string
          hero_title_de?: string
          hero_title_en?: string
          hero_title_fr?: string
          hero_title_it?: string
          hq_address?: string
          hq_address_de?: string
          hq_address_fr?: string
          hq_address_it?: string
          id?: string
          instagram_url?: string
          iqf_address?: string
          iqf_address_de?: string
          iqf_address_fr?: string
          iqf_address_it?: string
          legal_name?: string
          linkedin_url?: string
          logo_url?: string
          maps_url?: string
          packhouse_address?: string
          packhouse_address_de?: string
          packhouse_address_fr?: string
          packhouse_address_it?: string
          phone?: string
          published?: boolean
          section_visibility?: Json
          slogan_ar?: string
          slogan_de?: string
          slogan_en?: string
          slogan_fr?: string
          slogan_it?: string
          stats?: Json
          theme?: Json
          updated_at?: string
          whatsapp?: string
          youtube_url?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          badges: Json
          created_at: string
          email: string
          group_name: string
          id: string
          linkedin_url: string
          name_ar: string
          name_de: string
          name_en: string
          name_fr: string
          name_it: string
          phone: string
          photo_url: string
          sort_order: number
          title_ar: string
          title_de: string
          title_en: string
          title_fr: string
          title_it: string
          updated_at: string
          visible: boolean
          whatsapp: string
        }
        Insert: {
          badges?: Json
          created_at?: string
          email?: string
          group_name?: string
          id?: string
          linkedin_url?: string
          name_ar?: string
          name_de?: string
          name_en: string
          name_fr?: string
          name_it?: string
          phone?: string
          photo_url?: string
          sort_order?: number
          title_ar?: string
          title_de?: string
          title_en: string
          title_fr?: string
          title_it?: string
          updated_at?: string
          visible?: boolean
          whatsapp?: string
        }
        Update: {
          badges?: Json
          created_at?: string
          email?: string
          group_name?: string
          id?: string
          linkedin_url?: string
          name_ar?: string
          name_de?: string
          name_en?: string
          name_fr?: string
          name_it?: string
          phone?: string
          photo_url?: string
          sort_order?: number
          title_ar?: string
          title_de?: string
          title_en?: string
          title_fr?: string
          title_it?: string
          updated_at?: string
          visible?: boolean
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_admin: { Args: { _user_id: string }; Returns: boolean }
      has_any_role: {
        Args: { _roles: string[]; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
