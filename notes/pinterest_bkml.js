!function(w, a, item) {
  var self = w[item.k] = {
    w : w,
    d : a,
    a : item,
    s : {},
    f : function() {
      return{
        callback : [],
        /**
         * @param {HTMLElement} elem
         * @param {string} name
         * @return {?}
         */
        get : function(elem, name) {
          /** @type {null} */
          var c = null;
          return c = "string" === typeof elem[name] ? elem[name] : elem.getAttribute(name);
        },
        /**
         * @param {string} el
         * @param {string} name
         * @return {?}
         */
        getData : function(el, name) {
          return name = self.a.dataAttributePrefix + name, self.f.get(el, name);
        },
        /**
         * @param {Object} obj
         * @param {string} key
         * @param {boolean} val
         * @return {undefined}
         */
        set : function(obj, key, val) {
          if ("string" === typeof obj[key]) {
            /** @type {boolean} */
            obj[key] = val;
          } else {
            obj.setAttribute(key, val);
          }
        },
        /**
         * @param {?} opt_attributes
         * @return {?}
         */
        make : function(opt_attributes) {
          var type;
          var key;
          /** @type {boolean} */
          var s = false;
          for (type in opt_attributes) {
            if (opt_attributes[type].hasOwnProperty) {
              /** @type {Element} */
              s = self.d.createElement(type);
              for (key in opt_attributes[type]) {
                if (opt_attributes[type][key].hasOwnProperty) {
                  if ("string" === typeof opt_attributes[type][key]) {
                    self.f.set(s, key, opt_attributes[type][key]);
                  }
                }
              }
              break;
            }
          }
          return s;
        },
        /**
         * @param {HTMLElement} el
         * @return {undefined}
         */
        kill : function(el) {
          if ("string" === typeof el) {
            /** @type {(HTMLElement|null)} */
            el = self.d.getElementById(el);
          }
          if (el) {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          }
        },
        /**
         * @param {string} number
         * @param {?} func
         * @return {undefined}
         */
        call : function(number, func) {
          var i;
          var id;
          /** @type {string} */
          var nd = "?";
          i = self.v.nextCallback;
          self.v.nextCallback = self.v.nextCallback + 1;
          /** @type {string} */
          id = self.a.k + ".f.callback[" + i + "]";
          /**
           * @param {?} name
           * @return {undefined}
           */
          self.f.callback[i] = function(name) {
            func(name, i);
            self.f.kill(id);
          };
          if (number.match(/\?/)) {
            /** @type {string} */
            nd = "&";
          }
          self.d.b.appendChild(self.f.make({
            SCRIPT : {
              id : id,
              type : "text/javascript",
              charset : "utf-8",
              src : number + nd + "callback=" + id
            }
          }));
          self.f.debug("Calling: " + number + nd + "callback=" + id);
        },
        /**
         * @param {string} object
         * @return {undefined}
         */
        debug : function(object) {
          if (self.w.console) {
            if (self.w.console.log) {
              if (self.v.config.debug) {
                self.w.console.log(object);
              }
            }
          }
        },
        /**
         * @return {?}
         */
        getSelection : function() {
          return("" + (self.w.getSelection ? self.w.getSelection() : self.d.getSelection ? self.d.getSelection() : self.d.selection.createRange().text)).replace(/(^\s+|\s+$)/g, "");
        },
        /**
         * @return {?}
         */
        getWindowHeight : function() {
          /** @type {number} */
          var getWindowHeight = Math.max(Math.max(self.d.b.scrollHeight, self.d.d.scrollHeight), Math.max(self.d.b.offsetHeight, self.d.d.offsetHeight), Math.max(self.d.b.clientHeight, self.d.d.clientHeight));
          return getWindowHeight;
        },
        ping : {
          /**
           * @return {undefined}
           */
          log : function() {
            self.v.callbacksHaveReturned = self.v.callbacksHaveReturned + 1;
          },
          /**
           * @param {Array} domain
           * @return {undefined}
           */
          domain : function(domain) {
            self.v.callbacksHaveReturned = self.v.callbacksHaveReturned + 1;
            var i;
            var valsLength;
            if (domain && (domain.data && (domain.data.disallowed_domains && domain.data.disallowed_domains.length))) {
              /** @type {number} */
              i = 0;
              valsLength = domain.data.disallowed_domains.length;
              for (;i < valsLength;i += 1) {
                if (domain.data.disallowed_domains[i] === self.w.location.host) {
                  /** @type {boolean} */
                  self.v.data.blacklistedDomain = true;
                }
                /** @type {boolean} */
                self.v.checkDomainBlacklist[domain.data.disallowed_domains[i]] = true;
              }
              /** @type {number} */
              i = 0;
              valsLength = self.v.data.thumb.length;
              for (;i < valsLength;i += 1) {
                if (self.v.checkDomainBlacklist[self.v.data.thumb[i].domain] === true) {
                  /** @type {boolean} */
                  self.v.data.thumb[i].blacklistedImageSource = true;
                  self.f.log("image_from_blacklisted_domain", self.v.data.thumb[i].domain);
                }
              }
            }
          },
          /**
           * @param {MessageEvent} e
           * @return {undefined}
           */
          preferred : function(e) {
            if (self.v.callbacksHaveReturned = self.v.callbacksHaveReturned + 1, e.data) {
              self.f.debug("preferred data received");
              self.v.data.preferred = e.data.reply;
              var item;
              item = {};
              item.partner = e.data.src;
              if ("image" !== e.data.reply.media) {
                /** @type {boolean} */
                item.multimedia = true;
              }
              if (self.a.lookup[e.data.src]) {
                if (self.a.lookup[e.data.src].page) {
                  if (self.a.lookup[e.data.src].page.multimedia) {
                    /** @type {boolean} */
                    item.multimedia = true;
                  }
                }
              }
              if (self.v.data.preferred && (self.v.data.preferred.img && self.v.data.preferred.img.src)) {
                item.src = self.v.data.preferred.img.src;
              } else {
                self.f.debug("preferred data did not include image source");
                item.src = self.v.pref.og.media || self.v.pref.pin.media;
              }
              item.url = e.data.reply.page;
              item.description = self.v.data.preferred.title || self.d.title;
              /** @type {boolean} */
              item.override = true;
              self.f.thumbPreferred(item);
            }
          },
          /**
           * @param {MessageEvent} err
           * @param {?} callback
           * @return {undefined}
           */
          thumb : function(err, callback) {
            var i;
            var valsLength;
            if (self.v.callbacksHaveReturned = self.v.callbacksHaveReturned + 1, err.data) {
              /** @type {number} */
              i = 0;
              valsLength = self.v.data.thumb.length;
              for (;i < valsLength;i += 1) {
                if (self.v.data.thumb[i].callback === callback) {
                  if (err.data.reply) {
                    self.v.data.thumb[i].extended = err.data.reply;
                    if (self.v.data.thumb[i].extended) {
                      if (self.v.data.thumb[i].extended.media) {
                        if ("image" !== self.v.data.thumb[i].extended.media) {
                          /** @type {boolean} */
                          self.v.data.thumb[i].multimedia = true;
                        }
                      }
                    }
                  }
                  break;
                }
              }
            }
          },
          /**
           * @param {MessageEvent} err
           * @param {?} callback
           * @return {undefined}
           */
          media : function(err, callback) {
            var i;
            var valsLength;
            if (self.v.callbacksHaveReturned = self.v.callbacksHaveReturned + 1, err.data) {
              /** @type {number} */
              i = 0;
              valsLength = self.v.data.thumb.length;
              for (;i < valsLength;i += 1) {
                if (self.v.data.thumb[i].callback === callback) {
                  if (err.data.reply) {
                    self.v.data.thumb[i].extended = err.data.reply;
                  }
                  break;
                }
              }
            }
          }
        },
        /**
         * @param {Object} item
         * @return {undefined}
         */
        thumbPreferred : function(item) {
          self.f.debug("thumbing preferred");
          self.f.debug(item);
          /** @type {boolean} */
          item.preferred = true;
          /** @type {Image} */
          var image = new Image;
          /**
           * @return {undefined}
           */
          image.onload = function() {
            item.height = this.height;
            item.width = this.width;
            if (item.override === true) {
              if (self.v.hazHadPreferred) {
                self.v.data.thumb.shift();
              }
              /** @type {boolean} */
              self.v.hazOverridden = true;
              self.v.data.thumb.unshift(item);
            } else {
              if (!self.v.hazOverridden) {
                self.v.data.thumb.unshift(item);
              }
            }
          };
          image.src = item.src;
          /** @type {boolean} */
          self.v.hazHadPreferred = true;
        },
        /**
         * @return {undefined}
         */
        checkDomains : function() {
          var match;
          /** @type {string} */
          var result = self.a.checkDomain.url + "?domains=";
          /** @type {number} */
          var maxCheckCount = 0;
          for (match in self.v.checkDomain) {
            if (self.v.checkDomain[match].hasOwnProperty) {
              if (!self.v.checkDomainDone[match]) {
                /** @type {boolean} */
                self.v.checkDomainDone[match] = true;
                if (maxCheckCount) {
                  result += ",";
                }
                maxCheckCount += 1;
                result += encodeURIComponent(match);
                if (maxCheckCount > self.a.maxCheckCount) {
                  self.f.call(result, self.f.ping.domain);
                  /** @type {string} */
                  result = self.a.checkDomain.url + "?domains=";
                  /** @type {number} */
                  maxCheckCount = 0;
                }
              }
            }
          }
          if (maxCheckCount > 0) {
            self.f.call(result, self.f.ping.domain);
          }
        },
        /**
         * @return {undefined}
         */
        getArgs : function() {
          /** @type {NodeList} */
          var scripts = self.d.getElementsByTagName("SCRIPT");
          /** @type {number} */
          var valuesLen = scripts.length;
          /** @type {number} */
          var i = 0;
          /** @type {number} */
          var j = 0;
          /** @type {number} */
          var jl = self.a.validConfigParam.length;
          /** @type {null} */
          var value = null;
          /** @type {string} */
          var field = "";
          /**
           * @param {undefined} event
           * @return {undefined}
           */
          var next = function(event) {
            self.w.setTimeout(function() {
              self.f.kill(event);
            }, 10);
          };
          /** @type {number} */
          i = 0;
          for (;i < valuesLen;i += 1) {
            if (scripts[i].src.match(self.a.me)) {
              /** @type {number} */
              j = 0;
              for (;j < jl;j += 1) {
                field = self.a.validConfigParam[j];
                value = scripts[i].getAttribute(field);
                if (value) {
                  self.v.config[field] = value;
                }
              }
              next(scripts[i]);
              break;
            }
          }
          if (self.f.get(self.d.b, "data-pinterest-extension-installed")) {
            self.v.config.extensionVer = self.f.get(self.d.b, "data-pinterest-extension-installed");
          }
        },
        /**
         * @param {(Object|string)} el
         * @return {?}
         */
        hasValidSource : function(el) {
          /** @type {boolean} */
          var b = false;
          return(el.src && el.src.match(/^http/i) || self.f.getData(el, "media")) && (b = true), b === false && self.f.debug("Skipping an image with an unpinnable URL prefix: " + el.src.substr(0, 16)), b;
        },
        /**
         * @param {Image} cur
         * @return {?}
         */
        pinOkayPerSite : function(cur) {
          /** @type {boolean} */
          var b = false;
          return self.f.get(cur, "nopin") ? self.f.debug("image " + cur.src + " has inline nopin set") : b = true, b;
        },
        /**
         * @param {Element} p
         * @param {?} dataAndEvents
         * @return {undefined}
         */
        lookupThumb : function(p, dataAndEvents) {
          var file = p.src.split("#")[0].split("?")[0];
          /** @type {string} */
          var path = p.partner + ":" + file;
          /** @type {string} */
          var anchor = "source";
          if (dataAndEvents && (anchor = "link"), self.v.hazCalledForInfo[path]) {
            self.f.debug("duplicate lookup query " + path);
          } else {
            /** @type {boolean} */
            self.v.hazCalledForInfo[path] = true;
            /** @type {string} */
            var holder = self.a.embed + "?" + anchor + "=" + encodeURIComponent(file).replace(/^https/, "http");
            self.f.call(holder, self.f.ping.thumb);
          }
        },
        /**
         * @param {Object} $scope
         * @param {string} deepDataAndEvents
         * @return {undefined}
         */
        lookupMedia : function($scope, deepDataAndEvents) {
          /** @type {string} */
          var number = self.a.embed;
          if ("id" === deepDataAndEvents) {
            /** @type {string} */
            number = number + $scope.partner + "/";
          } else {
            /** @type {string} */
            deepDataAndEvents = "link";
          }
          if (self.v.hazCalledForInfo[$scope.source]) {
            self.f.debug("duplicate lookup query " + $scope.source);
          } else {
            /** @type {boolean} */
            self.v.hazCalledForInfo[$scope.source] = true;
            self.f.call(number + "?" + deepDataAndEvents + "=" + encodeURIComponent($scope.source).replace(/^https/, "http"), self.f.ping.media);
          }
        },
        /**
         * @param {string} element
         * @param {string} i
         * @return {?}
         */
        grovel : function(element, i) {
          var method;
          var j;
          var subLn;
          /** @type {null} */
          var introspectMethod = null;
          for (method in self.a.lookup) {
            if (self.a.lookup[method].hasOwnProperty && ("object" === typeof self.a.lookup[method][i] && "object" === typeof self.a.lookup[method][i].seek)) {
              /** @type {number} */
              j = 0;
              subLn = self.a.lookup[method][i].seek.length;
              for (;j < subLn;j += 1) {
                if (element.match(self.a.lookup[method][i].seek[j])) {
                  /** @type {string} */
                  introspectMethod = method;
                  break;
                }
              }
            }
          }
          return introspectMethod;
        },
        /**
         * @param {Object} img
         * @return {undefined}
         */
        getImageSize : function(img) {
          /** @type {boolean} */
          img.loaded = false;
          /** @type {Image} */
          var dataImg = new Image;
          if (dataImg.onload = function() {
            /** @type {boolean} */
            img.loaded = true;
            img.height = this.height;
            img.width = this.width;
          }, dataImg.src = img.src, img.patchedSource) {
            /** @type {Image} */
            var image = new Image;
            /**
             * @return {undefined}
             */
            image.onload = function() {
              /** @type {boolean} */
              img.loaded = true;
              img.height = this.height;
              img.width = this.width;
              img.src = this.src;
            };
            image.src = img.patchedSource;
          }
          self.v.data.thumb.push(img);
        },
        /**
         * @param {Image} el
         * @param {string} key
         * @return {undefined}
         */
        thumbImg : function(el, key) {
          var i;
          var valsLength;
          var font;
          var description;
          var options = {
            src : el.src,
            height : el.height,
            width : el.width
          };
          if (key) {
            /** @type {string} */
            options.partner = key;
          }
          options.domain = el.src.split("/")[2];
          /** @type {boolean} */
          self.v.checkDomain[options.domain] = true;
          description = self.f.get(el, "alt") || self.f.get(el, "title");
          if (description) {
            options.description = description;
          }
          /** @type {number} */
          i = 0;
          /** @type {number} */
          valsLength = self.a.validDataAtt.length;
          for (;i < valsLength;i += 1) {
            font = self.f.getData(el, self.a.validDataAtt[i]);
            if (font) {
              if (!options.suggested) {
                options.suggested = {};
              }
              options.suggested[self.a.validDataAtt[i]] = font;
            }
          }
          if (self.f.pinOkayPerSite(el)) {
            if (key) {
              if ("function" === typeof self.a.lookup[key].img.patch) {
                options.patchedSource = self.a.lookup[key].img.patch(el.src);
                self.f.getImageSize(options);
              }
              if ("lookup" === self.a.lookup[key].img.act) {
                options.callback = self.v.nextCallback;
                self.f.lookupThumb(options, self.a.lookup[key].img.link);
                self.v.data.thumb.push(options);
              }
            } else {
              if (options.suggested) {
                if (options.suggested.media) {
                  options.src = options.suggested.media;
                }
              }
              self.f.getImageSize(options);
            }
          } else {
            self.f.debug("nopin directive found locally for " + el.src);
            /** @type {boolean} */
            options.nopin = true;
          }
        },
        /**
         * @param {string} element
         * @param {string} keepData
         * @param {string} deepDataAndEvents
         * @return {undefined}
         */
        thumbMedia : function(element, keepData, deepDataAndEvents) {
          var root = {
            source : element,
            partner : keepData,
            callback : self.v.nextCallback,
            multimedia : true
          };
          self.f.lookupMedia(root, deepDataAndEvents);
          self.v.data.thumb.push(root);
        },
        /**
         * @return {undefined}
         */
        getPinnableTags : function() {
          var b;
          var i;
          var valsLength;
          var _i;
          var _len;
          var candidates;
          var el;
          var node;
          var key;
          var token;
          /** @type {Array} */
          var codeSegments = ["iframe", "embed", "video", "img"];
          /** @type {Array} */
          var contexts = ["src", "src", "src", "src"];
          var grammar = (self.v.nextCallback, {});
          /** @type {number} */
          i = 0;
          /** @type {number} */
          valsLength = codeSegments.length;
          for (;i < valsLength;i += 1) {
            /** @type {NodeList} */
            candidates = self.d.getElementsByTagName(codeSegments[i]);
            /** @type {number} */
            _len = candidates.length;
            /** @type {number} */
            _i = 0;
            for (;_i < _len;_i += 1) {
              if (el = candidates[_i], "img" !== codeSegments[i] || self.f.hasValidSource(el)) {
                node = el.parentNode;
                /** @type {boolean} */
                b = false;
                for (;node && "HTML" !== node.tagName;) {
                  if (node.currentStyle && "none" === node.currentStyle.display || w.getComputedStyle && "none" === w.getComputedStyle(el).getPropertyValue("display")) {
                    /** @type {boolean} */
                    b = true;
                    break;
                  }
                  node = node.parentNode;
                }
                if (!b) {
                  token = self.f.get(el, contexts[i]);
                  if (token) {
                    if (!grammar[token]) {
                      /** @type {boolean} */
                      grammar[token] = true;
                      key = self.f.grovel(token, codeSegments[i]);
                      if (key) {
                        if ("img" !== codeSegments[i]) {
                          if ("function" === typeof self.a.lookup[key][codeSegments[i]].patch) {
                            if (self.a.lookup[key][codeSegments[i]].att) {
                              if (self.f.get(el, self.a.lookup[key][codeSegments[i]].att)) {
                                token = self.a.lookup[key][codeSegments[i]].patch(self.f.get(el, self.a.lookup[key][codeSegments[i]].att));
                              }
                            }
                          }
                          self.f.thumbMedia(token, key, self.a.lookup[key][codeSegments[i]].via);
                        }
                      }
                      if ("img" === codeSegments[i]) {
                        if (self.f.get(el, "nopin")) {
                          self.f.log("image_with_inline_nopin", el.src);
                        } else {
                          if (!self.f.getData(el, "nopin")) {
                            self.f.thumbImg(el, key);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        /**
         * @return {undefined}
         */
        checkPage : function() {
          self.f.debug("checking page for nopins or preferences");
          var options;
          var j;
          var subLn;
          var evt;
          var value;
          var text;
          var script;
          var that;
          var holder;
          var i = self.f.grovel(self.d.URL, "page");
          if (i) {
            if (self.v.pagePartner = i, options = self.a.lookup[i].page, "close" === options.act && (that = self.v.msg[options.msg], "function" === typeof options.patch && (that = options.patch(that)), self.v.data.close = that), "bustFrame" === options.act) {
              self.v.data.confirm = self.v.msg[i].replace(/%s%/g, options.serviceName);
              /** @type {number} */
              j = 0;
              subLn = options.frameId.length;
              for (;j < subLn;j += 1) {
                /** @type {(HTMLElement|null)} */
                script = self.d.getElementById(options.frameId[j]);
                if (script) {
                  if ("IFRAME" === script.tagName) {
                    if (script.src) {
                      self.v.data.frameBust = script.src;
                    }
                  }
                }
              }
            }
            if ("lookup" === options.act) {
              self.f.debug("page lookup");
              /** @type {string} */
              holder = "id" === options.via ? self.a.embed + i + "/?id=" + encodeURIComponent(self.d.URL) : self.a.embed + "?" + options.via + "=" + encodeURIComponent(self.d.URL);
              self.f.call(holder, self.f.ping.preferred);
            }
            if (options.doNotCrawl) {
              /** @type {boolean} */
              self.v.doNotCrawl = true;
            }
            if (!self.v.data.close) {
              if (!("function" !== typeof options.patch)) {
                options.patch(self);
              }
            }
          }
          if (!self.v.data.close && !self.v.data.confirm) {
            /** @type {number} */
            j = 0;
            subLn = self.v.meta.length;
            for (;j < subLn;j += 1) {
              evt = self.f.get(self.v.meta[j], "name");
              value = self.f.get(self.v.meta[j], "property");
              text = self.f.get(self.v.meta[j], "content");
              that = self.f.get(self.v.meta[j], "description");
              if (evt) {
                if (text) {
                  if ("pinterest" === evt.toLowerCase()) {
                    if ("nopin" === text.toLowerCase()) {
                      self.v.data.close = that || self.v.msg.noPinMeta;
                      self.f.log("found_nopin_meta");
                    }
                  }
                  if ("pinterest-rich-pin" === evt.toLowerCase()) {
                    if ("false" === text.toLowerCase()) {
                      self.f.log("found_no_rich_pin_meta");
                    }
                  }
                }
              }
              if (!self.v.data.close) {
                if (value) {
                  if (text) {
                    if ("og:image" === value) {
                      self.v.pref.og.media = text;
                      self.f.debug("found og:image meta");
                    }
                    if ("og:url" === value) {
                      self.v.pref.og.url = text;
                      self.f.debug("found og:url meta");
                    }
                    if ("og:title" === value) {
                      self.v.pref.og.description = text;
                      self.f.debug("found og:description meta");
                    }
                    if ("pin:media" === value) {
                      self.v.pref.pin.media = text;
                      self.f.debug("found pin:image meta");
                    }
                    if ("pin:url" === value) {
                      self.v.pref.pin.url = text;
                      self.f.debug("found pin:url meta");
                    }
                    if ("pin:description" === value) {
                      self.v.pref.pin.description = text;
                      self.f.debug("found pin:description meta");
                    }
                  }
                }
              }
            }
          }
        },
        /**
         * @param {string} settings
         * @return {undefined}
         */
        pinDefault : function(settings) {
          var panel;
          var item;
          var e;
          if (settings.url) {
            if (settings.media) {
              /** @type {string} */
              self.v.data.preferred = settings;
              self.f.debug("found preferred media");
              panel = self.f.grovel(settings.url, "page");
              if (panel) {
                if (self.a.lookup[panel]) {
                  if (self.a.lookup[panel].page) {
                    self.f.debug("have partner page from OG");
                    if (settings.media) {
                      if (self.a.lookup[panel].page.patch) {
                        if ("function" === typeof self.a.lookup[panel].page.patch.img) {
                          settings.media = self.a.lookup[panel].page.patch.img(settings.media);
                        }
                      }
                    }
                  }
                }
              }
              if (!e) {
                item = {};
                if (panel) {
                  item.partner = panel;
                }
                item.src = settings.media;
                item.description = settings.description || self.d.title;
                self.f.thumbPreferred(item);
              }
            }
          }
        },
        /**
         * @param {Image} frame
         * @return {?}
         */
        checkSize : function(frame) {
          var oldHeight = frame.height;
          var linex = frame.width;
          /** @type {boolean} */
          var e = false;
          return frame.extended && (frame.extended.img && (linex = frame.extended.img.width, oldHeight = frame.extended.img.height)), oldHeight > self.a.imgSizeFloor && (linex > self.a.imgSizeFloor && ((oldHeight > self.a.imgSizeMin || linex > self.a.imgSizeMin) && (e = true))), e;
        },
        /**
         * @return {undefined}
         */
        noPinnablesFound : function() {
          self.v.data.close = self.v.msg.noPinnablesFound;
        },
        /**
         * @return {undefined}
         */
        collate : function() {
          var idx;
          var data;
          if (self.v.data.blacklistedDomain) {
            /** @type {Array} */
            self.v.data.thumb = [];
            self.v.data.close = self.v.msg.noPinDomain;
            self.f.log("domain_blacklisted");
          } else {
            if (!self.v.data.close && !self.v.data.confirm) {
              /** @type {number} */
              idx = self.v.data.thumb.length - 1;
              for (;idx > -1;idx -= 1) {
                data = self.v.data.thumb[idx];
                if (data.extended) {
                  if (data.extended.nopin) {
                    self.f.log("api_nopin", data.src);
                  }
                }
                if (!self.f.checkSize(data) || (data.nopin || (data.extended && data.extended.nopin || data.blacklistedImageSource))) {
                  self.v.data.thumb.splice(idx, 1);
                } else {
                  /** @type {string} */
                  data.url = self.d.URL;
                  data.media = data.src;
                  if (data.suggested) {
                    if (data.suggested.url) {
                      data.url = data.suggested.url;
                    }
                    if (data.suggested.media) {
                      data.src = data.suggested.media;
                    }
                    if (data.suggested.description) {
                      data.description = data.suggested.description;
                    }
                  }
                  if (data.extended) {
                    if (data.extended.page) {
                      data.url = data.extended.page;
                    }
                    if (data.extended.media) {
                      data.media = data.extended.media;
                    }
                    if (data.extended.img) {
                      if (data.extended.img.src) {
                        data.src = data.extended.img.src;
                      }
                    }
                    if (data.extended.description) {
                      data.description = data.extended.description;
                    }
                  }
                }
              }
              if (!self.v.data.thumb.length) {
                if (!self.v.data.preferred) {
                  self.f.noPinnablesFound();
                }
              }
            }
          }
          self.f.debug("done collating");
        },
        /**
         * @return {undefined}
         */
        done : function() {
          self.f.collate();
          /** @type {boolean} */
          var a = false;
          if (self.v.config.render) {
            if ("function" === typeof self.w[self.v.config.render]) {
              self.f.debug("firing custom render callback " + self.v.config.render);
              self.w[self.v.config.render](self.v.data);
              /** @type {boolean} */
              a = true;
            }
          }
          if (self.v.data.close) {
            if (!self.v.config.quiet) {
              alert(self.v.data.close);
            }
            self.f.close();
          } else {
            if (self.v.data.confirm) {
              if (!self.v.config.quiet) {
                if (self.v.data.frameBust) {
                  if (self.w.confirm(self.v.data.confirm)) {
                    self.w.location = self.v.data.frameBust;
                  } else {
                    self.f.close();
                  }
                }
              }
            } else {
              if (!a) {
                self.f.debug("ready to render");
                self.f.render();
              }
            }
          }
        },
        /**
         * @return {undefined}
         */
        ponder : function() {
          var reference;
          var update;
          var x;
          if (self.v.nextCallback) {
            /** @type {number} */
            reference = (new Date).getTime();
            (update = function() {
              if (self.v.nextCallback > self.v.callbacksHaveReturned) {
                /** @type {number} */
                x = (new Date).getTime();
                if (x < reference + self.a.maxWait) {
                  self.w.setTimeout(function() {
                    update();
                  }, 100);
                } else {
                  /** @type {boolean} */
                  self.v.data.timedOut = true;
                  self.f.debug("timed out - done looking for pinnables");
                  self.f.done();
                }
              } else {
                self.f.debug("all callbacks received - done looking for pinnables");
                self.f.done();
              }
            })();
          } else {
            self.f.debug("no callbacks to worry about - done looking for pinnables");
            self.f.done();
          }
        },
        /**
         * @param {number} step
         * @param {number} b
         * @return {?}
         */
        scaleThumb : function(step, b) {
          /** @type {number} */
          var n = Math.floor(self.a.thumbCellSize * (step / b));
          /** @type {number} */
          var w = self.a.thumbCellSize;
          return b < self.a.thumbCellSize && (w = b, n = step), {
            height : n,
            width : w
          };
        },
        /**
         * @param {Object} item
         * @return {?}
         */
        thumb : function(item) {
          var src;
          var max;
          var value;
          var tpl;
          var r;
          var wrap;
          var html;
          var me = self.f.make({
            SPAN : {
              className : self.a.k + "_thumb"
            }
          });
          if (item.extended && (item.extended.img && item.extended.img.src) ? (src = item.extended.img.src, max = item.extended.img.height, value = item.extended.img.width) : (src = item.src, max = item.height, value = item.width), !self.v.renderedThumb[src]) {
            /** @type {boolean} */
            self.v.renderedThumb[src] = true;
            r = self.f.scaleThumb(max, value);
            tpl = self.f.make({
              IMG : {
                src : src,
                "class" : self.a.k + "_thumb",
                nopin : true,
                height : "" + r.height,
                width : "" + r.width,
                style : "height:" + r.height + "px!important;width:" + r.width + "px!important;"
              }
            });
            me.appendChild(tpl);
            var dateString = self.f.getSelection() || (item.description || self.d.title);
            dateString = dateString.substring(0, 140);
            if (140 === dateString.length) {
              dateString += "...";
            }
            wrap = self.f.make({
              DIV : {
                className : self.a.k + "_info"
              }
            });
            var el = self.f.make({
              SPAN : {
                innerHTML : dateString
              }
            });
            /** @type {string} */
            el.style.display = "block";
            /** @type {boolean} */
            el.contentEditable = true;
            wrap.appendChild(el);
            /** @type {string} */
            var s = value + " x " + max;
            if (value < self.a.thumbCellSize || max < self.a.thumbCellSize) {
              /** @type {string} */
              s = s + " (" + self.v.msg.small + ")";
            }
            var count = self.f.make({
              SMALL : {
                innerHTML : s
              }
            });
            if (me.appendChild(count), item.partner && self.a.lookup[item.partner].label) {
              var anch = self.f.make({
                SPAN : {
                  className : self.a.k + "_attrib"
                }
              });
              /** @type {string} */
              anch.innerHTML = self.v.msg.seeAttribTextAfterPartnerLabel ? '<img class="' + self.a.k + '_attrib" src="' + self.a.cdn[self.w.location.protocol] + "/images/attrib/" + item.partner + '.png"/> ' + self.a.lookup[item.partner].label + " " + self.v.msg.attrib : '<img class="' + self.a.k + '_attrib" src="' + self.a.cdn[self.w.location.protocol] + "/images/attrib/" + item.partner + '.png"/> ' + self.v.msg.attrib + " " + self.a.lookup[item.partner].label;
              wrap.appendChild(anch);
              /** @type {string} */
              wrap.className = wrap.className + " " + self.a.k + "_hazAttrib";
            }
            return wrap.style.width = self.a.thumbCellSize - self.a.thumbCellMargin + "px", me.appendChild(wrap), r.height = r.height, html = self.f.make({
              SPAN : {
                className : self.a.k + "_pin",
                "data-pin-url" : item.url,
                "data-pin-media" : item.src
              }
            }), html.style.height = r.height + "px", item.multimedia === true && self.f.set(html, "data-pin-multimedia", true), me.appendChild(html), me.scale = r, me;
          }
        },
        /**
         * @return {undefined}
         */
        nagExtension : function() {
          if (self.a.nagChance > 0 && !Math.floor(Math.random() * self.a.nagChance)) {
            /** @type {string} */
            var scheme = self.w.location.protocol;
            if (!scheme.match(/^http/)) {
              /** @type {string} */
              scheme = "http:";
            }
            /** @type {string} */
            self.v.frameSource = scheme + self.a.disco + "discover.html";
            self.s.nag = self.f.make({
              IFRAME : {
                id : self.a.k + "_nag",
                src : self.v.frameSource + "?p=" + (new Date).getTime(),
                frameBorder : "0",
                scrolling : "none"
              }
            });
            self.s.ct.parentNode.insertBefore(self.s.nag, self.s.ct);
            /**
             * @return {undefined}
             */
            self.s.nag.onload = function() {
              self.v.receiver = self.s.nag.contentWindow;
              self.v.receiver.postMessage(self.a.k, self.v.frameSource);
            };
            self.f.listen(self.w, "message", function(obj2) {
              if (obj2.data === self.a.k) {
                self.f.kill(self.s.nag);
              }
            });
          }
        },
        /**
         * @return {undefined}
         */
        contents : function() {
          var i;
          var valsLength;
          self.f.debug("rendering " + self.v.data.thumb.length + " real thumbs");
          /** @type {number} */
          var y = 0;
          /** @type {Array} */
          var xy = [];
          /** @type {number} */
          var bounds = Math.floor(self.s.bd.offsetWidth / (self.a.thumbCellSize + self.a.thumbCellMargin));
          /** @type {string} */
          self.s.ct.style.width = bounds * (self.a.thumbCellSize + self.a.thumbCellMargin) + self.a.thumbCellMargin + "px";
          if (self.v.nagExtension) {
            self.f.nagExtension();
          }
          /** @type {number} */
          i = 0;
          valsLength = self.v.data.thumb.length;
          for (;i < valsLength;i += 1) {
            var marker = self.f.thumb(self.v.data.thumb[i]);
            if (marker) {
              if (!xy[y]) {
                /** @type {number} */
                xy[y] = 0;
              }
              marker.style.top = xy[y] + "px";
              /** @type {string} */
              marker.style.left = y * (self.a.thumbCellSize + self.a.thumbCellMargin) + "px";
              /** @type {string} */
              marker.style.width = self.a.thumbCellSize + "px";
              self.s.ct.appendChild(marker);
              var node = marker.getElementsByTagName("DIV")[0];
              /** @type {number} */
              var height = 0;
              if (node) {
                height = node.offsetHeight;
              }
              height += self.a.thumbDimHeight;
              /** @type {string} */
              marker.style.height = marker.scale.height + height + "px";
              var elem = marker.getElementsByTagName("SMALL")[0];
              /** @type {string} */
              elem.style.bottom = height - self.a.thumbDimHeight + "px";
              xy[y] = xy[y] + marker.scale.height + self.a.thumbCellMargin + height;
              /** @type {number} */
              y = (y + 1) % bounds;
            }
          }
        },
        /**
         * @return {undefined}
         */
        presentation : function() {
          var stylesheet;
          var replacement;
          var css;
          stylesheet = self.f.make({
            STYLE : {
              type : "text/css"
            }
          });
          replacement = self.a.cdn[self.w.location.protocol] || self.a.cdn["http:"];
          css = self.v.css;
          css = css.replace(/#_/g, "#" + item.k + "_");
          css = css.replace(/\._/g, "." + item.k + "_");
          css = css.replace(/;/g, "!important;");
          css = css.replace(/_cdn/g, replacement);
          css = css.replace(/_pin_it_button/, self.v.msg.button);
          if (stylesheet.styleSheet) {
            stylesheet.styleSheet.cssText = css;
          } else {
            stylesheet.appendChild(self.d.createTextNode(css));
          }
          if (self.d.h) {
            self.d.h.appendChild(stylesheet);
          } else {
            self.d.b.appendChild(stylesheet);
          }
        },
        /**
         * @param {Object} map
         * @param {string} classNames
         * @return {undefined}
         */
        makeStyleFrom : function(map, classNames) {
          var attrList;
          var i;
          var key;
          var operator;
          /** @type {string} */
          var buf = "";
          var val = classNames || "";
          for (key in map) {
            if (map[key].hasOwnProperty) {
              if ("string" === typeof map[key]) {
                /** @type {string} */
                buf = buf + key + ": " + map[key] + "; ";
              }
            }
          }
          if (val) {
            if (buf) {
              /** @type {string} */
              self.v.css = self.v.css + val + " { " + buf + "}\n";
            }
          }
          for (key in map) {
            if (map[key].hasOwnProperty && "object" === typeof map[key]) {
              /** @type {Array.<string>} */
              attrList = key.split(", ");
              /** @type {number} */
              i = 0;
              for (;i < attrList.length;i += 1) {
                /** @type {string} */
                operator = "";
                if (attrList[i].match(/^&/)) {
                  /** @type {string} */
                  attrList[i] = attrList[i].split("&")[1];
                } else {
                  if (val) {
                    /** @type {string} */
                    operator = " ";
                  }
                }
                self.f.makeStyleFrom(map[key], val + operator + attrList[i].replace(/^\s+|\s+$/g, ""));
              }
            }
          }
        },
        /**
         * @param {string} text
         * @param {?} v
         * @param {string} str
         * @return {undefined}
         */
        log : function(text, v, str) {
          var encodedValue = str || self.d.URL;
          /** @type {string} */
          var k = "?page=" + encodeURIComponent(encodedValue) + "&reason=" + encodeURIComponent(text);
          if (v) {
            /** @type {string} */
            k = k + "&image=" + encodeURIComponent(v);
          }
          self.w.setTimeout(function() {
            self.f.call(self.a.log + k, self.f.ping.log);
          }, self.a.maxWait);
        },
        /**
         * @return {undefined}
         */
        close : function() {
          if (window.hazPinningNow = false, self.s.bg) {
            /** @type {number} */
            var quietMillis = 1;
            if (self.v.receiver) {
              /** @type {string} */
              self.s.nag.src = "about:blank";
              /** @type {number} */
              quietMillis = 100;
            }
            self.w.setTimeout(function() {
              self.f.listen(self.d, "keydown", self.f.keydown, "detach");
              self.f.listen(self.d, "click", self.f.click, "detach");
              self.f.kill(self.s.shim);
              self.f.kill(self.s.bg);
              self.f.kill(self.s.bd);
              self.w.scroll(0, self.v.saveScrollTop);
              if (self.v.restore) {
                /** @type {string} */
                self.v.restore.style.display = "block";
              }
            }, quietMillis);
          }
        },
        /**
         * @param {Object} el
         * @return {undefined}
         */
        pin : function(el) {
          /** @type {string} */
          var url = self.a.pin + "/" + self.a.pinMethod + "/?";
          var query = self.f.getData(el, "multimedia");
          var data = self.f.getData(el, "media");
          var encodedValue = self.f.getData(el, "url") || self.d.URL;
          var hiddenPre = el.parentNode.getElementsByTagName("DIV")[0].getElementsByTagName("SPAN")[0];
          /** @type {string} */
          var q = "";
          if (hiddenPre) {
            q = hiddenPre.textContent || (hiddenPre.innerText || "");
            q = q.replace(/^\s+|\s+$/g, "");
          }
          /** @type {string} */
          url = url + "media=" + encodeURIComponent(data);
          /** @type {string} */
          url = url + "&url=" + encodeURIComponent(encodedValue);
          if (self.v.config.extensionVer) {
            /** @type {string} */
            url = url + "&xv=" + self.v.config.extensionVer + "&xm=g";
          }
          /** @type {string} */
          url = url + "&description=" + encodeURIComponent(q);
          if (query) {
            /** @type {string} */
            url = url + "&is_video=" + query;
          }
          if (self.v.hazIOS) {
            /** @type {string} */
            self.w.location = "http://" + url;
          } else {
            if (!(self.v.config.extensionVer && "cr2.0" === self.v.config.extensionVer)) {
              self.w.open("http://" + url, "pin" + (new Date).getTime(), self.a.pop);
            }
          }
          self.f.close();
        },
        /**
         * @param {(Object|boolean|number|string)} e
         * @return {undefined}
         */
        click : function(e) {
          var name;
          var key;
          name = e || self.w.event;
          key = self.f.getEl(name);
          if (key === self.s.x) {
            self.f.log("bookmarklet_cancel_click");
            self.f.close();
          }
          var req = self.f.getData(key, "url");
          var elements = self.f.getData(key, "media");
          if (elements) {
            if (req) {
              self.f.log("bookmarklet_pin", elements);
              self.f.pin(key);
            }
          }
        },
        /**
         * @param {(Object|boolean|number|string)} e
         * @return {undefined}
         */
        keydown : function(e) {
          var ev = e || self.w.event;
          var c = ev.keyCode || null;
          if (27 === c) {
            self.f.log("bookmarklet_cancel_esc");
            self.f.close();
          }
        },
        /**
         * @param {Event} event
         * @return {?}
         */
        getEl : function(event) {
          /** @type {null} */
          var b = null;
          return b = event.target ? 3 === event.target.nodeType ? event.target.parentNode : event.target : event.srcElement;
        },
        /**
         * @param {HTMLElement} element
         * @param {string} type
         * @param {?} func
         * @param {string} listener
         * @return {undefined}
         */
        listen : function(element, type, func, listener) {
          if (listener) {
            if ("undefined" !== typeof element.removeEventListener) {
              element.removeEventListener(type, func, false);
            } else {
              if ("undefined" !== typeof element.detachEvent) {
                element.detachEvent("on" + type, func);
              }
            }
          } else {
            if ("undefined" !== typeof self.w.addEventListener) {
              element.addEventListener(type, func, false);
            } else {
              if ("undefined" !== typeof self.w.attachEvent) {
                element.attachEvent("on" + type, func);
              }
            }
          }
        },
        /**
         * @return {undefined}
         */
        structure : function() {
          self.w.scroll(0, 0);
          self.s.shim = self.f.make({
            IFRAME : {}
          });
          /** @type {string} */
          self.s.shim.style.position = "absolute";
          /** @type {string} */
          self.s.shim.style.zIndex = "2147483640";
          /** @type {string} */
          self.s.shim.style.top = "0";
          /** @type {string} */
          self.s.shim.style.left = "0";
          /** @type {string} */
          self.s.shim.style.height = "100%";
          /** @type {string} */
          self.s.shim.style.width = "100%";
          self.d.b.appendChild(self.s.shim);
          self.s.bg = self.f.make({
            DIV : {
              id : self.a.k + "_bg"
            }
          });
          self.d.b.appendChild(self.s.bg);
          self.s.bd = self.f.make({
            DIV : {
              id : self.a.k + "_bd"
            }
          });
          self.s.hd = self.f.make({
            DIV : {
              id : self.a.k + "_hd"
            }
          });
          self.f.debug("config");
          self.f.debug(self.v.config);
          if (self.v.config.noHeader) {
            /** @type {string} */
            self.s.hd.className = self.a.k + "_noHeader";
          } else {
            self.s.bd.appendChild(self.f.make({
              DIV : {
                id : self.a.k + "_spacer"
              }
            }));
            self.s.hd.appendChild(self.f.make({
              SPAN : {
                id : self.a.k + "_logo"
              }
            }));
            if (self.v.config.noCancel !== true) {
              self.s.x = self.f.make({
                A : {
                  id : self.a.k + "_x",
                  innerHTML : self.v.msg.cancelTitle
                }
              });
              self.s.hd.appendChild(self.s.x);
            }
          }
          self.s.bd.appendChild(self.s.hd);
          self.s.ct = self.f.make({
            DIV : {
              id : self.a.k + "_ct"
            }
          });
          self.s.bd.appendChild(self.s.ct);
          self.d.b.appendChild(self.s.bd);
          var Mh = self.f.getWindowHeight();
          if (self.s.bd.offsetHeight < Mh) {
            /** @type {string} */
            self.s.bd.style.height = Mh + "px";
            /** @type {string} */
            self.s.bg.style.height = Mh + "px";
            /** @type {string} */
            self.s.shim.style.height = Mh + "px";
          }
          /** @type {number} */
          var iii = 0;
          for (;iii < self.a.infiniteZ.length;iii += 1) {
            /** @type {(HTMLElement|null)} */
            var testElement = self.d.getElementById(self.a.infiniteZ[iii]);
            if (testElement) {
              /** @type {HTMLElement} */
              self.v.restore = testElement;
              /** @type {string} */
              testElement.style.display = "none";
            }
          }
        },
        /**
         * @return {undefined}
         */
        render : function() {
          self.f.contents();
          self.f.listen(self.d, "keydown", self.f.keydown);
          self.f.listen(self.d, "click", self.f.click);
          self.f.log("bookmarklet_rendered");
        },
        /**
         * @return {?}
         */
        getPreferred : function() {
          /** @type {boolean} */
          var a = false;
          return self.v.pref.pin.media && (self.v.pref.pin.url && self.v.pref.pin.description) ? (self.f.pinDefault(self.v.pref.pin), a = true) : self.v.pref.og.media && (self.v.pref.og.url && (self.v.pref.og.description && (self.f.pinDefault(self.v.pref.og), a = true))), a;
        },
        /**
         * @return {undefined}
         */
        getLang : function() {
          var i;
          var valsLength;
          var string;
          var ret;
          var msg;
          if (msg = self.d.getElementsByTagName("HTML")[0].getAttribute("lang") || "") {
            msg = msg.toLowerCase();
          } else {
            /** @type {number} */
            i = 0;
            valsLength = self.v.meta.length;
            for (;i < valsLength;i += 1) {
              string = self.f.get(self.v.meta[i], "http-equiv");
              if (string && (string = string.toLowerCase(), "content-language" === string && (ret = self.f.get(self.v.meta[i], "content")))) {
                msg = ret;
                break;
              }
            }
          }
          if (msg) {
            if ("object" === typeof self.a.msg[msg]) {
              self.v.msg = self.a.msg[msg];
            } else {
              msg = msg.split("-")[0];
              if ("object" === typeof self.a.msg[msg]) {
                self.v.msg = self.a.msg[msg];
              }
            }
          }
        },
        /**
         * @return {undefined}
         */
        hazPinIt : function() {
          var i;
          var hasScripts;
          /** @type {NodeList} */
          var scripts = self.d.getElementsByTagName("SCRIPT");
          /** @type {string} */
          var s = "pinit_not_found";
          /** @type {number} */
          i = 0;
          /** @type {number} */
          hasScripts = scripts.length;
          for (;i < hasScripts;i += 1) {
            if (scripts[i].src && scripts[i].src.match(/^https?:\/\/log\.pinterest\.com/)) {
              /** @type {string} */
              s = "pinit_found";
              break;
            }
          }
          self.f.debug(s);
          self.f.log(s);
        },
        /**
         * @return {?}
         */
        init : function() {
          if (self.d.d = self.d.documentElement, self.d.b = self.d.getElementsByTagName("BODY")[0], self.v = {
            callbacksHaveReturned : 0,
            checkDomain : {},
            checkDomainDone : {},
            checkDomainBlacklist : {},
            config : {},
            css : "",
            data : {
              thumb : []
            },
            done : false,
            hazCalledForInfo : {},
            hazIE : false,
            hazIOS : false,
            meta : self.d.getElementsByTagName("META"),
            nextCallback : 0,
            pref : {
              pin : {},
              og : {}
            },
            renderedThumb : {},
            saveScrollTop : self.w.pageYOffset,
            msg : self.a.msg.en
          }, self.f.getLang(), self.v.msg.button || (self.v.msg.button = self.a.buttonImage), !self.d.b) {
            return self.v.data.msg = self.v.msg.noPinIncompletePage, void self.f.done();
          }
          if (window.isMainPinterestSite === true && self.d.URL.match(/^https?:\/\/(.*?\.|)pinterest\.com\//)) {
            return self.v.data.close = self.v.msg.installed, void self.f.done();
          }
          if (self.v.nagExtension = false, self.f.get(self.d.b, "data-pinterest-extension-installed") || (/Firefox/.test(self.w.navigator.userAgent) && (self.v.nagExtension = true), /Safari/.test(self.w.navigator.userAgent) && (/Macintosh/.test(self.w.navigator.userAgent) && (/(Version\/6|Version\/7)/.test(self.w.navigator.userAgent) && (self.v.nagExtension = true))), /Chrome/.test(self.w.navigator.userAgent) && (!/Android/i.test(self.w.navigator.userAgent) && (self.v.nagExtension = true))), /msie/i.test(self.w.navigator.userAgent) && 
          (!/opera/i.test(self.w.navigator.userAgent) && (self.v.hazIE = true)), null !== self.w.navigator.userAgent.match(/iP/) && (self.v.hazIOS = true), self.f.getArgs(), self.f.checkPage(), !self.v.config.render) {
            if (window.hazPinningNow === true) {
              return;
            }
            /** @type {boolean} */
            window.hazPinningNow = true;
            self.f.makeStyleFrom(self.a.presentation);
            self.f.structure();
            self.f.presentation();
          }
          if (self.v.config.pinMethod && (self.a.pinMethod = self.v.config.pinMethod), !self.v.data.close && (!self.v.data.confirm && !self.v.data.blacklistedDomain)) {
            var pagePartner = self.f.getPreferred();
            self.f.debug("page partner: " + self.v.pagePartner);
            if (self.v.pagePartner && (pagePartner && self.v.doNotCrawl)) {
              self.f.debug("preferred media found on partner page " + self.v.pagePartner + ", doNotCrawl set. Not looking further");
            } else {
              self.f.debug("getting pinnable tags");
              self.f.getPinnableTags();
            }
          }
          self.f.debug("checking for restricted domains");
          self.f.checkDomains();
          self.f.debug("checking for Pin It buttons on this page");
          self.f.hazPinIt();
          self.w.setTimeout(function() {
            self.f.ponder();
          }, 100);
        }
      };
    }()
  };
  self.f.init();
}(window, document, {
  maxWait : 4E3,
  k : "PIN_" + (new Date).getTime(),
  me : /pinmarklet/,
  nagChance : 1,
  infiniteZ : ["tumblr_controls", "pt_toolbar_iframe", "rakutenLimitedId_header"],
  log : "//api.pinterest.com/v3/callback/nopin/",
  checkDomain : {
    url : "//api.pinterest.com/v3/nopin/filter/"
  },
  cdn : {
    "https:" : "https://s-passets.pinimg.com",
    "http:" : "http://passets.pinterest.com"
  },
  maxCheckCount : 10,
  thumbCellSize : 236,
  thumbCellMargin : 14,
  thumbInfoHeight : 50,
  thumbDimHeight : 30,
  validConfigParam : ["debug", "noCancel", "noHeader", "pinMethod", "extensionVer", "render", "quiet"],
  embed : "//api.pinterest.com/v3/embed/",
  disco : "//assets.pinterest.com/ext/",
  pin : "pinterest.com/pin/create",
  pinMethod : "bookmarklet",
  dataAttributePrefix : "data-pin-",
  imgSizeMin : 119,
  imgSizeFloor : 79,
  validDataAtt : ["url", "media", "description"],
  pop : "status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=750,height=316,left=0,top=0",
  buttonImage : "images/bm/button.png",
  msg : {
    en : {
      cancelTitle : "Cancel",
      noPinIncompletePage : "Sorry, can't pin from non-HTML pages. If you're trying to upload an image, please visit pinterest.com.",
      stumbleuponFrame : "We need to hide the %s% toolbar to pin from this page.  After pinning, you can use the back button in your browser to return to %s%. Click OK to continue or Cancel to stay here.",
      noPinDomain : "Sorry, pinning is not allowed from this domain. Please contact the site operator if you have any questions.",
      noPinMeta : "Sorry, pinning is not allowed from this page. Please contact the site operator if you have any questions.",
      privateDomain : "Sorry, can't pin directly from %privateDomain%.",
      noPinnablesFound : "Sorry, couldn't find any pinnable things on this page.",
      installed : "Oops!\nThat button doesn't work on Pinterest.\nTry using the red Pin It button at the top of any Pin.",
      attrib : "from",
      small : "small"
    },
    de : {
      cancelTitle : "Abbrechen",
      noPinIncompletePage : "Es tut uns leid, aber du kannst keine Inhalte pinnen, die nicht von HTML-Seiten stammen. Falls du versuchst, ein Bild hochzuladen, gehe bitte zu pinterest.com.",
      stumbleuponFrame : "Wir m\u00fcssen die %s% Symbolleiste ausblenden, damit du von dieser Seite pinnen kannst. Nachdem du deine Inhalte gepinnt hast, kannst du mit der Schlatfl\u00e4che Zur\u00fcck in deinem Browser zur\u00fcck zu %s% gelangen. Klicke auf OK, um fortzufahren, oder auf Abbrechen, um auf dieser Seite zu bleiben.",
      noPinDomain : "Es tut uns leid, aber von dieser Domain kann nichts gepinnt werden. Bitte kontaktiere den Website-Betreiber, falls du weitere Fragen hast.",
      noPinMeta : "Es tut uns leid, aber von dieser Seite kann nichts gepinnt werden. Bitte kontaktiere den Website-Betreiber, falls du weitere Fragen hast.",
      privateDomain : "Es tut uns leid, aber du kannst nicht direkt von %privateDomain% pinnen",
      noPinnablesFound : "Es tut uns leid, aber wir konnten auf dieser Seite nichts finden, was du pinnen k\u00f6nntest.",
      installed : "Hoppla!\nDieser Button funktioniert auf Pinterest nicht.\nVersuchen Sie es stattdessen mit dem roten \u201ePin It\u201c-Button, der sich oberhalb jedes Pins befindet.",
      attrib : "auf",
      small : "wenig"
    },
    es : {
      cancelTitle : "Cancelar",
      noPinIncompletePage : "Lo sentimos, no es posible pinear desde p\u00e1ginas que no sean HTML. Si intentas subir una imagen, visita pinterest.com.",
      stumbleuponFrame : "Para pinear desde esta p\u00e1gina, es necesario ocultar la barra de herramientas de %s%. Despu\u00e9s de pinear, puedes usar el bot\u00f3n de vuelta atr\u00e1s del navegador para volver a %s%. Haz clic en Aceptar para continuar o en Cancelar para permanecer aqu\u00ed.",
      noPinDomain : "Lo sentimos, no est\u00e1 permitido pinear desde este dominio. Ponte en contacto con el operador del sitio si tienes alguna pregunta.",
      noPinMeta : "Lo sentimos, no est\u00e1 permitido pinear desde esta p\u00e1gina. Ponte en contacto con el operador del sitio si tienes alguna pregunta.",
      privateDomain : "Lo sentimos, no es posible pinear directamente desde %privateDomain%.",
      noPinnablesFound : "Lo sentimos, no hemos encontrado ning\u00fan elemento que se pueda pinear en esta p\u00e1gina.",
      installed : "\u00a1Vaya! \nEse bot\u00f3n no funciona en Pinterest. \nUsa el bot\u00f3n Pin It rojo que se encuentra en la parte superior de cualquier Pin.",
      attrib : "en",
      small : "poco"
    },
    "es-mx" : {
      cancelTitle : "Cancelar",
      noPinIncompletePage : "Lamentablemente, no es posible pinear desde p\u00e1ginas que no sean HTML. Si est\u00e1s intentando subir una imagen, accede a pinterest.com.",
      stumbleuponFrame : "Para poder pinear desde esta p\u00e1gina, es necesario ocultar la barra de herramientas %s%. Despu\u00e9s de pinear, usa el bot\u00f3n de flecha hacia atr\u00e1s del navegador para volver a %s%. Haz clic en Aceptar para continuar o en Cancelar para permanecer aqu\u00ed.",
      noPinDomain : "Lamentablemente, no est\u00e1 permitido pinear desde este dominio. Si quieres hacer consultas, comun\u00edcate con el operador del sitio.",
      noPinMeta : "Lamentablemente, no est\u00e1 permitido pinear desde esta p\u00e1gina. Si quieres hacer consultas, comun\u00edcate con el operador del sitio.",
      privateDomain : "Lamentablemente, no es posible pinear directamente desde %privateDomain%.",
      noPinnablesFound : "Lamentablemente, no se encontraron cosas para pinear en esta p\u00e1gina.",
      installed : "\u00a1Uy! \nEse bot\u00f3n no funciona en Pinterest.\nIntenta con el bot\u00f3n rojo de Pin It, ubicado en la parte superior de cualquier Pin.",
      attrib : "en",
      small : "poco"
    },
    fr : {
      cancelTitle : "Annuler",
      noPinIncompletePage : "D\u00e9sol\u00e9, mais vous pouvez uniquement \u00e9pingler les contenus issus de pages HTML. Si vous essayez d'importer une image, acc\u00e9dez au site pinterest.com.",
      stumbleuponFrame : "Nous devons masquer la barre d'outils %s% pour \u00e9pingler des contenus \u00e0 partir de cette page. Une fois l'\u00e9pinglage effectu\u00e9, vous pourrez utiliser le bouton Retour de votre navigateur pour retourner \u00e0 %s%. Cliquez sur OK pour continuer ou sur Annuler pour rester sur cette page.",
      noPinDomain : "D\u00e9sol\u00e9, mais vous ne pouvez pas \u00e9pingler les contenus de ce domaine. Pour toute question, veuillez contacter l'administrateur du site.",
      noPinMeta : "D\u00e9sol\u00e9, mais vous ne pouvez pas \u00e9pingler les contenus de cette page. Pour toute question, veuillez contacter l'administrateur du site.",
      privateDomain : "D\u00e9sol\u00e9, mais vous ne pouvez pas \u00e9pingler directement les contenus de %privateDomain%.",
      noPinnablesFound : "D\u00e9sol\u00e9, mais aucun contenu susceptible d'\u00eatre \u00e9pingl\u00e9 n'a \u00e9t\u00e9 trouv\u00e9 sur cette page.",
      installed : "Oups\u2026\nCe bouton ne fonctionne pas sur Pinterest.\nEssayez d'utiliser le bouton rouge Pin It en haut de chaque \u00e9pingle.",
      attrib : "sur",
      small : "faible"
    },
    ja : {
      cancelTitle : "&#12461;&#12515;&#12531;&#12475;&#12523;",
      noPinIncompletePage : "\u7533\u3057\u8a33\u3042\u308a\u307e\u305b\u3093\u3002 HTML \u4ee5\u5916\u306e\u30da\u30fc\u30b8\u3067\u30d4\u30f3\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093\u3002\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u3088\u3046\u3068\u8a66\u307f\u3066\u3044\u308b\u5834\u5408\u306f\u3001 pinterest.com \u306b\u30a2\u30af\u30bb\u30b9\u3057\u3066\u304f\u3060\u3055\u3044",
      stumbleuponFrame : "\u3053\u306e\u30da\u30fc\u30b8\u3067\u30d4\u30f3\u3092\u3059\u308b\u306b\u306f %s% \u30c4\u30fc\u30eb\u30d0\u30fc\u3092\u975e\u8868\u793a\u306b\u3059\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002\u30d4\u30f3\u3092\u3057\u3066\u304b\u3089\u3001\u30d6\u30e9\u30a6\u30b6\u306e [\u623b\u308b] \u30dc\u30bf\u30f3\u3092\u4f7f\u3063\u3066 %s% \u306b\u623b\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002[OK] \u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u7d9a\u884c\u3059\u308b\u304b\u3001[\u30ad\u30e3\u30f3\u30bb\u30eb] \u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u3053\u3053\u306b\u7559\u307e\u308a\u307e\u3059\u3002",
      noPinDomain : "\u3057\u8a33\u3042\u308a\u307e\u305b\u3093\u3002HTML \u4ee5\u5916\u306e\u30da\u30fc\u30b8\u3067\u30d4\u30f3\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093\u3002\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u3088\u3046\u3068\u8a66\u307f\u3066\u3044\u308b\u5834\u5408\u306f\u3001pinterest.com \u306b\u30a2\u30af\u30bb\u30b9\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
      noPinMeta : "\u3053\u306e\u30da\u30fc\u30b8\u304b\u3089\u306e\u30d4\u30f3\u306f\u8a31\u53ef\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002\u3054\u8cea\u554f\u304c\u3042\u308b\u5834\u5408\u306f\u3001\u30b5\u30a4\u30c8\u904b\u55b6\u8005\u306b\u304a\u554f\u3044\u5408\u308f\u305b\u304f\u3060\u3055\u3044\u3002",
      privateDomain : "\u7533\u3057\u8a33\u3054\u3056\u3044\u307e\u305b\u3093\u3001 %privateDomain% \u304b\u3089\u76f4\u63a5\u30d4\u30f3\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093\u3002",
      noPinnablesFound : "\u7533\u3057\u8a33\u3054\u3056\u3044\u307e\u305b\u3093\u3001\u3053\u306e\u30da\u30fc\u30b8\u3067\u30d4\u30f3\u3067\u304d\u308b\u30a2\u30a4\u30c6\u30e0\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
      installed : "Pinterest \u3067\u306f\u3053\u306e\u30dc\u30bf\u30f3\u306f\u4f7f\u3048\u307e\u305b\u3093\u3002\n\u30d4\u30f3\u306e\u4e0a\u90e8\u306b\u3042\u308b\u8d64\u3044 [\u30d4\u30f3] \u30dc\u30bf\u30f3\u3092\u304a\u4f7f\u3044\u304f\u3060\u3055\u3044\u3002",
      attrib : "&#12500;&#12531;&#12418;&#12392;",
      seeAttribTextAfterPartnerLabel : true,
      small : "&#23567;",
      button : "images/pidgets/ja_pin_it_button2.png"
    },
    nl : {
      cancelTitle : "Annuleren",
      noPinIncompletePage : "Sorry, je kunt niet pinnen vanaf pagina's die geen of ongeldige HTML bevatten. Je kunt afbeeldingen uploaden op pinterest.com.",
      stumbleuponFrame : "We moeten de %s%-werkbalk verbergen om te kunnen pinnen vanaf deze pagina. Na het pinnen kun je met de terugknop van je browser teruggaan naar %s%. Klik op OK om door te gaan of op Annuleren om hier te blijven.",
      noPinDomain : "Sorry, het is niet toegestaan om vanaf dit domein te pinnen. Neem contact op met de beheerder van deze website als je vragen hebt.",
      noPinMeta : "Sorry, het is niet toegestaan om vanaf dit domein te pinnen. Neem contact op met de beheerder van deze website als je vragen hebt.",
      privateDomain : "Sorry, je kunt niet direct pinnen vanaf %privateDomain%.",
      noPinnablesFound : "Sorry, er is niets wat je kunt pinnen op deze pagina.",
      installed : "Oeps!\nDie knop werkt niet op Pinterest.\nProbeer de rode Pin It-knoppen die boven pins zweven.",
      attrib : "pp",
      small : "klein"
    },
    pt : {
      cancelTitle : "Cancelar",
      noPinIncompletePage : "Lamentamos, mas n\u00e3o \u00e9 poss\u00edvel afixar pins a partir de p\u00e1ginas HTML. Se est\u00e1s a tentar carregar uma imagem, acede a pinterest.com.",
      stumbleuponFrame : "\u00c9 necess\u00e1rio ocultar a barra de ferramentas %s% para afixar pins a partir desta p\u00e1gina.  Depois de afixares o pin, podes utilizar o bot\u00e3o Anterior do teu browser, para regressar a %s%. Clica em OK para continuar ou em Cancelar para ficar aqui.",
      noPinDomain : "Lamentamos, mas n\u00e3o \u00e9 permitido afixar pins a partir deste dom\u00ednio. Em caso de d\u00favidas, contacta o operador do site.",
      noPinMeta : "Lamentamos, mas n\u00e3o \u00e9 permitido afixar pins a partir desta p\u00e1gina. Em caso de d\u00favidas, contacta o operador do site.",
      privateDomain : "Lamentamos, mas n\u00e3o \u00e9 poss\u00edvel afixar pins diretamente de %privateDomain%.",
      noPinnablesFound : "Lamentamos, mas n\u00e3o foi poss\u00edvel encontrar nesta p\u00e1gina nenhum conte\u00fado que possa ser afixado.",
      installed : "Ups! \nEsse bot\u00e3o n\u00e3o funciona no Pinterest. \nTenta utilizar o bot\u00e3o vermelho Pin It, que se encontra na parte superior de cada Pin.",
      attrib : "em",
      small : "pequeno"
    },
    "pt-br" : {
      cancelTitle : "Cancelar",
      noPinIncompletePage : "N\u00e3o \u00e9 poss\u00edvel pinar a partir de p\u00e1ginas que n\u00e3o sejam HTML. Se estiver tentando fazer o upload de uma imagem, acesse pinterest.com.",
      stumbleuponFrame : "\u00c9 necess\u00e1rio ocultar a barra de ferramentas %s% para pinar a partir desta p\u00e1gina. Ap\u00f3s a pinagem, voc\u00ea poder\u00e1 usar o bot\u00e3o Voltar do navegador para retornar a %s%. Clique em OK para continuar ou Cancelar para permanecer aqui.",
      noPinDomain : "N\u00e3o \u00e9 poss\u00edvel pinar a partir deste dom\u00ednio. Entre em contato com o operador do site se tiver d\u00favidas.",
      noPinMeta : "N\u00e3o \u00e9 poss\u00edvel pinar a partir desta p\u00e1gina. Entre em contato com o operador do site se tiver d\u00favidas.",
      privateDomain : "N\u00e3o \u00e9 poss\u00edvel pinar diretamente de %privateDomain%.",
      noPinnablesFound : "N\u00e3o foi poss\u00edvel encontrar nesta p\u00e1gina conte\u00fado que possa ser pinado.",
      installed : "Opa!\nEste bot\u00e3o n\u00e3o funciona no Pinterest.\nTente usar o bot\u00e3o vermelho Pin It, localizado na parte superior de qualquer Pin.",
      attrib : "em",
      small : "pequeno"
    }
  },
  presentation : {
    "div#_bg" : {
      position : "fixed",
      top : "0px",
      left : "0px",
      right : "0px",
      bottom : "0px",
      height : "100%",
      width : "100%",
      background : "#eee",
      "z-index" : "2147483641"
    },
    "div#_bd" : {
      "z-index" : "2147483642",
      "text-align" : "center",
      position : "absolute",
      width : "100%",
      top : "0",
      left : "0",
      right : "0",
      font : "16px helvetica neue,arial,san-serif",
      "#_spacer" : {
        display : "block",
        height : "60px"
      },
      "div#_hd" : {
        "z-index" : "2147483643",
        "-moz-box-shadow" : "0 1px 2px #aaa",
        "-webkit-box-shadow" : "0 1px 2px #aaa",
        "box-shadow" : "0 1px 2px #aaa",
        position : "fixed",
        "*position" : "absolute",
        width : "100%",
        top : "0",
        left : "0",
        right : "0",
        height : "45px",
        display : "block",
        margin : "0",
        background : "#fbf7f7",
        "border-bottom" : "1px solid #aaa",
        "&._noHeader" : {
          height : "1px",
          "background-color" : "#f2f2f2",
          "-moz-box-shadow" : "none",
          "-webkit-box-shadow" : "none",
          "box-shadow" : "none",
          border : "none"
        },
        "a#_x" : {
          display : "inline-block",
          cursor : "pointer",
          color : "#524D4D",
          "text-shadow" : "0 1px #fff",
          "float" : "right",
          "line-height" : "45px",
          "font-size" : "14px",
          "font-weight" : "bold",
          "text-align" : "center",
          width : "100px",
          "border-left" : "1px solid #aaa",
          "&:hover" : {
            color : "#524D4D",
            background : "#e1dfdf",
            "text-decoration" : "none"
          },
          "&:active" : {
            color : "#fff",
            background : "#cb2027",
            "text-decoration" : "none",
            "text-shadow" : "none"
          }
        },
        "#_logo" : {
          height : "43px",
          width : "100px",
          display : "inline-block",
          "margin-right" : "-100px",
          background : "transparent url(_cdn/images/LogoRed.png) 50% 50% no-repeat",
          border : "none"
        }
      },
      "iframe#_nag" : {
        height : "300px",
        width : "745px",
        padding : "0",
        margin : "0 auto 10px"
      },
      "div#_ct" : {
        margin : "0 auto 50px",
        position : "relative",
        "span._thumb" : {
          background : "#bbb",
          position : "absolute",
          "border-radius" : "3px",
          "-moz-box-shadow" : "0 0 2px #555",
          "-webkit-box-shadow" : "0 0 2px #555",
          "box-shadow" : "0 0 2px #555",
          overflow : "hidden",
          "span._pin" : {
            position : "absolute",
            top : "0",
            left : "0",
            width : "100%",
            cursor : "pointer",
            zoom : "1",
            "background-position" : "50% 50%",
            "background-repeat" : "no-repeat",
            "-moz-transition-property" : "background-color",
            "-moz-transition-duration" : ".25s",
            "-webkit-transition-property" : "background-color",
            "-webkit-transition-duration" : ".25s",
            "transition-property" : "background-color",
            "transition-duration" : ".25s",
            "img._thumb" : {
              border : "none",
              margin : "0",
              padding : "0"
            }
          },
          "&:hover" : {
            "span._pin" : {
              "background-image" : "url(_cdn/_pin_it_button)",
              "background-color" : "rgba(0, 0, 0, .25)"
            },
            "div._info" : {
              "background-color" : "#fff",
              "background-image" : "url(_cdn/images/bm/pencil.png)"
            }
          },
          "span._play" : {
            position : "absolute",
            top : "0",
            left : "0",
            width : "100%",
            background : "transparent url(_cdn/images/bm/play.png) 50% 50% no-repeat"
          },
          small : {
            position : "absolute",
            right : "0",
            left : "0",
            width : "100%",
            height : "30px",
            "line-height" : "30px",
            "text-align" : "center",
            "font-size" : "10px",
            background : "#fff",
            color : "#000",
            "border-top" : "1px solid #eee"
          },
          "div._info" : {
            position : "absolute",
            "border-top" : "1px solid #eee",
            left : "0",
            right : "0",
            bottom : "0",
            width : "100%",
            color : "#333",
            padding : "14px 0 14px 0",
            "line-height" : "17px",
            "font-size" : "13px",
            "font-style" : "normal",
            "font-weight" : "normal",
            "text-align" : "left",
            "text-shadow" : "none",
            overflow : "hidden",
            "background-color" : "#f6f6f6",
            "background-position" : "215px 15px",
            "background-repeat" : "no-repeat",
            "&._hazAttrib" : {
              "padding-bottom" : "45px"
            },
            span : {
              display : "block",
              margin : "0 18px 0 14px"
            },
            "span._attrib" : {
              "border-top" : "1px solid #eee",
              position : "absolute",
              bottom : "0",
              margin : "0",
              left : "0",
              right : "0",
              height : "30px",
              "line-height" : "30px",
              "font-size" : "11px",
              "text-indent" : "14px",
              background : "#fff",
              "img._attrib" : {
                "vertical-align" : "middle",
                margin : "0",
                padding : "0"
              }
            }
          }
        }
      }
    },
    "@media only screen and (-webkit-min-device-pixel-ratio: 2)" : {
      "#_logo" : {
        "background-size" : "100px 26px",
        "background-image" : "url(_cdn/images/LogoRed.2x.png)"
      }
    }
  },
  lookup : {
    artsy : {
      label : "Artsy",
      page : {
        seek : [/^https?:\/\/(.*?\.|)artsy\.net\/artwork\//, /^https?:\/\/(.*?\.|)artsy\.net\/post\//]
      },
      img : {
        seek : [/^https?:\/\/(.*?\.|)artsy\.net\//],
        act : "lookup"
      }
    },
    behance : {
      label : "Behance",
      img : {
        seek : [/^http:\/\/behance\.vo\.llnwd\.net\//, /^https?:\/\/m?[0-9]\.behance\.net\//],
        act : "lookup"
      }
    },
    dasauge : {
      label : "Dasauge",
      img : {
        seek : [/^https?:\/\/cdn?[0-9]\.dasauge\.net\//],
        act : "lookup"
      }
    },
    dailymotion : {
      label : "DailyMotion",
      page : {
        seek : [/^https?:\/\/.*?\.dailymotion\.com\//],
        act : "lookup",
        via : "id",
        multimedia : true,
        doNotCrawl : true
      }
    },
    dreamstime : {
      label : "Dreamstime",
      img : {
        seek : [/(.*?)\.dreamstime\.com\//],
        act : "lookup"
      }
    },
    etsy : {
      label : "Etsy",
      page : {
        seek : [/^https?:\/\/.*?\.etsy\.com\/listing\//],
        patch : {
          /**
           * @param {string} img
           * @return {?}
           */
          img : function(img) {
            return img.replace(/il_(.*?)\./, "il_570xN.");
          }
        }
      },
      img : {
        seek : [/^https?:\/\/.*?\.etsystatic\.com\//],
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          return fun.replace(/il_(.*?)\./, "il_570xN.");
        },
        act : "lookup"
      }
    },
    fivehundredpx : {
      label : "500px",
      page : {
        seek : [/^https?:\/\/500px\.com\/photo\//],
        act : "lookup",
        via : "id",
        doNotCrawl : true
      },
      img : {
        seek : [/^https?:\/\/pp?cdn\.500px\.(net|org)/],
        act : "lookup"
      }
    },
    facebook : {
      page : {
        seek : [/^https?:\/\/(.*?\.|)facebook\.com\//],
        act : "close",
        msg : "privateDomain",
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          return fun.replace(/%privateDomain%/, "Facebook");
        }
      }
    },
    flickr : {
      label : "Flickr",
      page : {
        seek : [/^https?:\/\/www\.flickr\.com\//],
        act : "lookup",
        via : "id",
        doNotCrawl : true
      },
      img : {
        seek : [/staticflickr.com\//, /static.flickr.com\//],
        act : "lookup"
      }
    },
    foursquare : {
      page : {
        seek : [/^https?:\/\/(.*?\.|)foursquare\.com\//],
        /**
         * @return {undefined}
         */
        patch : function() {
          /** @type {NodeList} */
          var nodes = document.getElementsByTagName("img");
          /** @type {RegExp} */
          var typePattern = /net\/img\/general/;
          /** @type {number} */
          var i = 0;
          /** @type {number} */
          var len = nodes.length;
          for (;i < len;i += 1) {
            if (nodes[i].src && nodes[i].src.match(typePattern)) {
              var parts = nodes[i].src.split("/");
              if (parts.length > 2) {
                var prevValue = parts[0] + "//" + parts[2] + "/img/general/width960/" + parts.pop();
                nodes[i].setAttribute("data-pin-media", prevValue);
              }
              var a = nodes[i].parentNode;
              if ("A" === a.tagName) {
                if (a.href) {
                  nodes[i].setAttribute("data-pin-url", a.href);
                }
              }
            } else {
              nodes[i].setAttribute("nopin", true);
            }
          }
        }
      }
    },
    geograph : {
      label : "Geograph",
      img : {
        seek : [/^https?:\/\/(.*?)\.geograph\.org\./],
        act : "lookup"
      }
    },
    googleReader : {
      page : {
        seek : [/^https?:\/\/.*?\.google\.com\/reader\//],
        act : "close",
        msg : "privateDomain",
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          return fun.replace(/%privateDomain%/, "Google Reader");
        }
      }
    },
    googleList : {
      page : {
        seek : [/^https?:\/\/www\.google\.com\/search(.*&tbm=isch.*)/],
        /**
         * @param {Object} data
         * @return {undefined}
         */
        patch : function(data) {
          data.f.debug("patching Google Image Search results");
          var root;
          var link;
          var i;
          var l;
          var elems;
          var directives;
          var vstr;
          var sign;
          if (root = data.d.getElementById("ires")) {
            link = root.getElementsByTagName("A");
            /** @type {number} */
            i = 0;
            l = link.length;
            for (;i < l;i += 1) {
              /** @type {string} */
              vstr = "";
              /** @type {string} */
              sign = "";
              if (link[i].href) {
                directives = link[i].href.split("imgrefurl=");
                if (directives[1]) {
                  vstr = directives[1].split("&")[0];
                }
                directives = link[i].href.split("imgurl=");
                if (directives[1]) {
                  sign = directives[1].split("&")[0];
                }
              }
              if (vstr) {
                if (sign) {
                  elems = link[i].getElementsByTagName("IMG");
                  if (elems[0]) {
                    data.f.set(elems[0], "data-pin-url", decodeURIComponent(vstr));
                    data.f.set(elems[0], "data-pin-media", decodeURIComponent(sign));
                  }
                }
              }
            }
          }
        }
      }
    },
    imdb : {
      img : {
        seek : [/^https?:\/\/(.*?)\.media-imdb\.com\/images\//],
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          return fun.replace(/@@(.*)/, "@@._V1_SX800.jpg");
        }
      }
    },
    kickstarter : {
      label : "Kickstarter",
      page : {
        seek : [/^https?:\/\/.*?\.kickstarter\.com\/projects\//],
        act : "lookup",
        via : "id",
        multimedia : true
      }
    },
    polyvore : {
      label : "Polyvore",
      page : {
        seek : [/^https?:\/\/(.*?\.|)polyvore\.com\//],
        act : "lookup",
        via : "id",
        doNotCrawl : true
      },
      img : {
        seek : [/^https?:\/\/(.*?)\.polyvoreimg\.com\//],
        act : "lookup"
      }
    },
    shutterstock : {
      label : "Shutterstock",
      img : {
        seek : [/^https?:\/\/image.shutterstock\.com\//, /^https?:\/\/thumb(.*?).shutterstock\.com\//],
        act : "lookup"
      }
    },
    slideshare : {
      label : "Slideshare",
      page : {
        seek : [/^https?:\/\/.*?\.slideshare\.net\//],
        act : "lookup",
        via : "id",
        multimedia : true,
        doNotCrawl : true
      }
    },
    soundcloud : {
      label : "SoundCloud",
      page : {
        seek : [/^https?:\/\/soundcloud\.com\//],
        act : "lookup",
        via : "id",
        multimedia : true,
        doNotCrawl : true
      }
    },
    stumbleuponFrame : {
      page : {
        seek : [/^https?:\/\/(.*?\.|)stumbleupon\.com\/su/],
        act : "bustFrame",
        serviceName : "StumbleUpon",
        frameId : ["tb-stumble-frame", "stumbleFrame"]
      }
    },
    ted : {
      label : "TED",
      page : {
        seek : [/^https?:\/\/(.*?)\.ted\.com\/talks\//],
        act : "lookup",
        via : "id",
        multimedia : true,
        doNotCrawl : true
      },
      img : {
        seek : [/^https?:\/\/(.*?)\.ted\.com\//],
        act : "lookup"
      },
      iframe : {
        seek : [/^https?:\/\/(.*?)\.ted\.com\//],
        act : "lookup",
        via : "id"
      }
    },
    tumblr : {
      img : {
        seek : [/^https?:\/\/.*?\.media\.tumblr\.com\//],
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          return fun.replace(/_(\d+)\.jpg$/, "_1280.jpg");
        }
      }
    },
    tumblrList : {
      page : {
        seek : [/^https?:\/\/www\.tumblr\.com\/tagged/, /^https?:\/\/www\.tumblr\.com\/dashboard/],
        /**
         * @param {Object} options
         * @return {undefined}
         */
        patch : function(options) {
          options.f.debug("patching Tumblr search or index");
          var elements;
          var index;
          var _len;
          var worlds;
          var codeSegments;
          var i;
          var max;
          var val;
          var data_tumblelog_content_rating;
          elements = options.d.getElementsByTagName("LI");
          /** @type {number} */
          index = 0;
          _len = elements.length;
          for (;index < _len;index += 1) {
            data_tumblelog_content_rating = options.f.get(elements[index], "data-tumblelog-content-rating");
            worlds = elements[index].getElementsByTagName("A");
            /** @type {string} */
            val = "";
            /** @type {number} */
            i = 0;
            max = worlds.length;
            for (;i < max;i += 1) {
              if (worlds[i].id && worlds[i].id.split("permalink_")[1]) {
                val = worlds[i].href;
                break;
              }
            }
            if (val) {
              codeSegments = elements[index].getElementsByTagName("IMG");
              /** @type {number} */
              i = 0;
              max = codeSegments.length;
              for (;i < max;i += 1) {
                if ("adult" === data_tumblelog_content_rating) {
                  options.f.set(codeSegments[i], "data-pin-nopin", true);
                  options.f.debug("do not pin per Tumblr content rating: " + codeSegments[i].src);
                  options.f.log("nsfw_per_domain", codeSegments[i].src, val);
                } else {
                  options.f.set(codeSegments[i], "data-pin-url", val);
                }
              }
            }
          }
        }
      }
    },
    vimeo : {
      label : "Vimeo",
      page : {
        seek : [/^https?:\/\/vimeo\.com\//],
        act : "lookup",
        via : "link",
        /**
         * @param {Object} options
         * @return {undefined}
         */
        patch : function(options) {
          options.f.debug("patching Vimeo page");
          var employees;
          var i;
          var l;
          var attrs;
          var elems;
          var j;
          var jj;
          var link;
          var dataId;
          var results;
          var none;
          results = options.d.getElementsByTagName("META");
          /** @type {number} */
          i = 0;
          l = results.length;
          for (;i < l;i += 1) {
            none = results[i].getAttribute("itemprop");
            if ("image" === none) {
              if (results[i].content) {
                options.v.pref.pin.media = results[i].content;
              }
            }
            if ("playpageUrl" === none) {
              if (results[i].content) {
                options.v.pref.pin.url = results[i].content;
              }
            }
          }
          employees = options.d.getElementsByTagName("LI");
          /** @type {number} */
          i = 0;
          l = employees.length;
          for (;i < l;i += 1) {
            if (employees[i].id && employees[i].id.match(/^clip/)) {
              attrs = employees[i].id.split("clip");
              if (attrs[1]) {
                attrs[1] = attrs[1].replace(/_/, "");
                options.f.thumbMedia("http://vimeo.com/" + attrs[1], "vimeo", "link");
              }
            } else {
              link = employees[i].getElementsByTagName("A");
              if (link[0]) {
                dataId = options.f.get(link[0], "data-id");
                if (dataId) {
                  options.f.thumbMedia("http://vimeo.com/" + dataId, "vimeo", "link");
                }
              }
            }
            elems = employees[i].getElementsByTagName("IMG");
            /** @type {number} */
            j = 0;
            jj = elems.length;
            for (;j < jj;j += 1) {
              options.f.set(elems[j], "data-pin-nopin", true);
            }
          }
        }
      },
      iframe : {
        seek : [/^http?s:\/\/vimeo\.com\/(\d+)/, /^http:\/\/player\.vimeo\.com\/video\/(\d+)/],
        act : "lookup",
        via : "link",
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          /** @type {null} */
          var str = null;
          var last = fun.split("#")[0].split("?")[0].split("/").pop();
          return last > 1E3 && (str = "http://vimeo.com/" + last), str;
        },
        att : "src"
      }
    },
    yelp : {
      page : {
        seek : [/^https?:\/\/(.*?\.|)yelp\.com\//],
        /**
         * @return {undefined}
         */
        patch : function() {
          /** @type {NodeList} */
          var nodes = document.getElementsByTagName("img");
          /** @type {RegExp} */
          var typePattern = /bphoto/;
          /** @type {number} */
          var i = 0;
          /** @type {number} */
          var len = nodes.length;
          for (;i < len;i += 1) {
            if (nodes[i].src && nodes[i].src.match(typePattern)) {
              var bits = nodes[i].src.split("/");
              if (bits.length > 2) {
                bits.pop();
                var prevValue = bits.join("/") + "/o.jpg";
                nodes[i].setAttribute("data-pin-media", prevValue);
                var a = nodes[i].parentNode;
                if ("A" === a.tagName) {
                  if (a.href) {
                    nodes[i].setAttribute("data-pin-url", a.href);
                  }
                }
              }
            } else {
              nodes[i].setAttribute("nopin", true);
            }
          }
        }
      }
    },
    youtube : {
      label : "YouTube",
      page : {
        seek : [/^https?:\/\/www\.youtube\.com\/watch/],
        act : "lookup",
        via : "link",
        multimedia : true,
        extended : true
      },
      video : {
        seek : [/^https?:\/\/(.*?\.|)youtube\.com\/videoplayback/],
        act : "lookup",
        via : "link",
        att : "data-youtube-id",
        /**
         * @param {Object} host
         * @return {?}
         */
        patch : function(host) {
          /** @type {null} */
          var digest_uri = null;
          return host && (digest_uri = "http://www.youtube.com/embed/" + host), digest_uri;
        }
      },
      iframe : {
        seek : [/^https?:\/\/(.*?\.|)youtube\.com\/embed\//],
        act : "lookup",
        via : "link"
      },
      embed : {
        seek : [/^http:\/\/s\.ytimg\.com\/yt\//],
        /**
         * @param {string} fun
         * @return {?}
         */
        patch : function(fun) {
          /** @type {null} */
          var s = null;
          var directives = fun.split("video_id=");
          return directives[1] && (s = directives[1].split("&")[0], s = "http://www.youtube.com/embed/" + s), s;
        },
        att : "flashvars"
      },
      img : {
        seek : [/^https?:\/\/(.*?\.|)ytimg\.com\/(vi|li)\//, /img.youtube.com\/vi\//],
        act : "lookup"
      }
    }
  }
});
