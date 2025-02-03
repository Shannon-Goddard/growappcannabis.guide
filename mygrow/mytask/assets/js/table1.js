// table1.js
$(async function() {
    const IndexedDBService = {
        dbName: 'myDatabase',
        dbVersion: 1,
        storeName: 'tables',
        
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

    const table = $('#table1');
    let fullTableContent = '';
    let hiddenTable = null;
    let saveTimeout = null;

    function isTodayDate(dateStr) {
        if (!dateStr) return false;
        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        return dateStr.trim() === formattedToday;
    }

    function filterTableByToday() {
        table.find('tr:not(:first)').each(function() {
            const dateCell = $(this).find('td:nth-child(2)').text().trim();
            if (isTodayDate(dateCell)) {
                $(this).show();
            } else {
                $(this).hide();
                if ($(this).next().hasClass('notes')) {
                    $(this).next().hide();
                }
            }
        });
    }

    function createHiddenTable() {
        hiddenTable = table.clone();
        hiddenTable.attr('id', 'hiddenTable1');
        hiddenTable.css({
            'position': 'absolute',
            'left': '-9999px',
            'visibility': 'hidden'
        });
        hiddenTable.find('tr').show();
        hiddenTable.find(':input').show();
        $('body').append(hiddenTable);
    }

    try {
        const savedContent = await IndexedDBService.loadTable();
        if (savedContent) {
            fullTableContent = savedContent;
            table.html(savedContent);
            createHiddenTable();
            filterTableByToday();
            table.find(":input").hide();
        }
    } catch (error) {
        console.error('Error loading table:', error);
    }

    table.css({
        'width': '100%',
        'border-collapse': 'collapse',
        'margin': '20px 0'
    });

    table.find('th, td').css({
        'border': '1px solid #ddd',
        'padding': '8px',
        'text-align': 'left'
    });

    table.attr('contenteditable', 'true');

    function debouncedSave() {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(async () => {
            const currentContent = table.html();
            hiddenTable.html(currentContent);
            hiddenTable.find('tr').show();
            hiddenTable.find(':input').show();
            fullTableContent = hiddenTable.html();
            await IndexedDBService.saveTable(fullTableContent);
            filterTableByToday();
        }, 1000);
    }

    table.on('input', function() {
        debouncedSave();
    });

    $(window).on('beforeunload', function() {
        clearTimeout(saveTimeout);
        
        table.find('tr').show();
        table.find(':input').show();
        
        hiddenTable.html(table.html());
        hiddenTable.find('tr').show();
        hiddenTable.find(':input').show();
        
        fullTableContent = hiddenTable.html();
        
        const db = indexedDB.open(IndexedDBService.dbName, IndexedDBService.dbVersion);
        db.onsuccess = function(event) {
            const database = event.target.result;
            const transaction = database.transaction([IndexedDBService.storeName], 'readwrite');
            const store = transaction.objectStore(IndexedDBService.storeName);
            store.put(fullTableContent, 'mainTable');
        };
        
        filterTableByToday();
        table.find(":input").hide();
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearTimeout(saveTimeout);
            
            table.find('tr').show();
            table.find(':input').show();
            
            hiddenTable.html(table.html());
            hiddenTable.find('tr').show();
            hiddenTable.find(':input').show();
            
            fullTableContent = hiddenTable.html();
            IndexedDBService.saveTable(fullTableContent);
            
            filterTableByToday();
            table.find(":input").hide();
        }
    });
});
