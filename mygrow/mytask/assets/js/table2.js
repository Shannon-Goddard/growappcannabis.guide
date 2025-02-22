// table2.js for mytask.html - with throttled updates to reduce mobile lag

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        if (!window.tableStorage) {
            console.error('tableStorage not initialized');
            return;
        }

        const table = $('#table2');
        const saveButton = document.getElementById('SaveButton');
        table.attr('contenteditable', 'true');

        // Pre-calculate today's date once
        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

        function filterTableByToday() {
            table.find('tr:not(:first)').each(function() {
                const row = $(this);
                const dateCell = row.find('td:nth-child(2)').text().trim();
                const isToday = (dateCell === formattedToday);
                const isNoteRow = row.hasClass('notes');
                
                if (isNoteRow) {
                    const prevRow = row.prev();
                    const prevRowVisible = prevRow.is(':visible');
                    row.toggle(prevRowVisible);
                } else {
                    row.toggle(isToday);
                }
            });
        }

        // Throttle setup for table updates
        let lastUpdate = 0;
        async function updateTable() {
            if (Date.now() - lastUpdate >= 1000) { // Limit to 1 update per second
                const savedContent = await window.tableStorage.loadTableData('table2');
                if (savedContent) {
                    table.html(savedContent);
                    filterTableByToday();
                    table.find(":input").hide();
                }
                lastUpdate = Date.now();
            }
        }

        try {
            // Initial load
            await updateTable();

            // Register table
            window.tableStorage.registerTable('table2', filterTableByToday);

            // Save handler (keep this, but save.js overrides it)
            let saveTimeout;
            table.on('input', 'td', function() {
                if (saveButton) {
                    saveButton.classList.add('save-button-pending');
                }
                
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    const tableClone = table[0].cloneNode(true);
                    const $clone = $(tableClone);
                    
                    $clone.find('tr').each(function() {
                        $(this).css('display', '');
                    });
                    
                    await window.tableStorage.saveTableData('table2', $clone.html());
                    $clone.remove();
                }, 2000);
            });

            // Style application
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
            console.error('Error initializing table2:', error);
        }
    }, 100);

    // Throttle any storage event updates
    window.addEventListener('storage', async () => {
        if (Date.now() - lastUpdate >= 1000) {
            await updateTable();
            lastUpdate = Date.now();
        }
    });
});