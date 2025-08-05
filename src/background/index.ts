import { ChromeStorage } from '@/infrastructure/chrome-storage'
import { DomainFilterRepositoryImpl } from '@/infrastructure/repositories/domain-filter-repository'
import { UrlDetectionUseCaseImpl } from '@/usecase/url-detection-usecase'

// Initialize dependencies
const storage = new ChromeStorage()
const filterRepo = new DomainFilterRepositoryImpl(storage)
const urlDetectionUseCase = new UrlDetectionUseCaseImpl(filterRepo)

// Store the current URL that triggered the popup
let currentDetectedUrl = ''

// Handle external URL requests
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only handle main frame navigation
  if (details.frameId !== 0) return

  // Skip chrome:// and extension URLs
  if (details.url.startsWith('chrome://') || details.url.startsWith('chrome-extension://')) {
    return
  }

  try {
    const result = await urlDetectionUseCase.shouldShowPopup(details.url)

    if (result.shouldShowPopup) {
      currentDetectedUrl = details.url
      isUrlDetection = true

      // Cancel the navigation
      chrome.tabs.update(details.tabId, { url: 'javascript:void(0)' })

      // Open popup
      chrome.action.openPopup()
    }
  } catch (error) {
    console.error('Error detecting URL:', error)
  }
})

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentUrl') {
    sendResponse({ url: currentDetectedUrl })
    return true
  }
  if (request.action === 'getPopupMode') {
    sendResponse({ isUrlDetection, url: currentDetectedUrl })
    isUrlDetection = false // Reset after checking
    return true
  }
})

// Clear badge when popup closes
chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    currentDetectedUrl = ''
  })
})

// Track if popup is opened by URL detection
let isUrlDetection = false

// Handle action button click (toolbar icon)
chrome.action.onClicked.addListener(() => {
  // This will only be called if default_popup is not set
  // Since we have default_popup, clicking icon will open popup
  // We'll handle the logic in popup to determine what to show
})
