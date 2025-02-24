// table4.js
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof IndexedDBService === 'undefined') {
        console.error('IndexedDBService not defined');
        return;
    }

    const table = $('#table4');
    let fullTableContent = '';
    let hiddenTable = null;
    let saveTimeout = null;
    const today = new Date();
    const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    function createHiddenTable() {
        hiddenTable = table.clone();
        hiddenTable.attr('id', 'hiddenTable4');
        hiddenTable.css({ 'position': 'absolute', 'left': '-9999px', 'visibility': 'hidden' });
        hiddenTable.find('tr').show();
        $('body').append(hiddenTable);
    }

    function filterTableByToday() {
        console.log('Filtering table4 for today:', formattedToday);
        table.find('tr:not(:first)').each(function() {
            const row = $(this);
            const dateCell = row.find('td:nth-child(2)').text().trim();
            const isToday = (dateCell === formattedToday);
            const isNoteRow = row.hasClass('notes');
            if (isNoteRow) {
                const prevRow = row.prev();
                row.toggle(prevRow.is(':visible'));
            } else {
                row.toggle(isToday);
            }
        });
    }

    try {
        const savedContent = await IndexedDBService.loadTable('table4');
        if (savedContent) {
            console.log('Loaded table4 content:', savedContent);
            fullTableContent = savedContent;
            table.html(savedContent);
            createHiddenTable();
            filterTableByToday();
        } else {
            console.log('No saved content for table4');
            createHiddenTable();
            // No "No data" placeholder
        }
    } catch (error) {
        console.error('Error loading table4:', error);
        createHiddenTable();
    }

    table.attr('contenteditable', 'true');
    table.css({ 'width': '100%', 'border-collapse': 'collapse', 'margin': '20px 0' });
    table.find('th, td').css({ 'border': '1px solid #ddd', 'padding': '8px', 'text-align': 'left' });
    table.find('tr.notes :input').hide();

    function debouncedSave() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const selection = window.getSelection();
            const range = selection.rangeCount ? selection.getRangeAt(0) : null;
            const cursorPosition = range ? range.startOffset : 0;
            const activeCell = document.activeElement.closest('td, th');

            const currentContent = table.html();
            console.log('Before save table4:', currentContent);
            if (!currentContent || currentContent.trim() === '') {
                console.log('Table4 empty, skipping save');
                return;
            }

            hiddenTable.html(currentContent);
            hiddenTable.find('tr').show();
            fullTableContent = hiddenTable.html();
            console.log('Saving table4:', fullTableContent);

            try {
                await IndexedDBService.saveTable('table4', fullTableContent);
                console.log('Saved table4 successfully');
                filterTableByToday();
                table.find('tr.notes :input').hide();

                if (activeCell && range) {
                    const rowIndex = activeCell.parentElement.rowIndex;
                    const cellIndex = Array.from(activeCell.parentElement.children).indexOf(activeCell);
                    const newCell = table[0].rows[rowIndex]?.cells[cellIndex];
                    if (newCell) {
                        const textNode = newCell.firstChild || newCell.appendChild(document.createTextNode(''));
                        const newRange = document.createRange();
                        newRange.setStart(textNode, Math.min(cursorPosition, textNode.length));
                        newRange.setEnd(textNode, Math.min(cursorPosition, textNode.length));
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                        newCell.focus();
                        console.log('Cursor restored in table4');
                    }
                }
            } catch (error) {
                console.error('Error saving table4:', error);
            }
        }, 250);
    }

    table.on('input', debouncedSave);
});