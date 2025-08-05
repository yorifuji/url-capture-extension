import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChromeStorage } from '@/infrastructure/chrome-storage'

// Mock chrome.storage API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

describe('ChromeStorage', () => {
  let storage: ChromeStorage

  beforeEach(() => {
    storage = new ChromeStorage()
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should get value from storage', async () => {
      const mockData = { testKey: { id: '1', name: 'Test' } }
      vi.mocked(chrome.storage.local.get).mockResolvedValue(mockData)

      const result = await storage.get('testKey')

      expect(chrome.storage.local.get).toHaveBeenCalledWith('testKey')
      expect(result).toEqual({ id: '1', name: 'Test' })
    })

    it('should return null if key not found', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({})

      const result = await storage.get('nonExistent')

      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should set value in storage', async () => {
      const value = { id: '1', name: 'Test' }
      vi.mocked(chrome.storage.local.set).mockResolvedValue()

      await storage.set('testKey', value)

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: value })
    })
  })

  describe('remove', () => {
    it('should remove key from storage', async () => {
      vi.mocked(chrome.storage.local.remove).mockResolvedValue()

      await storage.remove('testKey')

      expect(chrome.storage.local.remove).toHaveBeenCalledWith('testKey')
    })
  })
})
