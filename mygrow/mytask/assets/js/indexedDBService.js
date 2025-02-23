const IndexedDBService = {
    dbName: 'myGrow',
    dbVersion: 1,
    storeName: 'table1',
    
    // Initialize the database
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const stores = ['table1', 'table2', 'table3', 'table4'];
                stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: 'id' });
                    }
                });
            };
            
            request.onsuccess = () => resolve(request.result);
        });
    },



    // Load table from IndexedDB
    async loadTable() {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                
                const request = store.get('mainTable');
                
                request.onsuccess = () => {
                    const result = request.result ? request.result.data : null;
                    db.close();
                    resolve(result);
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
    }
};

