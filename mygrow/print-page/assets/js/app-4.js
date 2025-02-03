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

    .message-success {
        background-color: #4CAF50;
    }

    .message-error {
        background-color: #f44336;
    }

    .message-info {
        background-color: #2196F3;
    }

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
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Excel export function
function toExcel() {
    try {
        // Create a clone of the table
        const originalTable = document.getElementById('table4');
        const tableClone = originalTable.cloneNode(true);
        
        // Remove all .notes rows from the clone
        tableClone.querySelectorAll('tr.notes').forEach(row => row.remove());
        
        // Temporarily add the clone to the document (hidden)
        tableClone.style.display = 'none';
        document.body.appendChild(tableClone);

        // Export the cleaned table
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
            
            // Create a temporary div to hold table content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = table.innerHTML;
            
            // Remove .notes rows
            tempDiv.querySelectorAll('tr.notes').forEach(row => row.remove());
            
            // Format table data properly
            const rows = tempDiv.querySelectorAll('tr');
            let formattedContent = '';
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('th, td');
                const rowData = [];
                
                cells.forEach(cell => {
                    rowData.push(cell.textContent.trim());
                });
                
                // Add tab spacing between columns and newline for rows
                formattedContent += rowData.join('\t') + '\n';
            });
            
            // Check if the content is not empty
            if (!formattedContent.trim()) {
                showMessage('No content available to share', 'error');
                return;
            }

            try {
                await navigator.share({
                    title: 'MyGrow Table',
                    text: formattedContent
                });
                showMessage('Table shared successfully!', 'success');
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    showMessage('Share canceled or permission denied', 'info');
                } else if (error.name === 'AbortError') {
                    return;
                } else {
                    console.error('Share error:', error);
                    showMessage('Unable to share content', 'error');
                }
            }
        } catch (error) {
            console.error('Error preparing content:', error);
            showMessage('Error preparing content for sharing', 'error');
        }
    } else {
        showMessage('Sharing is not supported on this device/browser', 'info');
        
        // Clipboard fallback with formatted content
        try {
            const table = document.getElementById('table4');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = table.innerHTML;
            tempDiv.querySelectorAll('tr.notes').forEach(row => row.remove());
            
            // Format table data for clipboard
            const rows = tempDiv.querySelectorAll('tr');
            let formattedContent = '';
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('th, td');
                const rowData = [];
                
                cells.forEach(cell => {
                    rowData.push(cell.textContent.trim());
                });
                
                formattedContent += rowData.join('\t') + '\n';
            });
            
            await navigator.clipboard.writeText(formattedContent);
            showMessage('Content copied to clipboard instead', 'success');
        } catch (clipboardError) {
            console.error('Clipboard fallback failed:', clipboardError);
        }
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
    // Hide loader when page is fully loaded
    hideLoader();

    // Handle export button click
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

// Error handling for script loading
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showMessage('An error occurred. Please try again.', 'error');
    return false;
};
