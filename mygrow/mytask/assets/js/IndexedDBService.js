// Database configurations
const dbConfigs = {
    table1: { dbName: 'myDatabase', dbVersion: 1, storeName: 'tables' },
    table2: { dbName: 'myDatabase2', dbVersion: 2, storeName: 'tables2' },
    table3: { dbName: 'myDatabase3', dbVersion: 3, storeName: 'tables3' },
    table4: { dbName: 'myDatabase4', dbVersion: 4, storeName: 'tables4' }
};

// IndexedDBService definition
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
            console.error(`Error loading from ${dbName}:`, error);
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
            console.error(`Error saving to ${dbName}:`, error);
            return false;
        }
    }
};

// Initialize tables when document is ready
$(async function() {
    // Function to update row visibility based on date
    function updateRowVisibility(tableId) {
        const d = new Date();
        const today = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;

        $(`#${tableId} > tbody > tr`).each(function() {
            const date = $(this).find(".datetime2").html();
            if (date === today) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // Always show notes rows
        $('.notesRow').show();
    }

    // Function to clean table content
    function cleanTableContent(table) {
        // Remove any input fields and preserve their values
        table.find('input').each(function() {
            const input = $(this);
            const value = input.val() || '';
            input.closest('td').html(value);
        });

        // Remove any empty text nodes
        table.contents().each(function() {
            if (this.nodeType === 3 && !this.nodeValue.trim()) {
                $(this).remove();
            }
        });

        return table;
    }

    // Initialize each table
    for (const [tableId, dbConfig] of Object.entries(dbConfigs)) {
        const table = $(`#${tableId}`);
        if (!table.length) continue;

        // Clean and save initial table content if needed
        const initialContent = table.html();
        if (initialContent) {
            cleanTableContent(table);
            await IndexedDBService.saveTable(
                dbConfig.dbName,
                dbConfig.dbVersion,
                dbConfig.storeName,
                table.html()
            );
        }

        // Load saved content
        try {
            const savedContent = await IndexedDBService.loadTable(
                dbConfig.dbName,
                dbConfig.dbVersion,
                dbConfig.storeName
            );

            if (savedContent) {
                table.html(savedContent);
                cleanTableContent(table);
                updateRowVisibility(tableId);
            }
        } catch (error) {
            console.error(`Error loading ${tableId}:`, error);
        }

        // Make table editable
        table.attr('contenteditable', 'true');

        // Save content when table is modified
        table.on('input', async function() {
            try {
                cleanTableContent(table);
                await IndexedDBService.saveTable(
                    dbConfig.dbName,
                    dbConfig.dbVersion,
                    dbConfig.storeName,
                    table.html()
                );
            } catch (error) {
                console.error(`Error saving ${tableId}:`, error);
            }
        });
    }

    // Save button functionality
    $('#SaveButton').hide();

    $("table").on("click", "td", function() {
        $('#SaveButton').show();
    });

    $("#SaveButton").on("click", async function() {
        for (const [tableId, dbConfig] of Object.entries(dbConfigs)) {
            const table = $(`#${tableId}`);
            if (!table.length) continue;

            cleanTableContent(table);
            await IndexedDBService.saveTable(
                dbConfig.dbName,
                dbConfig.dbVersion,
                dbConfig.storeName,
                table.html()
            );
        }

        $('#SaveButton').hide();
    });

    // Remove any existing beforeunload handlers
    $(window).off('beforeunload');
    window.onbeforeunload = null;

    // Add visibilitychange handler for auto-saving
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'hidden') {
            for (const [tableId, dbConfig] of Object.entries(dbConfigs)) {
                const table = $(`#${tableId}`);
                if (!table.length) continue;

                // Show all rows temporarily
                table.find('tr').show();
                
                cleanTableContent(table);
                
                // Save the complete table content
                await IndexedDBService.saveTable(
                    dbConfig.dbName,
                    dbConfig.dbVersion,
                    dbConfig.storeName,
                    table.html()
                );
                
                // Restore visibility
                updateRowVisibility(tableId);
            }
        }
    });
});
