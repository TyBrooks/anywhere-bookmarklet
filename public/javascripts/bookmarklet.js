//TODO: 1. Refactor Ajax error callback out
//TODO: 2. Figure out what the hell is wrong with the variable scoping here... 
//TODO: 3. Get rid of !important css tags from clipboard button
//TODO  4. Make the mouse a pointer over the shorten button
//TODO 5. Fix order load importance in html? (maybe)



(function() {
  
  var dev = true;
  var serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';
  
  function Bookmarklet(options) {
    var dev = true;
  
    this.resources = options.resources || [];
    this.campaigns = [];
    this.campaignKeys = Object.create(null); // IE compatibility issue
    this.serverDomain = dev ? 'http://localhost:3000' : 'http://anywhere-bookmarklet.herokuapp.com';
    this.defaultCampaign = options.defaultCampaign || null;
  }

  /*
    NOTE: Apparently we can't actually trust that our site has already loaded a useable version of jQuery
    Amazon has some sort of customized jQuery library that uses window.jQuery but doesn't provide the functionality we need.
  */
  Bookmarklet.prototype.loadJQuery = function(callback) {
    var scriptElem = document.createElement("script");
    scriptElem.className = 'bkml-resource';
    
    scriptElem.src = this.serverDomain + "/javascripts/vendor/jquery-1.11.1.js";
    scriptElem.onload = scriptElem.onreadystatechange = function() {
      if (!this.readyState || (this.readyState === "complete" || this.readyState === "loaded") ) {
        // Ensure we're not stepping on anyone's feet. Return the $ to it's past owner once the library has loaded and
        // return window.jQuery to it's past value. We'll use the window.js$
        jq$ = window.jq$ = window.jQuery.noConflict(true);
        callback();  
      }
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
      },
      timeout: 3000,
      attempts: 0,
      attemptLimit: 2,
      error: function(xhr, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
          this.attempts += 1;
          if (this.attempts <= this.attemptsLimit) {
            $.ajax(this);
            return;
          } else {
            promise.reject(xhr, textStatus, errorThrown);
          }
        } else {
          promise.reject(xhr, textStatus, errorThrown);
        }
      }
    });
  
    return promise;
  }
  
  Bookmarklet.prototype.callJsonpAPI = function(url, callbackName) {
    var promise = jq$.Deferred();
    
    jq$.ajax(url, {
      dataType: 'jsonp',
      success: function(data) {
        promise.resolve(data);
      },
      jsonpCallback: callbackName,
      timeout: 3000,
      attempts: 0,
      attemptLimit: 2,
      error: function(xhr, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
          this.attempts += 1;
          if (this.attempts <= this.attemptsLimit) {
            $.ajax(this);
            return;
          } else {
            promise.reject(xhr, textStatus, errorThrown);
          }
        } else {
          promise.reject(xhr, textStatus, errorThrown);
        }
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
    }).fail(function(xhr, textStatus, errorThrown) {
      alert('Bookmarklet Error: There was an error loading the required resources');
      console.log("Bookmarklet Error: " + textStatus);
      console.log(xhr); //Include this?
      window.viglink_bkml.remove();
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
      },
      timeout: 1500,
      attempts: 0,
      attemptLimit: 2,
      error: function(xhr, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
          this.attempts += 1;
          if (this.attempts <= this.attemptsLimit) {
            $.ajax(this);
            return;
          } else {
            // alert('Bookmarklet Error: Failed to load HTML resource from ' + url);
            htmlPromise.reject(xhr, textStatus, errorThrown);
          }
        } else {
          htmlPromise.reject(xhr, textStatus, errorThrown);
          // if (xhr.status == 500) {
//             alert('Bookmarklet Error: Internal Server Error');
//           } else {
//             alert('Bookmarklet Error: Unknown Error');
//           }
        }
      }
    });
  
    return htmlPromise; 
  }

  // Returns a promise when the resource is loaded
  Bookmarklet.prototype.loadCSSResource = function(url) {
    var cssPromise = jq$.Deferred();
    
    $style = jq$('<link></link>').addClass('bkml-resource').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', url);
    jq$('head').append($style);
    
    //TODO: use setInterval to try and reload the CSS in case of a timeout
    $style.on('load', function() {
      cssPromise.resolve();
    })
  
    return cssPromise;
  }

  // Returns a promise when the resource is loaded
  Bookmarklet.prototype.loadJSResource = function(url) {
    var jsPromise = jq$.Deferred();
    
    //Using jQuery to avoid compatibility issues with older IE not handling script.onready well
    jq$.ajax({
      url: url,
      dataType: "script",
      success: function() {
        jsPromise.resolve();
      },
      timeout: 1500,
      attempts: 0,
      attemptLimit: 2,
      error: function(xhr, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
          this.attempts += 1;
          if (this.attempts <= this.attemptsLimit) {
            $.ajax(this);
            return;
          } else {
            jsPromise.reject(xhr, textStatus, errorThrown);
          }
        } else {
          jsPromise.reject(xhr, textStatus, errorThrown);
        }
      }
    });
    
    return jsPromise;
  }

  Bookmarklet.prototype.attach = function($bkml) {
    jq$('body').append($bkml);
  }

  Bookmarklet.prototype.remove = function() {
    jq$('.bkml-container').remove();
    jq$('.bkml-resource').remove();
    jq$('.global-zeroclipboard-container').remove();
    delete window.viglink_bkml;
  } 

