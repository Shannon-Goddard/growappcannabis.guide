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

    // Helper function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

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
                requestAnimationFrame(() => {
                    const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readwrite');
                    const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                    const request = store.put(content, 'mainTable');
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(request.error);
                    transaction.oncomplete = () => db.close();
                });
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
                        requestAnimationFrame(() => {
                            table.innerHTML = content;
                            if (this.tables[tableId]?.filterFunction) {
                                this.tables[tableId].filterFunction();
                            }
                        });
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

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            if (timeSinceLastType < 100) {
                return 200;
            } else if (timeSinceLastType < 500) {
                return 150;
            } else {
                return 100;
            }
        } else {
            if (timeSinceLastType < 100) {
                return 800;
            } else if (timeSinceLastType < 500) {
                return 600;
            } else {
                return 400;
            }
        }
    },

    processSaveQueue(tableId) {
        if (!this.saveQueue[tableId]) return;

        const currentContent = this.saveQueue[tableId];
        delete this.saveQueue[tableId];

        if (currentContent !== this.tables[tableId]?.lastContent) {
            requestAnimationFrame(() => {
                this.saveTableData(tableId, currentContent)
                    .then(() => {
                        this.tables[tableId].lastContent = currentContent;
                        if (this.tables[tableId].filterFunction) {
                            requestAnimationFrame(() => {
                                this.tables[tableId].filterFunction();
                            });
                        }
                    });
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
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const handleInput = () => {
            this.saveQueue[tableId] = table.innerHTML;
            
            if (saveTimeout) clearTimeout(saveTimeout);
            if (throttleTimeout) clearTimeout(throttleTimeout);

            if (!this.tables[tableId].isTyping) {
                this.tables[tableId].isTyping = true;
            }

            const delay = isMobile ? 150 : this.getTypingDelay(tableId);
            
            saveTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    this.processSaveQueue(tableId);
                    this.tables[tableId].isTyping = false;
                });
            }, delay);

            throttleTimeout = setTimeout(() => {
                if (this.tables[tableId].isTyping) {
                    requestAnimationFrame(() => {
                        this.processSaveQueue(tableId);
                    });
                }
            }, isMobile ? 1000 : 2000);
        };

        table.addEventListener('input', handleInput, { passive: true });

        table.addEventListener('blur', (event) => {
            if (event.target.tagName === 'TD') {
                if (saveTimeout) clearTimeout(saveTimeout);
                if (throttleTimeout) clearTimeout(throttleTimeout);
                requestAnimationFrame(() => {
                    this.processSaveQueue(tableId);
                    this.tables[tableId].isTyping = false;
                });
            }
        }, { passive: true });
    }
};

// Initialize tables when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Register table1 with its filter function
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
