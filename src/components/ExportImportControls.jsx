import React, { useRef, useState } from 'react'
import { exportEncryptedFile, importEncryptedFile } from '../utils/fileHelpers.js'
import { listNotesRaw, replaceAllNotes } from '../hooks/useStorage.js'

export default function ExportImportControls() {
  const fileInput = useRef(null)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    const pw = window.prompt('Set a password for encryption (remember this!)')
    if (!pw) return
    const notes = await listNotesRaw()
    await exportEncryptedFile(notes, pw)
    setMsg('Exported encrypted backup.')
    setTimeout(() => setMsg(''), 2500)
  }

  async function handleImport(file) {
    const pw = window.prompt('Enter the password used to encrypt this backup')
    if (!pw) return
    try {
      const imported = await importEncryptedFile(file, pw)
      if (!Array.isArray(imported)) throw new Error('Invalid file data')
      await replaceAllNotes(imported)
      setMsg('Imported notes into local storage.')
      setTimeout(() => setMsg(''), 2500)
    } catch (e) {
      alert('Import failed: ' + e.message)
    }
  }

  return (
    <div className="row">
      <button className="btn" onClick={handleExport}>Export</button>
      <button className="btn" onClick={() => fileInput.current?.click()}>Import</button>
      <input
        ref={fileInput}
        type="file"
        accept=".json,.enc.json,application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleImport(f)
          e.target.value = ''
        }}
      />
      {msg && <span className="pill">{msg}</span>}
    </div>
  )
}