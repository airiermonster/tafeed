export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          category: string
          created_at: string
          description: string
          district: string | null
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          region: string
          status: string | null
          street: string | null
          tracking_id: string
          updated_at: string
          user_id: string
          ward: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          region: string
          status?: string | null
          street?: string | null
          tracking_id: string
          updated_at?: string
          user_id: string
          ward?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          region?: string
          status?: string | null
          street?: string | null
          tracking_id?: string
          updated_at?: string
          user_id?: string
          ward?: string | null
        }
        Relationships: []
      }
      feedback_categories: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      feedback_evidence: {
        Row: {
          created_at: string
          feedback_id: string | null
          file_path: string
          id: string
        }
        Insert: {
          created_at?: string
          feedback_id?: string | null
          file_path: string
          id?: string
        }
        Update: {
          created_at?: string
          feedback_id?: string | null
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_evidence_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role_fixed: {
        Args: { p_user_id: string }
        Returns: string
      }
      assign_user_role: {
        Args: { user_id: string; role_name: string }
        Returns: undefined
      }
      assign_user_role_fixed: {
        Args: { p_user_id: string; p_role_name: string }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
