(function() {
  
  serverDomain = "//localhost:3000";    
  
  function Bookmarklet(options) {
    this.resources = options.resources || [];
    this.campaigns = [];
    this.campaignInfo = {};
    this.defaultCampaign = options.defaultCampaign || null;
    

    this.serverDomain = "//localhost:3000";      
    // this.serverDomain = "http://cdn.viglink.com";
    // this.serverDomain = "http://anywhere-bookmarklet.herokuapp.com";
    // this.serverDomain = "//10.0.2.2:3000";
    
    var bkml = this;
    this.routes = {
      html: bkml.serverDomain + "/bookmarklet/",
      flashSwf: bkml.serverDomain + "/bookmarklet/api/ZeroClipboard.swf",
      userData: "http://publishers.viglink.com/account/users",
      linkData: "http://api.viglink.com/api/link",
      bitly: 'https://api-ssl.bitly.com/v3/shorten?ACCESS_TOKEN=a2dde94fc7b3fc05e7a1dfc24d8d68840f013793',
      log: "http://qa-api-va-1.ec2.viglink.com:8080/api/pixel.gif" //TODO prod
    }
    
    //ORDER MATTERS : The HTML snippet has to be first
    this.resources = [
      [this.routes.html, 'html'],
      [this.serverDomain + '/javascripts/vendor/ZeroClipboard-VL.js', "js"],
      //Remove for production
      [this.serverDomain + '/stylesheets/bookmarklet.css', "css"],
      // Have to host Font Awesome from the CDN for firefox for some reason
      ['//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', 'css']
    ];
  }

  /*
    Loads jQuery but plays nice with already loaded versions and already-defined $ variables
    @param {function} callback : this callback is run once jQuery is loaded
    @return none
  */
  Bookmarklet.prototype.loadJQuery = function(callback) {
    var scriptElem = document.createElement("script"),
        loaded = false,
        bkml = this;
        
    scriptElem.className = 'bkml-resource';
    scriptElem.src = this.serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
    
    scriptElem.onload = scriptElem.onreadystatechange = function() {
      if (!loaded && (!this.readyState || this.readyState === "loaded" )) {
        loaded = true;  
        
        // Ensure we're not stepping on anyone's feet. Return the $ to it's past owner once the library has loaded and
        // return window.jQuery to it's past value. We'll use the window.js    
        jq$ = window.jq$ = window.jQuery.noConflict(true);
        
         // IE compat - doesn't support cross origin html ajax calls. Everything else we can grab from jsonp
        if ( window.XDomainRequest && !jq$.support.cors) {
          bkml.shimAjaxIE(window.jq$);            
        } 
        
        callback(); 
      }
    }
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  }
  
  /*
    Enables IE 9 support for loading resources that aren't JSONP enabled
    @param {jQuery} jQuery : pass in the global jQuery object (the one the bookmarklet is using)
  */
  Bookmarklet.prototype.shimAjaxIE = function(jQuery) {
    // Code courtesy of https://gist.github.com/michaelcox/2655118  
  	jQuery.ajaxTransport(function( s ) {
  		if ( s.crossDomain && s.async ) {
  			if ( s.timeout ) {
  				s.xdrTimeout = s.timeout;
  				delete s.timeout;
  			}
  			var xdr;
  			return {
  				send: function( _, complete ) {
  					function callback( status, statusText, responses, responseHeaders ) {
  						xdr.onload = xdr.onerror = xdr.ontimeout = xdr.onprogress = jQuery.noop;
  						xdr = undefined;
  						jQuery.event.trigger( "ajaxStop" );
  						complete( status, statusText, responses, responseHeaders );
  					}
  					xdr = new XDomainRequest();
  					xdr.open( s.type, s.url );
  					xdr.onload = function() {
  						var status = 200;
  						var message = xdr.responseText;
  						var r = xdr.responseText;
  						if (r.StatusCode && r.Message) {
  							status = r.StatusCode;
  							message = r.Message;
  						}
  						callback( status , message, { text: message }, "Content-Type: " + xdr.contentType );
  					};
  					xdr.onerror = function() {
  						callback( 500, "Unable to Process Data" );
  					};
  					xdr.onprogress = function() {};
  					if ( s.xdrTimeout ) {
  						xdr.ontimeout = function() {
  							callback( 0, "timeout" );
  						};
  						xdr.timeout = s.xdrTimeout;
  					}
  					xdr.send( ( s.hasContent && s.data ) || null );
  				},
  				abort: function() {
  					if ( xdr ) {
  						xdr.onerror = jQuery.noop();
  						xdr.abort();
  					}
  				}
  			};
  		}
  	});
  }
  
  /*
    The base ajax method that all resource loading uses
    @param {String} url : url to load
    @param {String} dataType : the dataType we're expecting from the server
    @param {String} jsonP : an overrride of the name of the callback parameter of the request
  */
  Bookmarklet.prototype.ajax =function(url, dataType, jsonp) {
    var promise = jq$.Deferred();
    
    jq$.ajax(url, jq$.extend({
        dataType: dataType,
        success: function(data) {
          promise.resolve(data);
        },
        timeout: 3000,
        attempts: 0,
        attemptLimit: 2,
        error: function(xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout') {
            this.attempts += 1;
            if (this.attempts <= this.attemptsLimit) {
              jq$.ajax(this);
              return;
            } else {
              promise.reject(xhr, textStatus, errorThrown);
            }
          } else {
            promise.reject(xhr, textStatus, errorThrown);
          }
        }
      }, {
        jsonp: jsonp
      })
    );
    
   return promise; 
  }
  
  /*
    Loads all resources in the bookmarklet's resources property
    @return {Promise} : promise resolves once all resources load or fails if any individual resource fails
  */
  Bookmarklet.prototype.loadResources = function() {
    var overallPromise = jq$.Deferred(),
    bkml = this,
    promises = [];

    // resource is an array of [url, type]
    this.resources.forEach(function(resource) { 
      var type = resource[1];
      var url = resource[0];
    
      if (type === "js") {
        var promise = bkml.loadJSResource(url);
        promises.push(promise);
      } else if (type === 'css') {
        var promise = bkml.loadCSSResource(url);
        promises.push(promise);
      } else if (type === 'html') {
        var promise = bkml.loadHTMLResource(url);
        promises.push(promise);
      }      
    });
  
    jq$.when.apply(jq$, promises).then(function(snippet) {      
      overallPromise.resolve(snippet);
    }).fail(function(xhr, textStatus, errorThrown) {
      alert('Bookmarklet Error: There was an error loading the required resources');
      console.log("Bookmarklet Error: " + textStatus);
      console.log(xhr); //Include this?
      bkml.remove();
    })
  
    return overallPromise;
  }

  /*
    Loads an HTML resource
    @return {Promise} : resolves or fails based on resource load
  */
  Bookmarklet.prototype.loadHTMLResource = function(url) {
    var htmlPromise = this.ajax(url, 'html');
    return htmlPromise;
  }

  /*
    Loads a CSS resource
    @return {Promise} : resolves or fails based on resource load
  */
  Bookmarklet.prototype.loadCSSResource = function(url) {
    var cssPromise = jq$.Deferred(),
        $bkml_style = jq$('<link></link>').addClass('bkml-resource').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', url);
    
    var cssTimeout = setInterval(function() {
      cssPromise.reject({ "reason": "cssTimeout" }, "Error: CSS Load timeout", url);
    }, 5000);
    
    $bkml_style.on('load', function() {
      clearInterval(cssTimeout);
      cssPromise.resolve();
    }).on('error', function() {
      clearInterval(cssTimeout);
      cssPromise.reject();
    });
    
    jq$('head').append($bkml_style);
  
    return cssPromise;
  }

  /*
    Loads a JavaScript resource
    @return {Promise} : resolves or fails based on resource load
  */
  Bookmarklet.prototype.loadJSResource = function(url) {
    var scriptPromise = this.ajax(url, 'script');
    return scriptPromise;
  }
  
  /*
    Loads JSON data via an Ajax request
    @return {Promise} : a promise that resolves or fails based on whether the resource loads
  */
  Bookmarklet.prototype.callJsonAPI = function(url) {
    var jsonPromise = this.ajax(url, 'json');
    return jsonPromise;
  }
  
  /*
    Loads JSONP data via an Ajax request
    @return {Promise} : a promise that resolves or fails based on whether the resource loads
  */
  Bookmarklet.prototype.callJsonpAPI = function(url, callbackParam) {
    var jsonpPromise = this.ajax(url, 'jsonp', callbackParam);
    return jsonpPromise;
  }
  
  /*
    Attaches the Bookmarklet HTML to the document
    @param {jQuery Object} : the Bookmarklet HTML Snippet wrapped in jQuery
  */
  Bookmarklet.prototype.attach = function($bkml) {
    jq$('body').append($bkml);
  }

  /*
    Removes the Bookmarklet from the document and performs all necessary cleanup
    Waits until the slide up animation completes to remove everything.
  */
  Bookmarklet.prototype.remove = function() {
    this.slideUp();
    setTimeout(function() {
      jq$('.bkml-container').remove();
      jq$('.bkml-resource').remove();
      jq$('.global-zeroclipboard-container').remove();
      delete window.viglink_bkml;
    }, 1000);
  } 
  
  // Triggers SlideDown Animation by removing the hidden class
  Bookmarklet.prototype.slideDown = function() {
    jq$('.bkml-container').removeClass("bkml-container-hidden");
  }
  
  // Triggers slide up Animation by removing the hidden class
  Bookmarklet.prototype.slideUp = function() {
    jq$('.bkml-container').addClass("bkml-container-hidden");
  }
  
  
  /*
    Sends data to the API Pixel Controller
    @param {Object} data : data that's not in sendable form but not wrapped by events
  */
  Bookmarklet.prototype.sendLogData = function(data) {
    var logPath = this.routes.log;
        
    jq$.ajax(logPath, {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: "POST",
      data: { events: JSON.stringify(data) },
      success: function() {

      },
      error: function(xhr, textStatus, errorThrown) {

      } 
    });
  }

  
  /*
    Constructor for an AnywhereBkml object. Calls the Bookmarklet constructor
    @param {object} options : an object with data to pass to the Bookmarklet constructor
  */
  function AnywhereBkml(options) {
    this.constructor(options);
  }
  
  // Surrogate Inheritance design pattern to manage classical inheritance of Bookmarklet methods by AnywhereBkml
  function Surrogate() {};
  Surrogate.prototype = Bookmarklet.prototype;
  AnywhereBkml.prototype = new Surrogate();
  
  /* 
    Packages AnywhereBookmarklet log data and then calls the Bookmarklet method for logging it
    @param {Object} data : an object with properties corresponding to relevant data
  */
  AnywhereBkml.prototype.logEvent = function(data) {
    var bkml = this,
        currentUser = jq$('#bkml-campaign-select').val() || window.viglink_default_campaign || null; // null? "unknown" ? ;
    
    var returnData = {
      "bookmarklet" : {
        et: data.type,
        uid: data.user, // || window.viglink_default_userId, make this work
        url: window.location.href
      }  
    };
    
    this.sendLogData(returnData);
  }

  /*
    Grab all initially-required resources once jQuery has been loaded
    Attempts to 1) Load Resources, 2) Grab data for the current user from API, 3) Grab current link data
    1 & 2 must complete before the loadHTML is called. 3 is required to have completed in the next step but not this one.
  */
  AnywhereBkml.prototype.grabResources = function() {
    var userDataPromise = this.grabUserData(),
        resourcesLoadPromise = this.loadResources();
        
    //This doesn't need to resolve until after the first two have
    var linkDataPromise = this.grabLinkData();
    
    var bkml = this;
    jq$.when(userDataPromise, resourcesLoadPromise).then(this.loadHTML.bind(bkml, linkDataPromise)).fail(function() {
      bkml.logEvent({
        type: "Load Failure",
        user: window.viglink_user
      });
      
      alert("Bookmarklet Error: There was a problem accessing our servers. Try again later!");
      bkml.remove();
    })
  }

  
  
/* General Event Flow function */
  
  /* 
    The main event loop for the Bookmarklet
    Takes the data we've loaded and determines which page to display
    @param {Promise} linkDataPromise : the promise from the call to grab data about the current url
    @param {object} userData : the data returned from the API call to get user data
    @param {DOM Partial Object} : the html snippet returned from the html resource load
  */
  AnywhereBkml.prototype.loadHTML = function(linkDataPromise, userData, htmlSnippet) {
    var $bkmlSnippet = jq$(htmlSnippet),
        bkml = this;
      
    if (bkml.isSignedIn(userData)) {
      this.createCampaignHash($bkmlSnippet, userData);
      
      linkDataPromise.done(function(linkData) { // The link data that was grabbed in the last step
        if (bkml.isAffiliatable(linkData)) {
          bkml.logEvent({
            type: "Load Success",
            user: window.viglink_user
          });
          
          bkml.buildSharePageHTML($bkmlSnippet, bkml.campaigns);
          bkml.initializeShareEvents($bkmlSnippet);
      
          bkml.showSharePage($bkmlSnippet);
          bkml.attach($bkmlSnippet);
        } else {
          bkml.logEvent({
            type: "Load NotAff",
            user: window.viglink_user
          });
          
          bkml.initializeNotAffiliatableEvents($bkmlSnippet);
          
          bkml.showNotAffiliatablePage($bkmlSnippet);
          bkml.attach($bkmlSnippet);
        }
      }).fail(function() {
        bkml.logEvent({
          type: "Load Failure",
          user: window.viglink_user
        })
        
        alert("Bookmarklet Error: There was a problem accessing our servers. Try again later!")
      })
    } else { 
      bkml.logEvent({
        type: "Load NotLogged",
        user: window.viglink_user
      });
      
      bkml.initializeLoginEvents($bkmlSnippet, linkDataPromise);
      
      bkml.showLoginPage($bkmlSnippet);
      bkml.attach($bkmlSnippet);
    }
    
    bkml.initializeGeneralEvents($bkmlSnippet);
  }
//end  
  
  
/* Helpers for building up the Share Page */  
  
  
  /*
    Handles the logic of building up and storing data about the user's campaigns
    @param {jQuery Object} $bkmlSnippet : the Bookmarklet $-wrapped HTML snippet
    @param {object} data : userData from API call
  */
  AnywhereBkml.prototype.createCampaignHash = function($bkmlSnippet, data) {
    var userData = data.users,
        bkml = this;
    
    this.campaigns = [];
    
    userData.forEach(function(campaignData) {
      var campaignName = campaignData.name;
      bkml.campaigns.push(campaignName);
      bkml.campaignInfo[campaignName] = bkml.campaignInfo[campaignName] || {};
      bkml.campaignInfo[campaignName]["key"] = campaignData.key;
      bkml.campaignInfo[campaignName]["userId"] = campaignData.id;
    });
  }

  AnywhereBkml.prototype.buildSharePageHTML = function($bkmlSnippet, campaignArr) {
    this.buildCampaignOptions($bkmlSnippet, campaignArr);
    
    var anywhereizedURL = this.getAnywhereizedURL($bkmlSnippet);  
    this.setNewLink($bkmlSnippet, anywhereizedURL);
  }

  AnywhereBkml.prototype.buildCampaignOptions = function($bkmlSnippet, campaignArr) {
    var bkml = this;
    
    $bkmlSnippet.find('#bkml-campaign-select').empty();
    
    campaignArr.forEach(function(campaign) {
      $option = jq$('<option val="' + bkml.campaignInfo[campaign]["key"] + '">' + campaign + '</option>');
      if (campaign === bkml.defaultCampaign) {
        $option.attr('selected', 'selected');
      }
      $bkmlSnippet.find('#bkml-campaign-select').append($option)
    });
  }
// End


/* Link Helpers for Share page */

  /*
    A Helper method for grabbing the current version of the Anywhereized Url for the current page
    @params {jQuery Object} $bkmlSnippet : required to determine the currently selected campaign API key
  */
  AnywhereBkml.prototype.getAnywhereizedURL = function($bkmlSnippet) {
    var currentCampaign = this.selectedCampaignKey($bkmlSnippet);
    var currentKey = this.campaignInfo[currentCampaign]["key"];
    var anywhereizedURL = this.anywhereizeURL(currentKey);

    return anywhereizedURL;
  }
  
  /*
    Returns an anywhereized URL
    @param {String} key : an api key
  */
  AnywhereBkml.prototype.anywhereizeURL = function(key) {
    return "http://redirect.viglink.com?key=" + key + "&type=bk&u=" + encodeURIComponent(window.location.href);
  }
  
  /*
    Whenever the selected campaign (and thus API key) changes, this method handles setting the new redirect URL
    @param {String} anywhereizedURL : the new anywhereized URL to insert
  */
  AnywhereBkml.prototype.setNewLink = function($bkmlSnippet, anywhereizedURL) {
    var $shortenButton = $bkmlSnippet.find('.bkml-link-shorten');
    
    //Remove any data- attributes for old shortened URL data
    $shortenButton.removeData('short');
    
    //Attach the new Long-form URL into the data-long attribute
    this.setShortenButtonAttrs($shortenButton, 'long', anywhereizedURL);
    
    this.insertLinkIntoHTML($bkmlSnippet, anywhereizedURL);
    
  }

  /*
    This handles all HTML specific changes that need to be made when the redirect link changes
    Handles setting the link text box, the clipboard target, twitter and FB link changes
  */
  AnywhereBkml.prototype.insertLinkIntoHTML = function($bkmlSnippet, url) {
    $bkmlSnippet.find('.bkml-link-text').text(url)
    $bkmlSnippet.find('#bkml-clipboard-target').data('clipboard-text', url);
  
    this.formatTwitterLink($bkmlSnippet.find('.bkml-social-tweet'), url);
    this.formatFbLink($bkmlSnippet.find('.bkml-social-fb'), url);
  }
  
  /* 
    Wraps the twitter link changing logic
  */
  AnywhereBkml.prototype.formatTwitterLink = function($el, url) {
    $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
  }  

  /* 
    Wraps the FB link changing logic 
  */
  AnywhereBkml.prototype.formatFbLink = function($el, url) {
    var shareURL = 'https://www.facebook.com/sharer.php?src=bm&v=4&i=1406665647&u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(document.title);
    $el.attr('href', shareURL); 
  }
// End


/* Share Event Helpers */

  AnywhereBkml.prototype.initializeShareEvents = function($bkmlSnippet) {
    var bkml = this;
    
    // Initializes the Clipboard events
    this.initializeClipboard($bkmlSnippet);

    //TODO TEST THESE. NECESSARY?
    $bkmlSnippet.find('.bkml-link-copy').on('click', function(event) {
      event.preventDefault();
    });
    
    $bkmlSnippet.find('.bkml-campaign-form').on('submit', function(event) {
      event.preventDefault();
    });
    
    // Event for the shorten button
    $bkmlSnippet.find('.bkml-link-shorten').on('click', this.handleShortenClick.bind(this, $bkmlSnippet));
    
    // Event handling for when the user changes the selected campaign
    $bkmlSnippet.find('#bkml-campaign-select').on('change', function(event) {
      var anywhereizedURL = bkml.getAnywhereizedURL(jq$('.bkml-container'));
      bkml.setNewLink($bkmlSnippet, anywhereizedURL);
      
      //This is a workaround to avoid having to rewrite the shorten url checking logic. 
      var campaignName = jq$(this).val(),
          shortUrl = bkml.campaignInfo[campaignName]["shortUrl"];
      if (shortUrl) {
        var $shortenButton = $bkmlSnippet.find('.bkml-link-shorten');
        $shortenButton.data('short', shortUrl);
      }
    });
    
    // Logs event when user clicks on a social button link
    $bkmlSnippet.find('.bkml-social-button').on('click', function(event) {
      var type = $(this).data('social');
      bkml.logEvent({
        type: "Share " + type,
        user: bkml.campaignInfo[bkml.selectedCampaignKey($bkmlSnippet)]["userId"]
      });
    });
  }

  /*
    Handles when the user clicks on the shorten button.
    Sets text of button, stores the new and old urls in data- attributes, sets spinner, and sets relevant html for the new url
  */
  AnywhereBkml.prototype.handleShortenClick = function($bkmlSnippet, event) {
    var $linkText = $bkmlSnippet.find('.bkml-link-text'),
        $shortenButton = $bkmlSnippet.find('.bkml-link-shorten'),
        spinnerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>',
        bkml = this;
        
    if ($shortenButton.data('active') === 'long' && !$shortenButton.data('short')) {
      $shortenButton.html(spinnerHTML);
      
      var bitlyPromise = this.grabBitlyData($shortenButton.data('long'));
      
      bitlyPromise.done(function(response) {
        // Ensure we don't have a duplicate request coming in and we have a valid response
        if (!($shortenButton.data('active') === 'short') && response.data && response.data.url) {
          var shortenedUrl = response.data.url;
          bkml.setShortenButtonAttrs($shortenButton, 'short', shortenedUrl);
          bkml.insertLinkIntoHTML($bkmlSnippet, shortenedUrl);
          
          var currentCampaign = bkml.selectedCampaignKey($bkmlSnippet);
          bkml.campaignInfo[currentCampaign]["shortUrl"] = shortenedUrl;
        }
      }).always(function() {
        if ($shortenButton.html() === spinnerHTML) {
          bkml.setShortenButtonAttrs($shortenButton, 'long', $shortenButton.data('long'));
        }
      });
      
    } else if ($shortenButton.data('active') === 'short') {
      this.setShortenButtonAttrs($shortenButton, 'long', $shortenButton.data('long'));
      this.insertLinkIntoHTML($bkmlSnippet, $shortenButton.data('long'));
    } else {
      this.setShortenButtonAttrs($shortenButton, 'short', $shortenButton.data('short'));
      this.insertLinkIntoHTML($bkmlSnippet, $shortenButton.data('short'));
    }
  
  }
  
  /* 
    A helper for setting the text and data- attributes for the shorten button
  */
  AnywhereBkml.prototype.setShortenButtonAttrs = function($shortenButton, active, url) {
    $shortenButton.data('active', active);
    
    if (active === 'short') {
      $shortenButton.data('short', url).text('Lengthen');
    } else if (active === 'long') {
      $shortenButton.data('long', url).text('Shorten');
    } else {
      $shortenButton.text('Not a valid campaign');
    }
  }
  
  /*
    Initializes the keyboard, binds it to the keyboard copy button, and has handlers for flash load error
  */
  AnywhereBkml.prototype.initializeClipboard = function($bkmlSnippet) {    
    var bkml = this,
        $copyButton = $bkmlSnippet.find('.bkml-link-copy');
    
    window.ZeroClipboard.config({
      swfPath: this.routes.flashSwf,
      trustedDomains: [window.location.protocol + "//" + window.location.host],
      containerId: "global-zeroclipboard-html-bridge-VL",
      swfObjectId: "global-zeroclipboard-flash-bridge-VL"
    });
    
    var clipboard = new window.ZeroClipboard($bkmlSnippet.find('#bkml-clipboard-target'));
    
    clipboard.on('ready', function(readyEvent) {
      clipboard.on( "copy", function (event) {
        var clipboard = event.clipboardData;
        clipboard.setData( "text/plain", jq$('#bkml-clipboard-target').data('clipboard-text'));
      });
        
      clipboard.on('aftercopy', function(event) {
        bkml.logEvent({
          type: "Copy Auto",
          user: bkml.campaignInfo[bkml.selectedCampaignKey($bkmlSnippet)]["userId"]
        });
        alert("Formatted URL has been copied!"); // Keep this? 
      });
    });
    
    // Dealing with flash problems
    clipboard.on('error', bkml.initializeAlternateCopyHandlers.bind(bkml, $copyButton));
  }
//End

  AnywhereBkml.prototype.initializeAlternateCopyHandlers = function($copyButton, error) {
    var bkml = this;
    
    $copyButton.unbind('click');
    $copyButton.on('click', function() {
      bkml.logEvent({
        type: "Copy Manual",
        user: bkml.campaignInfo[bkml.selectedCampaignKey($bkmlSnippet)]["userId"]
      });
      
      var currentLink = $copyButton.data('clipboard-text');
      window.prompt("Clipboard Error: " + error.message + "\n\nPress Ctrl + C to copy link manually.", currentLink);
    })
  }


/* Login Page events */
  AnywhereBkml.prototype.initializeLoginEvents = function($bkmlSnippet, linkDataPromise) {
    var bkml = this;
    
    $bkmlSnippet.find('#bkml-reload-button').on('click', function() {
      var $reload = jq$(this),
          oldHTML = $reload.html(),
          spinnerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="position: absolute; right: 21px; top: 13px;"></i>';
      
      $reload.off('click').html($reload.html() + spinnerHTML);
      
      var userDataPromise = bkml.grabUserData();  
      userDataPromise.done(function(userData) {
        $reload.html(oldHTML);
        bkml.loadHTML(linkDataPromise, userData, $bkmlSnippet); //Re-insert ourselves into event flow with new user data
      })
    });
  }
/* Login End

/* Not affiliatable events */
  
  AnywhereBkml.prototype.initializeNotAffiliatableEvents = function($bkmlSnippet) {
    var bkml = this;
    
    $bkmlSnippet.find('#bkml-close-button').on('click', function() {
      bkml.remove();
    });
  }

/* General Events */
  
  AnywhereBkml.prototype.initializeGeneralEvents = function($bkmlSnippet) {
    var bkml = this;
    
    $bkmlSnippet.find('.bkml-dismiss').on('click', function() {
      bkml.remove();
    })
    
    setTimeout(function() {
      bkml.slideDown();  
    }, 10)
  }
/* General End */
  
  
/* Page load helpers */
  AnywhereBkml.prototype.showSharePage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-share-page').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-page').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-page').css('display', 'none');
  }
  
  AnywhereBkml.prototype.showLoginPage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-login-page').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-share-page').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-page').css('display', 'none');
  }
  
  AnywhereBkml.prototype.showNotAffiliatablePage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-notaff-page').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-page').css('display', 'none');
    $bkmlSnippet.find('.bkml-share-page').css('display', 'none');
  }
