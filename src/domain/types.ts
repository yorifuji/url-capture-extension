import { z } from 'zod'

// Domain filter entity schema
export const DomainFilterSchema = z.object({
  id: z.string(),
  pattern: z.string().min(1), // e.g., "example.com", "*.github.com"
  enabled: z.boolean().default(true),
  createdAt: z.date(),
})

export type DomainFilter = z.infer<typeof DomainFilterSchema>

// URL detection result
export interface UrlDetectionResult {
  url: string
  hostname: string
  shouldShowPopup: boolean
  matchedPattern?: string
}
