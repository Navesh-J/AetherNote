import { openDB } from 'idb'

const DB_NAME = 'aethernote'
const STORE = 'notes'
const META_KEY = 'aethernote_meta'
const FALLBACK_KEY = 'aethernote_notes'

function supportsIndexedDB() {
  try { return typeof indexedDB !== 'undefined' } catch { return false }
}

async function getDB() {
  if (!supportsIndexedDB()) return null
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('updatedAt', 'updatedAt')
      }
    }
  })
}

export async function listNotesRaw() {
  const db = await getDB()
  if (db) {
    return (await db.getAll(STORE)) || []
  } else {
    try {
      return JSON.parse(localStorage.getItem(FALLBACK_KEY) || '[]')
    } catch { return [] }
  }
}

export async function listNotes() {
  const arr = await listNotesRaw()
  return arr.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export async function upsertNote(note) {
  const db = await getDB()
  if (db) {
    await db.put(STORE, note)
  } else {
    const arr = await listNotesRaw()
    const idx = arr.findIndex(n => n.id === note.id)
    if (idx >= 0) arr[idx] = note
    else arr.push(note)
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(arr))
  }
}

export async function upsertMany(notes) {
  const db = await getDB()
  if (db) {
    const tx = db.transaction(STORE, 'readwrite')
    for (const n of notes) await tx.store.put(n)
    await tx.done
  } else {
    const existing = await listNotesRaw()
    const byId = new Map(existing.map(n => [n.id, n]))
    for (const n of notes) byId.set(n.id, n)
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(Array.from(byId.values())))
  }
}

export async function deleteNoteById(id) {
  const db = await getDB()
  if (db) {
    await db.delete(STORE, id)
  } else {
    const arr = await listNotesRaw()
    const filtered = arr.filter(n => n.id !== id)
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(filtered))
  }
}

export async function replaceAllNotes(notes) {
  const db = await getDB()
  if (db) {
    const tx = db.transaction(STORE, 'readwrite')
    await tx.store.clear()
    for (const n of notes) await tx.store.put(n)
    await tx.done
  } else {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(notes))
  }
}

export function readMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') } catch { return {} }
}
export function writeMeta(obj) {
  const prev = readMeta()
  localStorage.setItem(META_KEY, JSON.stringify({ ...prev, ...obj }))
}