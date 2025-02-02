const IndexedDBService = {
    dbName: 'myDatabase2',
    dbVersion: 2,
    storeName: 'tables2',
    
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
            
            request.onsuccess = () => resolve(request.result);
        });
    },

    async saveTable(tableContent) {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                
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

    async loadTable() {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                
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
    }
};

// Initialize and load table content
$(async function() {
    const table = $('#table2');
    let fullTableContent = '';
    
    // Load content from IndexedDB
    try {
        const savedContent = await IndexedDBService.loadTable();
        if (savedContent) {
            fullTableContent = savedContent;  // Store the full table content
            table.html(savedContent);
            
            // Hide non-notes rows in the visible table
            table.find('tr:not(:first)').hide();
            table.find('.notes').show();
            table.find(":input").hide();
        }
    } catch (error) {
        console.error('Error loading table:', error);
    }

    // Make table editable
    table.attr('contenteditable', 'true');

    // Save content when table is modified
    table.on('input', async function() {
        try {
            // Update the full table content with any changes
            fullTableContent = table.html();
            await IndexedDBService.saveTable(fullTableContent);
        } catch (error) {
            console.error('Error saving table:', error);
        }
    });

    // Save before page unload
    $(window).on('beforeunload', function() {
        // Show all rows temporarily
        table.find('tr').show();
        
        // Get the complete table content
        fullTableContent = table.html();
        
        // Save the complete table content
        IndexedDBService.saveTable(fullTableContent);
        
        // Re-hide the rows
        table.find('tr:not(:first)').hide();
        table.find('.notes').show();
    });
});
