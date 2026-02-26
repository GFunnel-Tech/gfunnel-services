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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_items: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          url: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label: string
          url: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          billing_cycle_end: string | null
          created_at: string
          hours_included: number
          hours_used: number
          id: string
          name: string
          overage_rate: number
          plan_name: string
          plan_price: number
          plan_value: number
          response_time: string
          savings_percentage: number
          slug: string
          time_multiplier: number
          updated_at: string
          va_hourly_rate: number
        }
        Insert: {
          billing_cycle_end?: string | null
          created_at?: string
          hours_included?: number
          hours_used?: number
          id?: string
          name: string
          overage_rate?: number
          plan_name?: string
          plan_price?: number
          plan_value?: number
          response_time?: string
          savings_percentage?: number
          slug: string
          time_multiplier?: number
          updated_at?: string
          va_hourly_rate?: number
        }
        Update: {
          billing_cycle_end?: string | null
          created_at?: string
          hours_included?: number
          hours_used?: number
          id?: string
          name?: string
          overage_rate?: number
          plan_name?: string
          plan_price?: number
          plan_value?: number
          response_time?: string
          savings_percentage?: number
          slug?: string
          time_multiplier?: number
          updated_at?: string
          va_hourly_rate?: number
        }
        Relationships: []
      }
      company_roles: {
        Row: {
          ai_agent_id: string | null
          ai_embed_url: string | null
          ai_name: string | null
          ai_type: string | null
          assigned_email: string | null
          assigned_name: string | null
          assigned_phone: string | null
          assigned_photo_url: string | null
          company_id: string
          created_at: string
          department_slug: string
          google_meet_link: string | null
          hire_request_id: string | null
          id: string
          profile_type: string | null
          role_title: string
          status: string
          updated_at: string
        }
        Insert: {
          ai_agent_id?: string | null
          ai_embed_url?: string | null
          ai_name?: string | null
          ai_type?: string | null
          assigned_email?: string | null
          assigned_name?: string | null
          assigned_phone?: string | null
          assigned_photo_url?: string | null
          company_id: string
          created_at?: string
          department_slug: string
          google_meet_link?: string | null
          hire_request_id?: string | null
          id?: string
          profile_type?: string | null
          role_title: string
          status?: string
          updated_at?: string
        }
        Update: {
          ai_agent_id?: string | null
          ai_embed_url?: string | null
          ai_name?: string | null
          ai_type?: string | null
          assigned_email?: string | null
          assigned_name?: string | null
          assigned_phone?: string | null
          assigned_photo_url?: string | null
          company_id?: string
          created_at?: string
          department_slug?: string
          google_meet_link?: string | null
          hire_request_id?: string | null
          id?: string
          profile_type?: string | null
          role_title?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_roles_hire_request_id_fkey"
            columns: ["hire_request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      company_users: {
        Row: {
          company_id: string
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_primary: boolean | null
          role: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_primary?: boolean | null
          role?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_primary?: boolean | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hours_history: {
        Row: {
          company_id: string
          created_at: string
          hours_included: number
          hours_used: number
          id: string
          month_year: string
          plan_price: number
        }
        Insert: {
          company_id: string
          created_at?: string
          hours_included?: number
          hours_used?: number
          id?: string
          month_year: string
          plan_price?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          hours_included?: number
          hours_used?: number
          id?: string
          month_year?: string
          plan_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hours_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requests: {
        Row: {
          company_id: string | null
          created_at: string | null
          delegate_email: string | null
          delegate_name: string | null
          description: string | null
          email: string
          form_category: string
          form_type: string
          id: string
          payload: Json
          priority: string | null
          request_title: string | null
          status: string | null
          submitted_at: string
          updated_at: string | null
          video_link: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          delegate_email?: string | null
          delegate_name?: string | null
          description?: string | null
          email: string
          form_category: string
          form_type: string
          id?: string
          payload: Json
          priority?: string | null
          request_title?: string | null
          status?: string | null
          submitted_at?: string
          updated_at?: string | null
          video_link?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          delegate_email?: string | null
          delegate_name?: string | null
          description?: string | null
          email?: string
          form_category?: string
          form_type?: string
          id?: string
          payload?: Json
          priority?: string | null
          request_title?: string | null
          status?: string | null
          submitted_at?: string
          updated_at?: string | null
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      immersion_engagements: {
        Row: {
          id: string
          created_at: string
          client_name: string
          client_org: string
          client_email: string
          client_phone: string | null
          session_type: string
          session_date: string | null
          session_confirmed: boolean
          advisor_name: string
          advisor_id: string | null
          location: string | null
          stage: string
          stage_updated_at: string | null
          invoice_total: number | null
          invoice_status: string
          notes: string | null
          tags: string[] | null
          is_archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          client_name: string
          client_org: string
          client_email: string
          client_phone?: string | null
          session_type: string
          session_date?: string | null
          session_confirmed?: boolean
          advisor_name?: string
          advisor_id?: string | null
          location?: string | null
          stage?: string
          stage_updated_at?: string | null
          invoice_total?: number | null
          invoice_status?: string
          notes?: string | null
          tags?: string[] | null
          is_archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          client_name?: string
          client_org?: string
          client_email?: string
          client_phone?: string | null
          session_type?: string
          session_date?: string | null
          session_confirmed?: boolean
          advisor_name?: string
          advisor_id?: string | null
          location?: string | null
          stage?: string
          stage_updated_at?: string | null
          invoice_total?: number | null
          invoice_status?: string
          notes?: string | null
          tags?: string[] | null
          is_archived?: boolean
        }
        Relationships: []
      }
      immersion_portal_access: {
        Row: {
          id: string
          engagement_id: string
          user_id: string
          role: string
          invited_at: string
          invited_by: string | null
          accepted_at: string | null
          last_active_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          engagement_id: string
          user_id: string
          role: string
          invited_at?: string
          invited_by?: string | null
          accepted_at?: string | null
          last_active_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          engagement_id?: string
          user_id?: string
          role?: string
          invited_at?: string
          invited_by?: string | null
          accepted_at?: string | null
          last_active_at?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "immersion_portal_access_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_checklist_items: {
        Row: {
          id: string
          engagement_id: string
          stage: string
          order_index: number
          label: string
          description: string | null
          is_completed: boolean
          completed_at: string | null
          completed_by: string | null
          is_required: boolean
          assigned_to: string
        }
        Insert: {
          id?: string
          engagement_id: string
          stage: string
          order_index: number
          label: string
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          is_required?: boolean
          assigned_to?: string
        }
        Update: {
          id?: string
          engagement_id?: string
          stage?: string
          order_index?: number
          label?: string
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          is_required?: boolean
          assigned_to?: string
        }
        Relationships: [
          {
            foreignKeyName: "immersion_checklist_items_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_recordings: {
        Row: {
          id: string
          engagement_id: string
          created_at: string
          title: string
          type: string
          duration_seconds: number | null
          file_size_bytes: number | null
          storage_path: string | null
          storage_url: string | null
          segment_label: string | null
          recorded_at: string | null
          status: string
          transcript_text: string | null
          ai_summary_json: Json | null
        }
        Insert: {
          id?: string
          engagement_id: string
          created_at?: string
          title: string
          type: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          storage_path?: string | null
          storage_url?: string | null
          segment_label?: string | null
          recorded_at?: string | null
          status?: string
          transcript_text?: string | null
          ai_summary_json?: Json | null
        }
        Update: {
          id?: string
          engagement_id?: string
          created_at?: string
          title?: string
          type?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          storage_path?: string | null
          storage_url?: string | null
          segment_label?: string | null
          recorded_at?: string | null
          status?: string
          transcript_text?: string | null
          ai_summary_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "immersion_recordings_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_departments: {
        Row: {
          id: string
          engagement_id: string
          dept_number: number
          dept_name: string
          dept_color: string
          status: string
          progress: number
          build_items: Json
          advisor_notes: string | null
          client_notes: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          engagement_id: string
          dept_number: number
          dept_name: string
          dept_color: string
          status?: string
          progress?: number
          build_items?: Json
          advisor_notes?: string | null
          client_notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          engagement_id?: string
          dept_number?: number
          dept_name?: string
          dept_color?: string
          status?: string
          progress?: number
          build_items?: Json
          advisor_notes?: string | null
          client_notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "immersion_departments_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_documents: {
        Row: {
          id: string
          engagement_id: string
          created_at: string
          title: string
          category: string
          icon: string | null
          page_count: number | null
          file_type: string
          storage_path: string | null
          storage_url: string | null
          external_url: string | null
          version: number
          is_final: boolean
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          engagement_id: string
          created_at?: string
          title: string
          category: string
          icon?: string | null
          page_count?: number | null
          file_type?: string
          storage_path?: string | null
          storage_url?: string | null
          external_url?: string | null
          version?: number
          is_final?: boolean
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          engagement_id?: string
          created_at?: string
          title?: string
          category?: string
          icon?: string | null
          page_count?: number | null
          file_type?: string
          storage_path?: string | null
          storage_url?: string | null
          external_url?: string | null
          version?: number
          is_final?: boolean
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "immersion_documents_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_messages: {
        Row: {
          id: string
          engagement_id: string
          created_at: string
          sender_id: string | null
          sender_name: string
          sender_role: string
          body: string
          attachments: Json
          reply_to_id: string | null
          is_read: boolean
          read_at: string | null
          is_deleted: boolean
        }
        Insert: {
          id?: string
          engagement_id: string
          created_at?: string
          sender_id?: string | null
          sender_name: string
          sender_role: string
          body: string
          attachments?: Json
          reply_to_id?: string | null
          is_read?: boolean
          read_at?: string | null
          is_deleted?: boolean
        }
        Update: {
          id?: string
          engagement_id?: string
          created_at?: string
          sender_id?: string | null
          sender_name?: string
          sender_role?: string
          body?: string
          attachments?: Json
          reply_to_id?: string | null
          is_read?: boolean
          read_at?: string | null
          is_deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "immersion_messages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      immersion_invoices: {
        Row: {
          id: string
          engagement_id: string
          created_at: string
          invoice_number: string
          type: string
          description: string
          amount: number | null
          currency: string
          issued_date: string | null
          due_date: string | null
          paid_date: string | null
          status: string
          document_url: string | null
          stripe_invoice_id: string | null
        }
        Insert: {
          id?: string
          engagement_id: string
          created_at?: string
          invoice_number: string
          type: string
          description: string
          amount?: number | null
          currency?: string
          issued_date?: string | null
          due_date?: string | null
          paid_date?: string | null
          status?: string
          document_url?: string | null
          stripe_invoice_id?: string | null
        }
        Update: {
          id?: string
          engagement_id?: string
          created_at?: string
          invoice_number?: string
          type?: string
          description?: string
          amount?: number | null
          currency?: string
          issued_date?: string | null
          due_date?: string | null
          paid_date?: string | null
          status?: string
          document_url?: string | null
          stripe_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "immersion_invoices_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "immersion_engagements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_immersion_access: {
        Args: {
          p_engagement_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      get_immersion_role: {
        Args: {
          p_engagement_id: string
          p_user_id: string
        }
        Returns: string
      }
      is_immersion_staff: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