/* 
    AnywhereBkml Methods 
*/
  
  function AnywhereBkml(options) {
    this.constructor(options);
  }
  
  function Surrogate() {};
  Surrogate.prototype = Bookmarklet.prototype;
  AnywhereBkml.prototype = new Surrogate();


/* Load VLA specific resources */
    
  AnywhereBkml.prototype.grabResources = function() {
    var bkml = this;
    
    var userDataPromise = this.grabUserData();
    var resourcesLoadPromise = this.loadResources();
    //This doesn't need to resolve until after the first two have
    var linkDataPromise = this.grabLinkData();
    
    jq$.when(userDataPromise, resourcesLoadPromise).then(this.loadHTML.bind(bkml, linkDataPromise)).fail(function() {
      alert("Bookmarklet Error: There was a problem accessing our servers. Try again later!");
      bkml.remove();
    })
  }
//end  
  
  
/* General Event Flow function */
  
  AnywhereBkml.prototype.loadHTML = function(linkDataPromise, userData, htmlSnippet) {
    var $bkmlSnippet = jq$(htmlSnippet),
        bkml = this;
      
    if (bkml.isSignedIn(userData)) {
      this.createCampaignHash($bkmlSnippet, userData);
      
      //This call is made at the same time as resources load and user data grab
      linkDataPromise.done(function(linkData) {
        if (bkml.isAffiliatable(linkData)) {
          bkml.buildSharePageHTML($bkmlSnippet, bkml.campaigns);
          bkml.initializeShareEvents($bkmlSnippet);
      
          bkml.showSharePage($bkmlSnippet);
          bkml.attach($bkmlSnippet);
        } else {
          bkml.initializeNotAffiliatableEvents($bkmlSnippet);
          
          bkml.showNotAffiliatablePage($bkmlSnippet);
          bkml.attach($bkmlSnippet);
        }
      }).fail(function() {
        alert("Bookmarklet Error: There was a problem accessing our servers. Try again later!")
      })
    } else {
      bkml.initializeLoginEvents($bkmlSnippet, linkDataPromise);
      
      bkml.showLoginPage($bkmlSnippet);
      bkml.attach($bkmlSnippet);
    }
    
    bkml.initializeGeneralEvents($bkmlSnippet);
  }
