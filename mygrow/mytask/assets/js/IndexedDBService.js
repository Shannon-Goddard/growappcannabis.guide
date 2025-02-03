// IndexedDBService.js
const IndexedDBService = {
    initDB(dbName, dbVersion, storeName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, dbVersion);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
            
            request.onsuccess = () => resolve(request.result);
        });
    },

    async loadTable(dbName, dbVersion, storeName) {
        try {
            const db = await this.initDB(dbName, dbVersion, storeName);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
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

    async saveTable(dbName, dbVersion, storeName, content) {
        try {
            const db = await this.initDB(dbName, dbVersion, storeName);
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(content, 'mainTable');
                
                request.onsuccess = () => {
                    db.close();
                    resolve(true);
                };
                
                request.onerror = () => {
                    db.close();
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            return false;
        }
    }
};