//End
  
/* Begin Data Grabbing functions */

  AnywhereBkml.prototype.grabLinkData = function() {
    //TODO: Figure out how to implement a test key?
    var testKey = '9cb01deed662e8c71059a9ee9a024d30',
        out = encodeURIComponent(window.location.href),
        format = "jsonp",
        callbackParam = 'jsonp';
  
    var linkURL = this.routes.linkData + "?out=" + out + "&format=" + format + "&key=" + testKey + "&optimize=false";
    var linkDataPromise = this.callJsonpAPI(linkURL, callbackParam);

    return linkDataPromise;
  }

  AnywhereBkml.prototype.grabUserData = function() {
    var callbackParam = "callback";
      
    var userDataPromise = this.callJsonpAPI(this.routes.userData, callbackParam);
  
    return userDataPromise;
  }

  AnywhereBkml.prototype.grabBitlyData = function(url) {
        bitlyAPI = this.routes.bitly + '&longUrl=' + encodeURIComponent(url),
        callback = 'callback';
      
    var bitlyPromise = this.callJsonpAPI(bitlyAPI, callback);
    return bitlyPromise;
  }
// End  
    
/* Begin general helper functions */
  
    AnywhereBkml.prototype.isSignedIn = function(userData) {
      return !!userData.users;
    }
    
    AnywhereBkml.prototype.isAffiliatable = function(linkData) {
      return !!linkData.affiliatable;
    }
    
    AnywhereBkml.prototype.selectedCampaignKey = function($bkmlSnippet) {
      return $bkmlSnippet.find('#bkml-campaign-select').val();
    }
// End
  
/* 
    Code Initialization
*/


  
  
  var bkmlOptions = {};
  
  if (window.viglink_default_campaign) {
    bkmlOptions.defaultCampaign = unescape(window.viglink_default_campaign);
  }

  anywhereBkml = window.viglink_bkml = new AnywhereBkml(bkmlOptions);
  
  anywhereBkml.loadJQuery(anywhereBkml.grabResources.bind(anywhereBkml)); // This starts us off


})();
