const Events = {
  //initial values that will be added to the database after visiting  website and resetting current database state
  initialValues: [
    {
      title: '5th CEPPIS Conference',
      location: 'Warszawa',
      description: 'International scientific conference Civil Engineering: Present Problems.',
      summary: 'We encourage you to take part in a discussion in the course of the conference debates or present your theoretical or practical considerations, experiences and results of conducted investigations. Innovative Solutions CEPPIS 2019 is set out to pay attention to recent trends especially Circular Economy in Construction Sector.',
      date: `2019-5-22`,
      time: '20:00',
      image: "https://www.dike.lib.ia.us/images/sample-1.jpg/image"
    },
    {
      title: 'Up In Smoke Tour',
      location: 'Nowy Jork',
      description: 'Featured Eminem, Snoop Dog, Dr Dre and more! Best event of 2018',
      summary: "The tour was originally called The Boyz in the Hood under the pretext of Dr. Dre's to-be-released collaborative album The Chronic 2000 (later renamed).[1] In September 1999, Snoop Dogg stated that he, Dr. Dre, Eminem, Xzibit, Warren G and Nate Dogg would form the line-up.[2] By April 2000, Ice Cube was on board as part of the tour, which was slated for a June 15 start in San Diego. MC Ren, one time MC of N.W.A, was expected to join the tour in order to have reunited version of N.W.A along with Dr. Dre, Ice Cube, and Snoop Dogg.[3] Come May the tour was officially known as the Up In Smoke Tour,[4] and Dr. Dre was promising fans. Its gonna be incredible. We are gonna give everybody that's been buying our records a real show, something they've never seen before.",
      date: `2018-9-02`,
      time: '21:00',
      image: "https://www.dike.lib.ia.us/images/sample-1.jpg/image"
    },
    {
      title: 'Laravel #Poznań #Meetup #9!',
      location: 'Londyn',
      description: "Laravel's freaks and not only let's connect!",
      summary: 'Already in the New Year we invite you to the next editions of Laravel Meetups! Follow us to find out what we have prepared for you this time! It willl be possible to ask questions by Sli. Do application. We want to reach as many fans of Laravel as possible. We are going to share live streaming on our profile, especially for those who cannot be with us. We will try to release recordings of presentations after meetup (share on. slideshare.net/Laravel_Poznan_Meetup)',
      date: `2018-9-10`,
      time: '21:45',
      image: "https://www.dike.lib.ia.us/images/sample-1.jpg/image"
    },
    {
      title: 'Open Day - Business Link Maraton',
      location: 'Poznań',
      description: 'We have a good reason to make you visit us at MBC. We will meet and talk about business and economy',
      summary: 'Young Living - to od 25 lat światowy lider w dziedzinie aromaterapii, ekologiczne farmy, przyjazne biura i	6-milionowa społeczność w 40 krajach, na wszystkich kontynentach. Jednak przede wszystkim to filozofia czystych i aktywnych biologicznie olejów eterycznych, których produkcja jest kontrolowana na każdym etapie - od ziarna do szklanej buteleczki. Tylko 2% olejków eterycznych na świecie ma takie naturalne, biologicznie czynne pochodzenie zgodne ze standardem "from Sead to Seal"',
      date: `2018-9-30`,
      time: '19:00',
      image: "https://www.dike.lib.ia.us/images/sample-1.jpg/image"
    },
    {
      title: 'BEAT-PCD Conference & Training School 2019',
      location: 'Poznań',
      description: "The 4th (and Final) BEAT-PCD Conference and 5th PCD Training School will be held in Poznan, Poland from lunchtime on Tuesday 26 March to lunchtime on Friday 29 March 2019.",
      summary: 'Venue: Mercure Poznań Centrum, Ul. Roosevelta 20, 60-829 POZNAN, POLAND. Full programme will be circulated later but the format will follow last years event combining presentations, invited speaker lectures and workshops.',
      date: `2019-05-11`,
      time: '19:30',
      image: "https://www.dike.lib.ia.us/images/sample-1.jpg/image"
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
  copyDbState: [],
  bindEvents: function() {
    //recently added events
    this.container.querySelectorAll('.popular__delete').forEach(item => {item.addEventListener('click', this.deleteEvent.bind(this), false)});
    this.container.querySelectorAll('.article__link').forEach(item => {item.addEventListener('click', this.showArticeInfo.bind(this), false)});
  },
  clearDOM: function() {
    this.container.innerHTML = '';
  },
  toggleModal: function () {
    this.modal.classList.toggle('modal--showing');
    document.querySelector('.modal__wrapper').classList.toggle('modal--showing')
  },
  readDataUrl: function (file) {
    return new Promise(function(resolve, reject) {
      const reader  = new FileReader();

      reader.onload = function() {
        resolve(this.result);
      };
      reader.onerror = reader.onabort = reject;
      reader.readAsDataURL(file);
    });
  },
  uploadImageToImgur: async function (file) {
    const url = 'https://api.imgur.com/3/image';

    if(file) {
      const result = await this.readDataUrl(file);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Authorization": 'Client-ID 9972355cc3cd2ea Bearer 69312b9b7ddd10b659fb82c2465f4dc8db0af3cd',
        },
        body: result.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, "")
      });
      const data = await response.json();
      return data.data.link;
    }
  },
  showArticeInfo: function (e) {
    e.stopImmediatePropagation();
    let eventID = Number(e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id')),
        db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore'),
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        event = store.get(eventID);

    event.onsuccess = e => {
      const { title, location, date, time, summary, image } = e.target.result;

      this.modal.innerHTML =
      `<div class="modal__wrapper">
        <div class="modal__header">
          <h3 class='modal__title'>${title}</h3>
          <span class='modal__exit'></span>
        </div>
        <div class='modal__image-wrapper'>
          <img class='modal__image' src=${image} />
        </div>
        <div class='modal__content'>
          <section class='modal__column'>
            <span class='label'>About event</span>
            <p>${summary}</p>
          </section>
          <section class='modal__column'>
            <span class='label'>Location</span>
            <p>${location}, ${new Date(date).getDate()} ${months[new Date(date).getMonth()]} ${new Date(date).getFullYear()},  ${time}</p>
          </section>
        </div>
      </div>`;

      this.toggleModal();
      this.modal.querySelector('.modal__exit').addEventListener('click', this.toggleModal.bind(this), false);
    }

    event.onerror = e => {
      throw new Error(e);
    }
  },
  loadMoreData: function(e) {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        nodeList = this.container.querySelectorAll('article'),
        toggleDataBtn = document.querySelector('button[name="load-more-events"]'),
        monthArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    if(nodeList.length < this.copyDbState.length) {
      this.clearDOM();
      for (var i = 0 ; i < nodeList.length + 4; i++) {
        if(this.copyDbState[i] === undefined) {
          return (
            this.bindEvents(),
            this.displayAmount = this.copyDbState.length
          )
        }
        this.container.innerHTML += `<article class="popular__item" data-id='${this.copyDbState[i].id}'>
                      <figure class='article__image-wrapper'>
                        <img src=${this.copyDbState[i].image} alt="event name" class='article__image'>
                        <button class='button button--danger popular__delete'>⤫</button>
                      </figure>
                      <div class="article__wrapper article__info">
                        <div class="article__date">
                          <span class='article__day'>${new Date(this.copyDbState[i].date).getDate()}</span>
                          <span class='article__month'>${monthArr[new Date(this.copyDbState[i].date).getMonth()]}</span>
                        </div>
                        <a href="javascript:void(0)" class='article__link'>
                          <div class="article__content">
                            <header>
                              <h4 class='article__title'>${this.copyDbState[i].title}</h4>
                            </header>
                              <p class="article__summary">${this.copyDbState[i].location}</p>
                              <p class='article__text'>${this.copyDbState[i].description}</p>
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
  showNotification: function(text) {
    let paragraph = document.querySelector('.notification-info');

    paragraph.innerHTML = `${text}`;

    //reset form fields
    title = location = description = date = '';
    let notificationTime = setTimeout(() => {
      paragraph.innerText = ''
    }, 1500);
  },
  addInitialEvents: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore');

    this.initialValues.forEach(item => {
      let {title, location, description, summary, date, time, image} = item;
      store.put({ title, location, description, summary, date, time, image });
    });

    //set currentDbState
    store.openCursor(null, 'prev').onsuccess = e => {
      let cursor = e.target.result;
      if(cursor) {
        let { title, location, description, date, time, image } = cursor.value;
        this.currentDbState.push({ id: cursor.key, title, location, description, date, time, image });
        cursor.continue();
      } else {
        this.copyDbState = this.currentDbState.slice();
        this.loadDataToDOM();
      }
    }
  },
  setAddEventModal: function() {
    this.modal.innerHTML =
    `<div class="modal__wrapper">
      <div class="modal__header">
        <h4 class='modal__title'>Add your event</h4>
        <span class='modal__exit'></span>
      </div>
      <form action="" class='form modal__form'>
        <div class='modal__item'>
          <label class='modal__label'>Title:</label>
          <input type="text" class='input modal__input' id='title' placeholder="Enter event title" maxlength='50' required/>
        </div>
        <div class='modal__item'>
          <label class='modal__label'>Location:</label>
          <input type="text" class='input modal__input' id='location' placeholder="Enter event location" maxlength='35' required/>
        </div>
        <div class='modal__item'>
          <label class='modal__label'>Summary:</label>
          <textarea type="text" class='input modal__input' id='summary' placeholder="Enter short summary" maxlength='150' required></textarea>
        </div>
        <div class='modal__item'>
          <label class='modal__label'>Description:</label>
          <textarea type="text" class='input modal__input' id='description' placeholder="Enter event description" maxlength='500' required></textarea>
        </div>
        <div class='modal__item'>
          <label class='modal__label'>Starting At:</label>
          <div class='flex-wrapper flex-wrapper--row'>
            <input type="time" class='input modal__input' name='time' required/>
            <input type="date" class='input modal__input' name='date' required/>
          </div>
        </div>
        <div class='modal__item'>
          <label class='modal__label'>Image:</label>
          <input type="file" accept="image/*", class='input' id='image' placeholder="Upload your image" required />
        </div>
        <button class='button button--modal' name='add-event-toggle-modal'>add event</button>
      </form>
    </div>`

    //bind event
    this.modal.querySelector('button[name="add-event-toggle-modal"]').addEventListener('click', this.addEventFromUser.bind(this), false);
    this.modal.querySelector('.modal__exit').addEventListener('click', this.toggleModal.bind(this), false);
    this.toggleModal();
  },
  validateAddEventForm: function (arr) {
    let toBeValidated = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value === '') {
        arr[i].style.border='2px solid #ee324e';
        toBeValidated = true;
      } else {
        arr[i].style.border= '2px solid #d9d9d9';}
    }
    return toBeValidated;
  },
  addEventFromUser: function(e) {
    e.preventDefault();
    let form = e.target.parentElement,
        formInputs = form.querySelectorAll('input'),
        formTextarea = form.querySelectorAll('textarea'),
        //make the first letter of the string to be uppercase
        title = form.querySelector('#title').value.replace(/^\w/, e => e.toUpperCase()),
        location = form.querySelector('#location').value,
        summary = form.querySelector('#summary').value,
        description = form.querySelector('#description').value,
        date = form.querySelector('input[type="date"]').value,
        time = form.querySelector('input[type="time"]').value,
        image = form.querySelector('input[type="file"]').files[0],
        btn = e.target,
        paragraph = document.querySelector('.notification-info'),
        validate = this.validateAddEventForm([...formInputs,...formTextarea]);

        if(validate) return true;


        paragraph.innerHTML = `Please wait..`;
        //uplod an image
        this.uploadImageToImgur(image)
        .then((image) => {
          let db = this.dbOpen.result,
              tx = db.transaction('EventsStore', 'readwrite'),
              store = tx.objectStore('EventsStore');

          event = store.put({ title, location, description, summary, date, time, image });
          event.onsuccess = e => {
            //clear local db state
            this.currentDbState = [];
            //add data from db to local var
            store.openCursor(null, 'prev').onsuccess = e => {
              let cursor = e.target.result;
              if(cursor) {
                let { title, location, description, date, time, image } = cursor.value;

                this.currentDbState.push({ id: cursor.key, title, location, description, date, time, image })
                return cursor.continue();
              };

              this.copyDbState = this.currentDbState.slice();
              this.clearDOM();
              this.loadDataToDOM();
            };
          };

          paragraph.innerHTML = `${title} has been added to database`;
          setTimeout(() => {
            paragraph.innerText = '';
          }, 1500);

          this.toggleModal();

          event.onerror = e => {
            throw new Error(e);
          }
        })
  },
  resetInputsValue: function() {
    let searchInputs = document.querySelectorAll('input[type="search"]');

    searchInputs.forEach(item => {
      item.value = '';
    });
  },
  restoreSettings: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        toggleDataBtn = document.querySelector('button[name="load-more-events"]'),
        paragraph = document.querySelector('.notification-info');

        store.clear().onsuccess = () => {
          this.currentDbState = [];
          toggleDataBtn.disabled = false;
          this.displayAmount = 4;
          this.clearDOM();
          this.addInitialEvents();

          paragraph.innerHTML = `Data has been restored from database`;
          let notificationTime = setTimeout(() => {
            paragraph.innerText = ''
          }, 1500);
        };
  },
  searchHelper: function(i, displayTitle, displayCity) {
    let monthArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    //default value
    city = displayCity !== null ? displayCity : '';
    title = displayTitle !== null ? displayTitle : '';

    if(this.container.childNodes[0].localName == 'span') this.container.removeChild(this.container.firstElementChild);
    this.container.innerHTML +=
      `<article class="popular__item" data-id='${this.copyDbState[i].id}'>
        <figure class='article__image-wrapper'>
          <img src=${this.copyDbState[i].image} alt="event name" class='article__image'>
          <button class='button button--danger popular__delete'>⤫</button>
        </figure>
        <div class="article__wrapper article__info">
          <div class="article__date">
            <span class='article__day'>${new Date(this.copyDbState[i].date).getDate()}</span>
            <span class='article__month'>${monthArr[new Date(this.copyDbState[i].date).getMonth()]}</span>
          </div>
          <a href="#" class='article__link'>
          <div class="article__content">
            <header>
              <h4 class='article__title'>${this.copyDbState[i].title}</h4>
            </header>
            <p class="article__summary">${this.copyDbState[i].location}</p>
            <p class='article__text'>${this.copyDbState[i].description}</p>
          </div>
        </a>
      </div>
    </article>`
  },
  searchDatabase: function(e) {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite'),
        store = tx.objectStore('EventsStore'),
        title = document.querySelector('[name="title"]').value.toLowerCase(),
        city = document.querySelector('[name="city"]').value.toLowerCase();

    // copy original database state every each call
    // because each item that does not meet the condition in filter methods (430, 442, 454)
    // is deleted from an array, so when a letter changes we need to be sure that an array
    // contains all events to be filtered again
    // !! PROBABLY BAD PERFORMANCE WITH A LOT OF ITEMS IN AN ARRAY, need exp.
    this.copyDbState = this.currentDbState.slice();

    this.container.innerHTML = '<span style="margin-top:5px; margin-bottom:15px;">There is no events under that keyword.</span>';
    if(title.length > 0 && city.length > 0) {
      for (var i = 0; i < this.copyDbState.length; i++)
        if(this.filterTitleCity(this.copyDbState[i], i)) i--;

      this.bindEvents();
    } else if (title.length > 0) {
      for (var i = 0; i < this.copyDbState.length; i++)
        if(this.filterTitle(this.copyDbState[i], i)) i--;

      this.bindEvents();
    } else if (city.length > 0) {
      for (var i = 0; i < this.copyDbState.length; i++)
        if(this.filterCity(this.copyDbState[i], i)) i--;

      this.bindEvents();
    } else {
      this.displayAmount = 4;
      this.clearDOM(),
      this.loadDataToDOM()
    }
  },
  filterTitle: function(item, index) {
    let title = item.title.toLowerCase(),
    searchByTitle = document.querySelector('[name="title"]').value.toLowerCase();

    if(title.includes(searchByTitle)) {
      this.searchHelper(index, searchByTitle, null);
      return false;
    } else {
      this.copyDbState.splice(index, 1)
      return true;
    }
  },
  filterCity: function(item, index) {
    let location = item.location.toLowerCase(),
    searchByCity = document.querySelector('[name="city"]').value.toLowerCase();

    if(location.includes(searchByCity)) {
      this.searchHelper(index, null, searchByCity);
      return false;
    } else {
      this.copyDbState.splice(index, 1)
      return true;
    }
  },
  filterTitleCity: function(item, index) {
    let location = item.location.toLowerCase(),
        title = item.title.toLowerCase(),
        searchByTitle = document.querySelector('[name="title"]').value.toLowerCase();
        searchByCity = document.querySelector('[name="city"]').value.toLowerCase();

    if(location.includes(searchByCity) && title.includes(searchByTitle)) {
      this.searchHelper(index, searchByTitle, searchByCity);
      return false;
    } else {
      this.copyDbState.splice(index, 1)
      return true;
    }
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

    if(selectionByAscDesc) {
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
        eventID = Number(e.target.parentElement.parentElement.getAttribute('data-id')),
        notificationWrapper = document.querySelector('.notification-wrapper'),
        paragraph = document.querySelector('.notification-info'),
        deleteItem = store.delete(eventID);

    deleteItem.onsuccess = () => {
      this.copyDbState.forEach((item, key) => {
        if(item.id === eventID) {
          paragraph.innerHTML = `${item.title} has been deleted from database`;
          this.copyDbState.splice(key, 1);

          for (var i = 0; i < this.currentDbState.length; i++) {
            if(this.currentDbState[i].id === item.id)  this.currentDbState.splice(i, 1);
          }

          let notificationTime = setTimeout(() => {
            paragraph.innerText = ''
          }, 1500)
        }
      });
      this.clearDOM();
      this.loadDataToDOM();
    };
  },
  sortData: function(e) {
    let filters = this.setFilters();

    //works only for title, date sort is not working probably because compare funtion takes string as parameter instead of date objecet but im not sure enough
    if(filters[0] === 'title') {
      if(filters[1] === 'asc') {
        this.copyDbState.sort((a, b) => {
          if(a.title > b.title) return 1;
          if(a.title < b.title) return -1;
          return 0;
        });
      } else {
        this.copyDbState.sort((a, b) => {
          if(a.title > b.title) return -1;
          if(a.title < b.title) return 1;
          return 0;
        });
      }
    } else {
      if(filters[1] === 'asc') {
        this.copyDbState.sort((a, b) => {
          if(new Date(a.date) > new Date(b.date)) return 1;
          if(new Date(a.date) < new Date(b.date)) return -1;
          return 0;
        });
      } else {
        this.copyDbState.sort((a, b) => {
          if(new Date(a.date) > new Date(b.date)) return -1;
          if(new Date(a.date) < new Date(b.date)) return 1;
          return 0;
        });
      }
    }
    this.clearDOM();
    this.loadDataToDOM();
  },
  loadDataToDOM: function() {
    let db = this.dbOpen.result,
        tx = db.transaction('EventsStore', 'readwrite');
        store = tx.objectStore('EventsStore'),
        monthArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // if(this.copyDbState.length === 0) this.copyDbState = this.currentDbState.slice()
    if(this.displayAmount > this.copyDbState.length) this.displayAmount = this.copyDbState.length;

    //message if there is no events to display
    if(this.copyDbState.length === 0) return this.container.innerHTML = '<span style="margin-top:5px; margin-bottom:15px;">No events to display. You need to add one, change your search keywords or restore data to initial values.</span>';
      for (var i = 0; i < this.displayAmount; i++) {
        //temporary solution with displaying events, works as expected but looks kinda bad
        this.container.innerHTML += `<article class="popular__item" data-id='${this.copyDbState[i].id}'>
                      <figure class='article__image-wrapper'>
                        <img src=${this.copyDbState[i].image} alt="event name" class='article__image'>
                        <button class='button button--danger popular__delete'>⤫</button>
                      </figure>
                      <div class="article__wrapper article__info">
                        <div class="article__date">
                          <span class='article__day'>${new Date(this.copyDbState[i].date).getDate()}</span>
                          <span class='article__month'>${monthArr[new Date(this.copyDbState[i].date).getMonth()]}</span>
                        </div>
                        <a href="javascript:void(0)" class='article__link'>
                          <div class="article__content">
                            <header>
                              <h4 class='article__title'>${this.copyDbState[i].title}</h4>
                            </header>
                              <p class="article__summary">${this.copyDbState[i].location}</p>
                              <p class='article__text'>${this.copyDbState[i].description}</p>
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
        searchInputs = searchForm.querySelectorAll('input[type="search"]'),
        resetInputsValue = searchForm.querySelector('#resetInputs');

    return () => {
      this.dbOpen.onupgradeneeded = e => {
        let db = this.dbOpen.result,
            store = db.createObjectStore('EventsStore', {
              autoIncrement: true
            });
            store.createIndex('title', 'title', {unique: false});
            store.createIndex('location', 'location', {unique: false});
            store.createIndex('description', 'description', {unique: false});
            store.createIndex('summary', 'summary', {unique: false});
            store.createIndex('date', 'date', {unique: false});
            store.createIndex('time', 'time', {unique: false});
            store.createIndex('image', 'image', {unique: false});
        };

      this.dbOpen.onsuccess = e => {
        let db = this.dbOpen.result,
            tx = db.transaction('EventsStore', 'readwrite');
            store = tx.objectStore('EventsStore');

        store.index('title');
        store.index('location');
        store.index('description');
        store.index('summary');
        store.index('date');
        store.index('time');
        store.index('image');

        //general error handler
        db.onerror = e => {
          throw new Error(e.target.error);
        };

        //read data from db and set it to currentDbState variable
        store.getAll().onsuccess = e => {
          if(e.target.result.length === 0) return this.addInitialEvents();
          store.openCursor(null, 'prev').onsuccess = e => {
            let cursor = e.target.result;
            if(cursor) {
              let { title, location, description, summary, date, time, image } = cursor.value;
              this.currentDbState.push({ id: cursor.key, title, location, description, summary, date, time, image });
              return cursor.continue();
            };
              this.copyDbState = this.currentDbState.slice();
              this.loadDataToDOM();
          };
        };

      //fired after the initial transaction is completed
        tx.oncomplete = () => {
          // db.close();
          };
        };

        this.dbOpen.onerror = e => {
          throw new Error(e.target.error);
        };

        restoreDbBtn.addEventListener('click', this.restoreSettings.bind(this), false);
        modalDisplayBtn.addEventListener('click', this.setAddEventModal.bind(this), false);
        loadMoreBtn.addEventListener('click', this.loadMoreData.bind(this), false);
        filterByNameDate.addEventListener('click', this.sortData.bind(this) ,false);
        filterByAscDesc.addEventListener('click', this.sortData.bind(this), false);
        resetInputsValue.addEventListener('click', this.resetInputsValue.bind(this), false);
        searchInputs.forEach(item => {item.addEventListener('keyup', this.searchDatabase.bind(this), false)});
        window.addEventListener('click', e => { if(e.target === this.modal) this.toggleModal() }, false);
    };
  }
};

Events.initial()();
