$(function() {
  function bookmarkletCode(options) {
    var user = options.user,
        campaign = options.campaign;
      
    var campaignString = campaign ? "window.viglink_default_campaign=\"" + campaign + "\";" : "",
        userString = user ? "window.viglink_user='" + user +"';" : "";    
      
    var string = "javascript:(function(){if(!window.viglink_bkml)" +
                  "{var e=document.createElement('script');e.className='bkml-resource';" +
                  "e.src='" +  bookmarklet_javascript_path + "';document.body.appendChild(e);"
                  + campaignString + userString + "}})()"
                
                
    return string;
  }
  
  /*
    Setup the drop down to an initial "None" option.
    Users will still be able to select None, even after user data has loaded.
  */
  function setupPreLoadCampaignOptions() {
    $('.bookmarklet-link').attr('href', "#");
    
    var $opt = $('<option value="null">None</option>');
    $('#default-campaign-selector').append($opt);
  }
  
  /*
    Process data from Users Ajax call and add all campaigns to the drop-down menu.
    Save all user Ids in an options hash so we can have a default user id
  */
  function addUserDataToCampaignOptions(campaignList) {
    campaignList.users && campaignList.users.forEach(function(campaign) { // Failure is still interpreted as success
      $opt = $('<option>').text(campaign.name).val(campaign.name);
      $('#default-campaign-selector').append($opt);
      
      campaignInfo[campaign.name] = campaign.id;
      defaultUser = defaultUser || campaign.id;
    });
    
    $('.bookmarklet-link').text("VL Anywhere Bookmarklet").attr("href", bookmarkletCode({ "user" : defaultUser}));
  }
  
  /*
    Triggered when a user changes the default campaign.
    Replace the old href on the Anywhere badge to reflect the new default
  */
  function changeDefaultCampaign(event) {
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
  }
  
  var bookmarklet_javascript_root = '//localhost:3000';
  //var bookmarklet_javascript_root = '//10.0.2.2:3000';
  //var bookmarklet_javascript_root = '//cdn.viglink.com';
  //var bookmarklet_javascript_root = '//anywhere-bookmarklet.herokuapp.com';
  
  var bookmarklet_javascript_path = bookmarklet_javascript_root + '/bookmarklet/api/bookmarklet.js',
      users_api = 'http://www.viglink.com/account/users?callback=usersData',
      campaignIds = {},
      defaultUser;
      
  setupPreLoadCampaignOptions();
      
  $.ajax(users_api, {
    dataType: 'jsonp',
    jsonpCallback: "usersData",
    success: addUserDataToCampaignOptions
  });
  
  $('#default-campaign-selector').on('change', changeDefaultCampaign);
})