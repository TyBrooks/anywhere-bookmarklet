$(function() {
  dev = false;
  if (dev) {
    code_src = 'http://localhost:3000/javascripts/bookmarklet.js'
  } else {
    code_src = 'http://anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js'
  }
  
  //TODO: add 'bkml-resource' as className onto bookmarklet.js script
  $('.bookmarklet-link').attr('href', "javascript:(function(){if(!window.viglink_bkml){var scriptElem = document.createElement('script'); scriptElem.className = 'bkml-resource'; scriptElem.src='" +  code_src + "'; document.body.appendChild(scriptElem)}})();");
  
})
