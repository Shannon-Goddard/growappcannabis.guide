// Add this to nutrients-mix-and-match-1.html to debug nutrient loading issues
document.addEventListener('DOMContentLoaded', function() {
    if (typeof mobileLog !== 'function') {
        window.mobileLog = console.log; // Fallback if debug panel not loaded
    }

    // Debug nutrient loading
    const currentGrowId = localStorage.getItem('currentGrowId');
    mobileLog('=== NUTRIENT DEBUG ===');
    mobileLog('Current grow ID', currentGrowId);
    
    // Check if nutrients exist for this grow
    const growNutrients = localStorage.getItem(`nutrients_${currentGrowId}`);
    mobileLog('Grow-specific nutrients', growNutrients);
    
    // Check IndexedDB nutrients
    setTimeout(async () => {
        try {
            const dbRequest = indexedDB.open('MyGrowDB', 8);
            dbRequest.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['selectedNutrients'], 'readonly');
                const store = transaction.objectStore('selectedNutrients');
                const request = store.getAll();
                
                request.onsuccess = function() {
                    mobileLog('IndexedDB nutrients', request.result);
                };
            };
        } catch (error) {
            mobileLog('IndexedDB error', error.message);
        }
    }, 1000);
    
    // Monitor checkbox changes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.name === 'nutrients') {
            mobileLog('Nutrient checkbox changed', {
                nutrient: e.target.value,
                checked: e.target.checked
            });
        }
    });
});