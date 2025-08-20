import NoteCard from './NoteCard.jsx'

export default function NoteList({ notes, onPin, onArchive, onEdit, onDelete }) {
  if (!notes.length) {
    return <p className="hint">No notes yet.</p>
  }
  return (
    <div className="grid">
      {notes.map(n => (
        <NoteCard
          key={n.id}
          note={n}
          onPin={onPin}
          onArchive={onArchive}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}