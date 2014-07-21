(function() {
  function initializeClipboard() {
    ZeroClipboard.config( { swfPath: "/swf/ZeroClipboard.swf" } );
  
    var clipboard = new ZeroClipboard(document.getElementById('clipboard-target'));
  
    clipboard.on('ready', function(readyEvent) {
    
      clipboard.on('aftercopy', function(event) {
        //TODO: implement something here
        alert(event.data['text/plain']);
      });
    
    });
  }
  
  $(function() {
    // Wrap our jquery so that we don't load it until our html is loaded.
    window.viglink_bkml.initializeEvents = function() {
      $bkml = $('.bkml-container');
    
      initializeClipboard();
    
      $bkml.find('.bkml-link-copy').on('click', function(event) {
        event.preventDefault();
      });
    
      $bkml.find('.bkml-social-fb').on('click', function() {
        //TODO: implement fb redirect
        alert("FB Click");
      })
    
      $bkml.find('.bkml-social-tweet').on('click', function() {
        //TODO: implement tweet redirect
        alert("Tweet Click");
      });
    }
  });
})();

