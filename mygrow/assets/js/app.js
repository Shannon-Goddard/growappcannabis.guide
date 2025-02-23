//////retrieve local storage data////////////////////////////////
var plantLogo = localStorage.getItem('plantLogo');

if (plantLogo) {
  $("#mylogo").attr("src" , plantLogo);
  document.getElementById("MyGrowText").style.display = "block";
  document.getElementById("DeleteButton").style.display = "block";
  document.getElementById("MyGrowAdd").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
DeleteButton.addEventListener('click', function () {
  localStorage.removeItem('page_html');
  localStorage.removeItem('plantGrow');
  localStorage.removeItem('plantHeight');
  localStorage.removeItem('plantStrain');
  localStorage.removeItem('plantwatts');
  localStorage.removeItem('plantLogo');
  localStorage.removeItem('startDate');
///////////////////////////////////  
  // Clear all records in the 'table1' object store of 'myGrow'
const request = indexedDB.open('myGrow', 1); // Use the same version as in your IndexedDBService

request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['table1'], 'readwrite'); // Specify 'table1' object store
    const store = transaction.objectStore('table1');

    const clearRequest = store.clear(); // Clear all records in table1

    clearRequest.onsuccess = () => {
        console.log('All records in table1 have been deleted.');
        db.close();
    };

    clearRequest.onerror = (error) => {
        console.error('Error clearing table1:', error);
        db.close();
    };

    transaction.oncomplete = () => {
        db.close();
    };
};

request.onerror = (error) => {
    console.error('Error opening database:', error);
};
///////////////////////////////////////
  location.reload();
});

//////retrieve local storage data////////////////////////////////
var plantLogo = localStorage.getItem('plant2Logo');
if (plantLogo) {
  $("#my2logo").attr("src" , plantLogo);
  document.getElementById("MyGrow2Text").style.display = "block";
  document.getElementById("Delete2Button").style.display = "block";
  document.getElementById("MyGrow2Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete2Button.addEventListener('click', function () {
  localStorage.removeItem('page_html2');
  localStorage.removeItem('plant2Grow');
  localStorage.removeItem('plant2Height');
  localStorage.removeItem('plant2Strain');
  localStorage.removeItem('plant2watts');
  localStorage.removeItem('plant2Logo');
  localStorage.removeItem('start2Date');
  const request = indexedDB.open('myGrow', 1); // Use the same version as in your IndexedDBService

request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['table2'], 'readwrite'); // Specify 'table2' object store
    const store = transaction.objectStore('table2');

    const clearRequest = store.clear(); // Clear all records in table2

    clearRequest.onsuccess = () => {
        console.log('All records in table2 have been deleted.');
        db.close();
    };

    clearRequest.onerror = (error) => {
        console.error('Error clearing table2:', error);
        db.close();
    };

    transaction.oncomplete = () => {
        db.close();
    };
};

request.onerror = (error) => {
    console.error('Error opening database:', error);
};
  location.reload();
});

//////retrieve local storage data/////////////////////////////////
var plantLogo = localStorage.getItem('plant3Logo');
if (plantLogo) {
  $("#my3logo").attr("src" , plantLogo);
  document.getElementById("MyGrow3Text").style.display = "block";
  document.getElementById("Delete3Button").style.display = "block";
  document.getElementById("MyGrow3Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete3Button.addEventListener('click', function () {
  localStorage.removeItem('page_html3');
  localStorage.removeItem('plant3Grow');
  localStorage.removeItem('plant3Height');
  localStorage.removeItem('plant3Strain');
  localStorage.removeItem('plant3watts');
  localStorage.removeItem('plant3Logo');
  localStorage.removeItem('start3Date');
  const request = indexedDB.open('myGrow', 1); // Use the same version as in your IndexedDBService

request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['table3'], 'readwrite'); // Specify 'table3' object store
    const store = transaction.objectStore('table3');

    const clearRequest = store.clear(); // Clear all records in table3

    clearRequest.onsuccess = () => {
        console.log('All records in table3 have been deleted.');
        db.close();
    };

    clearRequest.onerror = (error) => {
        console.error('Error clearing table3:', error);
        db.close();
    };

    transaction.oncomplete = () => {
        db.close();
    };
};

request.onerror = (error) => {
    console.error('Error opening database:', error);
};
  location.reload();
});

//////retrieve local storage data/////////////////////////////////
var plantLogo = localStorage.getItem('plant4Logo');
if (plantLogo) {
  $("#my4logo").attr("src" , plantLogo);
  document.getElementById("MyGrow4Text").style.display = "block";
  document.getElementById("Delete4Button").style.display = "block";
  document.getElementById("MyGrow4Add").style.display = "none";
  $("#taskButton").show();
};
/////////////delete button////////
Delete4Button.addEventListener('click', function () {
  localStorage.removeItem('page_html4');
  localStorage.removeItem('plant4Grow');
  localStorage.removeItem('plant4Height');
  localStorage.removeItem('plant4Strain');
  localStorage.removeItem('plant4watts');
  localStorage.removeItem('plant4Logo');
  localStorage.removeItem('start4Date');
  const request = indexedDB.open('myGrow', 1); // Use the same version as in your IndexedDBService

request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['table4'], 'readwrite'); // Specify 'table4' object store
    const store = transaction.objectStore('table4');

    const clearRequest = store.clear(); // Clear all records in table4

    clearRequest.onsuccess = () => {
        console.log('All records in table4 have been deleted.');
        db.close();
    };

    clearRequest.onerror = (error) => {
        console.error('Error clearing table4:', error);
        db.close();
    };

    transaction.oncomplete = () => {
        db.close();
    };
};

request.onerror = (error) => {
    console.error('Error opening database:', error);
};
  location.reload();
});