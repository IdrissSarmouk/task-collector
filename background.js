// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Task Collector installed');
});

// Keep track of collector status across tabs
const collectorStatus = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStatus') {
    const tabId = sender.tab?.id;
    if (tabId) {
      collectorStatus.set(tabId, request.status);
    }
  }
  return true;
});

// Clean up status when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  collectorStatus.delete(tabId);
});