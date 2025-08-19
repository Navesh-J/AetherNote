# 📝 AetherNote

AetherNote is a modern **note-taking web app** that works both **offline for guests** and **online with cloud sync** for authenticated users.  
It is designed to be simple, secure, and flexible — allowing you to take notes anywhere, back them up, and sync seamlessly across devices.

---

## 🚀 Features

### ✨ Core Features
- Create, edit, pin, archive, and delete notes.
- Offline-first support — works fully without login using browser storage.
- Real-time sync with the cloud when logged in.

### 👤 Guest Mode
- Notes are stored locally in the browser (IndexedDB).
- No account required to get started.
- Optional encrypted backup & restore for full control of your data.
- Guest notes are cleared automatically when a user logs in, ensuring data separation.

### 🔐 Authentication & Cloud Sync
- Secure user accounts powered by **Supabase Auth**.
- Notes stored in **Supabase PostgreSQL** for persistence and cross-device access.
- Automatic sync between local and remote notes.
- Smart conflict resolution (`last-updated-wins`).
- Logout clears local cache to protect user privacy.

### 💾 Backup & Restore
- Export notes into a **password-encrypted file** for safe backup.
- Import encrypted files to restore notes securely.
- Backup files remain fully under your control.

### 🔄 Sync Service
- Keeps local and remote notes in sync.
- Merges notes intelligently:
  - Newer updates overwrite older versions.
  - Pinned notes always appear first.
- Ensures consistency across devices and sessions.

---

## 🌟 Why AetherNote?
- **Offline-first** — take notes anytime, anywhere.
- **Privacy-first** — your backups are encrypted before leaving your device.
- **Simple but powerful** — balances local storage with cloud sync.
- **Cross-device ready** — seamless experience when switching between guest and authenticated use.

---

## 📌 Roadmap
- Background auto-sync on note changes.
- Optional "Import guest notes into account" instead of auto-clearing.
- Conflict resolution UI for manual choices.
- Mobile-friendly optimizations.
