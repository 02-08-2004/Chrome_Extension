chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openEmail') {
    chrome.tabs.create({ url: message.url });
  }
});
