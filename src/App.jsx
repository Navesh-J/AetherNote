import React, { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import NoteEditor from './components/NoteEditor.jsx'
import NoteList from './components/NoteList.jsx'
import ExportImportControls from './components/ExportImportControls.jsx'
import useNotes from './hooks/useNotes.js'
import { getUser, onAuthStateChange } from './services/syncService.js'

export default function App() {
  const {
    notes, createNote, updateNote, deleteNote,
    togglePin, toggleArchive, loadNotes, syncNow
  } = useNotes()

  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState(null) // note or null

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    (async () => {
      const u = await getUser()
      setUser(u)
    })()
    const { data: sub } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      // Trigger a sync when auth state changes (login/logout)
      syncNow()
    })
    return () => { sub?.subscription?.unsubscribe?.() }
  }, [syncNow])

  const visibleNotes = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = notes.filter(n => {
      if (showArchived ? !n.archived : n.archived) return false
      if (!term) return true
      return (n.title || '').toLowerCase().includes(term) ||
             (n.content || '').toLowerCase().includes(term)
    })
    // Pinned first, then by updatedAt desc
    return filtered.sort((a,b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }, [notes, query, showArchived])

  return (
    <div className="container">
      <Header user={user} />
      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <button className={"btn"} onClick={() => setShowArchived(v => !v)}>
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
        <ExportImportControls />
        <button className="btn" onClick={() => setEditing({})}>New Note</button>
        <button className="btn" onClick={syncNow}>Sync</button>
      </div>

      {editing && (
        <NoteEditor
          note={editing.id ? editing : null}
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) {
              updateNote({ ...editing, ...data })
            } else {
              const n = createNote(data.title, data.content)
              setEditing(n)
            }
            setEditing(null)
          }}
        />
      )}

      <NoteList
        notes={visibleNotes}
        onPin={togglePin}
        onArchive={toggleArchive}
        onEdit={(n) => setEditing(n)}
        onDelete={deleteNote}
      />
    </div>
  )
}