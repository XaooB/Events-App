const Events = {
  //initial values that will be added to the database after visiting  website and resetting current database state
  initialValues: [
    {
      title: 'FrontEnd Bootcamp 2018',
      location: 'Saturday at 6 pm, H15 Boutique Hotel, Warsaw',
      description: 'Meet us in Boutique Hotel next Saturday. We are going to talk about new trends of 2018'
    },
    {
      title: 'Up In Smoke Tour',
      location: 'Saturday at 5 pm, Mattress Firm Amphitheatre, 2050 Entertainment Cir, Chula Vista',
      description: 'Featured Eminem, Snoop Dog, Dr Dre and more! Best event of 2018'
    },
    {
      title: 'Art Show',
      location: 'Sunday at 11 am, Lincoln Street, London',
      description: 'Must come and see best art made by John Doe. #FREE ENTRY, #FREE MEAL'
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
    },
    {
      title: 'Test #1',
      location: 'Test #1',
      description: 'Test #1'
    },
    {
      title: 'Reet aliquam et at orci',
      location: 'Quisque suscipit ac m',
      description: 'e et dapibus elit, vitae vestibulum tellus. Nunc ac vehicula lorem. Quisque suscipit ac magna vitae'
    },
    {
      title: 'At orci',
      location: 'Quisque sust ac m',
      description: 'e et dapilus. Nunc ac vehicula lorem. Quisque suscipit ac magna vitae'
    },
    {
      title: 'ABC',
      location: 'CBA',
      description: 'e et dapilus. Nunc ac vehicula lorem. Quisque suscipit ac magna vitae'
    },
  ],
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
  //db connection
  dbOpen: this.indexedDB.open('Events', 1),
  //container for recently added events
  container: document.querySelector('.recently-added .flex-wrapper'),
  //container for adding event and displaying searched by user
  modal: document.querySelector('.modal'),
  displayAmount: 4,
  currentDbState: [],
  bindEvents: function() {
    //recently added events
    document.querySelectorAll('.popular__delete').forEach(item => {item.addEventListener('click', this.deleteEvent.bind(this))});
  },
  clearDOM: function() {
    this.container.parentElement.firstElementChild.firstElementChild.innerText = 'recently added';
    this.container.innerHTML = '';
  },
  toggleModal: function () {
    this.modal.classList.toggle('modal--showing');
  },
  loadMoreData: function(e) {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        nodeList = this.container.querySelectorAll('article'),
        toggleDataBtn = document.querySelector('button[name="load-more-events"]');

    if(nodeList.length < this.currentDbState.length) {
      this.clearDOM();
      for (var i = 0 ; i < nodeList.length + 4; i++) {
        if(this.currentDbState[i] === undefined) return this.bindEvents();
        this.container.innerHTML += `<article class="popular__item" data-id='${this.currentDbState[i].id}'>
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
                              <h4 class='article__title'>${this.currentDbState[i].title}</h4>
                            </header>
                              <p class="article__summary">${this.currentDbState[i].location}</p>
                              <p class='article__text'>${this.currentDbState[i].description}</p>
                          </div>
                        </a>
                      </div>
                  </article>`
      }
      this.displayAmount += 4;
      this.bindEvents();
    } else {
      toggleDataBtn.disabled = true;
    }
  },
  addInitialEvents: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore'),
        self = this;

    this.initialValues.forEach(item => {
      store.put({
        title: item.title,
        location: item.location,
        description: item.description
      });
    })

    //set currectDbState
    store.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;
      if(cursor) {
        self.currentDbState.push({
          id: cursor.key,
          title: cursor.value.title,
          location: cursor.value.location,
          description: cursor.value.description
        });
        cursor.continue();
      } else {
        self.loadDataToDOM();
      }
    }
  },
  addEventFromUser: function(e) {
    e.preventDefault();
    let form = e.target.parentElement,
        //make the first letter of the string to be uppercase
        title = form.querySelector('#title').value.replace(/^\w/, e => e.toUpperCase()),
        location = form.querySelector('#location').value,
        description = form.querySelector('#description').value,
        date = form.querySelector('#date').value,
        self = this,
        btn = e.target,

        db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore'),

        event = store.put({
          title,
          location,
          description
        });

        event.onsuccess = e => {
          this.currentDbState = [];
          store.openCursor().onsuccess = function(e) {
            let cursor = e.target.result;
            if(cursor) {
              self.currentDbState.push({
                id: cursor.key,
                title: cursor.value.title,
                location: cursor.value.location,
                description: cursor.value.description
              })
              cursor.continue();
            };
              self.clearDOM();
              self.loadDataToDOM();
          };
        };

        event.onerror = e => {
          throw new Error(e);
        }

        //avoid abusing requests
        let disableButton = setTimeout(e => {
          btn.disabled = false;
          clearTimeout(disableButton);
        }, 3000);
  },
  restoreSettings: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        toggleDataBtn = document.querySelector('button[name="load-more-events"]');

        store.clear().onsuccess = () => {
          this.currentDbState = [];
          toggleDataBtn.disabled = false;
          this.displayAmount = 4;
          this.clearDOM();
          this.addInitialEvents();
          // toggleDataBtn.disabled = false;
        };
  },
  searchDatabase: function(e) {
    let keyword = e.target.value.toLowerCase(),
        db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore'),
        self = this,
        titleInput = document.querySelector('input[name="title"]');

        // check for search value
        if(titleInput.value === '') {
          this.clearDOM();
          return this.loadDataToDOM();
        }

        this.container.innerHTML = '<span style="margin-top:5px; margin-bottom:15px;">There is no events uder that keyword.</span>';

        this.currentDbState.forEach(item => {
          if(item.title.toLowerCase().split(' ').indexOf(keyword) !== -1) {
            if(self.container.childNodes[0].localName == 'span') self.container.removeChild(self.container.firstElementChild);
            self.container.parentElement.firstElementChild.firstElementChild.innerHTML = `Searched for: <span style='font-weight: lighter; color: #d4145a;'><i>${keyword}</i></span>`;
            this.container.innerHTML += `<article class="popular__item" data-id='${item.id}'>
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
          };
      });
  },
  setFilters: function(e) {
    let sortWraper = document.querySelector('.popular__sort'),
        selectionByTitleDate = sortWraper.querySelector('#sort_dn').checked,
        selectionByAscDesc = sortWraper.querySelector('#sort_ad').checked,
        labelByTitleDate = sortWraper.querySelector('label[name="sort_dn"]'),
        labelByAscDesc = sortWraper.querySelector('label[name="sort_ad"]');

    if(!selectionByTitleDate) {
      selectionByTitleDate = 'title';
      labelByTitleDate.innerText = 'title'
    } else {
      selectionByTitleDate = 'date';
      labelByTitleDate.innerText = 'date'
    }

    if(!selectionByAscDesc) {
      selectionByAscDesc = 'asc';
      labelByAscDesc.classList.remove('desc');
      labelByAscDesc.classList.add('asc');
    } else {
      selectionByAscDesc = 'desc';
      labelByAscDesc.classList.remove('asc');
      labelByAscDesc.classList.add('desc');
    }

    return [selectionByTitleDate, selectionByAscDesc];
  },
  deleteEvent: function(e) {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        eventID = Number(e.target.parentElement.parentElement.getAttribute('data-id'));

        let deleteItem = store.delete(eventID);

        deleteItem.onsuccess = () => {
        this.currentDbState.forEach((item, key) => {
          if(item.id === eventID) this.currentDbState.splice(key, 1);
        });
          this.clearDOM();
          this.loadDataToDOM();
        };

        deleteItem.onerror = e => {
          throw new Error(e);
        };
  },
  sortData: function(e) {
    let filters = this.setFilters();

    //temporary solution, works for now
    if(filters[0] === 'title') {
      if(filters[1] === 'asc') {
        this.currentDbState.sort((a, b) => {
          if(a.title < b.title) return 1;
          if(a.title > b.title) return -1;
        });
      } else {
        this.currentDbState.sort((a, b) => {
          if(a.title > b.title) return 1;
          if(a.title < b.title) return -1;
        });
      }
    } else {
      if(filters[1] === 'asc') {
        this.currentDbState.sort((a, b) => {
          if(a.location < b.location) return 1;
          if(a.location > b.location) return -1;
        });
      } else {
        this.currentDbState.sort((a, b) => {
          if(a.location > b.location) return 1;
          if(a.location < b.location) return -1;
        });
      }
    }
    this.clearDOM();
    this.loadDataToDOM();
  },
  loadDataToDOM: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore');

    if(this.displayAmount > this.currentDbState.length) this.displayAmount = this.currentDbState.length;
    if(this.currentDbState.length === 0) return this.container.innerHTML = '<span style="margin-top:5px; margin-bottom:15px;">No events to display. You need to add one or restore data to initial values.</span>';
      for (var i = 0; i < this.displayAmount; i++) {
        //temporary solution with displaying events, works as expected but looks kinda bad
        this.container.innerHTML += `<article class="popular__item" data-id='${this.currentDbState[i].id}'>
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
                              <h4 class='article__title'>${this.currentDbState[i].title}</h4>
                            </header>
                              <p class="article__summary">${this.currentDbState[i].location}</p>
                              <p class='article__text'>${this.currentDbState[i].description}</p>
                          </div>
                        </a>
                      </div>
                  </article>`
      }
      this.bindEvents();
  },
  initial: function() {
    //binding DOM elementes
    let dbNav = document.querySelector('#db-nav'),
        sortWrapper = document.querySelector('.popular__sort'),
        loadMoreBtn = document.querySelector('button[name="load-more-events"]'),
        searchForm = document.querySelector('.search__form'),
        modalDisplayBtn = dbNav.querySelector('#add_event'),
        restoreDbBtn = dbNav.querySelector('#restore_database'),
        modalAddBtn = this.modal.querySelector('.modal__btn'),
        modalExitBtn = this.modal.querySelector('.modal__exit'),
        modalWrapper = this.modal.querySelector('.modal__wrapper'),
        filterByNameDate = sortWrapper.querySelector('#sort_dn'),
        filterByAscDesc = sortWrapper.querySelector('#sort_ad'),
        searchInputs = searchForm.querySelectorAll('input[type="search"]');

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
            store.index('description')

            //general error handler
            db.onerror = e => {
              throw new Error(e.target.error);
            };

            //clear old data on each refresh - causes troubles with cursor. Cursor is incremented instead of being reset after every initiation call.
            store.clear();

            //add initial data to the database
            this.addInitialEvents();

            //fired after the initial transaction is completed
            tx.oncomplete = () => {
              // db.close();
            };
      };

      this.dbOpen.onerror = e => {
        throw new Error(e.target.error);
      };

      restoreDbBtn.addEventListener('click', this.restoreSettings.bind(this), false);
      modalAddBtn.addEventListener('click', this.addEventFromUser.bind(this), false);
      modalDisplayBtn.addEventListener('click', this.toggleModal.bind(this), false);
      modalExitBtn.addEventListener('click', this.toggleModal.bind(this), false);
      loadMoreBtn.addEventListener('click', this.loadMoreData.bind(this), false);
      filterByNameDate.addEventListener('click', this.sortData.bind(this) ,false);
      filterByAscDesc.addEventListener('click', this.sortData.bind(this), false);
      searchInputs.forEach(item => { item.addEventListener('keyup', this.searchDatabase.bind(this), false)})
      window.addEventListener('click', e => {
        if(e.target === this.modal) this.toggleModal();
      }, false);
    };
  },
};

Events.initial()();