//end  
  
  
/* Helpers for building up the Share Page */  
  
  AnywhereBkml.prototype.createCampaignHash = function($bkmlSnippet, data) {
    var userData = data.users;
    var that = this;
    this.campaigns = [];
    this.campaignKeys = Object.create(null);
    
    userData.forEach(function(campaignData) {
      that.campaigns.push(campaignData.name);
      that.campaignKeys[campaignData.name] = campaignData.key;
    });
    
    if (this.campaigns.length > 10) {
      $bkmlSnippet.find('.bkml-campaign-filter-container').css({ "display": "block" });
    }
  }

  AnywhereBkml.prototype.buildSharePageHTML = function($bkmlSnippet, campaignArr) {
    this.buildCampaignOptions($bkmlSnippet, campaignArr);
    
    var anywhereizedURL = this.getAnywhereizedURL($bkmlSnippet);  
    this.setNewLink($bkmlSnippet, anywhereizedURL);
  }

  AnywhereBkml.prototype.buildCampaignOptions = function($bkmlSnippet, campaignArr) {
    $bkmlSnippet.find('#bkml-campaign-select').empty();
    var bkml = this;
    
    campaignArr.forEach(function(campaign) {
      $option = jq$('<option val="' + bkml.campaignKeys[campaign] + '">' + campaign + '</option>');
      if (campaign === bkml.defaultCampaign) {
        $option.attr('selected', 'selected');
      }
      $bkmlSnippet.find('#bkml-campaign-select').append($option)
    });
  }
// End


/* Link Helpers for Share page */

  AnywhereBkml.prototype.getAnywhereizedURL = function($bkmlSnippet) {
    // Build anywhereized URL
    var currentCampaign = $bkmlSnippet.find('#bkml-campaign-select').val();
    var currentKey = this.campaignKeys[currentCampaign];
    var anywhereizedURL = this.anywhereizeURL(currentKey)

    return anywhereizedURL;
  }

  AnywhereBkml.prototype.anywhereizeURL = function(key) {
    return "http://redirect.viglink.com?key=" + key + "&u=" + encodeURIComponent(window.location.href);
  }

  AnywhereBkml.prototype.setNewLink = function($bkmlSnippet, anywhereizedURL) {
    this.insertLinkIntoHTML($bkmlSnippet, anywhereizedURL);
    $bkmlSnippet.find('.bkml-link-text').data('long', anywhereizedURL).data('active', 'long').removeData('short');
  }

  AnywhereBkml.prototype.insertLinkIntoHTML = function($bkmlSnippet, url) {
    $bkmlSnippet.find('.bkml-link-text').text(url)
    $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text', url);
  
    this.formatTwitterLink($bkmlSnippet.find('.bkml-social-tweet'), url);
    this.formatFbLink($bkmlSnippet.find('.bkml-social-fb'), url);
  }

  AnywhereBkml.prototype.formatTwitterLink = function($el, url) {
    $el.attr('href', 'https://twitter.com/share?url=' + encodeURIComponent(url))
  }  

  AnywhereBkml.prototype.formatFbLink = function($el, url) {
    var shareURL = 'https://www.facebook.com/sharer.php?src=bm&v=4&i=1406665647&u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(document.title);
    $el.attr('href', shareURL); 
  }
// End


