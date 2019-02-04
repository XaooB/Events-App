const Location = {
  API_KEY: 'AIzaSyCfvvtn0aYxCfxNLCXvmnGG0ICotVUKLWE',
  toggleButton: document.querySelector('#navigator'),
  init: function() {
    if ("geolocation" in navigator) {
        this.toggleButton.addEventListener('click', () => { this.getLocation() });
    } else {
      throw new Error("Navigator is not available. Not able to check your location.");
    }
  },
  getLocation: function() {
    window.navigator.geolocation.getCurrentPosition(position => {
        return this.getCiyName({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
    }, (err) => {
      throw new Error(err);
    }, {
      enableHighAccuracy: true
    })
  },
  getCiyName: async function(cords) {
    let API_REQUEST = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${cords.lat},${cords.lng}&sensor=false&key=${this.API_KEY}`,
        cityInput = document.querySelector('#city'),
        loader =  document.querySelector('.search__loader');

    //should be added on live instead of being changed diplay property
    loader.style.display = 'block';

    try {
      const request = await fetch(`${API_REQUEST}`);
      const data = await request.json();

      //check if there's any results
      if(data.results.length > 0) {
        data.results.forEach(item => {
          if(item.types[0] === 'locality' || item.types[0] === 'political') {
            //should be added instead of being changing diplay property
            loader.style.display = 'none';
            cityInput.value = item.address_components[0].short_name;
            return;
          }
        })
      } else {
        throw new Error('No results for those cords');
      }
    } catch(err) {
      throw new Error(err);
    }
  }
}

Location.init();
