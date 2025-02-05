const TableSaveManager = {
    dbConfigs: {
        table1: { dbName: 'myDatabase', dbVersion: 1, storeName: 'tables' },
        table2: { dbName: 'myDatabase2', dbVersion: 2, storeName: 'tables2' },
        table3: { dbName: 'myDatabase3', dbVersion: 3, storeName: 'tables3' },
        table4: { dbName: 'myDatabase4', dbVersion: 4, storeName: 'tables4' }
    },
    tables: {},
    saveTimeouts: {},
    TYPING_DELAY: 3000,  
    MIN_SAVE_INTERVAL: 5000,
    BATCH_SAVE_TIMEOUT: 3000,

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

    async saveTable(tableId, tableContent) {
        try {
            const db = await this.initDB(tableId);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readwrite');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                const request = store.put(tableContent, 'mainTable');
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    },

    async loadTable(tableId) {
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

    registerTable(tableId, table, hiddenTable, filterFunction) {
        this.tables[tableId] = { table, hiddenTable, filterFunction };
        
        // Setup save on input with debounce
        table.on('input', () => {
            if (this.saveTimeouts[tableId]) {
                clearTimeout(this.saveTimeouts[tableId]);
            }
            this.saveTimeouts[tableId] = setTimeout(async () => {
                const currentContent = table.html();
                // Save to hidden table without affecting visibility
                hiddenTable.html(currentContent);
                const visibilityStates = this.captureVisibilityStates(table);
                hiddenTable.find('tr').show();
                hiddenTable.find(':input').show();
                await this.saveTable(tableId, hiddenTable.html());
                this.restoreVisibilityStates(table, visibilityStates);
            }, this.TYPING_DELAY);
        });
    },

    captureVisibilityStates(table) {
        const states = [];
        table.find('tr').each(function() {
            states.push({
                row: $(this),
                isHidden: $(this).is(':hidden'),
                hasNotes: $(this).next().hasClass('notes')
            });
        });
        return states;
    },

    restoreVisibilityStates(table, states) {
        states.forEach(state => {
            if (state.isHidden) {
                state.row.hide();
                if (state.hasNotes) {
                    state.row.next('.notes').hide();
                }
            } else {
                state.row.show();
                if (state.hasNotes) {
                    state.row.next('.notes').show();
                }
            }
        });
    },

    async saveTableState(tableId) {
        const { table, hiddenTable } = this.tables[tableId];
        const currentContent = table.html();
        const visibilityStates = this.captureVisibilityStates(table);
        
        // Save to hidden table without affecting visibility
        hiddenTable.html(currentContent);
        hiddenTable.find('tr').show();
        hiddenTable.find(':input').show();
        
        await this.saveTable(tableId, hiddenTable.html());
        this.restoreVisibilityStates(table, visibilityStates);
    },

    handleUnload() {
        Object.keys(this.tables).forEach(tableId => {
            if (this.saveTimeouts[tableId]) {
                clearTimeout(this.saveTimeouts[tableId]);
            }
            // Use synchronous version for unload
            const { table, hiddenTable } = this.tables[tableId];
            const visibilityStates = this.captureVisibilityStates(table);
            
            hiddenTable.html(table.html());
            hiddenTable.find('tr').show();
            hiddenTable.find(':input').show();
            
            const db = indexedDB.open(this.dbConfigs[tableId].dbName);
            db.onsuccess = function(event) {
                const database = event.target.result;
                const transaction = database.transaction([this.dbConfigs[tableId].storeName], 'readwrite');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                store.put(hiddenTable.html(), 'mainTable');
                this.restoreVisibilityStates(table, visibilityStates);
            }.bind(this);
        });
    }
};

// Initialize event listeners
$(document).ready(() => {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            Object.keys(TableSaveManager.tables).forEach(async (tableId) => {
                await TableSaveManager.saveTableState(tableId);
            });
        }
    });

    window.addEventListener('beforeunload', () => {
        TableSaveManager.handleUnload();
    });
});
