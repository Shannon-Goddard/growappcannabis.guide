$(async function() {
    const table = $('#table2');
    let fullTableContent = '';
    let hiddenTable = null;

    // Set contenteditable immediately
    table.attr('contenteditable', 'true');

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
        hiddenTable.attr('id', 'hiddenTable2');
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
        const savedContent = await TableSaveManager.loadTable('table2');
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

    // Create hidden table if it doesn't exist yet
    if (!hiddenTable) {
        createHiddenTable();
    }

    // Register with TableSaveManager
    TableSaveManager.registerTable('table2', table, hiddenTable, filterTableByToday);
});