/* Share Event Helpers */

  AnywhereBkml.prototype.initializeShareEvents = function($bkmlSnippet) {
    this.initializeClipboard($bkmlSnippet);

    $bkmlSnippet.find('.bkml-link-copy').on('click', function(event) {
      event.preventDefault();
    });

    $bkmlSnippet.find('.bkml-link-shorten').on('click', this.handleShortenClick.bind(this, $bkmlSnippet));
    
    // Handling when the user changes the campaign selection
    
    var bkml = this;
    $bkmlSnippet.find('#bkml-campaign-select').on('change', function(event) {
      var anywhereizedURL = bkml.getAnywhereizedURL(jq$('.bkml-container'));
      bkml.setNewLink($bkmlSnippet, anywhereizedURL);
    });
    
    $bkmlSnippet.find('#bkml-campaign-filter').on('change', function(event) {
      var input = $(this).val();
      
      var matchingCampaigns = bkml.campaigns.filter(function(campaign) {
        return (campaign.indexOf(input) !== -1);
      });
      
      bkml.buildCampaignOptions($bkmlSnippet, matchingCampaigns);
      $bkmlSnippet.find('#bkml-campaign-select').trigger('change');
    });
    
    $bkmlSnippet.find('.bkml-campaign-form').on('submit', function(event) {
      event.preventDefault();
    });
  }

  AnywhereBkml.prototype.handleShortenClick = function($bkmlSnippet, event) {
    $linkText = $bkmlSnippet.find('.bkml-link-text');
    if ($linkText.data('active') === 'short') {
      this.insertLinkIntoHTML($bkmlSnippet, $linkText.data('long'));
      $linkText.data('active', 'long');
      $bkmlSnippet.find('.bkml-link-shorten').text('Shorten');
    } else if ($linkText.data('active') === 'long' && $linkText.data('short') ) {
      this.insertLinkIntoHTML($bkmlSnippet, $linkText.data('short'));
      $linkText.data('active', 'short');
      $bkmlSnippet.find('.bkml-link-shorten').text('Lengthen');
    } else {
      var bitlyAPI = 'https://api-ssl.bitly.com/v3/shorten?ACCESS_TOKEN=' + 'a2dde94fc7b3fc05e7a1dfc24d8d68840f013793' + '&longUrl=' + encodeURIComponent($linkText.data('long'));
      var bitlyPromise = window.viglink_bkml.callJsonAPI(bitlyAPI);
      
      spinnerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
      $bkmlSnippet.find('.bkml-link-shorten').html(spinnerHTML);
      
      var bkml = this;
      bitlyPromise.done(function(response) {
        if (!($linkText.data('active') === 'short') && !$linkText.data('short') ) { // make sure two ajax requests don't conflict
          if (response.data && response.data.url) {
            var newURL = response.data.url;
            bkml.insertLinkIntoHTML($bkmlSnippet, newURL);
            $linkText.data('active', 'short').data('short', newURL);
            $bkmlSnippet.find('.bkml-link-shorten').text('Lengthen');
          }
        }
      }).fail(function() {
        $bkmlSnippet.find('.bkml-link-shorten').text("Shorten");
      })
    }
  }

  AnywhereBkml.prototype.initializeClipboard = function($bkmlSnippet) {    
    var ZeroClipboard = window.ZeroClipboard;
    
    ZeroClipboard.config({
      moviePath: this.serverDomain + '/swf/ZeroClipboardv1.swf',
      swfPath: this.serverDomain + '/swf/ZeroClipboardv1.swf',
      trustedOrigins: [window.location.protocol + "//" + window.location.host],
      allowScriptAccess: 'always'
    });
    
    var clipboard = new ZeroClipboard($bkmlSnippet.find('#clipboard-target'));

    clipboard.on('load', function(readyEvent) {

      clipboard.on( "dataRequested", function (event) {
        clipboard.setText( jq$('#clipboard-target').data('clipboard-text' ) );
      });
  
      clipboard.on('complete', function(event, args) {
        alert("Formatted URL has been copied!"); // Keep this? 
      });
  
    });
    
    // Dealing with flash problems
    clipboard.on('noflash', function() {
      $copyButton = $bkmlSnippet.find('.bkml-link-copy');
      
      $copyButton.unbind('click');
      $copyButton.on('click', function() {
        var currentLink = $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text');
        window.prompt("Clipboard Error: No Adobe Flash detected. \n\nPress Ctrl + C to copy link manually.", currentLink);
      })
    })
    
    clipboard.on('wrongflash', function() {
      $copyButton = $bkmlSnippet.find('.bkml-link-copy');
      
      $copyButton.unbind('click');
      $copyButton.on('click', function() {
        var currentLink = $bkmlSnippet.find('.bkml-link-copy').data('clipboard-text');
        window.prompt("Clipboard Error: Your Adobe Flash is out of date. \n\nPress Ctrl + C to copy link manually.", currentLink);
      })
    })
  }
//End


