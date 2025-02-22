// save.js for mytask.html - save all present tables (1-4) with today's tasks and notes, debounced, with tableStorage

document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('SaveButton');
    const noteInputs = document.querySelectorAll('.notes'); // All .notes inputs across tables
    const tableIds = ['table1', 'table2', 'table3', 'table4']; // Possible tables
    
    // Function to update save button state
    const updateSaveButtonState = (state) => {
        if (!saveButton) return;
        
        saveButton.classList.remove('save-button-pending', 'save-button-success', 'save-button-saving');
        
        switch(state) {
            case 'pending':
                saveButton.classList.add('save-button-pending');
                saveButton.innerHTML = '<i class="fa fa-save"></i> Save Changes';
                break;
            case 'saving':
                saveButton.classList.add('save-button-saving');
                saveButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
                break;
            case 'success':
                saveButton.classList.add('save-button-success');
                saveButton.innerHTML = '<i class="fa fa-check"></i> Saved';
                setTimeout(() => {
                    saveButton.classList.remove('save-button-success');
                    saveButton.innerHTML = '<i class="fa fa-save"></i> Save';
                    saveButton.style.background = 'transparent';
                    saveButton.style.color = '#FFFFFF';
                    saveButton.style.borderColor = '#04AA6D';
                }, 2000);
                break;
            default:
                saveButton.innerHTML = '<i class="fa fa-save"></i> Save';
                saveButton.style.background = 'transparent';
                saveButton.style.color = '#FFFFFF';
                saveButton.style.borderColor = '#04AA6D';
        }
    };

    // Restore tableStorage for table1.js to table4.js compatibility
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
                if (!config) {
                    reject(new Error(`No config found for table ${tableId}`));
                    return;
                }
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
                updateSaveButtonState('saving');
                const db = await this.initDB(tableId);
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(this.dbConfigs[tableId].storeName, 'readwrite');
                    const store = transaction.objectStore(this.dbConfigs[tableId].storeName);
                    const request = store.put(content, 'mainTable');
                    
                    request.onsuccess = () => {
                        updateSaveButtonState('success');
                        resolve(true);
                    };
                    request.onerror = () => reject(request.error);
                    transaction.oncomplete = () => db.close();
                });
            } catch (error) {
                console.error('Error saving to IndexedDB:', error);
                updateSaveButtonState('pending');
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

        registerTable(tableId, filterFunction) {
            this.tables[tableId] = {
                filterFunction,
                lastContent: $(`#${tableId}`).html()
            };
        }
    };

    // Save all present tables
    async function saveAllTables() {
        for (const tableId of tableIds) {
            const table = document.getElementById(tableId);
            if (table) { // Only save if table exists
                const tableClone = table.cloneNode(true);
                const $clone = $(tableClone);
                
                $clone.find('tr').each(function() {
                    $(this).css('display', ''); // Keep all rows visible in storage
                    $(this).show();
                });
                
                await window.tableStorage.saveTableData(tableId, $clone.html());
                $clone.remove();
            }
        }
    }

    // Debounce setup
    let timeout;
    if (noteInputs.length > 0) {
        noteInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(saveAllTables, 300); // Save all tables after 300ms
            });
        });
    }

    // Save button click handler
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            updateSaveButtonState('saving');
            await saveAllTables();
        });
    }

    // Save on page unload
    window.addEventListener('beforeunload', async function() {
        await saveAllTables();
    });

    // Visibility change handler
    document.addEventListener('visibilitychange', async function() {
        if (document.hidden) {
            await saveAllTables();
        }
    });
});