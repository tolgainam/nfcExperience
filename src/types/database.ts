export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          prd: number
          brand: string
          name: string
          type: 'd' | 'f' | 'a'
          model_url: string | null
          created_at: string
        }
        Insert: {
          prd: number
          brand: string
          name: string
          type: 'd' | 'f' | 'a'
          model_url?: string | null
          created_at?: string
        }
        Update: {
          prd?: number
          brand?: string
          name?: string
          type?: 'd' | 'f' | 'a'
          model_url?: string | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          cc: number
          name: string
          theme_primary: string
          theme_secondary: string
          theme_accent: string
          description: string | null
          created_at: string
        }
        Insert: {
          cc: number
          name: string
          theme_primary: string
          theme_secondary: string
          theme_accent: string
          description?: string | null
          created_at?: string
        }
        Update: {
          cc?: number
          name?: string
          theme_primary?: string
          theme_secondary?: string
          theme_accent?: string
          description?: string | null
          created_at?: string
        }
      }
      units: {
        Row: {
          uid: number
          prd: number
          brand: string
          cc: number
          manufactured_at: string | null
          created_at: string
        }
        Insert: {
          uid: number
          prd: number
          brand: string
          cc: number
          manufactured_at?: string | null
          created_at?: string
        }
        Update: {
          uid?: number
          prd?: number
          brand?: string
          cc?: number
          manufactured_at?: string | null
          created_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          uid: number
          device_fingerprint: string
          scan_count: number
          first_scan_at: string
          last_scan_at: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          uid: number
          device_fingerprint: string
          scan_count?: number
          first_scan_at?: string
          last_scan_at?: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          uid?: number
          device_fingerprint?: string
          scan_count?: number
          first_scan_at?: string
          last_scan_at?: string
          user_agent?: string | null
        }
      }
      settings: {
        Row: {
          key: string
          value: string
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          description?: string | null
          updated_at?: string
        }
      }
    }
  }
}

// Helper types for application use
export type Product = Database['public']['Tables']['products']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Unit = Database['public']['Tables']['units']['Row']
export type Scan = Database['public']['Tables']['scans']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']

export interface UnitWithRelations extends Unit {
  products: Product
  campaigns: Campaign
}
