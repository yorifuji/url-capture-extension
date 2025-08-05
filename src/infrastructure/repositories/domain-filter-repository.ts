import { DomainFilterRepository } from '@/domain/interfaces'
import { DomainFilter } from '@/domain/types'
import { Storage } from '@/domain/interfaces'

export class DomainFilterRepositoryImpl implements DomainFilterRepository {
  private readonly STORAGE_KEY = 'domainFilters'

  constructor(private storage: Storage) {}

  async findAll(): Promise<DomainFilter[]> {
    const filters = await this.storage.get<DomainFilter[]>(this.STORAGE_KEY)
    return filters || []
  }

  async findById(id: string): Promise<DomainFilter | null> {
    const filters = await this.findAll()
    return filters.find((f) => f.id === id) || null
  }

  async save(filter: DomainFilter): Promise<void> {
    const filters = await this.findAll()
    const index = filters.findIndex((f) => f.id === filter.id)

    if (index >= 0) {
      filters[index] = filter
    } else {
      filters.push(filter)
    }

    await this.storage.set(this.STORAGE_KEY, filters)
  }

  async delete(id: string): Promise<void> {
    const filters = await this.findAll()
    const filtered = filters.filter((f) => f.id !== id)
    await this.storage.set(this.STORAGE_KEY, filtered)
  }
}
