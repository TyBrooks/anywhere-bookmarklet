//TODO: Deal with if default_campaign has " in campaign name...

$(function() {
  function bookmarkletCode(options) {
    var user = options.user,
        campaign = options.campaign;
      
    var campaignString = campaign ? "window.viglink_default_campaign=\"" + campaign + "\";" : "",
        userString = user ? "window.viglink_user='" + user +"';" : "";    
      
    var string = "javascript:(function(){if(!window.viglink_bkml)" +
                  "{var e=document.createElement('script');e.className='bkml-resource';" +
                  "e.src='" +  code_src + "';document.body.appendChild(e);"
                  + campaignString + userString + "}})()"
                
                
    return string;
  }
  
  var localhost = (true) ? "//localhost:3000" : "//10.0.2.2:3000"
  
  var dev = true,
      code_src,
      users_api;
  if (dev) {
    code_src = localhost + '/javascripts/bookmarklet.js';
  } else {
    code_src = 'http://anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js';
  }
  
  var defaultCampaign = null,
      defaultUser,
      campaignIds = {};
  
  
  $('.bookmarklet-link').attr('href', "#");
  
  var users_api = 'http://www.viglink.com/account/users?callback=usersData'
  
  var $opt = $('<option value="null">None</option>');
  $('#default-campaign-selector').append($opt);
  
  $.ajax(users_api, {
    dataType: 'jsonp',
    jsonpCallback: "usersData",
    success: function(campaignList) {
      campaignList.users && campaignList.users.forEach(function(campaign) { // Failure is still interpreted as success
        $opt = $('<option>').text(campaign.name).val(campaign.name);
        $('#default-campaign-selector').append($opt);
        
        campaignIds[campaign.name] = campaign.id;
        defaultUser = defaultUser || campaign.id;
      });
      
      $('.bookmarklet-link').text("VL Anywhere Bookmarklet").attr("href", bookmarkletCode({ "user" : defaultUser}));
    }
  });
  
  $('#default-campaign-selector').on('change', function(event) {
    var defaultCampaign = $(this).val(),
    formattedDefaultCampaign = defaultCampaign.replace(/[\"\']/g, function(quote) {
      return "\\" + quote;
    });
    
    if (defaultCampaign !== "null") {
      $('.bookmarklet-link').text("VL Anywhere Bookmarklet - " + defaultCampaign);
      $('.bookmarklet-link').attr('href', bookmarkletCode({ "campaign" : formattedDefaultCampaign, "user" : campaignIds[defaultCampaign] }));
    } else {
      $('.bookmarklet-link').text("VL Anywhere Bookmarklet");
      $('.bookmarklet-link').attr('href', bookmarkletCode({ "user" : defaultUser }));
    }
    
  });
  
  
})
