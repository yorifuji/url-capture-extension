import { describe, it, expect } from 'vitest'
import { DomainMatcher } from '@/domain/services/domain-matcher'
import { DomainFilter } from '@/domain/types'

describe('DomainMatcher', () => {
  describe('extractHostname', () => {
    it('should extract hostname from valid URL', () => {
      expect(DomainMatcher.extractHostname('https://example.com')).toBe('example.com')
      expect(DomainMatcher.extractHostname('https://sub.example.com/path')).toBe('sub.example.com')
      expect(DomainMatcher.extractHostname('http://localhost:3000')).toBe('localhost')
    })

    it('should return empty string for invalid URL', () => {
      expect(DomainMatcher.extractHostname('not-a-url')).toBe('')
      expect(DomainMatcher.extractHostname('')).toBe('')
    })
  })

  describe('extractUrlPath', () => {
    it('should extract path from URL', () => {
      expect(DomainMatcher.extractUrlPath('https://github.com/yorifuji')).toBe('/yorifuji')
      expect(DomainMatcher.extractUrlPath('https://github.com/yorifuji/')).toBe('/yorifuji')
      expect(DomainMatcher.extractUrlPath('https://example.com')).toBe('')
      expect(DomainMatcher.extractUrlPath('https://example.com/path?query=1')).toBe('/path?query=1')
    })
  })

  describe('matches', () => {
    // Hostname-only patterns
    it('should match exact hostname', () => {
      expect(DomainMatcher.matches('https://github.com', 'github.com')).toBe(true)
      expect(DomainMatcher.matches('https://github.com/path', 'github.com')).toBe(true)
      expect(DomainMatcher.matches('https://example.com', 'github.com')).toBe(false)
    })

    it('should normalize patterns with https:// prefix', () => {
      expect(DomainMatcher.matches('https://github.com', 'https://github.com')).toBe(true)
      expect(DomainMatcher.matches('https://github.com/path', 'https://github.com')).toBe(true)
      expect(DomainMatcher.matches('https://example.com', 'https://github.com')).toBe(false)
    })

    it('should normalize patterns with http:// prefix', () => {
      expect(DomainMatcher.matches('https://github.com', 'http://github.com')).toBe(true)
      expect(DomainMatcher.matches('http://github.com/path', 'http://github.com')).toBe(true)
      expect(DomainMatcher.matches('https://example.com', 'http://github.com')).toBe(false)
    })

    it('should match wildcard subdomain', () => {
      expect(DomainMatcher.matches('https://api.github.com', '*.github.com')).toBe(true)
      expect(DomainMatcher.matches('https://github.com', '*.github.com')).toBe(false)
      expect(DomainMatcher.matches('https://example.com', '*.github.com')).toBe(false)
    })

    it('should match patterns with wildcards in any position', () => {
      // Prefix wildcards
      expect(DomainMatcher.matches('https://foo1.example.com', 'foo*.example.com')).toBe(true)
      expect(DomainMatcher.matches('https://foobar.example.com', 'foo*.example.com')).toBe(true)
      expect(DomainMatcher.matches('https://bar.example.com', 'foo*.example.com')).toBe(false)

      // Suffix wildcards
      expect(DomainMatcher.matches('https://example.com', 'example.*')).toBe(true)
      expect(DomainMatcher.matches('https://example.org', 'example.*')).toBe(true)
      expect(DomainMatcher.matches('https://test.com', 'example.*')).toBe(false)

      // Multiple wildcards
      expect(DomainMatcher.matches('https://test.example.com', '*example*')).toBe(true)
      expect(DomainMatcher.matches('https://example.org', '*example*')).toBe(true)
      expect(DomainMatcher.matches('https://test.com', '*example*')).toBe(false)
    })

    // Path patterns
    it('should match exact path', () => {
      expect(DomainMatcher.matches('https://github.com/yorifuji', 'github.com/yorifuji')).toBe(true)
      expect(DomainMatcher.matches('https://github.com/yorifuji/', 'github.com/yorifuji')).toBe(
        true
      )
      expect(DomainMatcher.matches('https://github.com/yorifuji/repo', 'github.com/yorifuji')).toBe(
        true
      )
      expect(DomainMatcher.matches('https://github.com/foobar', 'github.com/yorifuji')).toBe(false)
    })

    it('should normalize path patterns with https:// prefix', () => {
      expect(
        DomainMatcher.matches('https://github.com/yorifuji', 'https://github.com/yorifuji')
      ).toBe(true)
      expect(
        DomainMatcher.matches('https://github.com/yorifuji/', 'https://github.com/yorifuji')
      ).toBe(true)
      expect(
        DomainMatcher.matches('https://github.com/yorifuji/repo', 'https://github.com/yorifuji')
      ).toBe(true)
      expect(
        DomainMatcher.matches('https://github.com/foobar', 'https://github.com/yorifuji')
      ).toBe(false)
    })

    it('should match path with wildcards', () => {
      expect(
        DomainMatcher.matches('https://github.com/yorifuji/repo1', 'github.com/yorifuji/*')
      ).toBe(true)
      expect(
        DomainMatcher.matches('https://github.com/yorifuji/repo2', 'github.com/yorifuji/*')
      ).toBe(true)
      expect(DomainMatcher.matches('https://github.com/foobar/repo', 'github.com/yorifuji/*')).toBe(
        false
      )

      // Multiple wildcards
      expect(DomainMatcher.matches('https://github.com/any/path/here', 'github.com/*/*')).toBe(true)
      expect(DomainMatcher.matches('https://github.com/yorifuji', 'github.com/*/*')).toBe(false)
    })

    it('should handle invalid URLs gracefully', () => {
      expect(DomainMatcher.matches('invalid-url', 'pattern')).toBe(false)
      expect(DomainMatcher.matches('', 'pattern')).toBe(false)
    })
  })

  describe('findMatchingFilter', () => {
    const filters: DomainFilter[] = [
      {
        id: '1',
        pattern: 'github.com',
        enabled: true,
        createdAt: new Date(),
      },
      {
        id: '2',
        pattern: 'github.com/yorifuji',
        enabled: true,
        createdAt: new Date(),
      },
      {
        id: '3',
        pattern: 'github.com/foobar/*',
        enabled: true,
        createdAt: new Date(),
      },
      {
        id: '4',
        pattern: 'disabled.com',
        enabled: false,
        createdAt: new Date(),
      },
    ]

    it('should find matching filter by priority', () => {
      // More specific path pattern should match first
      const result1 = DomainMatcher.findMatchingFilter('https://github.com/yorifuji', filters)
      expect(result1?.id).toBe('2')

      const result2 = DomainMatcher.findMatchingFilter('https://github.com/foobar/repo', filters)
      expect(result2?.id).toBe('3')

      const result3 = DomainMatcher.findMatchingFilter('https://github.com/other', filters)
      expect(result3?.id).toBe('1')
    })

    it('should not match disabled filters', () => {
      const result = DomainMatcher.findMatchingFilter('https://disabled.com', filters)
      expect(result).toBeNull()
    })

    it('should return null for no match', () => {
      const result = DomainMatcher.findMatchingFilter('https://example.com', filters)
      expect(result).toBeNull()
    })
  })
})
