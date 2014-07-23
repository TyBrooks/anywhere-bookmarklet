$(function() {
  dev = true;
  if (dev) {
    code_src = '//localhost:3000/javascripts/bookmarklet.js'
  } else {
    code_src = '//anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js'
  }
  
  
  $('.bookmarklet-link').attr('href', "javascript:(function(){if(!window.viglink_bkml || !window.viglink_bkml.initialized){document.body.appendChild(document.createElement('script')).src= '" + code_src + "'; }})();");
  
})
