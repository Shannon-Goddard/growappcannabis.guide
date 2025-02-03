// Message System Styles
const styles = `
    .message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-size: 16px;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .message-success { background-color: #4CAF50; }
    .message-error { background-color: #f44336; }
    .message-info { background-color: #2196F3; }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Message display function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Table storage and manipulation
$(function(){
    // Make table editable
    $("#table4").attr("contenteditable", "true");
    const content = document.getElementById('table4');
    
    // Save table content when "select" is clicked
    $(".get-started-btn").click(async function(e) {
        e.preventDefault();
        
        try {
            if (content && content.innerHTML) {
                localStorage.setItem('page_html', JSON.stringify(content.innerHTML));
                
                // Update strain info if available
                if (localStorage.plantStrain) {
                    $('.strain').each(function(){
                        $(this).html(localStorage.plantStrain);
                    });
                }
                
                showMessage('Selection saved successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving selection:', error);
            showMessage('Failed to save selection. Please try again.', 'error');
        }
    });
    
    // Load saved content
    try {
        const savedHtml = localStorage.getItem('page_html');
        if (savedHtml && content) {
            content.innerHTML = JSON.parse(savedHtml);
            $('.strain').each(function(){
                $(this).html(localStorage.plantStrain || '');
            });
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
    
    // Hide and remove unnecessary rows
    $('table tr:not(:first)').hide();
    $('.notes').show();
    $(":input").hide();
    $("tr:hidden,td:hidden").remove();
    $("th:hidden,td:hidden").remove();
});

// Excel export function
function toExcel() {
    try {
        // Create a clone of the table
        const originalTable = document.getElementById('table4');
        const tableClone = originalTable.cloneNode(true);
        
        // First, keep only the header row and .notes rows
        const headerRow = $(tableClone).find('tr:first');
        const notesRows = $(tableClone).find('tr.notes');
        
        // Clear the table and add back only the rows we want
        $(tableClone).empty();
        headerRow.appendTo(tableClone);
        notesRows.appendTo(tableClone);
        
        // Temporarily add the clone to the document (hidden)
        tableClone.style.display = 'none';
        document.body.appendChild(tableClone);

        // Export the cleaned table
        $(tableClone).table2excel({
            exclude: ".noExl",
            name: "MyDiary.xls",
            filename: "MyDiary.xls",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            preserveColors: false
        });

        // Remove the clone
        tableClone.remove();
        showMessage('Table exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        showMessage('Failed to export to Excel. Please try again.', 'error');
    }
}

// Mobile share function
async function shareTable() {
    if (navigator.share) {
        try {
            const table = document.getElementById('table4');
            
            // Get header row and notes rows
            const headerRow = table.querySelector('tr:first-child');
            const notesRows = table.querySelectorAll('tr.notes');
            
            // Format header
            const headerCells = headerRow.querySelectorAll('th');
            let formattedContent = Array.from(headerCells)
                .map(cell => cell.textContent.trim())
                .join('\t') + '\n\n';
            
            // Format notes rows
            notesRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowContent = Array.from(cells)
                    .map(cell => cell.textContent.trim())
                    .join('\t');
                if (rowContent.trim()) {
                    formattedContent += rowContent + '\n';
                }
            });
            
            if (!formattedContent.trim()) {
                showMessage('No content available to share', 'error');
                return;
            }

            try {
                await navigator.share({
                    title: 'MyDiary',
                    text: formattedContent
                });
                showMessage('Content shared successfully!', 'success');
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    showMessage('Share canceled or permission denied', 'info');
                } else if (error.name !== 'AbortError') {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error sharing table:', error);
            showMessage('Failed to share content. Please try again.', 'error');
        }
    } else {
        // Clipboard fallback
        try {
            const table = document.getElementById('table4');
            
            // Get header row and notes rows
            const headerRow = table.querySelector('tr:first-child');
            const notesRows = table.querySelectorAll('tr.notes');
            
            // Format header
            const headerCells = headerRow.querySelectorAll('th');
            let formattedContent = Array.from(headerCells)
                .map(cell => cell.textContent.trim())
                .join('\t') + '\n\n';
            
            // Format notes rows
            notesRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowContent = Array.from(cells)
                    .map(cell => cell.textContent.trim())
                    .join('\t');
                if (rowContent.trim()) {
                    formattedContent += rowContent + '\n';
                }
            });

            await navigator.clipboard.writeText(formattedContent);
            showMessage('Content copied to clipboard', 'success');
        } catch (clipboardError) {
            console.error('Clipboard fallback failed:', clipboardError);
            showMessage('Failed to copy content', 'error');
        }
    }
}

// Initialize export/share functionality
$(document).ready(function() {
    $('#exportBtn').on('click', function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            shareTable().catch(error => {
                console.error('Share handler error:', error);
                showMessage('Unable to complete the share operation', 'error');
            });
        } else {
            toExcel();
        }
    });
});


// Error handling for script loading
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showMessage('An error occurred. Please try again.', 'error');
    return false;
};
