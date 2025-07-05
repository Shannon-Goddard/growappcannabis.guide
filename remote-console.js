// Remote Console - Send logs to a server or display on screen
(function() {
    // Override console methods to capture logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const logs = [];
    
    function captureLog(level, args) {
        const timestamp = new Date().toISOString();
        const message = Array.from(args).map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        logs.push({ timestamp, level, message });
        
        // Keep only last 50 logs
        if (logs.length > 50) {
            logs.shift();
        }
        
        // Update display
        updateLogDisplay();
    }
    
    console.log = function(...args) {
        originalLog.apply(console, args);
        captureLog('LOG', args);
    };
    
    console.error = function(...args) {
        originalError.apply(console, args);
        captureLog('ERROR', args);
    };
    
    console.warn = function(...args) {
        originalWarn.apply(console, args);
        captureLog('WARN', args);
    };
    
    // Create log display
    const logDisplay = document.createElement('div');
    logDisplay.id = 'remoteConsole';
    logDisplay.style.cssText = `
        position: fixed; bottom: 0; left: 0; right: 0; height: 150px;
        background: black; color: lime; font-family: monospace; font-size: 10px;
        padding: 5px; overflow-y: auto; z-index: 10000;
        border-top: 2px solid lime;
    `;
    
    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Console';
    toggleBtn.style.cssText = `
        position: fixed; bottom: 155px; right: 10px; z-index: 10001;
        background: lime; color: black; border: none; padding: 5px 10px;
    `;
    toggleBtn.onclick = () => {
        logDisplay.style.display = logDisplay.style.display === 'none' ? 'block' : 'none';
    };
    
    document.body.appendChild(logDisplay);
    document.body.appendChild(toggleBtn);
    
    function updateLogDisplay() {
        logDisplay.innerHTML = logs.map(log => 
            `<div>[${log.timestamp.split('T')[1].split('.')[0]}] ${log.level}: ${log.message}</div>`
        ).join('');
        logDisplay.scrollTop = logDisplay.scrollHeight;
    }
    
    // Export logs function
    window.exportLogs = function() {
        const logText = logs.map(log => 
            `[${log.timestamp}] ${log.level}: ${log.message}`
        ).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobile-debug-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };
})();