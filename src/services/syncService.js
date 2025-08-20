import { supabase } from './supabaseClient.js'
import { listNotesRaw, upsertMany } from '../hooks/useStorage.js'

export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password })
}
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}
export async function signOut() {
  return await supabase.auth.signOut()
}
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user || null
}
export function onAuthStateChange(cb) {
  return supabase.auth.onAuthStateChange(cb)
}

// Merge strategy: last-updated wins
function mergeNotes(localArr, remoteArr) {
  const map = new Map()
  for (const n of localArr) map.set(n.id, { ...n })
  for (const r of remoteArr) {
    const l = map.get(r.id)
    if (!l) {
      map.set(r.id, r)
    } else {
      const lu = new Date(l.updatedAt).getTime()
      const ru = new Date(r.updatedAt).getTime()
      map.set(r.id, lu >= ru ? l : r)
    }
  }
  // Sort pinned first then updatedAt desc
  const merged = Array.from(map.values()).sort((a,b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
  return merged
}

export async function fetchRemoteNotes() {
  const user = await getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
  if (error) throw error
  // map to client shape
  return (data || []).map(row => ({
    id: row.id,
    title: row.title || '',
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pinned: !!row.pinned,
    archived: !!row.archived
  }))
}

export async function pushNotesToRemote(notes) {
  const user = await getUser()
  if (!user) return
  if (!notes.length) return
  const rows = notes.map(n => ({
    id: n.id,
    user_id: user.id,
    title: n.title,
    content: n.content,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
    pinned: n.pinned,
    archived: n.archived
  }))
  const { error } = await supabase.from('notes').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function deleteRemoteNote(id) {
  const user = await getUser()
  if (!user) return
  await supabase.from('notes').delete().eq('id', id).eq('user_id', user.id)
}

export async function syncAll(setNotes) {
  const local = await listNotesRaw()
  const remote = await fetchRemoteNotes()
  const merged = mergeNotes(local, remote)
  // Write merged to both sides
  await upsertMany(merged)
  try { await pushNotesToRemote(merged) } catch {}
  setNotes(merged)
}