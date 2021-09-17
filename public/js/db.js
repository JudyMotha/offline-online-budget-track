

let db;
const request = indexedDB.open('budgetTracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('budgstore', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['budgstore'], 'readwrite');
  const transactionObjectStore = transaction.objectStore('budgstore');
  transactionObjectStore.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(['budgstore'], 'readwrite');

  const transactionObjectStore = transaction.objectStore('budgstore');

  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['budgstore'], 'readwrite');
          const transactionObjectStore = transaction.objectStore('budgstore');
          transactionObjectStore.clear();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);