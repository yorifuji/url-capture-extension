import React, { useEffect, useState } from 'react'

export function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if popup was opened by URL detection or toolbar click
    chrome.runtime.sendMessage({ action: 'getPopupMode' }, (response) => {
      if (!response?.isUrlDetection) {
        // Toolbar click - open options page
        chrome.runtime.openOptionsPage()
        window.close()
      } else {
        // URL detection - show URL copy interface
        setCurrentUrl(response.url)
      }
    })
  }, [])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      // Close popup after a short delay to show feedback
      setTimeout(() => {
        window.close()
      }, 500)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="popup">
      <h2>URL Capture</h2>

      <div className="url-info">
        {currentUrl ? (
          <a href={currentUrl} className="url-link" target="_blank" rel="noopener noreferrer">
            右クリックで「別のユーザーとしてリンクを開く」等が選択できます
          </a>
        ) : (
          <div className="url-display">読み込み中...</div>
        )}
      </div>

      <div className="actions">
        <button
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopyUrl}
          disabled={!currentUrl}
        >
          {copied ? 'コピーしました！' : 'URLをコピー'}
        </button>

        <button className="settings-button" onClick={handleOpenOptions}>
          設定
        </button>
      </div>
    </div>
  )
}
