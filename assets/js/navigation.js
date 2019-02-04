(function() {
  'use strict';

  let body = document.querySelector('#body'),
      navToggle = document.querySelector('#nav-toggle');

  navToggle.onclick = function(e) {
    let checked = e.target.checked,
        innerWidth = window.innerWidth;

    if(checked)
      if(innerWidth >= 400)
        return body.style.paddingRight = '150px';
    body.style.paddingRight = '0';
  }
}());
