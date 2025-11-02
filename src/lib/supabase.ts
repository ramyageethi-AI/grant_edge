import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxqmdthwscwpboorkehw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cW1kdGh3c2N3cGJvb3JrZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjYwMTksImV4cCI6MjA3NjgwMjAxOX0.CKSCesPLfIjHNYaBR6wHkz8R2D7ElABo18cd_oJ5oV8'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
})