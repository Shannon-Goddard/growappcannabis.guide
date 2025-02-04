// Message display function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.remove(), 3000);
}

// Excel export function
function toExcel() {
    try {
        const originalTable = document.getElementById('table3');
        const tableClone = originalTable.cloneNode(true);
        
        tableClone.querySelectorAll('tr.notes').forEach(row => row.remove());
        tableClone.style.display = 'none';
        document.body.appendChild(tableClone);

        $(tableClone).table2excel({
            exclude: ".noExl",
            name: "MyGrow.xls",
            filename: "MyGrow.xls",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            preserveColors: false
        });

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
            const table = document.getElementById('table3');
            
            // Create email-friendly HTML structure
            const emailTemplate = `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>MyGrow Table</title>
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
            const file = new File([blob], 'MyGrow-Table.html', { type: 'text/html' });

            await navigator.share({
                title: 'MyGrow Table',
                text: 'MyGrow Table Data',
                files: [file]
            });
            showMessage('Table shared successfully!', 'success');
        } catch (error) {
            console.error('Share error:', error);
            try {
                const textContent = prepareTableText(table);
                await navigator.share({
                    title: 'MyGrow Table',
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
            const table = document.getElementById('table3');
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

// Print function
function printTable() {
    const table = document.getElementById('table3');
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>MyGrow Table</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                ${table.outerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
    } else {
        showMessage('Pop-up blocked. Please allow pop-ups and try again.', 'error');
    }
}

// Loader functions
function showLoader() {
    document.getElementById('loader-wrapper').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-wrapper').style.display = 'none';
}

// Initialize when document is ready
$(document).ready(function() {
    hideLoader();

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

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
    });
});

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showMessage('An error occurred. Please try again.', 'error');
    return false;
};
