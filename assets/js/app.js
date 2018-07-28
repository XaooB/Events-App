const Events = {
  //initial values that will be added to the database after visiting  website and resetting current database state
  initialValues: [{
      title: 'FrontEnd Bootcamp 2018',
      location: 'Saturday at 6 pm, H15 Boutique Hotel, Warsaw',
      description: 'Meet us in Boutique Hotel next Saturday. We are going to talk about new trends of 2018'
    },{
      title: 'Up In Smoke Tour',
      location: 'Saturday at 5 pm, Mattress Firm Amphitheatre, 2050 Entertainment Cir, Chula Vista',
      description: 'Featured Eminem, Snoop Dog, Dr Dre and more! Best event of 2018'
    }],
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
  dbOpen: this.indexedDB.open('Events', 1),

  createDomElement: function() {
    //create document element
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
        let db = this.dbOpen.result,
            store = db.createObjectStore('EventsStore', {
              autoIncrement: true
            });
            store.createIndex('title', 'title', {unique: false});
            store.createIndex('location', 'location', {unique: false});
            store.createIndex('description', 'description', {unique: false});
      }
      this.dbOpen.onsuccess = e => {
        let db = this.dbOpen.result,
            tx = db.transaction('EventsStore', 'readwrite');
            store = tx.objectStore('EventsStore');

            store.index('title');
            store.index('location');
            store.index('description');

            //general error handler
            db.onerror = e => {
              throw new Error(e.target.error);
            };

            //clear old data after refreshing the page
            store.clear();
            //adding initial data
            this.initialValues.forEach(item => {
              store.put({
                title: item.title,
                location: item.location,
                description: item.description
              })
            });

            //receiving initial data
            let reveicedData = store.getAll();
            reveicedData.onsuccess = () => {
              console.log('INITIAL DATA RECEIVED FROM INDEXEDDB');
              reveicedData.result.forEach((item, key) => {
                console.log(`ID record ${key} contains: ${JSON.stringify(item)}`);
              });
            }

            tx.oncomplete = () => {
              db.close();
            }
      }
      this.dbOpen.onerror = e => {
        throw new Error(e.target.error);
      }

      addEventBtn.addEventListener('click', (e) => { console.log('show modal') });
    }
  }
}

Events.initial()();
