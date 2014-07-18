$(function() {
  $('.get-bookmarklet').on('submit', function(event) {
    event.preventDefault();
    var userAPI = $('#user-api').val();
    $('.bookmarklet-link').attr('href', "javascript:(function(){window.vglnkbkmklt_key = '" + userAPI + "'; if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src= '/javascripts/loader.js'; }})();");
    $('.get-bookmarklet').toggle();
    $('.bookmarklet-holder').slideDown();
  });
})
