// mytask1.js
$(async function() {
    const tableConfig = {
        tableId: 'table2',
        dbName: 'myDatabase2',
        dbVersion: 2,
        storeName: 'tables2'
    };

    const table = $(`#${tableConfig.tableId}`);
    let hiddenTable = null;
    
    // Create hidden clone table
    function createHiddenTable() {
        hiddenTable = table.clone();
        hiddenTable.attr('id', `hidden_${tableConfig.tableId}`);
        hiddenTable.css({
            'position': 'absolute',
            'left': '-9999px',
            'visibility': 'hidden'
        });
        hiddenTable.find('tr').show();
        $('body').append(hiddenTable);
    }

    // Show today's rows function
    function showTodayRows() {
        const d = new Date();
        const today = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;

        // First pass - hide non-matching guide rows
        $(`#${tableConfig.tableId} > tbody > tr`).each(function() {
            const date = $(this).find(".datetime").html();
            if (date != today) {
                $(this).hide();
            }
        });

        // Second pass - show matching note rows
        $(`#${tableConfig.tableId} > tbody > tr`).each(function() {
            const date = $(this).find(".datetime2").html();
            if (date == today) {
                $(this).show();
            }
        });

        // Always show notes rows
        $('.notesRow').show();
    }

    // Load saved content
    try {
        const savedContent = await IndexedDBService.loadTable(
            tableConfig.dbName,
            tableConfig.dbVersion,
            tableConfig.storeName
        );

        if (savedContent) {
            table.html(savedContent);
            table.find('tr').show();
            createHiddenTable();
            showTodayRows();
        } else {
            createHiddenTable();
        }
    } catch (error) {
        console.error(`Error loading ${tableConfig.tableId}:`, error);
        createHiddenTable();
    }

    // Make table editable
    table.attr("contenteditable", "true");

    // Process user input and save on page unload
    window.addEventListener('beforeunload', async (event) => {
        try {
            // Process any input fields in today's rows
            const d = new Date();
            const today = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
            
            $(`#${tableConfig.tableId} > tbody > tr`).each(function() {
                const date = $(this).find(".datetime2").html();
                if (date == today) {
                    $(this).closest('tr').find("input").each(function() {
                        $(this).closest('td')
                            .html($(this).val())
                            .attr("contenteditable", "true");
                    });
                }
            });

            // Update hidden table and save
            hiddenTable.html(table.html());
            hiddenTable.find('tr').show();
            
            await IndexedDBService.saveTable(
                tableConfig.dbName,
                tableConfig.dbVersion,
                tableConfig.storeName,
                hiddenTable.html()
            );
        } catch (error) {
            console.error(`Error saving ${tableConfig.tableId}:`, error);
        }
    });

    // Keep today's rows visible after any changes
    table.on('input', function() {
        showTodayRows();
    });
});
