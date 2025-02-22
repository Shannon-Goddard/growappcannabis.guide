// save.js for mytask.html - fixed button and sync

document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('SaveButton');
    const noteInputs = document.querySelectorAll('.notes');
    const tableIds = ['table1', 'table2', 'table3', 'table4'];

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
                if (!config) reject(new Error(`No config found for ${tableId}`));
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

        registerTable(tableId, filterFunction) {
            this.tables[tableId] = { filterFunction, lastContent: $(`#${tableId}`).html() };
        }
    };

    async function saveAllTables() {
        for (const tableId of tableIds) {
            const table = document.getElementById(tableId);
            if (table) {
                const tableClone = table.cloneNode(true);
                const $clone = $(tableClone);
                
                $clone.find('tr').each(function() {
                    $(this).css('display', '');
                    $(this).show();
                });
                
                localStorage.setItem(`${tableId}_content`, $clone.html());
                await window.tableStorage.saveTableData(tableId, $clone.html());
                $clone.remove();
            }
        }
    }

    async function syncToServer() {
        updateSaveButtonState('saving');
        try {
            for (const tableId of tableIds) {
                const table = document.getElementById(tableId);
                if (table) {
                    const tableClone = table.cloneNode(true);
                    const $clone = $(tableClone);
                    
                    $clone.find('tr').each(function() {
                        $(this).css('display', '');
                        $(this).show();
                    });
                    
                    const response = await fetch('/save_notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ [tableId]: $clone.html() })
                    });
                    
                    if (!response.ok) throw new Error('Server sync failed');
                    const data = await response.json();
                    console.log('Server sync:', data);
                    $clone.remove();
                }
            }
            updateSaveButtonState('success');
        } catch (error) {
            console.error('Sync error:', error);
            updateSaveButtonState('success'); // Reset even on fail (local save worked)
        }
    }

    let timeout;
    if (noteInputs.length > 0) {
        noteInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateSaveButtonState('pending');
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    await saveAllTables();
                    updateSaveButtonState('success');
                }, 300);
            });
            input.addEventListener('blur', syncToServer);
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            await saveAllTables();
            await syncToServer();
        });
    }

    window.addEventListener('beforeunload', async function() {
        await saveAllTables();
        await syncToServer();
    });

    document.addEventListener('visibilitychange', async function() {
        if (document.hidden) {
            await saveAllTables();
            await syncToServer();
        }
    });
});