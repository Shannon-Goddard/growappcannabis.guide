// table1.js for mytask.html - with debug logs

document.addEventListener('DOMContentLoaded', function() {
    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    setTimeout(async function() {
        if (!window.tableStorage) {
            console.error('tableStorage not initialized');
            return;
        }

        const table = $('#table1');
        table.attr('contenteditable', 'true');

        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        console.log('Today’s date:', formattedToday); // Check the date

        function filterTableByToday() {
            table.find('tr:not(:first)').each(function() {
                const row = $(this);
                const dateCell = row.find('td:nth-child(2)').text().trim();
                const isToday = (dateCell === formattedToday);
                const isNoteRow = row.hasClass('notes');
                
                console.log('Row date:', dateCell, 'Matches today?', isToday); // Debug each row
                
                if (isNoteRow) {
                    const prevRow = row.prev();
                    const prevRowVisible = prevRow.is(':visible');
                    row.toggle(prevRowVisible);
                } else {
                    row.toggle(isToday);
                }
            });
        }

        async function updateTable() {
            const savedContent = await window.tableStorage.loadTableData('table1');
            console.log('Loaded content for table1:', savedContent); // What’s coming back?
            if (savedContent) {
                table.html(savedContent);
                filterTableByToday();
                table.find(":input").hide();
            } else {
                console.warn('No saved content for table1');
            }
        }

        try {
            await updateTable();
            window.tableStorage.registerTable('table1', filterTableByToday);

            const saveButton = document.getElementById('SaveButton');
            table.on('input', 'td', debounce(function() {
                // No save here
            }, 200));

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

        } catch (error) {
            console.error('Error initializing table1:', error);
        }
    }, 100);

    window.addEventListener('storage', debounce(async () => {
        await updateTable();
    }, 1000));
});