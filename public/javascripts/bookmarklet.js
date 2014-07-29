//TODO: 1. Add handler for if the user isn't logged in DONE
//TODO: 2. Handle multiple clicks  DONE
//TODO: 3. Refactor user data method into a universal method DONE
//TODO: 4. Figure out what the hell is wrong with the variable scoping here... 
//          - 


(function() {
  
  var dev = true;
  var serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';
  
  function Bookmarklet(options) {
    var dev = true;
  
    this.resources = options.resources || []; 
    this.campaigns = options.campaigns || Object.create(null);
    this.serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';
  }

  /*
    NOTE: Apparently we can't actually trust that our site has already loaded a useable version of jQuery
    Amazon has some sort of customized jQuery library that uses window.jQuery but doesn't provide the functionality we need.
  */
  Bookmarklet.prototype.ensureJQuery = function(callback) {
    var scriptElem = document.createElement("script");
    scriptElem.className = 'bkml-resource';
    
    scriptElem.src = this.serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
    scriptElem.onload = function() {
      // Ensure we're not stepping on anyone's feet. Return the $ to it's past owner once the library has loaded and
      // return window.jQuery to it's past value. We'll use the window.js$
      jq$ = window.jq$ = window.jQuery.noConflict(true);
      callback();
    }
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  }

  //TODO: Refactor both ajax wrappers into a universal method?
  Bookmarklet.prototype.callJsonAPI = function(url) {
    var promise = jq$.Deferred();
    
    jq$.ajax(url, {
      dataType: 'json',
      success: function(data) {
        promise.resolve(data);
      }
    });
  
    return promise;
  }
  
  Bookmarklet.prototype.callJsonpAPI = function(url) {
    var promise = jq$.Deferred();
    
    jq$.ajax(url, {
      dataType: 'jsonp',
      success: function(data) {
        promise.resolve(data);
      }
    });
  
    return promise;
  }
  
  // Returns a promise that resolves when all resources are loaded
  Bookmarklet.prototype.loadResources = function() {
    var overallPromise = jq$.Deferred();
    var that = this;
  
    //TODO: Fix scoping here
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
    jq$.ajax(url, {
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
    
    $style = jq$('<link></link>').addClass('bkml-resource').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', url);
    jq$('head').append($style);
    
    $style.on('load', function() {
      cssPromise.resolve();
    })
  
    return cssPromise;
  }

  // Returns a promise when the resource is loaded
  Bookmarklet.prototype.loadJSResource = function(url) {
    var jsPromise = jq$.Deferred();
    
    //Using jQuery to avoid compatibility issues with older IE not handling script.onready well
    jq$.getScript(url, function() {
      jsPromise.resolve();
    })
    
    return jsPromise;
  }
  
  Bookmarklet.prototype.buildCampaignHash = function(data) {
    var userData = data.users;
    var that = this;
    this.campaigns = Object.create(null);
    
    userData.forEach(function(campaignData) {
      that.campaigns[campaignData.name] = campaignData.key;
    });
  }

  Bookmarklet.prototype.attach = function($bkml) {
    jq$('body').append($bkml);
  }

  Bookmarklet.prototype.remove = function() {
    jq$('.bkml-container').remove();
    jq$('.bkml-resource').remove();
    delete window.viglink_bkml;
  } 


/* Initialization */

  //ORDER MATTERS : The HTML snippet has to be first
  var resources = [
    [serverDomain + '/bookmarklet', 'html'],
    [serverDomain + '/javascripts/vendor/ZeroClipboard-VL.js', "js"],
    [serverDomain + '/stylesheets/bookmarklet.css', "css"],
    // Have to host Font Awesome from the CDN for firefox for some reason
    ['//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', 'css']
  ];

  window.viglink_bkml = new Bookmarklet({
    resources: resources
  });
  
  window.viglink_bkml.ensureJQuery(afterJQueryLoad); // This starts us off

/* End Initialization */  
  
/* Begin Load order functions */

  function afterJQueryLoad() {
    var userDataPromise = window.viglink_bkml.callJsonAPI(window.viglink_bkml.serverDomain + '/account/users');
    var resourcesLoadPromise = window.viglink_bkml.loadResources();
    //This doesn't need to resolve until after the first two have
    var linkDataPromise = grabLinkData();
    
    jq$.when(userDataPromise, resourcesLoadPromise).then(loadHTML.bind(this, linkDataPromise))
  }

  /*
    Uses the user data (and the link data when the api call resolves) to determine which screen to show
  */
  function loadHTML(linkDataPromise, userData, htmlSnippet) {
    var $bkmlSnippet = jq$(htmlSnippet);
      
    if (isSignedIn(userData)) {
      window.viglink_bkml.buildCampaignHash(userData);
      
      //This call is made at the same time as resources load and user data grab
      linkDataPromise.done(function(linkData) {
        if (isAffiliatable(linkData)) {
          buildHTML($bkmlSnippet, window.viglink_bkml.campaigns);
          initializeShareEvents($bkmlSnippet);
      
          showSharePage($bkmlSnippet);
          window.viglink_bkml.attach($bkmlSnippet);
        } else {
          initializeNotAffiliatableEvents($bkmlSnippet);
          
          showNotAffiliatablePage($bkmlSnippet);
          window.viglink_bkml.attach($bkmlSnippet);
        }
      })
    } else {
      initializeLoginEvents($bkmlSnippet, linkDataPromise);
      
      showLoginPage($bkmlSnippet);
      window.viglink_bkml.attach($bkmlSnippet);
    }
    
    initializeGeneralEvents($bkmlSnippet);
  }
  
/* End load order functions */
  
  
  
/* Begin general helper functions */
  
  function isSignedIn(userData) {
    return !!userData.users;
  }
  
  function grabLinkData() {
    //TODO: Figure out how to implement a test key?
    var testKey = '9cb01deed662e8c71059a9ee9a024d30';
    var linkURL = serverDomain + '/api/link?optimize=false&format=jsonp&key=' + testKey + '&out=' + encodeURIComponent(window.location.href)
    var linkDataPromise = window.viglink_bkml.callJsonAPI(linkURL); 
    
    return linkDataPromise;
  }
  
  function isAffiliatable(linkData) {
    return !!linkData.affiliatable;
  }
  
/* End general helper methods */
  
  
  
/* Tools for building up the Share page html with user specific data */

  function buildHTML($bkmlSnippet, campaignHash) {
    buildCampaignOptions($bkmlSnippet, campaignHash);
    
    var anywhereizedURL = getAnywhereizedURL($bkmlSnippet);  
    setNewLink($bkmlSnippet, anywhereizedURL);
  }


  function buildCampaignOptions($bkmlSnippet, campaignHash) {
    $bkmlSnippet.find('#bkml-campaign-select').empty();
    
    for(var campaign in campaignHash) {
      $option = jq$('<option val="' + campaignHash[campaign] + '">' + campaign + '</option>');
      $bkmlSnippet.find('#bkml-campaign-select').append($option)
    }
  }
/* End HTML builder tools */



/* Link Helpers */  

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

  function setNewLink($bkmlSnippet, anywhereizedURL) {
    insertLinkIntoHTML($bkmlSnippet, anywhereizedURL);
    $bkmlSnippet.find('.bkml-link-text').data('long', anywhereizedURL).data('active', 'long').removeData('short');
  }

  function insertLinkIntoHTML($bkmlSnippet, url) {
    $bkmlSnippet.find('.bkml-link-text').text(url)
    $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text', url);
    
    formatTwitterLink($bkmlSnippet.find('.bkml-social-tweet'), url);
    formatFbLink($bkmlSnippet.find('.bkml-social-fb'), url);
  }

  function formatTwitterLink($el, url) {
    $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
  }  
  
  function formatFbLink($el, url) {
    var shareURL = 'https://www.facebook.com/sharer.php?src=bm&v=4&i=1406665647&u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(document.title);
    $el.attr('href', shareURL); 
  }
/* End Link Helpers */
  

  
/* Begin helper functions to intialize share events */
  
  function initializeShareEvents($bkmlSnippet) {
    initializeClipboard($bkmlSnippet);
  
    $bkmlSnippet.find('.bkml-link-copy').on('click', function(event) {
      event.preventDefault();
    });

    $bkmlSnippet.find('.bkml-social-fb').on('click', function(event) {
      //TODO: implement this... maybe
    })
    
    $bkmlSnippet.find('.bkml-link-shorten').on('click', handleShortenClick.bind(window.viglink_bkml, $bkmlSnippet));
  
    $bkmlSnippet.find('#bkml-campaign-select').on('change', function(event) {
      var anywhereizedURL = getAnywhereizedURL(jq$('.bkml-container'));
      setNewLink($bkmlSnippet, anywhereizedURL);
    });
  }
  
  function handleShortenClick($bkmlSnippet, event) {
    $linkText = $bkmlSnippet.find('.bkml-link-text');
    if ($linkText.data('active') === 'short') {
      insertLinkIntoHTML($bkmlSnippet, $linkText.data('long'));
      $linkText.data('active', 'long');
    } else if ($linkText.data('active') === 'long' && $linkText.data('short') ) {
      insertLinkIntoHTML($bkmlSnippet, $linkText.data('short'));
      $linkText.data('active', 'short');
    } else {
      var bitlyAPI = 'https://api-ssl.bitly.com/v3/shorten?ACCESS_TOKEN=' + 'a2dde94fc7b3fc05e7a1dfc24d8d68840f013793' + '&longUrl=' + encodeURIComponent($linkText.data('long'));
      var bitlyPromise = window.viglink_bkml.callJsonAPI(bitlyAPI);
      bitlyPromise.done(function(response) {
        if (!($linkText.data('active') === 'short') && !$linkText.data('short') ) { // make sure two ajax requests don't conflict
          if (response.data && response.data.url) {
            var newURL = response.data.url;
            insertLinkIntoHTML($bkmlSnippet, newURL);
            $linkText.data('active', 'short').data('short', newURL);
          }
        }
      })
    }
  }
  
  function initializeClipboard($bkmlSnippet) {
    //TODO: Harden code, add logic for clipboard failure (just add an alert saying clipboard isn't working)
    
    var ZeroClipboard = window.ZeroClipboard;
    
    ZeroClipboard.config({ 
      swfPath: serverDomain + "/swf/ZeroClipboard.swf",
      trustedDomains: [window.location.protocol + "//" + window.location.host],
      containerClass: "global-zeroclipboard-container bkml-resource"
    });
    
    var clipboard = new ZeroClipboard($bkmlSnippet.find('#clipboard-target'));

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

/* End copy phase event helpers */
  
/* Login Page events */
  function initializeLoginEvents($bkmlSnippet, linkDataPromise) {
    $bkmlSnippet.find('.bkml-redirect-done').on('click', function() {
      var $reload = jq$(this);
      $reload.off('click');
      
      spinnerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
      var oldVal = $reload.html();
      $reload.html(spinnerHTML);
      
      var userDataPromise = window.viglink_bkml.callJsonAPI(window.viglink_bkml.serverDomain + '/account/users');  
      userDataPromise.done(function(userData) {
        $reload.html(oldVal);
        loadHTML(linkDataPromise, userData, $bkmlSnippet); //Re-insert ourselves into event flow with new user data
      })
    });
  }
/* Login End

/* Not affiliatable events */
  
  function initializeNotAffiliatableEvents($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-notaff-close').on('click', function() {
      window.viglink_bkml.remove();
    });
  }

/* General Events */
  
  function initializeGeneralEvents($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-dismiss').on('click', function() {
      window.viglink_bkml.remove();
    })
  }
/* General End */
  
  
/* Page load helpers */
  function showSharePage($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-share-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'none');
  }
  
  function showLoginPage($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-login-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-share-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'none');
  }
  
  function showNotAffiliatablePage($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-share-container').css('display', 'none');
  }
  
  

})();
