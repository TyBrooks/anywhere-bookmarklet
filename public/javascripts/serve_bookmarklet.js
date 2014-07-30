$(function() {
  var dev = true,
      code_src,
      users_api;
  if (dev) {
    code_src = 'http://localhost:3000/javascripts/bookmarklet.js'
    users_api = 'http://localhost:3000/account/users'
  } else {
    code_src = 'http://anywhere-bookmarklet.herokuapp.com/javascripts/bookmarklet.js'
    users_api = 'http://anywhere-bookmarklet.herokuapp.com/account/users'
  }
  
  var defaultCampaign = null;
  
  $('.bookmarklet-link').attr('href', "javascript:(function() {if(!window.viglink_bkml){var scriptElem= document.createElement('script');scriptElem.className= 'bkml-resource';scriptElem.src='" +  code_src + "';document.body.appendChild(scriptElem);window.viglink_default_campaign = '" + defaultCampaign + "';}})();");
  
  $('#default-campaign-selector').on('change', function(event) {
    defaultCampaign = $(this).val();
    $('.bookmarklet-link').text("VL Anywhere Bookmarklet - " + defaultCampaign);
    $('.bookmarklet-link').attr('href', "javascript:(function() {if(!window.viglink_bkml){var scriptElem= document.createElement('script');scriptElem.className= 'bkml-resource';scriptElem.src='" +  code_src + "';document.body.appendChild(scriptElem);window.viglink_default_campaign = '" + defaultCampaign + "';}})();");
  });
  
  $.getJSON(users_api, function(campaignList) {
    $opt = $('<option value="null">None Selected</option>');
    $('#default-campaign-selector').append($opt);
    
    campaignList.users.forEach(function(campaign) {
      $opt = $('<option>').text(campaign.name).val(campaign.name);
      $('#default-campaign-selector').append($opt);
    })
  });
  
  
  
  
  
})
