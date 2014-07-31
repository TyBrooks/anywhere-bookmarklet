//TODO: Deal with if default_campaign has " in campaign name...

$(function() {
  var dev = true,
      code_src,
      users_api;
  if (dev) {
    code_src = 'http://localhost:3000/javascripts/bookmarklet.js'
  } else {
    code_src = 'http://anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js'
  }
  
  var defaultCampaign = null;
  
  $('.bookmarklet-link').attr('href', "javascript:(function() {if(!window.viglink_bkml){var scriptElem= document.createElement('script');scriptElem.className= 'bkml-resource';scriptElem.src='" +  code_src + "';document.body.appendChild(scriptElem);}void 0;})();");
  
  var users_api = 'http://www.viglink.com/account/users?callback=usersData'
  
  var $opt = $('<option value="null">None</option>');
  $('#default-campaign-selector').append($opt);
  
  $.ajax(users_api, {
    dataType: 'jsonp',
    jsonpCallback: "usersData",
    success: function(campaignList) {
      campaignList.users.forEach(function(campaign) {
        $opt = $('<option>').text(campaign.name).val(campaign.name);
        $('#default-campaign-selector').append($opt);
      });
    }
  });
  
  $('#default-campaign-selector').on('change', function(event) {
    defaultCampaign = $(this).val();
    defaultCampaign = defaultCampaign.replace(/[\"\']/g, function(quote) {
      return "\\" + quote;
    });
    
    if (defaultCampaign !== "null") {
      $('.bookmarklet-link').text("VL Anywhere Bookmarklet - " + defaultCampaign);
      $('.bookmarklet-link').attr('href', "javascript:(function(){if(!window.viglink_bkml){var e=document.createElement('script');e.className='bkml-resource';e.src='" +  code_src + "';document.body.appendChild(e);window.viglink_default_campaign=\"" + defaultCampaign + "\"}void 0;})()");
    } else {
      $('.bookmarklet-link').text("VL Anywhere Bookmarklet");
      $('.bookmarklet-link').attr('href', "javascript:(function() {if(!window.viglink_bkml){var scriptElem= document.createElement('script');scriptElem.className= 'bkml-resource';scriptElem.src='" +  code_src + "';document.body.appendChild(scriptElem);}void 0;})();");
    }
    
  });
  
  
  
  
  
})
