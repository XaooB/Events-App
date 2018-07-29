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
    },
    {
      title: 'Art Show',
      location: 'Sunday at 11 am, Lincoln Street, London',
      description: 'Must come and see best art made by John Doe. FREE ENTRY, FREE MEAL'
    },
    {
      title: 'Open Day - Business Link Maraton',
      location: 'Maraton Business Center, Poznań',
      description: 'We have a good reason to make you visit us at MBC. We will meet and talk about business and economy'
    },
    {
      title: 'World Rowing Under 23',
      location: 'Malta, Poznań',
      description: 'For many years both the Greater Poland Rowing Foundation and FISA International Rowing Federation were loyal partners for the organization of international events'
    }],
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
  dbOpen: this.indexedDB.open('Events', 2),

  addEvent: function() {
    //data from form
    //store.put({title: '', location: '', describe: '', date: '', image: ''})
  },
  //doesnt work correctly..
  deleteEvent: function(e) {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        eventID = Number(e.target.parentElement.parentElement.getAttribute('data-id'))

        //delete event
        let deleteItem = store.delete(eventID);

        deleteItem.onsuccess = e => {
          console.log(e.target);

          store.get(1).onsuccess = e => {
            console.log(e.target);
          }
          //just for testing purposes, result is undefined - figuring out why..
          console.log('item has been deleted');
        }

        deleteItem.onerror = e => {
          throw new Error(e);
        }
  },
  addEventsAfterDbOpen: function(data) {
    let container = document.querySelector('.recently-added .flex-wrapper');

        data.result.forEach((item, key) => {
        if(key>3) return; //testing purposes

        container.innerHTML += `<article class="popular__item" data-id='${key}'>
                    <figure class='article__image-wrapper'>
                      <img src="assets/images/ev1.jpg" alt="event name" class='article__image'>
                      <button class='button button--danger popular__delete'>⤫</button>
                    </figure>
                    <div class="article__wrapper article__info">
                      <div class="article__date">
                        <span class='article__day'>21</span>
                        <span class='article__month'>AUG</span>
                      </div>
                      <a href="#" class='article__link'>
                        <div class="article__content">
                          <header>
                            <h4 class='article__title'>${item.title}</h4>
                          </header>
                            <p class="article__summary">${item.location}</p>
                            <p class='article__text'>${item.description}</p>
                        </div>
                      </a>
                    </div>
                </article>`
      });

    data.onerror = e => {
      throw new Error(e);
    }
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
      };
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

            //clear old data on each refresh
            store.clear();

            //add initial data to the database
            this.initialValues.forEach(item => {
              store.put({
                title: item.title,
                location: item.location,
                description: item.description
              });
            });

            //receive data from db and add it to the DOM
            let receivedData = store.getAll();
            receivedData.onsuccess = () => {
              this.addEventsAfterDbOpen(receivedData);
            }

            console.log(store.get(1));
            //fired after the initial transaction is completed
            tx.oncomplete = () => {
              //bind click event to recently added events
              document.querySelectorAll('.popular__delete')
              .forEach(item => {
                item.addEventListener('click', this.deleteEvent.bind(this));
              });
            };
      };
      this.dbOpen.onerror = e => {
        throw new Error(e.target.error);
      };

      addEventBtn.addEventListener('click', (e) => { console.log('show modal') });
    };
  }
};

Events.initial()();
