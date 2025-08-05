import { DomainFilterUseCase, DomainFilterRepository } from '@/domain/interfaces'
import { DomainFilter } from '@/domain/types'

export class DomainFilterUseCaseImpl implements DomainFilterUseCase {
  constructor(private repository: DomainFilterRepository) {}

  async getAllFilters(): Promise<DomainFilter[]> {
    return this.repository.findAll()
  }

  async getFilter(id: string): Promise<DomainFilter | null> {
    return this.repository.findById(id)
  }

  async createFilter(pattern: string): Promise<DomainFilter> {
    const filter: DomainFilter = {
      id: crypto.randomUUID(),
      pattern,
      enabled: true,
      createdAt: new Date(),
    }

    await this.repository.save(filter)
    return filter
  }

  async updateFilter(id: string, pattern: string, enabled: boolean): Promise<void> {
    const filter = await this.repository.findById(id)
    if (!filter) {
      throw new Error('Filter not found')
    }

    const updatedFilter: DomainFilter = {
      ...filter,
      pattern,
      enabled,
    }

    await this.repository.save(updatedFilter)
  }

  async deleteFilter(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
