/*
Code Flow:
1. Check whether bkml is already loaded. If so, reload without redownloading resources
2. Load jQuery if it's not already present
3. Load the resource list specified at the beginning of the code
4. Load the actual bookmarklet html and initialize code
*/

(function() {
  // Resource list format: [url, type]
  var resources = []
  resources.push(['https://anywhere-booklet.herokuapp.com/javascripts/vendor/ZeroClipboard.js', "js"]);
  resources.push(['https://anywhere-booklet.herokuapp.com/javascripts/bookmarklet_events.js', "js"]);
  resources.push(['https://anywhere-booklet.herokuapp.com/stylesheets/bookmarklet.css', "css"]);
  
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
  
  function loadResourceArr(resourceArr) {
    var promises = [];
    
    // resource is an array of [url, type]
    resources.forEach(function(resource) {
      loadResourceUrl(resource[0], resource[1]);
    })
    
    $.when.apply($, promises).then(function() {
      loadBookmarklet();
    })
    
    loadBookmarklet();
  }
  
  function loadResourceUrl(resourceURL, resourceType) {
    var promise = $.Deferred();
    promises.push(promise);
    
    if (resourceType == "js") {
      var scriptElem = document.createElement("script");
      scriptElem.src = resourceURL;
      scriptElem.onload = function() {
        promise.resolve();
      }
      document.head.appendChild(scriptElem);
    } else if (resourceType == "css") {
      var styleElem = document.createElement("link");
      styleElem.setAttribute('rel', 'stylesheet');
      styleElem.type = 'text/css';
      styleElem.href = resourceUrl;
      document.head.appendChild(styleElem);
    }    
  }
  
  // There are two compiled JS files depending on whether or not the page already has jQuery loaded
  function ensureJQuery() {
    if (!window.jQuery) {
      var scriptElem = document.createElement("script");
      scriptElem.src = "//anywhere-bookmarklet.herokuapp.com/javascripts/vendor/jquery-1.11.1.js";
      scriptElem.onload = function() {
        // Additional step required: ensure no namespace conflicts (mootools, etc.)
        // init function wrapped in IIFE so we can still use $ conflict-free
        jQuery.noConflict();
        (function($) {
          loadResourceArr(resources);
        })(jQuery);
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    } else {
      (function($) {
        loadResourceArr();
      })(window.jQuery);
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