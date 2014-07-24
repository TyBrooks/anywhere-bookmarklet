//TODO: 1. Add handler for if the user isn't logged in
//TODO: 2. Handle multiple clicks
//TODO: 3. Refactor user data method into a universal method
//TODO: 4. Figure out what the hell is wrong with the variable scoping here...


(function() {
  
  function Bookmarklet(options) {
    var dev = true;
  
    this.resources = options.resources || [];
    this.loaded = options.loaded || false;
    this.campaigns = options.campaigns || Object.create(null);
    this.serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';
    this.anywhereizedUrl = null;
  }

  /*
    NOTE: Apparently we can't actually trust that our site has already loaded a useable version of jQuery
    Amazon has some sort of customized jQuery library that uses window.jQuery but doesn't provide the functionality we need.
  */
  Bookmarklet.prototype.ensureJQuery = function(callback) {
    var scriptElem = document.createElement("script");
    scriptElem.src = this.serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
    scriptElem.onload = function() {
      // Ensure we're not stepping on anyone's feet. Return the $ to it's past owner once the library has loaded and
      // return window.jQuery to it's past value. We'll use the window.js$
      jq$ = window.jq$ = window.jQuery.noConflict(true);
      callback();
    }
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  }

  //TODO: refactor this into a universal method
  Bookmarklet.prototype.pullUserData = function() {
    var promise = jq$.Deferred();
    jq$.ajax(this.serverDomain + '/account/users', {
      dataType: 'json',
      contentType: 'application/json',
      async: false,
      success: function(data) {
        promise.resolve(data);
      }
    });
  
    return promise;
  }

  Bookmarklet.prototype.pullJSONP = function() {
  
  }

  // Returns a promise that resolves when all resources are loaded
  Bookmarklet.prototype.loadResources = function() {
    var overallPromise = jq$.Deferred();
    var that = this;
  
    promises = [];

    // resource is an array of [url, type]
    this.resources.forEach(function(resource) {
      var type = resource[1];
      var url = resource[0];
    
      if (type === "js") {
        var promise = that.loadJSResource(url);
        promises.push(promise);
      } else if (type === 'css') {
        var promise = that.loadCSSResource(url);
        promises.push(promise);
      } else if (type === 'html') {
        var promise = that.loadHTMLResource(url);
        promises.push(promise);
      }
    });
  
    jq$.when.apply(jq$, promises).then(function(snippet) {
      overallPromise.resolve(snippet);
    })
  
    return overallPromise;
  }

  //Returns a promise when the resource is loaded
  Bookmarklet.prototype.loadHTMLResource = function(url) {
    var htmlPromise = jq$.Deferred();
    jq$.ajax(this.serverDomain + '/bookmarklet', {
      dataType: "html",
      success: function(snippet) {
        htmlPromise.resolve(snippet);
      }
    });
  
    return htmlPromise; 
  }

  // Returns a promise when the resource is loaded
  Bookmarklet.prototype.loadCSSResource = function(url) {
    var cssPromise = jq$.Deferred();
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
    var jsPromise = jq$.Deferred();
    var scriptElem = document.createElement("script");
    scriptElem.src = url;
    scriptElem.onload = function() {
      jsPromise.resolve();
    }
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  
    return jsPromise;
  }

  Bookmarklet.prototype.attach = function($bkml) {
    jq$('body').append($bkml);
  }

  Bookmarklet.prototype.remove = function() {
    jq$('.bkml-container').remove();
  } 

  // Initial Code Below:
  var dev = true;

  var serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';

  //ORDER MATTERS : The HTML snippet has to be first
  var resources = [
    [serverDomain + '/bookmarklet', 'html'],
    [serverDomain + '/javascripts/vendor/ZeroClipboard.js', "js"],
    [serverDomain + '/stylesheets/bookmarklet.css', "css"],
    [serverDomain + '/fonts/font-awesome-4.1.0/css/font-awesome.min.css', 'css']
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
      });
    } else {
      bkml.loggedIn = false;
    }
  
    var resourcesLoadPromise = bkml.loadResources();
    resourcesLoadPromise.done(afterResourcesLoad);
  
  }

  function afterResourcesLoad(htmlSnippet) {
    var $bkmlSnippet = jq$(htmlSnippet);
    buildHTML($bkmlSnippet, bkml.campaigns);
    initializeEvents($bkmlSnippet);
  }

  function buildHTML($bkmlSnippet, campaignHash) {
    buildCampaignOptions($bkmlSnippet, campaignHash);
    //Current anywhereized URL should be the first option
    bkml.anywhereizedURL = getAnywhereizedURL($bkmlSnippet);
    insertAnywhereizedURL($bkmlSnippet, bkml.anywhereizedURL);
  
    formatTwitterLink($bkmlSnippet.find('.bkml-social-tweet'), bkml.anywhereizedURL);
    bkml.attach($bkmlSnippet);
  }

  function initializeEvents($bkmlSnippet) {
      initializeClipboard();
    
      // jQuery Events...
      $bkmlSnippet.find('.bkml-link-copy').on('click', function(event) {
        event.preventDefault();
      });
  
      $bkmlSnippet.find('.bkml-social-fb').on('click', function(event) {
        //TODO: implement this... maybe
      })
    
      $bkmlSnippet.find('#bkml-campaign-select').on('change', function(event) {
        var anywhereizedURL = getAnywhereizedURL(jq$('.bkml-container'));
        window.viglink_bkml.anywhereizedURL = anywhereizedURL;
        formatTwitterLink(jq$('.bkml-social-tweet'), bkml.anywhereizedURL)
      
        $bkmlSnippet.find('.bkml-link-text').text(anywhereizedURL);
        $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text', anywhereizedURL);
      });
    }

  // buildHTML Helper methods

  function buildCampaignOptions($bkmlSnippet, campaignHash) {
    for(var campaign in campaignHash) {
      $option = jq$('<option val="' + campaignHash[campaign] + '">' + campaign + '</option>');
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

  function insertAnywhereizedURL($bkmlSnippet, anywhereizedURL) {
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

    var clipboard = new ZeroClipboard(jq$('#clipboard-target'));

    clipboard.on('ready', function(readyEvent) {
    
      clipboard.on( "copy", function (event) {
        var clipboard = event.clipboardData;
        clipboard.setData( "text/plain", jq$('#clipboard-target').data('clipboard-text' ));
      });
  
      clipboard.on('aftercopy', function(event) {
        //TODO: Decide whether to alert the user
        alert("Formatted URL has been copied!");
        console.log(event.data['text/plain']);
      });
  
    });
  }
})();
