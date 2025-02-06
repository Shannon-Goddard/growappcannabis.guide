window.tableStorage = {
    tables: {},
    dbConfigs: {
        table1: { dbName: 'myDatabase', dbVersion: 1, storeName: 'tables' },
        table2: { dbName: 'myDatabase2', dbVersion: 2, storeName: 'tables2' },
        table3: { dbName: 'myDatabase3', dbVersion: 3, storeName: 'tables3' },
        table4: { dbName: 'myDatabase4', dbVersion: 4, storeName: 'tables4' }
    },

    async initDB(tableId) {
        return new Promise((resolve, reject) => {
            const config = this.dbConfigs[tableId];
            const request = indexedDB.open(config.dbName, config.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(config.storeName)) {
                    db.createObjectStore(config.storeName);
                }
            };
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

    async loadTableData(tableId) {
        try {
            const db = await this.initDB(tableId);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readonly');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                const request = store.get('mainTable');

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error loading from IndexedDB:', error);
            return null;
        }
    },

    async saveAllTables() {
        try {
            const tables = ['table1', 'table2', 'table3', 'table4'];
            for (const tableId of tables) {
                const table = $(`#${tableId}`);
                if (table.length) {
                    table.find('tr').show();
                    await this.saveTableData(tableId, table.html());
                    if (this.tables[tableId]?.filterFunction) {
                        this.tables[tableId].filterFunction();
                    }
                }
            }
        } catch (error) {
            console.error('Error saving tables:', error);
        }
    },

    registerTable(tableId, filterFunction) {
        const table = $(`#${tableId}`);
        if (!table.length) return;

        this.tables[tableId] = {
            filterFunction,
            lastContent: table.html()
        };
    }
};

$(window).on('beforeunload', function() {
    window.tableStorage.saveAllTables();
});
