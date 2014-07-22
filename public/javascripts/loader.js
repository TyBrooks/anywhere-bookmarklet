/*
Code Flow:
1. Check whether bkml is already loaded. If so, reload without redownloading resources
2. Load jQuery if it's not already present
3. Load the resource list specified at the beginning of the code
4. Load the actual bookmarklet html and initialize code
*/

(function() {
  function ensureJQuery() {
    if (!window.jQuery) {
      var scriptElem = document.createElement("script");
      scriptElem.src = "http://" + serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
      scriptElem.onload = function() {
        // Additional step required: ensure no namespace conflicts (mootools, etc.)
        // init function wrapped in IIFE so we can still use $ conflict-free
        jQuery.noConflict();
        (function($) {
          loadResourcesArr(window.viglink_bkml.resources);
        })(window.jQuery);
      }
      document.getElementsByTagName("head")[0].appendChild(scriptElem);
    } else {
      // Even if jQuery is loaded, we can't trust that it's been namespaced to the bling.
      (function($) {
        loadResourcesArr(window.viglink_bkml.resources);
      })(window.jQuery);
    }
  };
  
  function removeBookmarklet() {
    $('bkml-container').remove();
  }
  
  function loadResourcesArr(resources) {
    //TODO: figure out why this isn't working with a locally scoped promises variable
    promises = [];

    // resource is an array of [url, type]
    resources.forEach(function(resource) {
      loadResourceURL(resource[0], resource[1]);
    });
    
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
    
  function loadBookmarklet() {
    // Create an object wrapper to build a promise for our HTML snippet
    var HTMLSnippet = {
      grab: function() {
        var HTMLPromise = $.Deferred();
        $.ajax('//localhost:3000/bookmarklet', {
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
      // Build and append our HTML snippet
      var $bookmarklet = $(snippet);
      var anywhereizedURL = "http://redirect.viglink.com?key=" + window.viglink_bkml.key + "&u=" + encodeURIComponent(window.location.href);
      $bookmarklet.find('.bkml-link-text').text(anywhereizedURL);
      $bookmarklet.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
      $('body').append($bookmarklet);
      
      // Set our viglink_bkml object with the relevant data
      window.viglink_bkml.anywhereizedURL = anywhereizedURL;
      window.viglink_bkml.loaded = true;
      
      // Finally, initialize the events loaded up and attached to the viglink_bkml object.
      window.viglink_bkml.initializeEvents && window.viglink_bkml.initializeEvents();
    }).fail(function() {
      //TODO: Implement error procedure
    });    
  }
  
  /*
    The code below is the initially running code
  */
  
  // Toggle between dev and production (production = demo)
  var dev = true;
  
  var serverDomain = dev ? 'localhost:3000' : 'anywhere-bookmarklet.herokuapp.com';
  
  // Resource list format: [url, type]
  window.viglink_bkml.resources = [
    ['http://' + serverDomain + '/javascripts/vendor/ZeroClipboard.js', "js"],
    ['http://' + serverDomain + '/javascripts/bookmarklet_events.js', "js"],
    ['http://' + serverDomain + '/stylesheets/bookmarklet.css', "css"]
  ];
  
  window.viglink_bkml.loaded = window.viglink_bkml.loaded || false;
  
  // Step 1, check if bookmarklet has already been loaded
  if (!window.viglink_bkml.loaded) { 
    // If it hasn't, start by loading jQuery
    ensureJQuery();
  } else {
      removeBookmarklet();
      window.viglink_bkml.loaded = false;
      loadBookmarklet();  
  }
  
    
})();