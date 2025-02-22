// mytask-save-handler.js - slimmed down

(function() {
    "use strict";

    function debounce(fn, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    const saveCompleteTableData = async (tableId) => {
      const table = document.getElementById(tableId);
      if (!table) return;

      try {
        const tableClone = table.cloneNode(true);
        const hiddenRows = tableClone.querySelectorAll('tr[style*="display: none"]');
        hiddenRows.forEach(row => row.style.display = '');

        if (window.tableStorage) {
          await window.tableStorage.saveTableData(tableId, tableClone.innerHTML);
        }
      } catch (error) {
        console.error(`Save failed for ${tableId}:`, error);
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      const tables = ['table1', 'table2', 'table3', 'table4'];

      tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (table) {
          const inputs = table.querySelectorAll('.notes');
          inputs.forEach(input => {
            input.addEventListener('input', debounce(() => saveCompleteTableData(tableId), 200));
          });
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          tables.forEach(tableId => saveCompleteTableData(tableId));
        }
      });

      window.addEventListener('beforeunload', () => {
        tables.forEach(tableId => saveCompleteTableData(tableId));
      });
    });
})();