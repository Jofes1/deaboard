import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Hämta aktiva deals (ej utgångna)
export async function getDeals({ category, search } = {}) {
  let query = supabase
    .from('deals')
    .select('*')
    .eq('active', true)
    .gt('expires_at', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (category && category !== 'Alla') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,store.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createDeal(deal) {
  const { data, error } = await supabase.from('deals').insert([deal]).select()
  if (error) throw error
  return data[0]
}

export async function updateDeal(id, updates) {
  const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function deleteDeal(id) {
  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) throw error
}

export async function getAllDealsAdmin() {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
