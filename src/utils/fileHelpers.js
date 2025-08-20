import CryptoJS from 'crypto-js'

export async function exportEncryptedFile(notes, password) {
  const json = JSON.stringify(notes, null, 2)
  const encrypted = CryptoJS.AES.encrypt(json, password).toString()
  const blob = new Blob([encrypted], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  a.href = url
  a.download = `aethernote-backup-${stamp}.enc.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function importEncryptedFile(file, password) {
  const text = await file.text()
  let decrypted
  try {
    decrypted = CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8)
  } catch (e) {
    throw new Error('Wrong password or corrupted file')
  }
  if (!decrypted) throw new Error('Wrong password or corrupted file')
  return JSON.parse(decrypted)
}