/* Login Page events */
  AnywhereBkml.prototype.initializeLoginEvents = function($bkmlSnippet, linkDataPromise) {
    var bkml = this;
    
    $bkmlSnippet.find('.bkml-redirect-done').on('click', function() {
      var $reload = jq$(this);
      $reload.off('click');
      
      spinnerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
      var oldVal = $reload.html();
      $reload.html(spinnerHTML);
      
      var userDataPromise = bkml.callJsonAPI(bkml.serverDomain + '/account/users');  
      userDataPromise.done(function(userData) {
        $reload.html(oldVal);
        bkml.loadHTML(linkDataPromise, userData, $bkmlSnippet); //Re-insert ourselves into event flow with new user data
      })
    });
  }
/* Login End

/* Not affiliatable events */
  
  AnywhereBkml.prototype.initializeNotAffiliatableEvents = function($bkmlSnippet) {
    var bkml = this;
    
    $bkmlSnippet.find('.bkml-notaff-close').on('click', function() {
      bkml.remove();
    });
  }

/* General Events */
  
  AnywhereBkml.prototype.initializeGeneralEvents = function($bkmlSnippet) {
    var bkml = this;
    
    $bkmlSnippet.find('.bkml-dismiss').on('click', function() {
      bkml.remove();
    })
  }
/* General End */
  
  
/* Page load helpers */
  AnywhereBkml.prototype.showSharePage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-share-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'none');
  }
  
  AnywhereBkml.prototype.showLoginPage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-login-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-share-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'none');
  }
  
  AnywhereBkml.prototype.showNotAffiliatablePage = function($bkmlSnippet) {
    $bkmlSnippet.find('.bkml-notaff-container').css('display', 'inline-block');
    $bkmlSnippet.find('.bkml-login-container').css('display', 'none');
    $bkmlSnippet.find('.bkml-share-container').css('display', 'none');
  }
//End
  
  
/* Begin general helper functions */
  
    AnywhereBkml.prototype.isSignedIn = function(userData) {
      return !!userData.users;
    }
    
    AnywhereBkml.prototype.isAffiliatable = function(linkData) {
      return !!linkData.affiliatable;
    }
    
    AnywhereBkml.prototype.grabLinkData = function() {
      //TODO: Figure out how to implement a test key?
      var testKey = '9cb01deed662e8c71059a9ee9a024d30',
          rootUrl = 'http://api.viglink.com/api/link',
          out = encodeURIComponent(window.location.href),
          format = "jsonp",
          jsonp = 'linkData';
      
      var linkURL = rootUrl + "?out=" + out + "&format=" + format + "&key=" + testKey + "&jsonp=" + jsonp + "&optimize=false";
      var linkDataPromise = this.callJsonpAPI(linkURL, jsonp); 
    
      return linkDataPromise;
    }
    
    AnywhereBkml.prototype.grabUserData = function() {
      var rootUrl = "http://www.viglink.com/account/users",
          callback = "userData";
          
      var userURL = rootUrl + "?callback=" + callback;
      var userDataPromise = this.callJsonpAPI(userURL, callback);
      
      return userDataPromise;
    }

// End
  
/* 
    Code Initialization
*/


  //ORDER MATTERS : The HTML snippet has to be first
  var resources = [
    [serverDomain + '/bookmarklet', 'html'],
    [serverDomain + '/javascripts/vendor/ZeroClipboardv1-VL.js', "js"],
    [serverDomain + '/stylesheets/bookmarklet.css', "css"],
    // Have to host Font Awesome from the CDN for firefox for some reason
    ['//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', 'css']
  ];
  
  var bkmlOptions = {
    resources: resources
  }
  
  if (window.viglink_default_campaign) {
    bkmlOptions.defaultCampaign = unescape(window.viglink_default_campaign);
  }

  anywhereBkml = window.viglink_bkml = new AnywhereBkml(bkmlOptions);
  
  anywhereBkml.loadJQuery(anywhereBkml.grabResources.bind(anywhereBkml)); // This starts us off


})();
