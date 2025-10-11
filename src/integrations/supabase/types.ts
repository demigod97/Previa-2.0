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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string
          account_number_masked: string | null
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          institution: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_name: string
          account_number_masked?: string | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          institution: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_name?: string
          account_number_masked?: string | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          institution?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bank_statements: {
        Row: {
          bank_account_id: string | null
          created_at: string | null
          extracted_at: string | null
          extraction_confidence: number | null
          file_path: string
          file_size: number | null
          id: string
          period_end: string
          period_start: string
          processing_status: string | null
          user_id: string | null
        }
        Insert: {
          bank_account_id?: string | null
          created_at?: string | null
          extracted_at?: string | null
          extraction_confidence?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          period_end: string
          period_start: string
          processing_status?: string | null
          user_id?: string | null
        }
        Update: {
          bank_account_id?: string | null
          created_at?: string | null
          extracted_at?: string | null
          extraction_confidence?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          period_end?: string
          period_start?: string
          processing_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          policyDate: string | null
          policyName: string | null
          policyType: string | null
          source_id: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          policyDate?: string | null
          policyName?: string | null
          policyType?: string | null
          source_id?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          policyDate?: string | null
          policyName?: string | null
          policyType?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          extracted_text: string | null
          id: string
          notebook_id: string
          source_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          extracted_text?: string | null
          id?: string
          notebook_id: string
          source_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          extracted_text?: string | null
          id?: string
          notebook_id?: string
          source_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_policy_document_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "policy_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_documents: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          example_questions: string[] | null
          generation_status: string | null
          icon: string | null
          id: string
          role_assignment: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          example_questions?: string[] | null
          generation_status?: string | null
          icon?: string | null
          id?: string
          role_assignment?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          example_questions?: string[] | null
          generation_status?: string | null
          icon?: string | null
          id?: string
          role_assignment?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number | null
          confidence_score: number | null
          created_at: string | null
          file_path: string
          file_size: number | null
          id: string
          merchant: string | null
          ocr_data: Json | null
          processing_status: string | null
          receipt_date: string | null
          tax: number | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          confidence_score?: number | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          merchant?: string | null
          ocr_data?: Json | null
          processing_status?: string | null
          receipt_date?: string | null
          tax?: number | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          confidence_score?: number | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          merchant?: string | null
          ocr_data?: Json | null
          processing_status?: string | null
          receipt_date?: string | null
          tax?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      reconciliation_matches: {
        Row: {
          confidence: number
          created_at: string | null
          id: string
          receipt_id: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          confidence: number
          created_at?: string | null
          id?: string
          receipt_id?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string | null
          id?: string
          receipt_id?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_matches_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reconciliation_matches_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          content: string | null
          created_at: string
          display_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          notebook_id: string
          policyDate: string | null
          policyName: string | null
          policyType: string | null
          processing_status: string | null
          summary: string | null
          target_role: string | null
          title: string
          type: Database["public"]["Enums"]["source_type"]
          updated_at: string
          uploaded_by_user_id: string | null
          url: string | null
          visibility_scope: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          notebook_id: string
          policyDate?: string | null
          policyName?: string | null
          policyType?: string | null
          processing_status?: string | null
          summary?: string | null
          target_role?: string | null
          title: string
          type: Database["public"]["Enums"]["source_type"]
          updated_at?: string
          uploaded_by_user_id?: string | null
          url?: string | null
          visibility_scope?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          notebook_id?: string
          policyDate?: string | null
          policyName?: string | null
          policyType?: string | null
          processing_status?: string | null
          summary?: string | null
          target_role?: string | null
          title?: string
          type?: Database["public"]["Enums"]["source_type"]
          updated_at?: string
          uploaded_by_user_id?: string | null
          url?: string | null
          visibility_scope?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_policy_document_id_fkey"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "policy_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bank_statement_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          transaction_date: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bank_statement_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_date: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bank_statement_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_statement_id_fkey"
            columns: ["bank_statement_id"]
            isOneToOne: false
            referencedRelation: "bank_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tiers: {
        Row: {
          accounts_limit: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          receipts_monthly_limit: number | null
          tier: string
          transactions_monthly_limit: number | null
          updated_at: string | null
          upgraded_at: string | null
          user_id: string | null
        }
        Insert: {
          accounts_limit?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          receipts_monthly_limit?: number | null
          tier: string
          transactions_monthly_limit?: number | null
          updated_at?: string | null
          upgraded_at?: string | null
          user_id?: string | null
        }
        Update: {
          accounts_limit?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          receipts_monthly_limit?: number | null
          tier?: string
          transactions_monthly_limit?: number | null
          updated_at?: string | null
          upgraded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_document_role: {
        Args: {
          document_id: string
          target_role: string
          user_id_param?: string
        }
        Returns: boolean
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      can_user_modify_source: {
        Args: { source_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      get_user_role: {
        Args: { user_id_param?: string }
        Returns: string
      }
      get_user_role_safe: {
        Args: { user_id_param?: string }
        Returns: string
      }
      get_user_sources: {
        Args: { notebook_id_param: string; user_role_param?: string }
        Returns: {
          content: string
          created_at: string
          file_path: string
          file_size: number
          id: string
          metadata: Json
          notebook_id: string
          processing_status: string
          summary: string
          target_role: string
          title: string
          type: string
          updated_at: string
          uploaded_by_user_id: string
          url: string
          visibility_scope: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: { required_role: string; user_id_param?: string }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_policy_document_owner: {
        Args: { policy_document_id_param: string }
        Returns: boolean
      }
      is_policy_document_owner_for_document: {
        Args: { doc_metadata: Json }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      source_type: "pdf" | "text" | "website" | "youtube" | "audio"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      source_type: ["pdf", "text", "website", "youtube", "audio"],
    },
  },
} as const
