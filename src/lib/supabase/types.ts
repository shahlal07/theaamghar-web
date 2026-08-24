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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          phone: string | null
          postal_code: string | null
          profile_id: string
          province: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id: string
          province?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_id?: string
          province?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          actor_email: string
          actor_id: string | null
          created_at: string
          detail: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          vendor_id: string | null
        }
        Insert: {
          action: string
          actor_email: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          vendor_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          at: string
          detail: string
          entity: string
          id: string
        }
        Insert: {
          action: string
          actor: string
          at?: string
          detail?: string
          entity: string
          id?: string
        }
        Update: {
          action?: string
          actor?: string
          at?: string
          detail?: string
          entity?: string
          id?: string
        }
        Relationships: []
      }
      bug_reports: {
        Row: {
          admin_note: string | null
          ai_reply: string | null
          created_at: string
          description: string
          id: string
          profile_id: string | null
          reporter_email: string | null
          reporter_name: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reward_granted: boolean
          screenshot_path: string | null
          source: string
          status: string
          title: string
          vendor_id: string | null
        }
        Insert: {
          admin_note?: string | null
          ai_reply?: string | null
          created_at?: string
          description: string
          id?: string
          profile_id?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_granted?: boolean
          screenshot_path?: string | null
          source?: string
          status?: string
          title: string
          vendor_id?: string | null
        }
        Update: {
          admin_note?: string | null
          ai_reply?: string | null
          created_at?: string
          description?: string
          id?: string
          profile_id?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_granted?: boolean
          screenshot_path?: string | null
          source?: string
          status?: string
          title?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bug_reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bug_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bug_reports_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          business_address: string | null
          business_name: string
          cod_enabled: boolean
          currency: string
          default_shipping_cost: number
          facebook_url: string | null
          free_shipping_threshold: number | null
          google_maps_url: string | null
          instagram_url: string | null
          low_stock_alert_threshold: number
          payment_gateway_fee_percent: number
          support_email: string | null
          support_phone: string | null
          support_whatsapp: string | null
          tax_percent: number
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          vendor_id: string
          welcome_discount_enabled: boolean
          welcome_discount_percent: number
          whatsapp_order_message_template: string | null
          youtube_url: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string
          cod_enabled?: boolean
          currency?: string
          default_shipping_cost?: number
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          google_maps_url?: string | null
          instagram_url?: string | null
          low_stock_alert_threshold?: number
          payment_gateway_fee_percent?: number
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tax_percent?: number
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          vendor_id: string
          welcome_discount_enabled?: boolean
          welcome_discount_percent?: number
          whatsapp_order_message_template?: string | null
          youtube_url?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string
          cod_enabled?: boolean
          currency?: string
          default_shipping_cost?: number
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          google_maps_url?: string | null
          instagram_url?: string | null
          low_stock_alert_threshold?: number
          payment_gateway_fee_percent?: number
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tax_percent?: number
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          vendor_id?: string
          welcome_discount_enabled?: boolean
          welcome_discount_percent?: number
          whatsapp_order_message_template?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          box_size_id: string | null
          id: string
          profile_id: string
          qty: number
          updated_at: string
          variant_id: string | null
          vendor_id: string
        }
        Insert: {
          box_size_id?: string | null
          id?: string
          profile_id: string
          qty: number
          updated_at?: string
          variant_id?: string | null
          vendor_id: string
        }
        Update: {
          box_size_id?: string | null
          id?: string
          profile_id?: string
          qty?: number
          updated_at?: string
          variant_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_box_size_id_fkey"
            columns: ["box_size_id"]
            isOneToOne: false
            referencedRelation: "product_box_sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          vendor_id: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          vendor_id: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      category_product_schemas: {
        Row: {
          category: string
          display_order: number
          fields: string[]
          model: Database["public"]["Enums"]["product_model"]
          note: string
          variant_example: string | null
        }
        Insert: {
          category: string
          display_order?: number
          fields?: string[]
          model: Database["public"]["Enums"]["product_model"]
          note?: string
          variant_example?: string | null
        }
        Update: {
          category?: string
          display_order?: number
          fields?: string[]
          model?: Database["public"]["Enums"]["product_model"]
          note?: string
          variant_example?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          customer_id: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
          min_order_amount: number
          starts_at: string | null
          updated_at: string
          used_count: number
          vendor_id: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          customer_id?: string | null
          discount_type: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number
          starts_at?: string | null
          updated_at?: string
          used_count?: number
          vendor_id: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          customer_id?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_order_amount?: number
          starts_at?: string | null
          updated_at?: string
          used_count?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      currency_rates: {
        Row: {
          currency: string
          rate_to_pkr: number
          updated_at: string
        }
        Insert: {
          currency: string
          rate_to_pkr: number
          updated_at?: string
        }
        Update: {
          currency?: string
          rate_to_pkr?: number
          updated_at?: string
        }
        Relationships: []
      }
      customer_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          profile_id: string
          read: boolean
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          profile_id: string
          read?: boolean
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          profile_id?: string
          read?: boolean
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_entries: {
        Row: {
          active: boolean
          answer: string
          category: string | null
          created_at: string
          id: string
          keywords: string[]
          question: string
          sort_order: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          keywords?: string[]
          question: string
          sort_order?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          keywords?: string[]
          question?: string
          sort_order?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_entries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_applications: {
        Row: {
          email: string
          follower_count: number
          id: string
          name: string
          pitch: string
          platform: Database["public"]["Enums"]["influencer_platform"]
          social_handle: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
        }
        Insert: {
          email: string
          follower_count?: number
          id?: string
          name: string
          pitch?: string
          platform: Database["public"]["Enums"]["influencer_platform"]
          social_handle: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
        }
        Update: {
          email?: string
          follower_count?: number
          id?: string
          name?: string
          pitch?: string
          platform?: Database["public"]["Enums"]["influencer_platform"]
          social_handle?: string
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
        }
        Relationships: []
      }
      influencer_program_settings: {
        Row: {
          cut_duration_months: number
          default_cut_percent: number
          enabled: boolean
          id: boolean
          min_follower_count: number
        }
        Insert: {
          cut_duration_months?: number
          default_cut_percent?: number
          enabled?: boolean
          id?: boolean
          min_follower_count?: number
        }
        Update: {
          cut_duration_months?: number
          default_cut_percent?: number
          enabled?: boolean
          id?: boolean
          min_follower_count?: number
        }
        Relationships: []
      }
      influencer_referred_vendors: {
        Row: {
          influencer_id: string
          referred_at: string
          vendor_id: string
        }
        Insert: {
          influencer_id: string
          referred_at?: string
          vendor_id: string
        }
        Update: {
          influencer_id?: string
          referred_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_referred_vendors_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_referred_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          account_id: string | null
          cut_percent: number
          email: string
          follower_count: number
          id: string
          joined_at: string
          name: string
          platform: Database["public"]["Enums"]["influencer_platform"]
          referral_code: string
          social_handle: string
          status: Database["public"]["Enums"]["influencer_status"]
        }
        Insert: {
          account_id?: string | null
          cut_percent?: number
          email: string
          follower_count?: number
          id?: string
          joined_at?: string
          name: string
          platform: Database["public"]["Enums"]["influencer_platform"]
          referral_code: string
          social_handle: string
          status?: Database["public"]["Enums"]["influencer_status"]
        }
        Update: {
          account_id?: string | null
          cut_percent?: number
          email?: string
          follower_count?: number
          id?: string
          joined_at?: string
          name?: string
          platform?: Database["public"]["Enums"]["influencer_platform"]
          referral_code?: string
          social_handle?: string
          status?: Database["public"]["Enums"]["influencer_status"]
        }
        Relationships: [
          {
            foreignKeyName: "influencers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "platform_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_audit_log: {
        Row: {
          box_size_id: string | null
          change_qty: number
          created_at: string
          id: string
          new_qty: number
          note: string | null
          order_id: string | null
          previous_qty: number
          product_id: string
          reason: string
          variant_id: string | null
          vendor_id: string
        }
        Insert: {
          box_size_id?: string | null
          change_qty: number
          created_at?: string
          id?: string
          new_qty: number
          note?: string | null
          order_id?: string | null
          previous_qty: number
          product_id: string
          reason: string
          variant_id?: string | null
          vendor_id: string
        }
        Update: {
          box_size_id?: string | null
          change_qty?: number
          created_at?: string
          id?: string
          new_qty?: number
          note?: string | null
          order_id?: string | null
          previous_qty?: number
          product_id?: string
          reason?: string
          variant_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_audit_log_box_size_id_fkey"
            columns: ["box_size_id"]
            isOneToOne: false
            referencedRelation: "product_box_sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_audit_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_audit_log_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_audit_log_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_audit_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      mango_game_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          meta: Json | null
          points: number
          profile_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          meta?: Json | null
          points: number
          profile_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          meta?: Json | null
          points?: number
          profile_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mango_game_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mango_game_events_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_item_stock_warnings: {
        Row: {
          created_at: string
          id: string
          item: Json
          order_id: string
          reason: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item: Json
          order_id: string
          reason: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item?: Json
          order_id?: string
          reason?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_stock_warnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_stock_warnings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cost_snapshot: Json | null
          courier_name: string | null
          created_at: string
          customer_id: string
          delivery: Json
          discount_amount: number
          discount_code: string | null
          gift_message: string | null
          gift_recipient_name: string | null
          id: string
          idempotency_key: string | null
          is_gift: boolean
          items: Json
          order_number: string
          payment_account_id: string | null
          payment_method: string | null
          payment_proof_uploaded_at: string | null
          payment_proof_url: string | null
          payment_rejection_reason: string | null
          payment_status: string
          payment_verified_at: string | null
          payment_verified_by: string | null
          platform_fee_amount: number
          platform_fee_percent_snapshot: number | null
          profit: number
          shipping_fee: number
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cost_snapshot?: Json | null
          courier_name?: string | null
          created_at?: string
          customer_id: string
          delivery: Json
          discount_amount?: number
          discount_code?: string | null
          gift_message?: string | null
          gift_recipient_name?: string | null
          id?: string
          idempotency_key?: string | null
          is_gift?: boolean
          items: Json
          order_number?: string
          payment_account_id?: string | null
          payment_method?: string | null
          payment_proof_uploaded_at?: string | null
          payment_proof_url?: string | null
          payment_rejection_reason?: string | null
          payment_status?: string
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          platform_fee_amount?: number
          platform_fee_percent_snapshot?: number | null
          profit?: number
          shipping_fee?: number
          status?: string
          subtotal: number
          total: number
          tracking_number?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cost_snapshot?: Json | null
          courier_name?: string | null
          created_at?: string
          customer_id?: string
          delivery?: Json
          discount_amount?: number
          discount_code?: string | null
          gift_message?: string | null
          gift_recipient_name?: string | null
          id?: string
          idempotency_key?: string | null
          is_gift?: boolean
          items?: Json
          order_number?: string
          payment_account_id?: string | null
          payment_method?: string | null
          payment_proof_uploaded_at?: string | null
          payment_proof_url?: string | null
          payment_rejection_reason?: string | null
          payment_status?: string
          payment_verified_at?: string | null
          payment_verified_by?: string | null
          platform_fee_amount?: number
          platform_fee_percent_snapshot?: number | null
          profit?: number
          shipping_fee?: number
          status?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payment_account_id_fkey"
            columns: ["payment_account_id"]
            isOneToOne: false
            referencedRelation: "payment_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payment_verified_by_fkey"
            columns: ["payment_verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_accounts: {
        Row: {
          account_number: string
          account_title: string
          active: boolean
          bank_name: string | null
          created_at: string
          iban: string | null
          id: string
          instructions: string | null
          label: string
          method: string
          qr_code_url: string | null
          sort_order: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          account_number: string
          account_title: string
          active?: boolean
          bank_name?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          instructions?: string | null
          label: string
          method: string
          qr_code_url?: string | null
          sort_order?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          account_number?: string
          account_title?: string
          active?: boolean
          bank_name?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          instructions?: string | null
          label?: string
          method?: string
          qr_code_url?: string | null
          sort_order?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_accounts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          onboarding_completed_at: string | null
          phone: string | null
          provider: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          onboarding_completed_at?: string | null
          phone?: string | null
          provider?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_completed_at?: string | null
          phone?: string | null
          provider?: string
        }
        Relationships: []
      }
      platform_pricing: {
        Row: {
          custom_domain_fee: number
          id: boolean
          monthly_break_even_orders: number
          monthly_fee: number
          per_order_fee: number
          platform_fee_fixed_amount: number
          platform_fee_type: string
        }
        Insert: {
          custom_domain_fee?: number
          id?: boolean
          monthly_break_even_orders?: number
          monthly_fee?: number
          per_order_fee?: number
          platform_fee_fixed_amount?: number
          platform_fee_type?: string
        }
        Update: {
          custom_domain_fee?: number
          id?: boolean
          monthly_break_even_orders?: number
          monthly_fee?: number
          per_order_fee?: number
          platform_fee_fixed_amount?: number
          platform_fee_type?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          application_sla_hours: number
          applications_paused: boolean
          created_at: string
          default_applicant_plan: Database["public"]["Enums"]["pricing_plan"]
          id: boolean
          platform_fee_fixed_amount: number
          platform_fee_percent: number
          platform_fee_type: string
          platform_name: string
          support_email: string
          tagline: string
          updated_at: string
        }
        Insert: {
          application_sla_hours?: number
          applications_paused?: boolean
          created_at?: string
          default_applicant_plan?: Database["public"]["Enums"]["pricing_plan"]
          id?: boolean
          platform_fee_fixed_amount?: number
          platform_fee_percent?: number
          platform_fee_type?: string
          platform_name?: string
          support_email?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          application_sla_hours?: number
          applications_paused?: boolean
          created_at?: string
          default_applicant_plan?: Database["public"]["Enums"]["pricing_plan"]
          id?: boolean
          platform_fee_fixed_amount?: number
          platform_fee_percent?: number
          platform_fee_type?: string
          platform_name?: string
          support_email?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_site_content: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      product_box_sizes: {
        Row: {
          active: boolean
          box_size_kg: number
          created_at: string
          id: string
          low_stock_threshold: number
          product_id: string
          selling_price: number
          stock_qty: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          box_size_kg: number
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id: string
          selling_price: number
          stock_qty?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          box_size_kg?: number
          created_at?: string
          id?: string
          low_stock_threshold?: number
          product_id?: string
          selling_price?: number
          stock_qty?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_box_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_box_sizes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_type_fields: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          product_type_id: string
          scope: string
          sort_order: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          product_type_id: string
          scope: string
          sort_order?: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          product_type_id?: string
          scope?: string
          sort_order?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_type_fields_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_type_fields_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string
          id: string
          is_builtin: boolean
          label: string
          slug: string
          sort_order: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_builtin?: boolean
          label: string
          slug: string
          sort_order?: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_builtin?: boolean
          label?: string
          slug?: string
          sort_order?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_types_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          active: boolean
          attributes: Json
          created_at: string
          id: string
          label: string | null
          low_stock_threshold: number
          product_id: string
          selling_price: number
          sku: string | null
          sort_order: number
          stock_qty: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          attributes?: Json
          created_at?: string
          id?: string
          label?: string | null
          low_stock_threshold?: number
          product_id: string
          selling_price: number
          sku?: string | null
          sort_order?: number
          stock_qty?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          attributes?: Json
          created_at?: string
          id?: string
          label?: string | null
          low_stock_threshold?: number
          product_id?: string
          selling_price?: number
          sku?: string | null
          sort_order?: number
          stock_qty?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          branding_sticker_cost: number | null
          category_id: string | null
          created_at: string
          description: string[]
          discount_price: number | null
          fiber: string | null
          foam_paper_cost: number | null
          gallery: string[]
          harvest_season_end: string | null
          harvest_season_start: string | null
          id: string
          image: string | null
          is_seasonal: boolean
          labour_cost: number | null
          low_stock_threshold: number
          marketing_cost_per_order: number | null
          misc_cost: number | null
          name: string
          origin: string | null
          packaging_box_cost: number | null
          price: number | null
          product_type: string
          purchase_price_per_kg: number | null
          rating_avg: number
          recipe_suggestions: string[]
          review_count: number
          ripening_tip: string | null
          season: string | null
          selling_price: number | null
          slug: string
          sort_order: number
          status: string
          stock_qty: number | null
          storage_tip: string | null
          sweetness: string | null
          tagline: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string
          vendor_id: string
          weight_note: string | null
        }
        Insert: {
          attributes?: Json
          branding_sticker_cost?: number | null
          category_id?: string | null
          created_at?: string
          description?: string[]
          discount_price?: number | null
          fiber?: string | null
          foam_paper_cost?: number | null
          gallery?: string[]
          harvest_season_end?: string | null
          harvest_season_start?: string | null
          id?: string
          image?: string | null
          is_seasonal?: boolean
          labour_cost?: number | null
          low_stock_threshold?: number
          marketing_cost_per_order?: number | null
          misc_cost?: number | null
          name: string
          origin?: string | null
          packaging_box_cost?: number | null
          price?: number | null
          product_type?: string
          purchase_price_per_kg?: number | null
          rating_avg?: number
          recipe_suggestions?: string[]
          review_count?: number
          ripening_tip?: string | null
          season?: string | null
          selling_price?: number | null
          slug: string
          sort_order?: number
          status?: string
          stock_qty?: number | null
          storage_tip?: string | null
          sweetness?: string | null
          tagline?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
          vendor_id: string
          weight_note?: string | null
        }
        Update: {
          attributes?: Json
          branding_sticker_cost?: number | null
          category_id?: string | null
          created_at?: string
          description?: string[]
          discount_price?: number | null
          fiber?: string | null
          foam_paper_cost?: number | null
          gallery?: string[]
          harvest_season_end?: string | null
          harvest_season_start?: string | null
          id?: string
          image?: string | null
          is_seasonal?: boolean
          labour_cost?: number | null
          low_stock_threshold?: number
          marketing_cost_per_order?: number | null
          misc_cost?: number | null
          name?: string
          origin?: string | null
          packaging_box_cost?: number | null
          price?: number | null
          product_type?: string
          purchase_price_per_kg?: number | null
          rating_avg?: number
          recipe_suggestions?: string[]
          review_count?: number
          ripening_tip?: string | null
          season?: string | null
          selling_price?: number | null
          slug?: string
          sort_order?: number
          status?: string
          stock_qty?: number | null
          storage_tip?: string | null
          sweetness?: string | null
          tagline?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
          vendor_id?: string
          weight_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          email: string | null
          email_verified_at: string | null
          gender: string | null
          id: string
          mango_credits: number
          mango_lifetime_points: number
          name: string | null
          notification_prefs: Json
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          role: string
          vendor_id: string | null
          welcome_discount_claimed_at: string | null
          welcome_discount_percent: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          email?: string | null
          email_verified_at?: string | null
          gender?: string | null
          id: string
          mango_credits?: number
          mango_lifetime_points?: number
          name?: string | null
          notification_prefs?: Json
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          vendor_id?: string | null
          welcome_discount_claimed_at?: string | null
          welcome_discount_percent?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string | null
          email_verified_at?: string | null
          gender?: string | null
          id?: string
          mango_credits?: number
          mango_lifetime_points?: number
          name?: string | null
          notification_prefs?: Json
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          vendor_id?: string | null
          welcome_discount_claimed_at?: string | null
          welcome_discount_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      review_helpful_votes: {
        Row: {
          created_at: string
          profile_id: string
          review_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          review_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          review_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpful_votes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          admin_reply_at: string | null
          admin_reply_body: string | null
          admin_reply_by: string | null
          admin_reply_images: string[]
          body: string
          created_at: string
          delivery_rating: number | null
          freshness_rating: number | null
          helpful_count: number
          id: string
          images: string[]
          packaging_rating: number | null
          product_id: string
          profile_id: string
          rating: number
          taste_rating: number | null
          title: string | null
          vendor_id: string
          verified_purchase: boolean
        }
        Insert: {
          admin_reply_at?: string | null
          admin_reply_body?: string | null
          admin_reply_by?: string | null
          admin_reply_images?: string[]
          body: string
          created_at?: string
          delivery_rating?: number | null
          freshness_rating?: number | null
          helpful_count?: number
          id?: string
          images?: string[]
          packaging_rating?: number | null
          product_id: string
          profile_id: string
          rating: number
          taste_rating?: number | null
          title?: string | null
          vendor_id: string
          verified_purchase?: boolean
        }
        Update: {
          admin_reply_at?: string | null
          admin_reply_body?: string | null
          admin_reply_by?: string | null
          admin_reply_images?: string[]
          body?: string
          created_at?: string
          delivery_rating?: number | null
          freshness_rating?: number | null
          helpful_count?: number
          id?: string
          images?: string[]
          packaging_rating?: number | null
          product_id?: string
          profile_id?: string
          rating?: number
          taste_rating?: number | null
          title?: string | null
          vendor_id?: string
          verified_purchase?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_admin_reply_by_fkey"
            columns: ["admin_reply_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_redemptions: {
        Row: {
          coupon_code: string
          credits: number
          id: string
          redeemed_at: string
          tier: string
          vendor_id: string
        }
        Insert: {
          coupon_code: string
          credits?: number
          id?: string
          redeemed_at?: string
          tier: string
          vendor_id: string
        }
        Update: {
          coupon_code?: string
          credits?: number
          id?: string
          redeemed_at?: string
          tier?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sent_announcements: {
        Row: {
          category: Database["public"]["Enums"]["announcement_category"]
          id: string
          message: string
          recipient_count: number
          sent_at: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["announcement_category"]
          id?: string
          message: string
          recipient_count?: number
          sent_at?: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["announcement_category"]
          id?: string
          message?: string
          recipient_count?: number
          sent_at?: string
          title?: string
        }
        Relationships: []
      }
      settlement_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: Database["public"]["Enums"]["settlement_payment_method"]
          notes: string
          paid_at: string
          paid_by: string | null
          reference: string
          settlement_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["settlement_payment_method"]
          notes?: string
          paid_at?: string
          paid_by?: string | null
          reference?: string
          settlement_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["settlement_payment_method"]
          notes?: string
          paid_at?: string
          paid_by?: string | null
          reference?: string
          settlement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_payments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlement_payments_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          amount_paid: number
          due_date: string | null
          gross_revenue: number
          id: string
          month: string
          orders_count: number
          platform_fee: number
          reversed_reason: string | null
          status: Database["public"]["Enums"]["settlement_status"]
          updated_at: string
          vendor_id: string
          waived_reason: string | null
        }
        Insert: {
          amount_paid?: number
          due_date?: string | null
          gross_revenue?: number
          id?: string
          month: string
          orders_count?: number
          platform_fee?: number
          reversed_reason?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          updated_at?: string
          vendor_id: string
          waived_reason?: string | null
        }
        Update: {
          amount_paid?: number
          due_date?: string | null
          gross_revenue?: number
          id?: string
          month?: string
          orders_count?: number
          platform_fee?: number
          reversed_reason?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          updated_at?: string
          vendor_id?: string
          waived_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          active: boolean
          city: string | null
          created_at: string
          id: string
          province: string
          rate: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          province: string
          rate: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          province?: string
          rate?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          updated_at: string
          vendor_id: string
        }
        Insert: {
          content?: Json
          updated_at?: string
          vendor_id: string
        }
        Update: {
          content?: Json
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_content_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          added_at: string
          avatar_url: string | null
          email: string
          id: string
          last_active_at: string
          name: string
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          added_at?: string
          avatar_url?: string | null
          email: string
          id: string
          last_active_at?: string
          name: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          added_at?: string
          avatar_url?: string | null
          email?: string
          id?: string
          last_active_at?: string
          name?: string
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: []
      }
      storefront_orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          payment_method: string
          payment_screenshot_url: string | null
          status: Database["public"]["Enums"]["storefront_order_status"]
          total_amount: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          items: Json
          payment_method?: string
          payment_screenshot_url?: string | null
          status?: Database["public"]["Enums"]["storefront_order_status"]
          total_amount: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          payment_method?: string
          payment_screenshot_url?: string | null
          status?: Database["public"]["Enums"]["storefront_order_status"]
          total_amount?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_products: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string | null
          name: string
          options: Json
          price: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          options?: Json
          price: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          options?: Json
          price?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      support_conversations: {
        Row: {
          admin_unread: boolean
          created_at: string
          customer_id: string
          customer_unread: boolean
          id: string
          last_message_at: string
          last_message_by: string
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          admin_unread?: boolean
          created_at?: string
          customer_id: string
          customer_unread?: boolean
          id?: string
          last_message_at?: string
          last_message_by?: string
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          admin_unread?: boolean
          created_at?: string
          customer_id?: string
          customer_unread?: boolean
          id?: string
          last_message_at?: string
          last_message_by?: string
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_conversations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string | null
          sender_type: string
          vendor_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id?: string | null
          sender_type: string
          vendor_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string | null
          sender_type?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "support_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_health: {
        Row: {
          auth_failed_attempts: number
          failed_orders: number
          failure_rate: number
          last_order_at: string | null
          stock_warnings: number
          total_orders: number
          vendor_id: string
        }
        Insert: {
          auth_failed_attempts?: number
          failed_orders?: number
          failure_rate?: number
          last_order_at?: string | null
          stock_warnings?: number
          total_orders?: number
          vendor_id: string
        }
        Update: {
          auth_failed_attempts?: number
          failed_orders?: number
          failure_rate?: number
          last_order_at?: string | null
          stock_warnings?: number
          total_orders?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_health_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_admins: {
        Row: {
          added_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["vendor_admin_role"]
          vendor_id: string
        }
        Insert: {
          added_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["vendor_admin_role"]
          vendor_id: string
        }
        Update: {
          added_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["vendor_admin_role"]
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_admins_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_applications: {
        Row: {
          applicant_account_id: string | null
          business_name: string
          business_type: string
          city: string
          id: string
          message: string
          owner_email: string
          owner_name: string
          owner_phone: string
          reference_id: string
          referral_code: string | null
          requested_plan: Database["public"]["Enums"]["pricing_plan"]
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"]
          subdomain_preference: string
          submitted_at: string
        }
        Insert: {
          applicant_account_id?: string | null
          business_name: string
          business_type: string
          city: string
          id?: string
          message?: string
          owner_email: string
          owner_name: string
          owner_phone: string
          reference_id: string
          referral_code?: string | null
          requested_plan?: Database["public"]["Enums"]["pricing_plan"]
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          subdomain_preference: string
          submitted_at?: string
        }
        Update: {
          applicant_account_id?: string | null
          business_name?: string
          business_type?: string
          city?: string
          id?: string
          message?: string
          owner_email?: string
          owner_name?: string
          owner_phone?: string
          reference_id?: string
          referral_code?: string | null
          requested_plan?: Database["public"]["Enums"]["pricing_plan"]
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          subdomain_preference?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_applicant_account_id_fkey"
            columns: ["applicant_account_id"]
            isOneToOne: false
            referencedRelation: "platform_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_loyalty: {
        Row: {
          credits: number
          lifetime_points: number
          vendor_id: string
        }
        Insert: {
          credits?: number
          lifetime_points?: number
          vendor_id: string
        }
        Update: {
          credits?: number
          lifetime_points?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_loyalty_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_monthly_settlements: {
        Row: {
          created_at: string | null
          gross_revenue: number
          month: string
          platform_fee: number
          settled_at: string | null
          settled_by: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          gross_revenue?: number
          month: string
          platform_fee?: number
          settled_at?: string | null
          settled_by?: string | null
          status?: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          gross_revenue?: number
          month?: string
          platform_fee?: number
          settled_at?: string | null
          settled_by?: string | null
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_monthly_settlements_settled_by_fkey"
            columns: ["settled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_monthly_settlements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payment_gateways: {
        Row: {
          active: boolean
          created_at: string | null
          credentials_encrypted: string
          id: string
          merchant_id: string
          provider: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          credentials_encrypted: string
          id?: string
          merchant_id: string
          provider: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          credentials_encrypted?: string
          id?: string
          merchant_id?: string
          provider?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payment_gateways_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payment_methods: {
        Row: {
          account_name: string
          account_number: string
          active: boolean
          created_at: string
          id: string
          method: Database["public"]["Enums"]["vendor_payment_method_type"]
          qr_code_url: string | null
          vendor_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          active?: boolean
          created_at?: string
          id?: string
          method: Database["public"]["Enums"]["vendor_payment_method_type"]
          qr_code_url?: string | null
          vendor_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          active?: boolean
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["vendor_payment_method_type"]
          qr_code_url?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payment_methods_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_preview_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_preview_images_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          accent_color: string | null
          accent_emoji: string | null
          active: boolean
          brand_colors: Json | null
          carrier_name: string | null
          category: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string
          custom_domain: string | null
          description: string | null
          email: string | null
          favicon_url: string | null
          fee_override_fixed_amount: number | null
          fee_override_percent: number | null
          fee_type: string
          id: string
          instagram_url: string | null
          joined_at: string | null
          logo_url: string | null
          name: string
          orders_last_30d: number
          phone_display: string | null
          phone_href: string | null
          plan: Database["public"]["Enums"]["pricing_plan"] | null
          platform_fee_fixed_amount: number | null
          platform_fee_percent: number | null
          platform_fee_type: string | null
          provision_id: string | null
          revenue_last_30d: number
          slug: string
          status: string
          subdomain: string
          tagline: string | null
          theme_accent_from: string | null
          theme_accent_to: string | null
          theme_font: string | null
          theme_logo_emoji: string | null
          theme_logo_url: string | null
          updated_at: string | null
          whatsapp_number: string | null
          white_label_enabled: boolean
          youtube_url: string | null
        }
        Insert: {
          accent_color?: string | null
          accent_emoji?: string | null
          active?: boolean
          brand_colors?: Json | null
          carrier_name?: string | null
          category?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          custom_domain?: string | null
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          fee_override_fixed_amount?: number | null
          fee_override_percent?: number | null
          fee_type?: string
          id?: string
          instagram_url?: string | null
          joined_at?: string | null
          logo_url?: string | null
          name: string
          orders_last_30d?: number
          phone_display?: string | null
          phone_href?: string | null
          plan?: Database["public"]["Enums"]["pricing_plan"] | null
          platform_fee_fixed_amount?: number | null
          platform_fee_percent?: number | null
          platform_fee_type?: string | null
          provision_id?: string | null
          revenue_last_30d?: number
          slug: string
          status?: string
          subdomain: string
          tagline?: string | null
          theme_accent_from?: string | null
          theme_accent_to?: string | null
          theme_font?: string | null
          theme_logo_emoji?: string | null
          theme_logo_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
          white_label_enabled?: boolean
          youtube_url?: string | null
        }
        Update: {
          accent_color?: string | null
          accent_emoji?: string | null
          active?: boolean
          brand_colors?: Json | null
          carrier_name?: string | null
          category?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string
          custom_domain?: string | null
          description?: string | null
          email?: string | null
          favicon_url?: string | null
          fee_override_fixed_amount?: number | null
          fee_override_percent?: number | null
          fee_type?: string
          id?: string
          instagram_url?: string | null
          joined_at?: string | null
          logo_url?: string | null
          name?: string
          orders_last_30d?: number
          phone_display?: string | null
          phone_href?: string | null
          plan?: Database["public"]["Enums"]["pricing_plan"] | null
          platform_fee_fixed_amount?: number | null
          platform_fee_percent?: number | null
          platform_fee_type?: string | null
          provision_id?: string | null
          revenue_last_30d?: number
          slug?: string
          status?: string
          subdomain?: string
          tagline?: string | null
          theme_accent_from?: string | null
          theme_accent_to?: string | null
          theme_font?: string | null
          theme_logo_emoji?: string | null
          theme_logo_url?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
          white_label_enabled?: boolean
          youtube_url?: string | null
        }
        Relationships: []
      }
      webhook_subscriptions: {
        Row: {
          active: boolean
          created_at: string
          event_type: string
          id: string
          last_status_code: number | null
          last_triggered_at: string | null
          secret: string
          url: string
          vendor_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          event_type?: string
          id?: string
          last_status_code?: number | null
          last_triggered_at?: string | null
          secret: string
          url: string
          vendor_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          event_type?: string
          id?: string
          last_status_code?: number | null
          last_triggered_at?: string | null
          secret?: string
          url?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          product_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_business_settings: {
        Row: {
          business_address: string | null
          business_name: string | null
          cod_enabled: boolean | null
          currency: string | null
          default_shipping_cost: number | null
          facebook_url: string | null
          free_shipping_threshold: number | null
          google_maps_url: string | null
          instagram_url: string | null
          support_email: string | null
          support_phone: string | null
          support_whatsapp: string | null
          tiktok_url: string | null
          twitter_url: string | null
          vendor_id: string | null
          welcome_discount_enabled: boolean | null
          welcome_discount_percent: number | null
          whatsapp_order_message_template: string | null
          youtube_url: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          cod_enabled?: boolean | null
          currency?: string | null
          default_shipping_cost?: number | null
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          google_maps_url?: string | null
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          vendor_id?: string | null
          welcome_discount_enabled?: boolean | null
          welcome_discount_percent?: number | null
          whatsapp_order_message_template?: string | null
          youtube_url?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          cod_enabled?: boolean | null
          currency?: string | null
          default_shipping_cost?: number | null
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          google_maps_url?: string | null
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          vendor_id?: string | null
          welcome_discount_enabled?: boolean | null
          welcome_discount_percent?: number | null
          whatsapp_order_message_template?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adjust_stock_for_order_items: {
        Args: {
          p_direction: number
          p_items: Json
          p_order_id: string
          p_reason: string
        }
        Returns: undefined
      }
      admin_adjust_mango_points: {
        Args: { p_delta: number; p_profile_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      admin_best_sellers: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          kind: string
          name: string
          qty: number
        }[]
      }
      admin_confirm_bug_report: {
        Args: { p_admin_note?: string; p_bug_id: string }
        Returns: undefined
      }
      admin_dashboard_summary: {
        Args: { p_from: string; p_to: string }
        Returns: {
          average_order_value: number
          cod_pending_amount: number
          cod_pending_count: number
          cod_received_amount: number
          cod_received_count: number
          new_customers: number
          returning_customers: number
          status_counts: Json
          total_orders: number
          total_profit: number
          total_revenue: number
        }[]
      }
      admin_day_of_week_series: {
        Args: { p_from: string; p_to: string }
        Returns: {
          dow: number
          orders: number
          revenue: number
        }[]
      }
      admin_order_series: {
        Args: {
          p_bucket: string
          p_from: string
          p_limit?: number
          p_to: string
        }
        Returns: {
          bucket_key: string
          orders: number
          profit: number
          revenue: number
        }[]
      }
      admin_orders_by_city: {
        Args: { p_from: string; p_limit?: number; p_to: string }
        Returns: {
          city: string
          orders: number
        }[]
      }
      admin_payment_method_split: {
        Args: { p_from: string; p_to: string }
        Returns: {
          count: number
          method: string
          revenue: number
        }[]
      }
      admin_reject_bug_report: {
        Args: { p_admin_note: string; p_bug_id: string }
        Returns: undefined
      }
      admin_remove_from_leaderboard: {
        Args: { p_profile_id: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      attach_payment_proof: {
        Args: { p_order_number: string; p_proof_path: string }
        Returns: undefined
      }
      award_review_points: {
        Args: { p_review_id: string }
        Returns: {
          message: string
          points_awarded: number
          success: boolean
        }[]
      }
      calculate_order_profit: {
        Args: {
          p_items: Json
          p_order_id?: string
          p_payment_method: string
          p_shipping_fee: number
          p_vendor_id?: string
        }
        Returns: {
          cost_snapshot: Json
          profit: number
        }[]
      }
      cancel_own_order: {
        Args: { p_order_id: string; p_reason: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      check_and_record_coupon_attempt: {
        Args: { p_identifier: string }
        Returns: {
          allowed: boolean
          retry_after: string
        }[]
      }
      check_and_record_login_attempt: {
        Args: { p_identifier: string }
        Returns: {
          allowed: boolean
          retry_after: string
        }[]
      }
      check_and_record_rate_limit: {
        Args: {
          p_bucket: string
          p_identifier: string
          p_lock_minutes: number
          p_max_attempts: number
          p_window_minutes: number
        }
        Returns: {
          allowed: boolean
          retry_after: string
        }[]
      }
      claim_daily_checkin: {
        Args: never
        Returns: {
          message: string
          points_awarded: number
          streak: number
          success: boolean
        }[]
      }
      claim_welcome_discount: {
        Args: never
        Returns: {
          discount_percent: number
        }[]
      }
      find_application_by_reference: {
        Args: { p_query: string }
        Returns: {
          business_name: string
          city: string
          owner_email: string
          reference_id: string
          referral_code: string
          requested_plan: Database["public"]["Enums"]["pricing_plan"]
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
        }[]
      }
      find_order_by_number_and_email: {
        Args: { p_email: string; p_order_number: string }
        Returns: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cost_snapshot: Json | null
          courier_name: string | null
          created_at: string
          customer_id: string
          delivery: Json
          discount_amount: number
          discount_code: string | null
          gift_message: string | null
          gift_recipient_name: string | null
          id: string
          idempotency_key: string | null
          is_gift: boolean
          items: Json
          order_number: string
          payment_account_id: string | null
          payment_method: string | null
          payment_proof_uploaded_at: string | null
          payment_proof_url: string | null
          payment_rejection_reason: string | null
          payment_status: string
          payment_verified_at: string | null
          payment_verified_by: string | null
          platform_fee_amount: number
          platform_fee_percent_snapshot: number | null
          profit: number
          shipping_fee: number
          status: string
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
          vendor_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      generate_vendor_settlement: {
        Args: { p_month: string; p_vendor_id: string }
        Returns: {
          created_at: string | null
          gross_revenue: number
          month: string
          platform_fee: number
          settled_at: string | null
          settled_by: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_monthly_settlements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_mango_leaderboard: {
        Args: never
        Returns: {
          display_name: string
          lifetime_points: number
          rank: number
        }[]
      }
      get_or_create_referral_code: { Args: never; Returns: string }
      grant_welcome_discount: {
        Args: never
        Returns: {
          discount_percent: number
        }[]
      }
      increment_coupon_usage: { Args: { p_code: string }; Returns: undefined }
      is_finance_staff: { Args: never; Returns: boolean }
      is_mutating_staff: { Args: never; Returns: boolean }
      is_referrer_of_own_vendor: {
        Args: { p_influencer_id: string }
        Returns: boolean
      }
      is_staff: { Args: never; Returns: boolean }
      is_subdomain_taken: { Args: { p_subdomain: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      link_referral: {
        Args: { p_code: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      mark_review_helpful: { Args: { p_review_id: string }; Returns: number }
      mark_settlement_settled: {
        Args: { p_month: string; p_vendor_id: string }
        Returns: {
          created_at: string | null
          gross_revenue: number
          month: string
          platform_fee: number
          settled_at: string | null
          settled_by: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_monthly_settlements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_support_conversation_read: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      own_vendor_id: { Args: never; Returns: string }
      platform_tenant_health: {
        Args: { p_days?: number }
        Returns: {
          auth_failed_attempts: number
          failed_orders: number
          last_order_at: string
          order_failure_rate: number
          stock_warnings: number
          total_orders: number
          vendor_id: string
          vendor_name: string
          vendor_status: string
        }[]
      }
      product_has_order_history: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      redeem_mango_credits: {
        Args: { p_tier: string }
        Returns: {
          coupon_code: string
          message: string
          success: boolean
        }[]
      }
      reset_login_attempts: {
        Args: { p_identifier: string }
        Returns: undefined
      }
      resolve_vendor_by_host: {
        Args: { p_host: string }
        Returns: {
          active: boolean
          id: string
        }[]
      }
      send_admin_support_message: {
        Args: {
          p_body: string
          p_conversation_id?: string
          p_customer_id: string
          p_vendor_id?: string
        }
        Returns: string
      }
      send_customer_support_message: {
        Args: { p_body: string; p_conversation_id: string }
        Returns: undefined
      }
      start_support_conversation: {
        Args: { p_body: string; p_vendor_id: string }
        Returns: string
      }
      unclaim_welcome_discount: { Args: never; Returns: undefined }
      update_own_order_delivery: {
        Args: {
          p_address: string
          p_city: string
          p_full_name: string
          p_notes: string
          p_order_id: string
          p_phone: string
          p_postal_code: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      validate_coupon: {
        Args: {
          p_code: string
          p_customer_id?: string
          p_order_amount: number
          p_vendor_id: string
        }
        Returns: {
          discount_type: string
          discount_value: number
          message: string
          valid: boolean
        }[]
      }
      vendor_has_active_gateway: {
        Args: { p_provider: string; p_vendor_id: string }
        Returns: boolean
      }
    }
    Enums: {
      announcement_category: "product_update" | "policy_change" | "promotion"
      application_status: "pending" | "approved" | "rejected"
      influencer_platform:
        | "Instagram"
        | "TikTok"
        | "YouTube"
        | "Facebook"
        | "Other"
      influencer_status: "pending" | "active" | "suspended"
      pricing_plan: "per_order" | "monthly"
      product_model: "weight_based" | "variant_based" | "simple"
      settlement_payment_method: "bank_transfer" | "cash" | "cheque" | "other"
      settlement_status:
        | "pending"
        | "partially_paid"
        | "paid"
        | "waived"
        | "reversed"
      staff_role:
        | "super_admin"
        | "platform_staff"
        | "admin"
        | "finance"
        | "support"
        | "read_only"
      storefront_order_status:
        | "pending"
        | "confirmed"
        | "fulfilled"
        | "cancelled"
      vendor_admin_role: "owner" | "staff"
      vendor_payment_method_type: "easypaisa" | "jazzcash" | "bank"
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
      announcement_category: ["product_update", "policy_change", "promotion"],
      application_status: ["pending", "approved", "rejected"],
      influencer_platform: [
        "Instagram",
        "TikTok",
        "YouTube",
        "Facebook",
        "Other",
      ],
      influencer_status: ["pending", "active", "suspended"],
      pricing_plan: ["per_order", "monthly"],
      product_model: ["weight_based", "variant_based", "simple"],
      settlement_payment_method: ["bank_transfer", "cash", "cheque", "other"],
      settlement_status: [
        "pending",
        "partially_paid",
        "paid",
        "waived",
        "reversed",
      ],
      staff_role: [
        "super_admin",
        "platform_staff",
        "admin",
        "finance",
        "support",
        "read_only",
      ],
      storefront_order_status: [
        "pending",
        "confirmed",
        "fulfilled",
        "cancelled",
      ],
      vendor_admin_role: ["owner", "staff"],
      vendor_payment_method_type: ["easypaisa", "jazzcash", "bank"],
    },
  },
} as const
