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
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
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
          profile_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reward_granted: boolean
          screenshot_path: string | null
          status: string
          title: string
        }
        Insert: {
          admin_note?: string | null
          ai_reply?: string | null
          created_at?: string
          description: string
          id?: string
          profile_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_granted?: boolean
          screenshot_path?: string | null
          status?: string
          title: string
        }
        Update: {
          admin_note?: string | null
          ai_reply?: string | null
          created_at?: string
          description?: string
          id?: string
          profile_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_granted?: boolean
          screenshot_path?: string | null
          status?: string
          title?: string
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
        ]
      }
      business_settings: {
        Row: {
          business_address: string | null
          business_name: string
          currency: string
          default_shipping_cost: number
          facebook_url: string | null
          free_shipping_threshold: number | null
          id: boolean
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
          welcome_discount_enabled: boolean
          welcome_discount_percent: number
          youtube_url: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string
          currency?: string
          default_shipping_cost?: number
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          id?: boolean
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
          welcome_discount_enabled?: boolean
          welcome_discount_percent?: number
          youtube_url?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string
          currency?: string
          default_shipping_cost?: number
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          id?: boolean
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
          welcome_discount_enabled?: boolean
          welcome_discount_percent?: number
          youtube_url?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          box_size_id: string | null
          id: string
          profile_id: string
          qty: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          box_size_id?: string | null
          id?: string
          profile_id: string
          qty: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          box_size_id?: string | null
          id?: string
          profile_id?: string
          qty?: number
          updated_at?: string
          variant_id?: string | null
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
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
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
        }
        Relationships: [
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        }
        Relationships: []
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
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          meta?: Json | null
          points: number
          profile_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          meta?: Json | null
          points?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mango_game_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
        }
        Insert: {
          created_at?: string
          id?: string
          item: Json
          order_id: string
          reason: string
        }
        Update: {
          created_at?: string
          id?: string
          item?: Json
          order_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_stock_warnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
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
          sort_order: number
          updated_at: string
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
          sort_order?: number
          updated_at?: string
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
          sort_order?: number
          updated_at?: string
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
        }
        Relationships: [
          {
            foreignKeyName: "product_box_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
          slug: string
          sort_order: number
          status: string
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
          slug: string
          sort_order?: number
          status?: string
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
          slug?: string
          sort_order?: number
          status?: string
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
        ]
      }
      review_helpful_votes: {
        Row: {
          created_at: string
          profile_id: string
          review_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          review_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          review_id?: string
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
        }
        Insert: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          province: string
          rate: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          city?: string | null
          created_at?: string
          id?: string
          province?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          id: boolean
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: boolean
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          accent_color: string | null
          active: boolean
          carrier_name: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone_display: string | null
          phone_href: string | null
          slug: string
          tagline: string | null
          whatsapp_number: string | null
        }
        Insert: {
          accent_color?: string | null
          active?: boolean
          carrier_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone_display?: string | null
          phone_href?: string | null
          slug: string
          tagline?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          accent_color?: string | null
          active?: boolean
          carrier_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone_display?: string | null
          phone_href?: string | null
          slug?: string
          tagline?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
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
          currency: string | null
          default_shipping_cost: number | null
          facebook_url: string | null
          free_shipping_threshold: number | null
          instagram_url: string | null
          support_email: string | null
          support_phone: string | null
          support_whatsapp: string | null
          tiktok_url: string | null
          twitter_url: string | null
          welcome_discount_enabled: boolean | null
          welcome_discount_percent: number | null
          youtube_url: string | null
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          currency?: string | null
          default_shipping_cost?: number | null
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          welcome_discount_enabled?: boolean | null
          welcome_discount_percent?: number | null
          youtube_url?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          currency?: string | null
          default_shipping_cost?: number | null
          facebook_url?: string | null
          free_shipping_threshold?: number | null
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          support_whatsapp?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          welcome_discount_enabled?: boolean | null
          welcome_discount_percent?: number | null
          youtube_url?: string | null
        }
        Relationships: []
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
      admin_confirm_bug_report: {
        Args: { p_admin_note?: string; p_bug_id: string }
        Returns: undefined
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
        }
        Returns: {
          cost_snapshot: Json
          profit: number
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
          p_max_attempts: number
          p_window_minutes: number
          p_lock_minutes: number
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
      link_referral: {
        Args: { p_code: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      mark_review_helpful: { Args: { p_review_id: string }; Returns: number }
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
      validate_coupon: {
        Args: { p_code: string; p_customer_id?: string; p_order_amount: number }
        Returns: {
          discount_type: string
          discount_value: number
          message: string
          valid: boolean
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
    Enums: {},
  },
} as const
