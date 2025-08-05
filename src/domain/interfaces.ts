import { DomainFilter, UrlDetectionResult } from './types'

// Repository interfaces
export interface DomainFilterRepository {
  findAll(): Promise<DomainFilter[]>
  findById(id: string): Promise<DomainFilter | null>
  save(filter: DomainFilter): Promise<void>
  delete(id: string): Promise<void>
}

// Use case interfaces
export interface DomainFilterUseCase {
  getAllFilters(): Promise<DomainFilter[]>
  getFilter(id: string): Promise<DomainFilter | null>
  createFilter(pattern: string): Promise<DomainFilter>
  updateFilter(id: string, pattern: string, enabled: boolean): Promise<void>
  deleteFilter(id: string): Promise<void>
}

export interface UrlDetectionUseCase {
  shouldShowPopup(url: string): Promise<UrlDetectionResult>
}

// Storage interface
export interface Storage {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown): Promise<void>
  remove(key: string): Promise<void>
}
