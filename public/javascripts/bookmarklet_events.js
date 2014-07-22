(function() {
  function initializeClipboard() {
    ZeroClipboard.config({ 
      swfPath: "//localhost:3000/swf/ZeroClipboard.swf",
      trustedDomains: [window.location.protocol + "//" + window.location.host]
    });
  
    var clipboard = new ZeroClipboard($('#clipboard-target'));
  
    clipboard.on('ready', function(readyEvent) {
      
      clipboard.on( "copy", function (event) {
        var clipboard = event.clipboardData;
        clipboard.setData( "text/plain", "http:" + window.viglink_bkml.anywhereizedURL );
      });
    
      clipboard.on('aftercopy', function(event) {
        //TODO: Decide whether to alert the user
        alert("Formatted URL has been copied!");
        console.log(event.data['text/plain']);
      });
    
    });
  }
  
  function formatTwitterLink($el, url) {
    $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
  }
  
  $(function() {
    // Wrap our jquery so that we don't load it until our html is loaded.
    window.viglink_bkml.initializeEvents = function() {
      $bkml = $('.bkml-container');
    
      initializeClipboard();
      
      formatTwitterLink($('.bkml-social-tweet'), window.viglink_bkml.anywhereizedURL);
    
      $bkml.find('.bkml-link-copy').on('click', function(event) {
        event.preventDefault();
      });
    
      $bkml.find('.bkml-social-fb').on('click', function() {
        //TODO: implement fb redirect
        alert("FB Click");
      })
    }
  });
})();

