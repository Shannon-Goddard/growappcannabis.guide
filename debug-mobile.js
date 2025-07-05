// Mobile Debug Helper - Add this to any page having issues
(function() {
    // Create debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'mobileDebug';
    debugPanel.style.cssText = `
        position: fixed; top: 0; right: 0; width: 300px; height: 200px;
        background: rgba(0,0,0,0.9); color: white; font-size: 12px;
        padding: 10px; z-index: 9999; overflow-y: auto;
        border: 2px solid red;
    `;
    document.body.appendChild(debugPanel);

    // Debug logging function
    window.mobileLog = function(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.innerHTML = `[${timestamp}] ${message}`;
        if (data) {
            logEntry.innerHTML += `<br>Data: ${JSON.stringify(data, null, 2)}`;
        }
        debugPanel.appendChild(logEntry);
        debugPanel.scrollTop = debugPanel.scrollHeight;
        console.log(`[MOBILE DEBUG] ${message}`, data);
    };

    // Log localStorage info
    window.mobileLog('=== MOBILE DEBUG STARTED ===');
    window.mobileLog('Current URL', window.location.href);
    window.mobileLog('Current growId', localStorage.getItem('currentGrowId'));
    window.mobileLog('Total localStorage keys', Object.keys(localStorage).length);
    
    // Log grow-related keys
    const growKeys = Object.keys(localStorage).filter(key => key.includes('grow_'));
    window.mobileLog('Grow-related keys', growKeys.length);
    
    // Log nutrient-related keys
    const nutrientKeys = Object.keys(localStorage).filter(key => key.includes('nutrients_'));
    window.mobileLog('Nutrient-related keys', nutrientKeys);
})();