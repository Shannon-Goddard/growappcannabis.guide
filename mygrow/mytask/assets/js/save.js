// save.js
window.tableStorage = {
    dbConfigs: {
        table1: { dbName: 'myDatabase', dbVersion: 1, storeName: 'tables' },
        table2: { dbName: 'myDatabase2', dbVersion: 2, storeName: 'tables2' },
        table3: { dbName: 'myDatabase3', dbVersion: 3, storeName: 'tables3' },
        table4: { dbName: 'myDatabase4', dbVersion: 4, storeName: 'tables4' }
    },
    tables: {},
    saveTimeouts: {},
    TYPING_DELAY: 1500,
    lastKnownContent: {},

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

    registerTable(tableId, filterFunction) {
        const table = document.getElementById(tableId);
        if (!table) return;

        this.tables[tableId] = {
            filterFunction,
            lastContent: table.innerHTML
        };

        // Add input handler with debounce
        let saveTimeout = null;
        table.addEventListener('input', () => {
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const currentContent = table.innerHTML;
                if (currentContent !== this.tables[tableId].lastContent) {
                    this.saveTableData(tableId, currentContent)
                        .then(() => {
                            this.tables[tableId].lastContent = currentContent;
                            if (filterFunction) filterFunction();
                        })
                        .catch(error => console.error(`Error saving ${tableId}:`, error));
                }
            }, this.TYPING_DELAY);
        });

        // Add blur handler for immediate save
        table.addEventListener('blur', (event) => {
            if (event.target.tagName === 'TD') {
                const currentContent = table.innerHTML;
                if (currentContent !== this.tables[tableId].lastContent) {
                    this.saveTableData(tableId, currentContent)
                        .then(() => {
                            this.tables[tableId].lastContent = currentContent;
                            if (filterFunction) filterFunction();
                        })
                        .catch(error => console.error(`Error saving ${tableId}:`, error));
                }
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

    // Register other tables similarly
    ['table2', 'table3', 'table4'].forEach(tableId => {
        if (document.getElementById(tableId)) {
            window.tableStorage.registerTable(tableId, null); // No filter function for other tables
        }
    });
});
