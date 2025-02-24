// save.js
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('SaveButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const tables = ['table1', 'table2', 'table3', 'table4'];
            for (const tableId of tables) {
                const table = $(`#${tableId}`);
                const hiddenTable = $(`#hidden${tableId}`);
                if (table.length && hiddenTable.length) {
                    const currentContent = table.html();
                    hiddenTable.html(currentContent);
                    hiddenTable.find('tr').show();
                    const fullContent = hiddenTable.html();
                    console.log(`Manual save ${tableId}:`, fullContent);
                    await IndexedDBService.saveTable(tableId, fullContent);
                }
            }
            saveButton.classList.add('save-button-success');
            setTimeout(() => saveButton.classList.remove('save-button-success'), 1000);
        });
    }
});