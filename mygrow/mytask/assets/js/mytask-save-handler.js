// mytask-save-handler.js
(function() {
    "use strict";

    const saveTableData = async (tableId) => {
        const table = document.getElementById(tableId);
        if (!table || !window.tableStorage) return;

        const tableClone = table.cloneNode(true);
        const hiddenRows = tableClone.querySelectorAll('tr[style*="display: none"]');
        hiddenRows.forEach(row => row.style.display = '');

        try {
            await window.tableStorage.saveTableData(tableId, tableClone.innerHTML);
            console.log(`Auto-saved ${tableId}`);
        } catch (error) {
            console.error(`Error auto-saving ${tableId}:`, error);
        }
    };

    let saveTimeouts = {};
    const handleAutoSave = (tableId) => {
        clearTimeout(saveTimeouts[tableId]);
        saveTimeouts[tableId] = setTimeout(() => saveTableData(tableId), 3000); // 3s debounce
    };

    document.addEventListener('DOMContentLoaded', () => {
        const tables = ['table1', 'table2', 'table3', 'table4'];
        
        tables.forEach(tableId => {
            const table = document.getElementById(tableId);
            if (table) {
                table.addEventListener('input', () => handleAutoSave(tableId));
            }
        });

        // Keep these for robustness, but they’re less frequent on mobile
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                tables.forEach(tableId => saveTableData(tableId));
            }
        });

        window.addEventListener('beforeunload', () => {
            tables.forEach(tableId => saveTableData(tableId));
        });
    });
})();