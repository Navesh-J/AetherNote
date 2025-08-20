import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { listNotes, upsertNote, deleteNoteById } from './useStorage.js'
import { syncAll, getUser, deleteRemoteNote } from '../services/syncService.js'

export default function useNotes() {
  const [notes, setNotes] = useState([])
  const syncTimer = useRef(null)

  const loadNotes = useCallback(async () => {
    setNotes(await listNotes())
  }, [])

  const queueSync = useCallback(() => {
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      syncNow()
    }, 600)
  }, [])

  const syncNow = useCallback(async () => {
    const user = await getUser()
    if (!user) return // offline-only when not logged in
    await syncAll(setNotes)
  }, [])

  useEffect(() => {
    return () => clearTimeout(syncTimer.current)
  }, [])

  function createNote(title = '', content = '') {
    const now = new Date().toISOString()
    const n = {
      id: uuidv4(),
      title, content,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      archived: false
    }
    upsertNote(n).then(loadNotes).then(queueSync)
    return n
  }

  function updateNote(note) {
    const n = { ...note, updatedAt: new Date().toISOString() }
    upsertNote(n).then(loadNotes).then(queueSync)
  }

  async function deleteNote(id) {
    // delete locally first
    await deleteNoteById(id)
    await loadNotes()
    // if logged in, remove remotely as well
    const user = await getUser()
    if (user) await deleteRemoteNote(id)
  }

  function togglePin(id) {
    const n = notes.find(n => n.id === id)
    if (!n) return
    updateNote({ ...n, pinned: !n.pinned })
  }
  function toggleArchive(id) {
    const n = notes.find(n => n.id === id)
    if (!n) return
    updateNote({ ...n, archived: !n.archived })
  }

  return {
    notes, loadNotes, createNote, updateNote, deleteNote, togglePin, toggleArchive,
    syncNow
  }
}