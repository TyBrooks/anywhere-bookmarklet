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
