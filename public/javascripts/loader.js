/*
Code Flow:
1. Check whether bkml is already loaded. If so, reload without redownloading resources
2. Load jQuery if it's not already present
3. Load the resource list specified at the beginning of the code
4. Load the actual bookmarklet html and initialize code
*/

(function() {
  
  
  // Step 1, check if bookmarklet has already been loaded
  if (window.viglink_bkml === undefined) {
    // May need to wrap our bkml event handlers in an init function in this object
    // ... Don't want to load them until the bkml html is loaded.
    window.viglink_bkml = {
      loaded: false
    }
    
    
    // Resource list format: [url, type]
    window.viglink_bkml.resources = []
    window.viglink_bkml.resources.push(['https://anywhere-booklet.herokuapp.com/javascripts/vendor/ZeroClipboard.js', "js"]);
    window.viglink_bkml.resources.push(['https://anywhere-booklet.herokuapp.com/javascripts/bookmarklet_events.js', "js"]);
    window.viglink_bkml.resources.push(['https://anywhere-booklet.herokuapp.com/stylesheets/bookmarklet.css', "css"]);
  
    // Dev only
    dev = true; 
    var devResources = [];
    devResources.push(['http://localhost:3000/javascripts/vendor/ZeroClipboard.js', "js"]);
    devResources.push(['http://localhost:3000/javascripts/bookmarklet_events.js', "js"]);
    devResources.push(['http://localhost:3000/stylesheets/bookmarklet.css', "css"]);
  
    if (dev) {
      window.viglink_bkml.resources = devResources;
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
  
  function loadResourcesArr(resourceArr) {
    //TODO: figure out why this isn't working with a locally scoped promises variable
    promises = [];

    // resource is an array of [url, type]
    window.viglink_bkml.resources.forEach(function(resource) {
      loadResourceURL(resource[0], resource[1]);
    })
    
    $.when.apply($, promises).then(function() {
      loadBookmarklet();
    })
    
    loadBookmarklet();
  }
  
  function loadResourceURL(resourceURL, resourceType) {
    var promise = $.Deferred();
    promises.push(promise);
    
    if (resourceType == "js") {
      var scriptElem = document.createElement("script");
      scriptElem.src = resourceURL;
      scriptElem.onload = function() {
        promise.resolve();
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    } else if (resourceType == "css") {
      var styleElem = document.createElement("link");
      styleElem.setAttribute('rel', 'stylesheet');
      styleElem.type = 'text/css';
      styleElem.href = resourceURL;
      document.getElementsByTagName("head")[0].appendChild(styleElem);
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
          loadResourcesArr();
        })(jQuery);
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    } else {
      (function($) {
        loadResourcesArr();
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