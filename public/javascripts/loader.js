(function() {
  // Step 1, check if bookmarklet has already been loaded
  if (window.viglink_bkml === undefined) {
    // May need to wrap our bkml event handlers in an init function in this object
    // ... Don't want to load them until the bkml html is loaded.
    window.viglink_bkml = {
      loaded: false
    }
    
    // Step 2, check whether jQuery is already loaded
    ensureJQuery();
  } else {
    // Make sure user double-clicking the bookmarklet isn't a problem
    if (viglink_bkml.loaded) {
      removeBookmarklet();
      window.viglink_bkml.loaded = false;
      loadBookmarklet();  
    }
  }
  
  function removeBookmarklet() {
    $('bkml-container').remove();
  }
  
  // There are two compiled JS files depending on whether or not the page already has jQuery loaded
  function ensureJQuery() {
    if (window.jQuery) {
      var scriptElem = document.createElement("script");
      scriptElem.src = "https://anywhere-bookmarklet.herokuapp.com//src/app_no_jquery.js";
      scriptElem.onload = function() {
        loadBookmarklet();
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);      
    } else {
      var scriptElem = document.createElement("script");
      scriptElem.src = "https://anywhere-bookmarklet.herokuapp.com//src/app_jquery.js";
      scriptElem.onload = function() {
        // Additional step required: ensure no namespace conflicts (mootools, etc.)
        // init function wrapped in IIFE so we can still use $ conflict-free
        jQuery.noConflict();
        (function($) {
          loadBookmarklet();
        })(jQuery);
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    }
  };
  
  
  function loadBookmarklet() {
    //TODO: make sure ZeroClipboard.Core.js loaded, make contingencies if it hasn't
    
    // Create an object wrapper to build a promise for our HTML snippet
    var HTMLSnippet = {
      grab: function() {
        var HTMLPromise = $.Deferred();
        $.ajax('https://anywhere-bookmarklet.herokuapp.com/bookmarklet', {
          dataType: "html",
          success: function(snippet) {
            HTMLPromise.resolve(snippet);
          }
        });
        
        return HTMLPromise;
      }
    }
    
    var promise = HTMLSnippet.grab();
    promise.done(function(snippet) {
      var $bookmarklet = $(snippet);
      var anywhereizedURL = "https://redirect.viglink.com?key=" + window.viglink_bkml_key + "&u=" + encodeURIComponent(window.location.href);
      $bookmarklet.find('.bkml-link-text').val(anywhereizedURL);
      $bookmarklet.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
      $('body').append($bookmarklet);
      
      window.viglink_bkml.loaded = true;
      
      // Include a custom JS file in the compiled file, attach events to the window.viglink_bkml initialize events function
      window.viglink_bkml.initializeEvents && window.viglink_bkml.initializeEvents();
    }).fail(function() {
      //TODO: Implement error procedure
    });    
  }
    
})();