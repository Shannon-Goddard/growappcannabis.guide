$(async function() {
    const table = $('#table3');
    table.attr('contenteditable', 'true');

    let queued = false;
    let lastValue = null;

    function isTodayDate(dateStr) {
        if (!dateStr) return false;
        const today = new Date();
        const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        return dateStr.trim() === formattedToday;
    }

    function filterTableByToday() {
        requestAnimationFrame(() => {
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
        });
    }

    // Optimized input handling
    table.on('input', function() {
        if (!queued) {
            queued = true;
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    const currentValue = table.html();
                    if (currentValue !== lastValue) {
                        window.tableStorage.saveTableData('table3', currentValue);
                        lastValue = currentValue;
                    }
                    queued = false;
                }, { timeout: 1000 });
            } else {
                setTimeout(() => {
                    const currentValue = table.html();
                    if (currentValue !== lastValue) {
                        window.tableStorage.saveTableData('table3', currentValue);
                        lastValue = currentValue;
                    }
                    queued = false;
                }, 100);
            }
        }
    });

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

    // Performance optimized styles
    table.css({
        'width': '100%',
        'border-collapse': 'collapse',
        'margin': '20px 0',
        'will-change': 'transform', // Hardware acceleration hint
        'transform': 'translateZ(0)' // Force hardware acceleration
    });

    table.find('th, td').css({
        'border': '1px solid #ddd',
        'padding': '8px',
        'text-align': 'left',
        'will-change': 'transform' // Hardware acceleration hint
    });

    // Register table with optimized filter
    window.tableStorage.registerTable('table3', filterTableByToday);
});
