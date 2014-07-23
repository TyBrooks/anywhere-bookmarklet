function Bookmarklet(options) {
  this.resources = options.resources || [];
  this.loaded = options.loaded || false;
  this.campaigns = options.campaigns || Object.create(null);
  this.serverDomain = '//localhost:3000';
  this.anywhereizedUrl = null;
}

// Asynch : ensures the jQuery library is present before loading other resourcs
//TODO: Find a way of managing async w/o callback hell
Bookmarklet.prototype.ensureJQuery = function(callback) {
  if (!window.jQuery) {
    var scriptElem = document.createElement("script");
    scriptElem.src = this.serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
    scriptElem.onload = function() {
      // Additional step required: ensure no namespace conflicts (mootools, etc.)
      // init function wrapped in IIFE so we can still use $ conflict-free
      window.jQuery.noConflict();
      (function($) {
        callback();
      })(window.jQuery);
    }
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  } else {
    // Even if jQuery is loaded, we can't trust that it's been namespaced to the bling.
    (function($) {
      callback();
    })(window.jQuery);
  }
}

//TODO: refactor this into a universal method
Bookmarklet.prototype.pullUserData = function() {
  var promise = $.Deferred();
  $.ajax('http://' + serverDomain + '/account/users', {
    dataType: 'json',
    contentType: 'application/json',
    async: false,
    success: function(data) {
      var userData = data.users;
      //Handle our user data
      userData.forEach(function(campaignData) {
         window.viglink_bkml.campaigns[campaignData.name] = campaignData.key;
      });
      
      promise.resolve();
    }
  });
  
  return promise;
}

Bookmarklet.prototype.pullJSONP = function() {
  
}

// Returns a promise that resolves when all resources are loaded
Bookmarklet.prototype.loadResources = function() {
  var overallPromise = $.Deferred();
  
  promises = [];

  // resource is an array of [url, type]
  this.resources.forEach(function(resource) {
    var type = resource[1];
    var url = resource[0];
    
    if (type === "js") {
      var promise = loadJSResource(url);
      promises.push(promise);
    } else (type === 'css') {
      var promise = loadCSSResource(url);
      promises.push(promise);
    } else (type === 'html') {
      var promise = loadHTMLResource(url);
      promises.push(promise);
    }
  });
  
  $.when.apply($, promises).then(function(snippet) {
    overallPromise.resolve(snippet);
  })
  
  return overallPromise();
}

//Returns a promise when the resource is loaded
Bookmarklet.prototype.loadHTMLResource = function(url) {
  var htmlPromise = $.Deferred();
  $.ajax(this.serverDomain + '/bookmarklet', {
    dataType: "html",
    success: function(snippet) {
      htmlPromise.resolve(snippet);
    }
  });
  
  return htmlPromise; 
}

// Returns a promise when the resource is loaded
Bookmarklet.prototype.loadCSSResource = function(url) {
  var cssPromise = $.Deferred();
  var styleElem = document.createElement("link");
  styleElem.setAttribute('rel', 'stylesheet');
  styleElem.type = 'text/css';
  styleElem.href = url;
  document.getElementsByTagName("head")[0].appendChild(styleElem);
  if ('onload' in document.createElement('link')) {
    // Modern Browsers
    styleElem.onload = function() {
      cssPromise.resolve();
    }
  } else {
    //TODO: Implement better, for now just assume it's going to work
    cssPromise.resolve();
  }  
  
  return cssPromise;
}

// Returns a promise when the resource is loaded
Bookmarklet.prototype.loadJSResource = function(url) {
  var jsPromise = $.Deferred();
  var scriptElem = document.createElement("script");
  scriptElem.src = url;
  scriptElem.onload = function() {
    jsPromise.resolve();
  }
  document.getElementsByTagName("head")[0].appendChild(scriptElem);
  
  return jsPromise;
}

Bookmarklet.prototype.attach = function($bkml) {
  $('head').appendChild($bkml);
}

Bookmarklet.prototype.remove = function() {
   $('.bkml-container').remove();
}

Bookmarklet.prototype.attachEvents = function() {
  
}


// Initial Code Below:

var serverDomain = '//localhost:3000';

//ORDER MATTERS : The HTML snippet has to be first
var resources = [
  [serverDomain + '/bookmarklet', 'html'],
  [serverDomain + '/javascripts/vendor/ZeroClipboard.js', "js"],
  [serverDomain + '/stylesheets/bookmarklet.css', "css"]
];

