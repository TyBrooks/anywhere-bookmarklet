$(function() {
  dev = false;
  if (dev) {
    code_src = 'http://localhost:3000/javascripts/bookmarklet.js'
  } else {
    code_src = 'http://anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js'
  }
  
  
  $('.bookmarklet-link').attr('href', "javascript:(function(){if(!window.viglink_bkml || !window.viglink_bkml.initialized){document.body.appendChild(document.createElement('script')).src= '" + code_src + "'; }})();");
  
})
