$(async function() {
    const table = $('#table3');
    table.attr('contenteditable', 'true');

    // Pre-calculate today's date once
    const today = new Date();
    const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    // Simple, efficient filter
    function filterTableByToday() {
        table.find('tr:not(:first)').each(function() {
            const dateCell = $(this).find('td:nth-child(2)').text().trim();
            const isToday = (dateCell === formattedToday);
            $(this).toggle(isToday);
            if (!isToday && $(this).next().hasClass('notes')) {
                $(this).next().hide();
            }
        });
    }

    // Save handler with longer delay
    let saveTimeout;
    table.on('input', 'td', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            window.tableStorage.saveTableData('table3', table.html());
        }, 5000);
    });

    // Ensure save on page leave
    $(window).on('beforeunload', function() {
        clearTimeout(saveTimeout);
        window.tableStorage.saveTableData('table3', table.html());
    });

    // Initial load
    try {
        const savedContent = await window.tableStorage.loadTableData('table3');
        if (savedContent) {
            table.html(savedContent);
            filterTableByToday();
            table.find(":input").hide();
        }
    } catch (error) {
        console.error('Error loading table:', error);
    }

    // Register table
    window.tableStorage.registerTable('table3', filterTableByToday);

    // One-time style application
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
});