var bkml = window.viglink_bkml = new Bookmarklet({
  resources: resources
});

bkml.ensureJQuery(afterJQueryLoad);

function afterJQueryLoad() {
  var userDataPromise = bkml.pullUserData();
  userDataPromise.done(afterUserDataLoad);
}

//Once user data loads, we either need to load a redirect-to-signin screen, or load all the resources
function afterUserDataLoad(data) {
  var loggedIn;
  
  if (data.users) {
    var userData = data.users;
    bkml.campaigns = Object.create(null);
    userData.forEach(function(campaignData) {
    bkml.campaigns[campaignData.name] = campaignData.key;
    bkml.loggedIn = true;
  } else {
    bkml.loggedIn = false;
  }
  
  var resourcesLoadPromise = bkml.loadResources();
  resourcesLoadPromise.done(afterResourcesLoad);
  
}

function afterResourcesLoad(htmlSnippet) {
  var $bkmlSnippet = $(htmlSnippet);
  buildHTML($bkmlSnippet);
  initializeEvents($bkmlSnippet);
}

function buildHTML($bkmlSnippet) {
  buildCampaignOptions($bkmlSnippet, campaignHash);
  //Current anywhereized URL should be the first option
  bkml.anywhereizedURL = getAnywhereizedURL($bkmlSnippet);
  insertAnywhereizedURL($bkmlSnippet, bkml.anywhereizedURL);
  
  formatTwitterLink($bkmklSnippet.find('.bkml-social-tweet'), bkml.anywhereizedURL);
  bkml.attach();
}

function initializeEvents($bkmlSnippet) {
      initializeClipboard();
      
      // jQuery Events...
      $bkmlSnippet.find('.bkml-link-copy').on('click', function(event) {
        event.preventDefault();
      });
    
      $bkml.find('.bkml-social-fb').on('click', function() {
        //TODO: implement fb redirect
        alert("FB Click");
      })
      
      $bkml.find('#bkml-campaign-select').on('change', function(event) {
        var anywhereizedURL = getAnywhereizedURL($('.bkml-container'));
        window.viglink_bkml.anywhereizedURL = anywhereizedURL;
        formatTwitterLink($('.bkml-social-tweet'), bkml.anywhereizedURL)
        
        $bkml.find('.bkml-link-text').text(anywhereizedURL);
        $bkml.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
      });
    }

// buildHTML Helper methods

function buildCampaignOptions($bkmlSnippet, campaignHash) {
  for(var campaign in campaignHash) {
    $option = $('<option val="' + campaignHash[campaign] + '">' + campaign + '</option>');
    $bkmlSnippet.find('#bkml-campaign-select').append($option)
  }
}

function getAnywhereizedURL($bkmlSnippet) {
  // Build anywhereized URL
  var currentCampaign = $bkmlSnippet.find('#bkml-campaign-select').val();
  var currentKey = window.viglink_bkml.campaigns[currentCampaign];
  var anywhereizedURL = anywhereizeURL(currentKey)
  
  return anywhereizedURL;
}

function anywhereizeURL(key) {
  return "http://redirect.viglink.com?key=" + key + "&u=" + encodeURIComponent(window.location.href);
}

function insertAnywhereizedURL($bkmlSnippet, anywhereizedUrl) {
  $bkmlSnippet.find('.bkml-link-text').text(anywhereizedURL);
  $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
}

function formatTwitterLink($el, url) {
  $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
}

// end buildHTML helpers

function initializeClipboard() {
  ZeroClipboard.config({ 
    swfPath: "//localhost:3000/swf/ZeroClipboard.swf",
    trustedDomains: [window.location.protocol + "//" + window.location.host]
  });

  var clipboard = new ZeroClipboard($('#clipboard-target'));

  clipboard.on('ready', function(readyEvent) {
    
    clipboard.on( "copy", function (event) {
      var clipboard = event.clipboardData;
      clipboard.setData( "text/plain", $('#clipboard-target').data('clipboard-text' ));
    });
  
    clipboard.on('aftercopy', function(event) {
      //TODO: Decide whether to alert the user
      alert("Formatted URL has been copied!");
      console.log(event.data['text/plain']);
    });
  
  });
}

