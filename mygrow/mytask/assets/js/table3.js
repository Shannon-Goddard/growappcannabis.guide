// table3.js
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(async function() {
        if (!window.tableStorage) {
            console.error('tableStorage not initialized');
            return;
        }

        const table = $('#table3');
        const saveButton = document.getElementById('SaveButton');
        table.attr('contenteditable', 'true');

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

        try {
            // Initial load
            const savedContent = await window.tableStorage.loadTableData('table3');
            if (savedContent) {
                table.html(savedContent);
                filterTableByToday();
                table.find(":input").hide();
            }

            // Register table
            window.tableStorage.registerTable('table3', filterTableByToday);

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
            console.error('Error initializing table3:', error);
        }
    }, 100);
});