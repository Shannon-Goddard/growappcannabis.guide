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
    $("#table2").attr("contenteditable", "true");
    const content = document.getElementById('table2');
    
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
        const originalTable = document.getElementById('table2');
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
            name: "MyDiary",
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
            const table = document.getElementById('table2');
            
            // Create email-friendly HTML structure
            const emailTemplate = `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>MyDiary Table</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff;">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table role="presentation" style="width: 95%; border-collapse: collapse; border: 1px solid #cccccc;">
                                    ${convertTableToEmailFriendly(table.innerHTML)}
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `;

            const blob = new Blob([emailTemplate], { type: 'text/html' });
            const file = new File([blob], 'MyDiary-Table.html', { type: 'text/html' });

            await navigator.share({
                title: 'MyDiary Table',
                text: 'MyDiary Table Data',
                files: [file]
            });
            showMessage('Table shared successfully!', 'success');
        } catch (error) {
            console.error('Share error:', error);
            try {
                const textContent = prepareTableText(table);
                await navigator.share({
                    title: 'MyDiary Table',
                    text: textContent
                });
                showMessage('Table shared as text!', 'success');
            } catch (fallbackError) {
                showMessage('Unable to share content', 'error');
            }
        }
    } else {
        showMessage('Sharing not supported on this device/browser', 'info');
        try {
            const table = document.getElementById('table2');
            await navigator.clipboard.writeText(table.outerHTML);
            showMessage('HTML table copied to clipboard instead', 'success');
        } catch (clipboardError) {
            console.error('Clipboard fallback failed:', clipboardError);
        }
    }
}

// Helper function to convert table to email-friendly format
function convertTableToEmailFriendly(tableHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHTML, 'text/html');
    const rows = doc.querySelectorAll('tr:not(.notes)');
    
    let emailFriendlyHTML = '';
    rows.forEach(row => {
        emailFriendlyHTML += '<tr>';
        const cells = row.querySelectorAll('th, td');
        
        cells.forEach(cell => {
            const isHeader = cell.tagName.toLowerCase() === 'th';
            const cellStyles = `
                border: 1px solid #cccccc;
                padding: 10px;
                text-align: left;
                background-color: ${isHeader ? '#f8f9fa' : '#ffffff'};
                font-weight: ${isHeader ? 'bold' : 'normal'};
                font-size: 14px;
                color: #333333;
            `;
            
            emailFriendlyHTML += `
                <${cell.tagName.toLowerCase()} style="${cellStyles}">
                    ${cell.innerHTML}
                </${cell.tagName.toLowerCase()}>
            `;
        });
        emailFriendlyHTML += '</tr>';
    });
    
    return emailFriendlyHTML;
}

// Helper function to prepare table text
function prepareTableText(table) {
    const rows = table.querySelectorAll('tr:not(.notes)');
    let text = '';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => cell.textContent.trim());
        text += rowData.join('\t') + '\n';
    });
    
    return text;
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
