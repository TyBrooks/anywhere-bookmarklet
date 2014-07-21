$(function() {
  dev = true;
  if (dev) {
    code_src = '//localhost:3000/javascripts/loader.js'
  } else {
    code_src = '//anywhere-bookmarklet.herokuapp.com/javascripts/loader.js'
  }
  
  
  $('.get-bookmarklet').on('submit', function(event) {
    event.preventDefault();
    var userAPI = $('#user-api').val();
    $('.bookmarklet-link').attr('href', "javascript:(function(){window.vglnkbkmklt_key = '" + userAPI + "'; if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src= '" + code_src + "'; }})();");
    $('.get-bookmarklet').toggle();
    $('.bookmarklet-holder').slideDown();
  });
})
