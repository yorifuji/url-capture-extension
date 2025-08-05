import { Storage } from '@/domain/interfaces'

export class ChromeStorage implements Storage {
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key)
    return result[key] || null
  }

  async set(key: string, value: unknown): Promise<void> {
    await chrome.storage.local.set({ [key]: value })
  }

  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key)
  }
}
