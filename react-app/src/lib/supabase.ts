import { createClient } from '@supabase/supabase-js'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 用户认证
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  getUser: async () => {
    return await supabase.auth.getUser()
  },
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// 历史记录 CRUD
export const history = {
  save: async (record: {
    user_id: string
    question: string
    divination_type: string
    hexagram_id: number
    hexagram_name: string
    transformed_hexagram_id?: number
    transformed_hexagram_name?: string
    moving_lines: number[]
    interpretation: string
    master_advice?: string
    luck_score?: number
  }) => {
    return await supabase
      .from('divination_history')
      .insert([record])
      .select()
  },
  load: async (userId: string, limit: number = 50) => {
    return await supabase
      .from('divination_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
  },
  delete: async (id: string) => {
    return await supabase
      .from('divination_history')
      .delete()
      .eq('id', id)
  }
}
