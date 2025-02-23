// databaseInitializer.js
var DB_NAME = 'myGrow';
var DB_VERSION = 1;
var db;

function initializeDatabase() {
    var request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        var tables = ['table1', 'table2', 'table3', 'table4'];
        var i;
        for (i = 0; i < tables.length; i++) {
            if (!db.objectStoreNames.contains(tables[i])) {
                db.createObjectStore(tables[i], { keyPath: 'id' });
            }
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Database initialized successfully:', DB_NAME);
    };

    request.onerror = function(event) {
        console.error('Database error:', event.target.error);
    };
}

initializeDatabase();

// Quick function to log all localStorage items
function checkLocalStorage() {
    console.log("Checking localStorage contents:");
    if (localStorage.length === 0) {
        console.log("localStorage is empty.");
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        }
    }
}

// Run the check
checkLocalStorage();