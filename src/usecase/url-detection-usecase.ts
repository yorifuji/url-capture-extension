import { UrlDetectionUseCase, DomainFilterRepository } from '@/domain/interfaces'
import { UrlDetectionResult } from '@/domain/types'
import { DomainMatcher } from '@/domain/services/domain-matcher'

export class UrlDetectionUseCaseImpl implements UrlDetectionUseCase {
  constructor(private filterRepository: DomainFilterRepository) {}

  async shouldShowPopup(url: string): Promise<UrlDetectionResult> {
    const hostname = DomainMatcher.extractHostname(url)
    const filters = await this.filterRepository.findAll()

    // Check if URL matches any filter
    const matchedFilter = DomainMatcher.findMatchingFilter(url, filters)

    return {
      url,
      hostname,
      shouldShowPopup: !!matchedFilter, // Show popup only if filter matches
      matchedPattern: matchedFilter?.pattern,
    }
  }
}
