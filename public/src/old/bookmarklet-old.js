(function() {
  /**
   * @return {undefined}
   */
  var init = function() {
    if (window.vglnk_bookmarklet) {
      save();
      run();
    } else {
      window.vglnk_bookmarklet = {};
      /** @type {Element} */
      var scriptElem = document.createElement("script");
      scriptElem.setAttribute("src", "//infinite-depths-8370.herokuapp.com/assets/ZeroClipboard.js");
      /** @type {function (): undefined} */
      scriptElem.onload = scriptElem.onreadystatechange = function() {
        run();
      };
      document.body.appendChild(scriptElem);
    }
  };
  /**
   * @return {undefined}
   */
  var save = function() {
    $("#vl-bookmarklet").remove();
  };
  /**
   * @return {undefined}
   */
  var run = function() {
    if (window.ZeroClipboard) {
      ZeroClipboard.setDefaults({
        moviePath : "//infinite-depths-8370.herokuapp.com/assets/ZeroClipboard.swf",
        trustedOrigins : [window.location.protocol + "//" + window.location.host]
      });
      var clip = new ZeroClipboard;
      clip.on("complete", function(dataAndEvents, deepDataAndEvents) {
        alert("URL copied clipboard!");
        save();
      });
    }
    /** @type {string} */
    var attrValue = "http://redirect.viglink.com?key=" + window.vglnkbkmklt_key + "&u=" + encodeURIComponent(window.location.href);
    $("body").append('<div id="vl-bookmarklet">\n  <textarea readonly id="vl-bookmarklet-textarea"></textarea>\n  <p>\n  <button id="vl-bookmarklet-button">Copy to clipboard</button>\n  </p>\n  <a href="#" class="vl-cancel">Cancel</a>\n</div>\n\n<style>\n  #vl-bookmarklet {\n    border: 2px solid #ccc;\n    background: #f0f0f0;\n    padding: 1%;\n    position: fixed;\n    width: 20%;\n    height: 20%;\n    min-width: 300px;\n    min-height: 150px;\n    top: 40%;\n    left: 40%;\n    cursor: pointer;\n    z-index: 999999;\n  }\n\n  #vl-bookmarklet textarea {\n    width: 90%;\n    height: 60%;\n    margin: 0 auto;\n    font-size: 12px;\n    font-family: courier;\n  }\n\n  #vl-bookmarklet p {\n    margin: 10px 0 0 0;\n    text-align: center;\n  }\n</style>\n');
    $("#vl-bookmarklet-textarea").val(attrValue);
    if (window.ZeroClipboard) {
      $("#vl-bookmarklet-button").attr("data-clipboard-text", attrValue);
      clip.glue(document.getElementById("vl-bookmarklet-button"));
    } else {
      $("#vl-bookmarklet-button").hide();
    }
    $(".vl-cancel").click(save);
  };
  /** @type {null} */
  var $ = null;
  if (void 0 === window.jQuery) {
    /** @type {boolean} */
    var f = false;
    /** @type {Element} */
    var scriptElem = document.createElement("script");
    /** @type {string} */
    scriptElem.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
    /** @type {function (): undefined} */
    scriptElem.onload = scriptElem.onreadystatechange = function() {
      if (!f && (!this.readyState || ("loaded" == this.readyState || "complete" == this.readyState))) {
        /** @type {boolean} */
        f = true;
        $ = window.jQuery;
        init();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(scriptElem);
  } else {
    $ = window.jQuery;
    init();
  }
})();
