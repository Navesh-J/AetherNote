import React, { useEffect, useState } from 'react'

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')

  useEffect(() => {
    setTitle(note?.title || '')
    setContent(note?.content || '')
  }, [note?.id])

  return (
    <div className="editor">
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        rows={8}
        placeholder="Write your note..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="row" style={{justifyContent: 'flex-end', gap: 8}}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button
          className="btn primary"
          onClick={() => onSave({ title: title.trim(), content: content.trim() })}
        >
          Save
        </button>
      </div>
      <span className="hint">Notes are stored locally first. If you are logged in, changes will sync to Supabase.</span>
    </div>
  )
}