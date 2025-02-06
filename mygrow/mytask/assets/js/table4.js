$(async function() {
    const table = $('#table4');
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

    try {
        const savedContent = await window.tableStorage.loadTableData('table4');
        if (savedContent) {
            table.html(savedContent);
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

    window.tableStorage.registerTable('table4', filterTableByToday);
});
