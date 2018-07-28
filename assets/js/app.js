const Events = {
  //initial values that will be added to the database after visiting  website and resetting current database state
  initialValues: [1,2,3],
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
  dbOpen: this.indexedDB.open('Events', 2),

  createDomElement: function() {
    //create document element
  },
  addInitialValues: function() {
    // let db = dbOpen.result,
    //     tx = db.transaction('name', 'readwrite'),
    //     store = tx.objectStore('name'),
    //     eventList = tx.objectStore.getAll();

    //this.initialValues.forEach((item, key) => {
    //  store.put({title: item.title, location: item.location, describe: item.describe, date: item.date, image: item.image})
    //})
    //
    // for(let item in eventList) {
    //   //createDomElement and add to the DOM
    // }
  },
  addEvent: function() {
    //data from form
    //store.put({title: '', location: '', describe: '', date: '', image: ''})
  },
  deleteEvent: function(eventID) {
    //detele event from the database
  },
  displayEvents: function(list) {

  },
  //initial funtion
  initial: function() {
    //binding DOM elementes
    let addEventBtn = document.querySelector('#add-wrapper');

    return () => {
      this.dbOpen.onupgradeneeded = e => {
        console.log('onupgradeneeded event ', e);
      }
      this.dbOpen.onsuccess = e => {
        console.log('onsuccess event ',e);
      }
      this.dbOpen.onerror = e => {
        console.log('onerror event ', e);
      }

      addEventBtn.addEventListener('click', (e) => { console.log('show modal') });
    }
  }
}

Events.initial()();
