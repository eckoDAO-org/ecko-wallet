import 'regenerator-runtime/runtime';

const scriptInjection = document.createElement('script');
scriptInjection.src = chrome.runtime.getURL('app/script/inpage.js');
(document.head || document.documentElement).appendChild(scriptInjection);

scriptInjection.onload = () => {
  const extensionURL = chrome.runtime.getURL('popup.html');

  const event = new CustomEvent('onloadInject', { detail: { extensionURL } });
  document.dispatchEvent(event);
};

// Long-life connection to background
let port = chrome.runtime.connect({ name: 'kda.extension' });

// Listen background message
port.onMessage.addListener(async (data) => {
  window.postMessage({
    ...data,
    target: 'kda.dapps',
  });
});
port.onDisconnect.addListener(() => {
  // new connect
  port = chrome.runtime.connect({ name: 'kda.extension' });
});
// Listen webpage(dapps) message
window.addEventListener(
  'message',
  (event) => {
    if (event.source !== window) return;

    const { data } = event;
    if (data.target && data.target === 'kda.content') {
      port.postMessage({
        ...data,
        target: 'kda.background',
      });
    }
  },
  false,
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('!!! ~ sender', sender);
  console.log('!!! ~ request', request);
  sendResponse({ test: 'hello' });
  const event = new CustomEvent('message', { detail: request, data: request, target: 'kda.dapps' });
  document.dispatchEvent(event);
  return true;
});
