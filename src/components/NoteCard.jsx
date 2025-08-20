import React from 'react'

export default function NoteCard({ note, onPin, onArchive, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="title">{note.title || <em>(Untitled)</em>}</div>
      <div className="meta">
        Updated {new Date(note.updatedAt).toLocaleString()}
        {note.pinned && <span className="pill" style={{ marginLeft: 8 }}>Pinned</span>}
        {note.archived && <span className="pill" style={{ marginLeft: 8 }}>Archived</span>}
      </div>
      <div style={{
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 6,
        WebkitBoxOrient: 'vertical',
        opacity: 0.9
      }}>{note.content}</div>
      <div className="actions">
        <div className="row">
          <button className="btn" onClick={() => onPin(note.id)}>{note.pinned ? 'Unpin' : 'Pin'}</button>
          <button className="btn" onClick={() => onArchive(note.id)}>{note.archived ? 'Unarchive' : 'Archive'}</button>
          <button className="btn" onClick={() => onEdit(note)}>Edit</button>
        </div>
        <button className="btn danger" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </div>
  )
}