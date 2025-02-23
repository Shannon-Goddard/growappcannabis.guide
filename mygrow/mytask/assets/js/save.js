// save.js
window.tableStorage = {
    dbConfigs: {
        table1: { dbName: 'myGrow', dbVersion: 1, storeName: 'table1' },
        table2: { dbName: 'myGrow', dbVersion: 1, storeName: 'table2' },
        table3: { dbName: 'myGrow', dbVersion: 1, storeName: 'table3' },
        table4: { dbName: 'myGrow', dbVersion: 1, storeName: 'table4' }
    },
    tables: {},

    async initDB(tableId) {
        return new Promise((resolve, reject) => {
            const config = this.dbConfigs[tableId];
            if (!config) reject(new Error(`No config found for table ${tableId}`));
            const request = indexedDB.open(config.dbName, config.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const stores = ['table1', 'table2', 'table3', 'table4'];
                stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: 'id' });
                    }
                });
            };
        });
    },

    async saveTableData(tableId, content) {
        try {
            const db = await this.initDB(tableId);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readwrite');
                const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                const request = store.put({ id: 'mainTable', data: content });
                
                request.onsuccess = () => {
                    resolve(true);
                };
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

                request.onsuccess = () => {
                    resolve(request.result ? request.result.data : null);
                };
                request.onerror = () => reject(request.error);
                transaction.oncomplete = () => db.close();
            });
        } catch (error) {
            console.error('Error loading from IndexedDB:', error);
            return null;
        }
    },

    registerTable(tableId, filterFunction) {
        this.tables[tableId] = {
            filterFunction,
            lastContent: $(`#${tableId}`).html()
        };
    }
};

// Optional: Handle Save button if needed
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('SaveButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const tables = ['table1', 'table2', 'table3', 'table4'];
            for (const tableId of tables) {
                const table = $(`#${tableId}`);
                if (table.length) {
                    const tableClone = table[0].cloneNode(true);
                    const $clone = $(tableClone);
                    $clone.find('tr').each(function() {
                        $(this).css('display', '');
                    });
                    await window.tableStorage.saveTableData(tableId, $clone.html());
                    $clone.remove();
                }
            }
        });
    }
});