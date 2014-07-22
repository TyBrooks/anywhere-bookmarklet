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
        clipboard.setData( "text/plain", window.viglink_bkml.anywhereizedURL );
      });
    
      clipboard.on('aftercopy', function(event) {
        //TODO: Decide whether to alert the user
        alert("Formatted URL has been copied!");
        console.log(event.data['text/plain']);
      });
    
    });
  }
  
  // Documentation: https://dev.twitter.com/docs/tweet-button
  function formatTwitterLink($el, url) {
    $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
  }
  
  //TODO: eventually get rid of this one in favor of the one in the other file
  function anywhereizeURL(key) {
    return "http://redirect.viglink.com?key=" + key + "&u=" + encodeURIComponent(window.location.href);
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
      
      $bkml.find('#bkml-campaign-select').on('change', function(event) {
        var newCampaign = $(this).val();
        var newKey = window.viglink_bkml.campaigns[newCampaign];
        var anywhereizedURL = anywhereizeURL(newKey);
        $bkml.find('.bkml-link-text').text(anywhereizedURL);
        $bkml.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
      });
    }
  });
})();

