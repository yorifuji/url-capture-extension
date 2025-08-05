import React, { useEffect, useState } from 'react'
import { DomainFilter } from '@/domain/types'
import { ChromeStorage } from '@/infrastructure/chrome-storage'
import { DomainFilterRepositoryImpl } from '@/infrastructure/repositories/domain-filter-repository'
import { DomainFilterUseCaseImpl } from '@/usecase/domain-filter-usecase'

export function OptionsApp() {
  const [filters, setFilters] = useState<DomainFilter[]>([])
  const [newPattern, setNewPattern] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPattern, setEditingPattern] = useState('')
  const [loading, setLoading] = useState(true)

  const storage = new ChromeStorage()
  const filterRepo = new DomainFilterRepositoryImpl(storage)
  const filterUseCase = new DomainFilterUseCaseImpl(filterRepo)

  useEffect(() => {
    loadFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadFilters = async () => {
    try {
      const allFilters = await filterUseCase.getAllFilters()
      setFilters(allFilters)
    } catch (error) {
      console.error('Failed to load filters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFilter = async () => {
    if (!newPattern.trim()) return

    try {
      await filterUseCase.createFilter(newPattern.trim())
      setNewPattern('')
      await loadFilters()
    } catch (error) {
      console.error('Failed to add filter:', error)
    }
  }

  const handleUpdateFilter = async (id: string) => {
    if (!editingPattern.trim()) return

    try {
      const filter = filters.find((f) => f.id === id)
      if (filter) {
        await filterUseCase.updateFilter(id, editingPattern.trim(), filter.enabled)
        setEditingId(null)
        setEditingPattern('')
        await loadFilters()
      }
    } catch (error) {
      console.error('Failed to update filter:', error)
    }
  }

  const handleToggleFilter = async (id: string) => {
    try {
      const filter = filters.find((f) => f.id === id)
      if (filter) {
        await filterUseCase.updateFilter(id, filter.pattern, !filter.enabled)
        await loadFilters()
      }
    } catch (error) {
      console.error('Failed to toggle filter:', error)
    }
  }

  const handleDeleteFilter = async (id: string) => {
    try {
      await filterUseCase.deleteFilter(id)
      await loadFilters()
    } catch (error) {
      console.error('Failed to delete filter:', error)
    }
  }

  const startEditing = (filter: DomainFilter) => {
    setEditingId(filter.id)
    setEditingPattern(filter.pattern)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingPattern('')
  }

  if (loading) {
    return <div className="loading">読み込み中...</div>
  }

  return (
    <div className="options">
      <h1>URL Capture 設定</h1>

      <div className="section">
        <h2>URLパターン設定</h2>
        <p className="description">
          登録されたパターンに一致するURLが開かれた時にポップアップを表示します。
          パターンが1つも登録されていない場合、ポップアップは表示されません。
        </p>

        <div className="add-filter">
          <input
            type="text"
            placeholder="例: github.com, *.github.com, foo*.example.com"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFilter()}
          />
          <button onClick={handleAddFilter}>追加</button>
        </div>

        <div className="filter-list">
          {filters.length === 0 ? (
            <div className="empty-state">パターンが登録されていません</div>
          ) : (
            filters.map((filter) => (
              <div key={filter.id} className={`filter-item ${!filter.enabled ? 'disabled' : ''}`}>
                {editingId === filter.id ? (
                  <>
                    <input
                      type="text"
                      value={editingPattern}
                      onChange={(e) => setEditingPattern(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateFilter(filter.id)}
                      autoFocus
                    />
                    <div className="filter-actions">
                      <button onClick={() => handleUpdateFilter(filter.id)}>保存</button>
                      <button onClick={cancelEditing}>キャンセル</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="pattern" onClick={() => startEditing(filter)}>
                      {filter.pattern}
                    </span>
                    <div className="filter-actions">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={filter.enabled}
                          onChange={() => handleToggleFilter(filter.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <button onClick={() => handleDeleteFilter(filter.id)}>削除</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <h2>使い方</h2>
        <ul className="help-list">
          <li>外部アプリケーションからURLが開かれると、ポップアップが表示されます</li>
          <li>ポップアップでURLをクリップボードにコピーできます</li>
          <li>ワイルドカード（*）を使用してサブドメインやパスをまとめて指定できます</li>
          <li>
            ホスト名のみ: <code>github.com</code> - github.com全体にマッチ
          </li>
          <li>
            特定のパス: <code>github.com/yorifuji</code> - 特定のユーザーページのみ
          </li>
          <li>
            パスのワイルドカード: <code>github.com/yorifuji/*</code> - 特定ユーザーの全リポジトリ
          </li>
          <li>
            サブドメイン: <code>*.github.com</code> - api.github.comなどにマッチ
          </li>
          <li>
            ワイルドカード: <code>foo*.example.com</code> -
            foo1.example.com、foobar.example.comなどにマッチ
          </li>
        </ul>
      </div>
    </div>
  )
}
