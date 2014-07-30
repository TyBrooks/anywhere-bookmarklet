(function(){
  // USER SPECIFIC BKMLT KEY GOES HERE
  window.viglink_bkml = window.viglink_bkml || { key : '', initialized: false }
              
  if (!window.viglink_bkml.initialized) {
    document.body.appendChild(document.createElement('script')).src='/javascripts/loader.js';
    window.viglink_bkml.initialized = true;
  }
})();



(function(){
  window.viglink_bkml = window.viglink_bkml || { key : '" + userAPI + "', initialized: false };
  if(!window.viglink_bkml.initialized) {
    document.body.appendChild(document.createElement('script')).src= '" + code_src + "'; 
  }
})();


(function() {
  if (!window.viglink_bkml) {
    var scriptElem = document.createElement('script');
    scriptElem.className = 'bkml-resource';
    scriptElem.src='" +  code_src + "'; 
    document.body.appendChild(scriptElem);
    window.viglink_default_campaign = ' defaultCampaign '
  }
})();

"(function() {if(!window.viglink_bkml){var scriptElem= document.createElement('script');scriptElem.className= 'bkml-resource';scriptElem.src='" +  code_src + "';document.body.appendChild(scriptElem);window.viglink_default_campaign = '" + defaultCampaign + "';}})();"

"(function(){if(!window.viglink_bkml){var e=document.createElement('script');e.className='bkml-resource';e.src='" +  code_src + "';document.body.appendChild(e);window.viglink_default_campaign=" + defaultCampaign + "}})()"