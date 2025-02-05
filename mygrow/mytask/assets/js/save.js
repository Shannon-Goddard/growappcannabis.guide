window.tableStorage = {
    dbConfigs: {
        table1: { dbName: 'myDatabase', dbVersion: 1, storeName: 'tables' },
        table2: { dbName: 'myDatabase2', dbVersion: 2, storeName: 'tables2' },
        table3: { dbName: 'myDatabase3', dbVersion: 3, storeName: 'tables3' },
        table4: { dbName: 'myDatabase4', dbVersion: 4, storeName: 'tables4' }
    },
    tables: {},
    saveTimeouts: {},
    saveQueue: {},
    lastTypingTime: {},

    async initDB(tableId) {
        const config = this.dbConfigs[tableId];
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(config.dbName, config.dbVersion);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(config.storeName)) {
                    db.createObjectStore(config.storeName);
                }
            };
            request.onsuccess = () => resolve(request.result);
        });
    },

    async saveTableData(tableId, content) {
        try {
            const db = await this.initDB(tableId);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readwrite');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                const request = store.put(content, 'mainTable');
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    },

    async restoreTableData() {
        const tables = ['table1', 'table2', 'table3', 'table4'];
        for (const tableId of tables) {
            try {
                const table = document.getElementById(tableId);
                if (table) {
                    const content = await this.loadTableData(tableId);
                    if (content) {
                        table.innerHTML = content;
                        if (this.tables[tableId]?.filterFunction) {
                            this.tables[tableId].filterFunction();
                        }
                    }
                }
            } catch (error) {
                console.error(`Error restoring ${tableId}:`, error);
            }
        }
    },

    async loadTableData(tableId) {
        try {
            const db = await this.initDB(tableId);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readonly');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                const request = store.get('mainTable');
                request.onsuccess = () => {
                    db.close();
                    resolve(request.result);
                };
                request.onerror = () => {
                    db.close();
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error loading from IndexedDB:', error);
            return null;
        }
    },

    getTypingDelay(tableId) {
        const now = Date.now();
        const timeSinceLastType = now - (this.lastTypingTime[tableId] || 0);
        this.lastTypingTime[tableId] = now;

        // Fast typing (< 100ms between keystrokes): longer delay
        // Slow typing (> 500ms between keystrokes): shorter delay
        if (timeSinceLastType < 100) {
            return 800; // Fast typing
        } else if (timeSinceLastType < 500) {
            return 600; // Medium typing
        } else {
            return 400; // Slow typing
        }
    },

    processSaveQueue(tableId) {
        if (!this.saveQueue[tableId]) return;

        const currentContent = this.saveQueue[tableId];
        delete this.saveQueue[tableId];

        if (currentContent !== this.tables[tableId]?.lastContent) {
            this.saveTableData(tableId, currentContent)
                .then(() => {
                    this.tables[tableId].lastContent = currentContent;
                    if (this.tables[tableId].filterFunction) {
                        this.tables[tableId].filterFunction();
                    }
                });
        }
    },

    registerTable(tableId, filterFunction) {
        const table = document.getElementById(tableId);
        if (!table) return;

        this.tables[tableId] = {
            filterFunction,
            lastContent: table.innerHTML,
            isTyping: false
        };

        let saveTimeout = null;
        let throttleTimeout = null;

        const handleInput = () => {
            this.saveQueue[tableId] = table.innerHTML;
            
            // Clear existing timeouts
            if (saveTimeout) clearTimeout(saveTimeout);
            if (throttleTimeout) clearTimeout(throttleTimeout);

            // Set typing flag
            if (!this.tables[tableId].isTyping) {
                this.tables[tableId].isTyping = true;
            }

            // Schedule save with dynamic delay
            saveTimeout = setTimeout(() => {
                this.processSaveQueue(tableId);
                this.tables[tableId].isTyping = false;
            }, this.getTypingDelay(tableId));

            // Ensure save happens after typing stops
            throttleTimeout = setTimeout(() => {
                if (this.tables[tableId].isTyping) {
                    this.processSaveQueue(tableId);
                }
            }, 2000); // Backup save after 2 seconds of continuous typing
        };

        // Handle input events
        table.addEventListener('input', handleInput);

        // Handle blur events for immediate save
        table.addEventListener('blur', (event) => {
            if (event.target.tagName === 'TD') {
                if (saveTimeout) clearTimeout(saveTimeout);
                if (throttleTimeout) clearTimeout(throttleTimeout);
                this.processSaveQueue(tableId);
                this.tables[tableId].isTyping = false;
            }
        }, true);
    }
};

// Initialize tables when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Register each table with its filter function
    if (document.getElementById('table1')) {
        window.tableStorage.registerTable('table1', function() {
            const table = document.getElementById('table1');
            table.querySelectorAll('tr:not(:first-child)').forEach(row => {
                const dateCell = row.querySelector('td:nth-child(2)');
                if (dateCell) {
                    const dateStr = dateCell.textContent.trim();
                    const today = new Date();
                    const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
                    if (dateStr === formattedToday) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                        if (row.nextElementSibling?.classList.contains('notes')) {
                            row.nextElementSibling.style.display = 'none';
                        }
                    }
                }
            });
        });
    }

    // Register other tables
    ['table2', 'table3', 'table4'].forEach(tableId => {
        if (document.getElementById(tableId)) {
            window.tableStorage.registerTable(tableId, null);
        }
    });
});
