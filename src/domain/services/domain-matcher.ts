import { DomainFilter } from '../types'

export class DomainMatcher {
  static extractHostname(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return ''
    }
  }

  static extractUrlPath(url: string): string {
    try {
      const urlObj = new URL(url)
      // Remove trailing slash for consistency
      return (urlObj.pathname + urlObj.search).replace(/\/$/, '')
    } catch {
      return ''
    }
  }

  static matches(url: string, pattern: string): boolean {
    if (!url || !pattern) return false

    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname
      const fullPath = hostname + this.extractUrlPath(url)

      // If pattern contains '/', it's a path pattern
      if (pattern.includes('/')) {
        // Handle wildcards in path patterns
        if (pattern.includes('*')) {
          // Convert pattern to regex
          const regexPattern = pattern
            .split('*')
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('.*')
          const regex = new RegExp(`^${regexPattern}$`)
          return regex.test(fullPath)
        }
        // Exact path match
        return fullPath === pattern || fullPath.startsWith(pattern + '/')
      }

      // Hostname-only patterns
      // Handle wildcards in hostname patterns
      if (pattern.includes('*')) {
        // Convert pattern to regex
        const regexPattern = pattern
          .split('*')
          .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('.*')
        const regex = new RegExp(`^${regexPattern}$`)
        return regex.test(hostname)
      }

      // Exact match
      if (pattern === hostname) return true

      // Partial match (contains)
      return hostname.includes(pattern)
    } catch {
      return false
    }
  }

  static findMatchingFilter(url: string, filters: DomainFilter[]): DomainFilter | null {
    if (!url) return null

    // Only check enabled filters
    const enabledFilters = filters.filter((f) => f.enabled)

    // Sort filters by specificity (path patterns before hostname patterns)
    const sortedFilters = [...enabledFilters].sort((a, b) => {
      const aHasPath = a.pattern.includes('/')
      const bHasPath = b.pattern.includes('/')

      // Path patterns have higher priority
      if (aHasPath && !bHasPath) return -1
      if (!aHasPath && bHasPath) return 1

      // Among path patterns, longer patterns have higher priority
      if (aHasPath && bHasPath) {
        return b.pattern.length - a.pattern.length
      }

      return 0
    })

    return sortedFilters.find((filter) => this.matches(url, filter.pattern)) || null
  }
}
