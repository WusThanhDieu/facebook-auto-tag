chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'execute') {
        chrome.scripting.executeScript({
            target: { tabId: message.tabId },
            func: eval('(' + message.code + ')')
        }).catch(error => {
            console.error("Error executing script:", error);
        });
    }
});
