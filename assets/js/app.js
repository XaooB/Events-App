const Events = {
  //initial values that will be added to the database after visiting  website and resetting current database state
  initialValues: [1,2,3],

  bindEvents: function() {
    let modal = document.querySelector('.modal'),
        addEventBtn = modal.querySelector('#add-wrapper');

    //testing purposes
    addEventBtn.addEventListener('click', (e) => {
      console.log('btn clicked');
    });
  },
  createDatabase: function()  {
    //create initial indexedDb
  },
  createDomElement: function() {
    //create document element
  },
  addEvent: function(eventID) {
    //add event to the database
  },
  deleteEvent: function(eventID) {
    //detele event from the database
  },
  displayEvents: function(list) {
    //display events through DOM
  },
  //initial funtion
  initial: function() {
    this.bindEvents();
  }
}

Events.initial();
