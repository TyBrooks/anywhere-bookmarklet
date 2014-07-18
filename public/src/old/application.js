(function(win, ready) {
  /**
   * @param {string} fix
   * @return {?}
   */
  function isArraylike(fix) {
    var cnl = fix.length;
    var type = jQuery.type(fix);
    return jQuery.isWindow(fix) ? false : 1 === fix.nodeType && cnl ? true : "array" === type || "function" !== type && (0 === cnl || "number" === typeof cnl && (0 < cnl && cnl - 1 in fix));
  }
  /**
   * @param {string} options
   * @return {?}
   */
  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.match(core_rnotwhite) || [], function(dataAndEvents, flag) {
      /** @type {boolean} */
      object[flag] = true;
    });
    return object;
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {string} node
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  function compile(elem, name, node, dataAndEvents) {
    if (jQuery.acceptData(elem)) {
      var internalKey = jQuery.expando;
      var isNode = elem.nodeType;
      var cache = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
      if (id && (cache[id] && (dataAndEvents || cache[id].data)) || !(node === ready && "string" === typeof name)) {
        if (!id) {
          id = isNode ? elem[internalKey] = core_deletedIds.pop() || jQuery.guid++ : internalKey;
        }
        if (!cache[id]) {
          /** @type {({})} */
          cache[id] = isNode ? {} : {
            toJSON : jQuery.noop
          };
        }
        if ("object" === typeof name || "function" === typeof name) {
          if (dataAndEvents) {
            cache[id] = jQuery.extend(cache[id], name);
          } else {
            cache[id].data = jQuery.extend(cache[id].data, name);
          }
        }
        elem = cache[id];
        if (!dataAndEvents) {
          if (!elem.data) {
            elem.data = {};
          }
          elem = elem.data;
        }
        if (node !== ready) {
          /** @type {string} */
          elem[jQuery.camelCase(name)] = node;
        }
        if ("string" === typeof name) {
          node = elem[name];
          if (null == node) {
            node = elem[jQuery.camelCase(name)];
          }
        } else {
          /** @type {Object} */
          node = elem;
        }
        return node;
      }
    }
  }
  /**
   * @param {Object} elem
   * @param {string} name
   * @param {boolean} keepData
   * @return {undefined}
   */
  function remove(elem, name, keepData) {
    if (jQuery.acceptData(elem)) {
      var cache;
      var i;
      var isNode = elem.nodeType;
      var response = isNode ? jQuery.cache : elem;
      var id = isNode ? elem[jQuery.expando] : jQuery.expando;
      if (response[id]) {
        if (name && (cache = keepData ? response[id] : response[id].data)) {
          if (jQuery.isArray(name)) {
            name = name.concat(jQuery.map(name, jQuery.camelCase));
          } else {
            if (name in cache) {
              /** @type {Array} */
              name = [name];
            } else {
              name = jQuery.camelCase(name);
              name = name in cache ? [name] : name.split(" ");
            }
          }
          i = name.length;
          for (;i--;) {
            delete cache[name[i]];
          }
          if (keepData ? !filter(cache) : !jQuery.isEmptyObject(cache)) {
            return;
          }
        }
        if (!keepData && (delete response[id].data, !filter(response[id]))) {
          return;
        }
        if (isNode) {
          jQuery.cleanData([elem], true);
        } else {
          if (jQuery.support.deleteExpando || response != response.window) {
            delete response[id];
          } else {
            /** @type {null} */
            response[id] = null;
          }
        }
      }
    }
  }
  /**
   * @param {string} fix
   * @param {string} key
   * @param {string} data
   * @return {?}
   */
  function dataAttr(fix, key, data) {
    if (data === ready && 1 === fix.nodeType) {
      if (data = "data-" + key.replace(r20, "-$1").toLowerCase(), data = fix.getAttribute(data), "string" === typeof data) {
        try {
          data = "true" === data ? true : "false" === data ? false : "null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (h) {
        }
        jQuery.data(fix, key, data);
      } else {
        /** @type {string} */
        data = ready;
      }
    }
    return data;
  }
  /**
   * @param {Object} obj
   * @return {?}
   */
  function filter(obj) {
    var name;
    for (name in obj) {
      if (!("data" === name && jQuery.isEmptyObject(obj[name])) && "toJSON" !== name) {
        return false;
      }
    }
    return true;
  }
  /**
   * @return {?}
   */
  function returnTrue() {
    return true;
  }
  /**
   * @return {?}
   */
  function returnFalse() {
    return false;
  }
  /**
   * @return {?}
   */
  function safeActiveElement() {
    try {
      return node.activeElement;
    } catch (a) {
    }
  }
  /**
   * @param {Object} cur
   * @param {string} dir
   * @return {?}
   */
  function sibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && 1 !== cur.nodeType);
    return cur;
  }
  /**
   * @param {string} elements
   * @param {string} type
   * @param {Object} isXML
   * @return {?}
   */
  function winnow(elements, type, isXML) {
    if (jQuery.isFunction(type)) {
      return jQuery.grep(elements, function(ret, tx) {
        return!!type.call(ret, tx, ret) !== isXML;
      });
    }
    if (type.nodeType) {
      return jQuery.grep(elements, function(clas) {
        return clas === type !== isXML;
      });
    }
    if ("string" === typeof type) {
      if (rmouseEvent.test(type)) {
        return jQuery.filter(type, elements, isXML);
      }
      type = jQuery.filter(type, elements);
    }
    return jQuery.grep(elements, function(arg) {
      return 0 <= jQuery.inArray(arg, type) !== isXML;
    });
  }
  /**
   * @param {Document} context
   * @return {?}
   */
  function get(context) {
    /** @type {Array.<string>} */
    var braceStack = uHostName.split("|");
    context = context.createDocumentFragment();
    if (context.createElement) {
      for (;braceStack.length;) {
        context.createElement(braceStack.pop());
      }
    }
    return context;
  }
  /**
   * @param {Node} elem
   * @param {Object} content
   * @return {?}
   */
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") && jQuery.nodeName(1 === content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
  }
  /**
   * @param {Object} elem
   * @return {?}
   */
  function restoreScript(elem) {
    /** @type {string} */
    elem.type = (null !== jQuery.find.attr(elem, "type")) + "/" + elem.type;
    return elem;
  }
  /**
   * @param {Element} elem
   * @return {?}
   */
  function fn(elem) {
    /** @type {(Array.<string>|null)} */
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      /** @type {string} */
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }
  /**
   * @param {(Array|NodeList)} elems
   * @param {Array} refElements
   * @return {undefined}
   */
  function setGlobalEval(elems, refElements) {
    var cur;
    /** @type {number} */
    var i = 0;
    for (;null != (cur = elems[i]);i++) {
      jQuery._data(cur, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
    }
  }
  /**
   * @param {Object} src
   * @param {Object} dest
   * @return {undefined}
   */
  function cloneCopyEvent(src, dest) {
    if (1 === dest.nodeType && jQuery.hasData(src)) {
      var fn;
      var type;
      var valsLength;
      type = jQuery._data(src);
      var curData = jQuery._data(dest, type);
      var store = type.events;
      if (store) {
        for (fn in delete curData.handle, curData.events = {}, store) {
          /** @type {number} */
          type = 0;
          valsLength = store[fn].length;
          for (;type < valsLength;type++) {
            jQuery.event.add(dest, fn, store[fn][type]);
          }
        }
      }
      if (curData.data) {
        curData.data = jQuery.extend({}, curData.data);
      }
    }
  }
  /**
   * @param {Node} context
   * @param {string} tag
   * @return {?}
   */
  function getAll(context, tag) {
    var opt_nodes;
    var node;
    /** @type {number} */
    var i = 0;
    var ret = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || "*") : ready;
    if (!ret) {
      /** @type {Array} */
      ret = [];
      opt_nodes = context.childNodes || context;
      for (;null != (node = opt_nodes[i]);i++) {
        if (!tag || jQuery.nodeName(node, tag)) {
          ret.push(node);
        } else {
          jQuery.merge(ret, getAll(node, tag));
        }
      }
    }
    return tag === ready || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret;
  }
  /**
   * @param {Element} elem
   * @return {undefined}
   */
  function callback(elem) {
    if (manipulation_rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  /**
   * @param {Object} style
   * @param {string} name
   * @return {?}
   */
  function vendorPropName(style, name) {
    if (name in style) {
      return name;
    }
    var capName = name.charAt(0).toUpperCase() + name.slice(1);
    /** @type {string} */
    var origName = name;
    /** @type {number} */
    var i = cssPrefixes.length;
    for (;i--;) {
      if (name = cssPrefixes[i] + capName, name in style) {
        return name;
      }
    }
    return origName;
  }
  /**
   * @param {Object} node
   * @param {Function} context
   * @return {?}
   */
  function cycle(node, context) {
    node = context || node;
    return "none" === jQuery.css(node, "display") || !jQuery.contains(node.ownerDocument, node);
  }
  /**
   * @param {Array} elements
   * @param {boolean} show
   * @return {?}
   */
  function showHide(elements, show) {
    var display;
    var elem;
    var hidden;
    /** @type {Array} */
    var values = [];
    /** @type {number} */
    var index = 0;
    var length = elements.length;
    for (;index < length;index++) {
      if (elem = elements[index], elem.style) {
        if (values[index] = jQuery._data(elem, "olddisplay"), display = elem.style.display, show) {
          if (!values[index]) {
            if ("none" === display) {
              /** @type {string} */
              elem.style.display = "";
            }
          }
          if ("" === elem.style.display) {
            if (cycle(elem)) {
              values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
            }
          }
        } else {
          if (!values[index] && (hidden = cycle(elem), display && "none" !== display || !hidden)) {
            jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
          }
        }
      }
    }
    /** @type {number} */
    index = 0;
    for (;index < length;index++) {
      if (elem = elements[index], elem.style && (!show || ("none" === elem.style.display || "" === elem.style.display))) {
        elem.style.display = show ? values[index] || "" : "none";
      }
    }
    return elements;
  }
  /**
   * @param {string} elems
   * @param {string} value
   * @param {string} keepData
   * @return {?}
   */
  function setPositiveNumber(elems, value, keepData) {
    return(elems = r.exec(value)) ? Math.max(0, elems[1] - (keepData || 0)) + (elems[2] || "px") : value;
  }
  /**
   * @param {string} elem
   * @param {number} i
   * @param {string} extra
   * @param {boolean} isBorderBox
   * @param {string} styles
   * @return {?}
   */
  function augmentWidthOrHeight(elem, i, extra, isBorderBox, styles) {
    /** @type {number} */
    i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === i ? 1 : 0;
    /** @type {number} */
    var val = 0;
    for (;4 > i;i += 2) {
      if ("margin" === extra) {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if ("content" === extra) {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }
        if ("margin" !== extra) {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      } else {
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        if ("padding" !== extra) {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
        }
      }
    }
    return val;
  }
  /**
   * @param {string} elem
   * @param {string} name
   * @param {string} extra
   * @return {?}
   */
  function getWidthOrHeight(elem, name, extra) {
    /** @type {boolean} */
    var valueIsBorderBox = true;
    var val = "width" === name ? elem.offsetWidth : elem.offsetHeight;
    var styles = getStyles(elem);
    var isBorderBox = jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles);
    if (0 >= val || null == val) {
      val = css(elem, name, styles);
      if (0 > val || null == val) {
        val = elem.style[name];
      }
      if (res.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
      /** @type {number} */
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
  }
  /**
   * @param {?} nodeName
   * @return {?}
   */
  function defaultDisplay(nodeName) {
    /** @type {Document} */
    var doc = node;
    var display = elemdisplay[nodeName];
    if (!display) {
      display = actualDisplay(nodeName, doc);
      if ("none" === display || !display) {
        iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement);
        doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
        doc.write("<!doctype html><html><body>");
        doc.close();
        display = actualDisplay(nodeName, doc);
        iframe.detach();
      }
      elemdisplay[nodeName] = display;
    }
    return display;
  }
  /**
   * @param {?} name
   * @param {Document} doc
   * @return {?}
   */
  function actualDisplay(name, doc) {
    var el = jQuery(doc.createElement(name)).appendTo(doc.body);
    var display = jQuery.css(el[0], "display");
    el.remove();
    return display;
  }
  /**
   * @param {string} prefix
   * @param {string} fix
   * @param {boolean} traditional
   * @param {Function} add
   * @return {undefined}
   */
  function buildParams(prefix, fix, traditional, add) {
    var name;
    if (jQuery.isArray(fix)) {
      jQuery.each(fix, function(i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + "[" + ("object" === typeof v ? i : "") + "]", v, traditional, add);
        }
      });
    } else {
      if (!traditional && "object" === jQuery.type(fix)) {
        for (name in fix) {
          buildParams(prefix + "[" + name + "]", fix[name], traditional, add);
        }
      } else {
        add(prefix, fix);
      }
    }
  }
  /**
   * @param {Object} structure
   * @return {?}
   */
  function addToPrefiltersOrTransports(structure) {
    return function(selector, fn) {
      if ("string" !== typeof selector) {
        /** @type {(Function|string)} */
        fn = selector;
        /** @type {string} */
        selector = "*";
      }
      var node;
      /** @type {number} */
      var i = 0;
      var elem = selector.toLowerCase().match(core_rnotwhite) || [];
      if (jQuery.isFunction(fn)) {
        for (;node = elem[i++];) {
          if ("+" === node[0]) {
            node = node.slice(1) || "*";
            (structure[node] = structure[node] || []).unshift(fn);
          } else {
            (structure[node] = structure[node] || []).push(fn);
          }
        }
      }
    };
  }
  /**
   * @param {?} structure
   * @param {?} options
   * @param {Object} originalOptions
   * @param {?} jqXHR
   * @return {?}
   */
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    /**
     * @param {string} type
     * @return {?}
     */
    function inspect(type) {
      var msg;
      /** @type {boolean} */
      special[type] = true;
      jQuery.each(structure[type] || [], function(dataAndEvents, prefilterOrFactory) {
        var type = prefilterOrFactory(options, originalOptions, jqXHR);
        if ("string" === typeof type && (!seekingTransport && !special[type])) {
          return options.dataTypes.unshift(type), inspect(type), false;
        }
        if (seekingTransport) {
          return!(msg = type);
        }
      });
      return msg;
    }
    var special = {};
    /** @type {boolean} */
    var seekingTransport = structure === transports;
    return inspect(options.dataTypes[0]) || !special["*"] && inspect("*");
  }
  /**
   * @param {(Object|string)} target
   * @param {Object} src
   * @return {?}
   */
  function ajaxExtend(target, src) {
    var deep;
    var key;
    var flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== ready) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
    return target;
  }
  /**
   * @return {?}
   */
  function createStandardXHR() {
    try {
      return new win.XMLHttpRequest;
    } catch (a) {
    }
  }
  /**
   * @return {?}
   */
  function createFxNow() {
    setTimeout(function() {
      /** @type {string} */
      fxNow = ready;
    });
    return fxNow = jQuery.now();
  }
  /**
   * @param {?} attributes
   * @param {?} key
   * @param {?} object
   * @return {?}
   */
  function clone(attributes, key, object) {
    var obj;
    var codeSegments = (cache[key] || []).concat(cache["*"]);
    /** @type {number} */
    var i = 0;
    var valuesLen = codeSegments.length;
    for (;i < valuesLen;i++) {
      if (obj = codeSegments[i].call(object, key, attributes)) {
        return obj;
      }
    }
  }
  /**
   * @param {string} elem
   * @param {Text} data
   * @param {Object} options
   * @return {?}
   */
  function Animation(elem, data, options) {
    var h;
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var l = listeners.length;
    var deferred = jQuery.Deferred().always(function() {
      delete tick.elem;
    });
    /**
     * @return {?}
     */
    var tick = function() {
      if (h) {
        return false;
      }
      var remaining = fxNow || createFxNow();
      /** @type {number} */
      remaining = Math.max(0, animation.startTime + animation.duration - remaining);
      /** @type {number} */
      var percent = 1 - (remaining / animation.duration || 0);
      /** @type {number} */
      var index = 0;
      var sz = animation.tweens.length;
      for (;index < sz;index++) {
        animation.tweens[index].run(percent);
      }
      deferred.notifyWith(elem, [animation, percent, remaining]);
      if (1 > percent && sz) {
        return remaining;
      }
      deferred.resolveWith(elem, [animation]);
      return false;
    };
    var animation = deferred.promise({
      elem : elem,
      props : jQuery.extend({}, data),
      opts : jQuery.extend(true, {
        specialEasing : {}
      }, options),
      originalProperties : data,
      originalOptions : options,
      startTime : fxNow || createFxNow(),
      duration : options.duration,
      tweens : [],
      /**
       * @param {string} prop
       * @param {string} end
       * @return {?}
       */
      createTween : function(prop, end) {
        var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
        animation.tweens.push(tween);
        return tween;
      },
      /**
       * @param {boolean} gotoEnd
       * @return {?}
       */
      stop : function(gotoEnd) {
        /** @type {number} */
        var index = 0;
        var length = gotoEnd ? animation.tweens.length : 0;
        if (h) {
          return this;
        }
        /** @type {boolean} */
        h = true;
        for (;index < length;index++) {
          animation.tweens[index].run(1);
        }
        if (gotoEnd) {
          deferred.resolveWith(elem, [animation, gotoEnd]);
        } else {
          deferred.rejectWith(elem, [animation, gotoEnd]);
        }
        return this;
      }
    });
    options = animation.props;
    propFilter(options, animation.opts.specialEasing);
    for (;i < l;i++) {
      if (data = listeners[i].call(animation, elem, options, animation.opts)) {
        return data;
      }
    }
    jQuery.map(options, clone, animation);
    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    jQuery.fx.timer(jQuery.extend(tick, {
      elem : elem,
      anim : animation,
      queue : animation.opts.queue
    }));
    return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  /**
   * @param {Object} obj
   * @param {Object} members
   * @return {undefined}
   */
  function propFilter(obj, members) {
    var key;
    var name;
    var member;
    var value;
    var hooks;
    for (key in obj) {
      if (name = jQuery.camelCase(key), member = members[name], value = obj[key], jQuery.isArray(value) && (member = value[1], value = obj[key] = value[0]), key !== name && (obj[name] = value, delete obj[key]), (hooks = jQuery.cssHooks[name]) && "expand" in hooks) {
        for (key in value = hooks.expand(value), delete obj[name], value) {
          if (!(key in obj)) {
            obj[key] = value[key];
            members[key] = member;
          }
        }
      } else {
        members[name] = member;
      }
    }
  }
  /**
   * @param {string} selector
   * @param {string} context
   * @param {string} prop
   * @param {string} end
   * @param {string} easing
   * @return {?}
   */
  function Tween(selector, context, prop, end, easing) {
    return new Tween.prototype.init(selector, context, prop, end, easing);
  }
  /**
   * @param {string} type
   * @param {boolean} includeWidth
   * @return {?}
   */
  function genFx(type, includeWidth) {
    var which;
    var attrs = {
      height : type
    };
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    includeWidth = includeWidth ? 1 : 0;
    for (;4 > i;i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  /**
   * @param {Object} node
   * @return {?}
   */
  function getWindow(node) {
    return jQuery.isWindow(node) ? node : 9 === node.nodeType ? node.defaultView || node.parentWindow : false;
  }
  var readyList;
  var element;
  /** @type {string} */
  var core_strundefined = typeof ready;
  /** @type {Location} */
  var location = win.location;
  /** @type {Document} */
  var node = win.document;
  /** @type {Element} */
  var docElem = node.documentElement;
  var $ = win.jQuery;
  var _$ = win.$;
  var class2type = {};
  /** @type {Array} */
  var core_deletedIds = [];
  /** @type {function (this:*, ...[*]): Array} */
  var core_concat = core_deletedIds.concat;
  /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
  var core_push = core_deletedIds.push;
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var core_slice = core_deletedIds.slice;
  /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
  var core_indexOf = core_deletedIds.indexOf;
  /** @type {function (this:*): string} */
  var core_toString = class2type.toString;
  /** @type {function (this:Object, *): boolean} */
  var core_hasOwn = class2type.hasOwnProperty;
  /** @type {function (this:string): string} */
  var _trim = "1.10.2".trim;
  /**
   * @param {string} selector
   * @param {string} context
   * @return {?}
   */
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context, element);
  };
  /** @type {string} */
  var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  /** @type {RegExp} */
  var core_rnotwhite = /\S+/g;
  /** @type {RegExp} */
  var badChars = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  /** @type {RegExp} */
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
  /** @type {RegExp} */
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  /** @type {RegExp} */
  var args = /^[\],:{}\s]*$/;
  /** @type {RegExp} */
  var normalizr = /(?:^|:|,)(?:\s*\[)+/g;
  /** @type {RegExp} */
  var rNewline = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
  /** @type {RegExp} */
  var rSlash = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
  /** @type {RegExp} */
  var rmsPrefix = /^-ms-/;
  /** @type {RegExp} */
  var emptyParagraphRegexp = /-([\da-z])/gi;
  /**
   * @param {?} all
   * @param {string} letter
   * @return {?}
   */
  var fcamelCase = function(all, letter) {
    return letter.toUpperCase();
  };
  /**
   * @param {Event} t
   * @return {undefined}
   */
  var contentLoaded = function(t) {
    if (node.addEventListener || ("load" === t.type || "complete" === node.readyState)) {
      domReady();
      jQuery.ready();
    }
  };
  /**
   * @return {undefined}
   */
  var domReady = function() {
    if (node.addEventListener) {
      node.removeEventListener("DOMContentLoaded", contentLoaded, false);
      win.removeEventListener("load", contentLoaded, false);
    } else {
      node.detachEvent("onreadystatechange", contentLoaded);
      win.detachEvent("onload", contentLoaded);
    }
  };
  jQuery.fn = jQuery.prototype = {
    jquery : "1.10.2",
    /** @type {function (string, string): ?} */
    constructor : jQuery,
    /**
     * @param {string} selector
     * @param {Object} context
     * @param {string} rootjQuery
     * @return {?}
     */
    init : function(selector, context, rootjQuery) {
      var match;
      if (!selector) {
        return this;
      }
      if ("string" === typeof selector) {
        if ((match = "<" === selector.charAt(0) && (">" === selector.charAt(selector.length - 1) && 3 <= selector.length) ? [null, selector, null] : rquickExpr.exec(selector)) && (match[1] || !context)) {
          if (match[1]) {
            if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : node, true)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
              for (match in context) {
                if (jQuery.isFunction(this[match])) {
                  this[match](context[match]);
                } else {
                  this.attr(match, context[match]);
                }
              }
            }
          } else {
            if ((context = node.getElementById(match[2])) && context.parentNode) {
              if (context.id !== match[2]) {
                return rootjQuery.find(selector);
              }
              /** @type {number} */
              this.length = 1;
              /** @type {Object} */
              this[0] = context;
            }
            /** @type {Document} */
            this.context = node;
            /** @type {string} */
            this.selector = selector;
          }
          return this;
        }
        return!context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
      }
      if (selector.nodeType) {
        return this.context = this[0] = selector, this.length = 1, this;
      }
      if (jQuery.isFunction(selector)) {
        return rootjQuery.ready(selector);
      }
      if (selector.selector !== ready) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
      return jQuery.makeArray(selector, this);
    },
    selector : "",
    length : 0,
    /**
     * @return {?}
     */
    toArray : function() {
      return core_slice.call(this);
    },
    /**
     * @param {string} num
     * @return {?}
     */
    get : function(num) {
      return null == num ? this.toArray() : 0 > num ? this[this.length + num] : this[num];
    },
    /**
     * @param {Object} ret
     * @return {?}
     */
    pushStack : function(ret) {
      ret = jQuery.merge(this.constructor(), ret);
      ret.prevObject = this;
      ret.context = this.context;
      return ret;
    },
    /**
     * @param {Function} opt_attributes
     * @param {Function} args
     * @return {?}
     */
    each : function(opt_attributes, args) {
      return jQuery.each(this, opt_attributes, args);
    },
    /**
     * @param {string} fix
     * @return {?}
     */
    ready : function(fix) {
      jQuery.ready.promise().done(fix);
      return this;
    },
    /**
     * @return {?}
     */
    slice : function() {
      return this.pushStack(core_slice.apply(this, arguments));
    },
    /**
     * @return {?}
     */
    first : function() {
      return this.eq(0);
    },
    /**
     * @return {?}
     */
    last : function() {
      return this.eq(-1);
    },
    /**
     * @param {number} i
     * @return {?}
     */
    eq : function(i) {
      var len = this.length;
      i = +i + (0 > i ? len : 0);
      return this.pushStack(0 <= i && i < len ? [this[i]] : []);
    },
    /**
     * @param {Function} callback
     * @return {?}
     */
    map : function(callback) {
      return this.pushStack(jQuery.map(this, function(el, operation) {
        return callback.call(el, operation, el);
      }));
    },
    /**
     * @return {?}
     */
    end : function() {
      return this.prevObject || this.constructor(null);
    },
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    push : core_push,
    /** @type {function (this:(Array.<T>|{length: number}), function (T, T): number=): ?} */
    sort : [].sort,
    /** @type {function (this:(Array.<T>|{length: number}), *=, *=, ...[T]): Array.<T>} */
    splice : [].splice
  };
  jQuery.fn.init.prototype = jQuery.fn;
  /** @type {function (): ?} */
  jQuery.extend = jQuery.fn.extend = function() {
    var src;
    var copyIsArray;
    var copy;
    var name;
    var options;
    var target = arguments[0] || {};
    /** @type {number} */
    var i = 1;
    /** @type {number} */
    var n = arguments.length;
    /** @type {boolean} */
    var deep = false;
    if ("boolean" === typeof target) {
      /** @type {boolean} */
      deep = target;
      target = arguments[1] || {};
      /** @type {number} */
      i = 2;
    }
    if ("object" !== typeof target) {
      if (!jQuery.isFunction(target)) {
        target = {};
      }
    }
    if (n === i) {
      target = this;
      --i;
    }
    for (;i < n;i++) {
      if (null != (options = arguments[i])) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target !== copy) {
            if (deep && (copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))))) {
              if (copyIsArray) {
                /** @type {boolean} */
                copyIsArray = false;
                src = src && jQuery.isArray(src) ? src : [];
              } else {
                src = src && jQuery.isPlainObject(src) ? src : {};
              }
              target[name] = jQuery.extend(deep, src, copy);
            } else {
              if (copy !== ready) {
                target[name] = copy;
              }
            }
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando : "jQuery" + ("1.10.2" + Math.random()).replace(/\D/g, ""),
    /**
     * @param {?} deep
     * @return {?}
     */
    noConflict : function(deep) {
      if (win.$ === jQuery) {
        win.$ = _$;
      }
      if (deep) {
        if (win.jQuery === jQuery) {
          win.jQuery = $;
        }
      }
      return jQuery;
    },
    isReady : false,
    readyWait : 1,
    /**
     * @param {?} hold
     * @return {undefined}
     */
    holdReady : function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    /**
     * @param {boolean} wait
     * @return {?}
     */
    ready : function(wait) {
      if (!(true === wait ? --jQuery.readyWait : jQuery.isReady)) {
        if (!node.body) {
          return setTimeout(jQuery.ready);
        }
        /** @type {boolean} */
        jQuery.isReady = true;
        if (!(true !== wait && 0 < --jQuery.readyWait)) {
          readyList.resolveWith(node, [jQuery]);
          if (jQuery.fn.trigger) {
            jQuery(node).trigger("ready").off("ready");
          }
        }
      }
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    isFunction : function(obj) {
      return "function" === jQuery.type(obj);
    },
    /** @type {function (*): boolean} */
    isArray : Array.isArray || function(type) {
      return "array" === jQuery.type(type);
    },
    /**
     * @param {Object} obj
     * @return {?}
     */
    isWindow : function(obj) {
      return null != obj && obj == obj.window;
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    isNumeric : function(obj) {
      return!isNaN(parseFloat(obj)) && isFinite(obj);
    },
    /**
     * @param {string} type
     * @return {?}
     */
    type : function(type) {
      return null == type ? String(type) : "object" === typeof type || "function" === typeof type ? class2type[core_toString.call(type)] || "object" : typeof type;
    },
    /**
     * @param {string} obj
     * @return {?}
     */
    isPlainObject : function(obj) {
      var type;
      if (!obj || ("object" !== jQuery.type(obj) || (obj.nodeType || jQuery.isWindow(obj)))) {
        return false;
      }
      try {
        if (obj.constructor && (!core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))) {
          return false;
        }
      } catch (f) {
        return false;
      }
      if (jQuery.support.ownLast) {
        for (type in obj) {
          return core_hasOwn.call(obj, type);
        }
      }
      for (type in obj) {
      }
      return type === ready || core_hasOwn.call(obj, type);
    },
    /**
     * @param {?} obj
     * @return {?}
     */
    isEmptyObject : function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    },
    /**
     * @param {string} type
     * @return {?}
     */
    error : function(type) {
      throw Error(type);
    },
    /**
     * @param {?} data
     * @param {Object} context
     * @param {Object} scripts
     * @return {?}
     */
    parseHTML : function(data, context, scripts) {
      if (!data || "string" !== typeof data) {
        return null;
      }
      if ("boolean" === typeof context) {
        /** @type {Object} */
        scripts = context;
        /** @type {boolean} */
        context = false;
      }
      context = context || node;
      /** @type {(Array.<string>|null)} */
      var parsed = rsingleTag.exec(data);
      /** @type {(Array|boolean)} */
      scripts = !scripts && [];
      if (parsed) {
        return[context.createElement(parsed[1])];
      }
      parsed = jQuery.buildFragment([data], context, scripts);
      if (scripts) {
        jQuery(scripts).remove();
      }
      return jQuery.merge([], parsed.childNodes);
    },
    /**
     * @param {string} data
     * @return {?}
     */
    parseJSON : function(data) {
      if (win.JSON && win.JSON.parse) {
        return win.JSON.parse(data);
      }
      if (null === data) {
        return data;
      }
      if ("string" === typeof data && ((data = jQuery.trim(data)) && args.test(data.replace(rNewline, "@").replace(rSlash, "]").replace(normalizr, "")))) {
        return(new Function("return " + data))();
      }
      jQuery.error("Invalid JSON: " + data);
    },
    /**
     * @param {string} data
     * @return {?}
     */
    parseXML : function(data) {
      var xml;
      var tmp;
      if (!data || "string" !== typeof data) {
        return null;
      }
      try {
        if (win.DOMParser) {
          /** @type {DOMParser} */
          tmp = new DOMParser;
          /** @type {(Document|null)} */
          xml = tmp.parseFromString(data, "text/xml");
        } else {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          /** @type {string} */
          xml.async = "false";
          xml.loadXML(data);
        }
      } catch (h) {
        /** @type {string} */
        xml = ready;
      }
      if (!xml || (!xml.documentElement || xml.getElementsByTagName("parsererror").length)) {
        jQuery.error("Invalid XML: " + data);
      }
      return xml;
    },
    /**
     * @return {undefined}
     */
    noop : function() {
    },
    /**
     * @param {string} data
     * @return {undefined}
     */
    globalEval : function(data) {
      if (data) {
        if (jQuery.trim(data)) {
          (win.execScript || function(expr) {
            win.eval.call(win, expr);
          })(data);
        }
      }
    },
    /**
     * @param {string} string
     * @return {?}
     */
    camelCase : function(string) {
      return string.replace(rmsPrefix, "ms-").replace(emptyParagraphRegexp, fcamelCase);
    },
    /**
     * @param {Node} elem
     * @param {string} name
     * @return {?}
     */
    nodeName : function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    /**
     * @param {Function} obj
     * @param {Function} callback
     * @param {Object} args
     * @return {?}
     */
    each : function(obj, callback, args) {
      var value;
      /** @type {number} */
      var i = 0;
      var l = obj.length;
      value = isArraylike(obj);
      if (args) {
        if (value) {
          for (;i < l && !(value = callback.apply(obj[i], args), false === value);i++) {
          }
        } else {
          for (i in obj) {
            if (value = callback.apply(obj[i], args), false === value) {
              break;
            }
          }
        }
      } else {
        if (value) {
          for (;i < l && !(value = callback.call(obj[i], i, obj[i]), false === value);i++) {
          }
        } else {
          for (i in obj) {
            if (value = callback.call(obj[i], i, obj[i]), false === value) {
              break;
            }
          }
        }
      }
      return obj;
    },
    /** @type {function (string): ?} */
    trim : _trim && !_trim.call("\ufeff\u00a0") ? function(text) {
      return null == text ? "" : _trim.call(text);
    } : function(num) {
      return null == num ? "" : (num + "").replace(badChars, "");
    },
    /**
     * @param {?} arr
     * @param {Array} results
     * @return {?}
     */
    makeArray : function(arr, results) {
      var ret = results || [];
      if (null != arr) {
        if (isArraylike(Object(arr))) {
          jQuery.merge(ret, "string" === typeof arr ? [arr] : arr);
        } else {
          core_push.call(ret, arr);
        }
      }
      return ret;
    },
    /**
     * @param {string} elem
     * @param {Array} arr
     * @param {number} i
     * @return {?}
     */
    inArray : function(elem, arr, i) {
      var length;
      if (arr) {
        if (core_indexOf) {
          return core_indexOf.call(arr, elem, i);
        }
        length = arr.length;
        i = i ? 0 > i ? Math.max(0, length + i) : i : 0;
        for (;i < length;i++) {
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return-1;
    },
    /**
     * @param {(Function|string)} first
     * @param {?} second
     * @return {?}
     */
    merge : function(first, second) {
      var l = second.length;
      var i = first.length;
      /** @type {number} */
      var j = 0;
      if ("number" === typeof l) {
        for (;j < l;j++) {
          first[i++] = second[j];
        }
      } else {
        for (;second[j] !== ready;) {
          first[i++] = second[j++];
        }
      }
      first.length = i;
      return first;
    },
    /**
     * @param {Array} elems
     * @param {Function} callback
     * @param {boolean} inv
     * @return {?}
     */
    grep : function(elems, callback, inv) {
      var retVal;
      /** @type {Array} */
      var ret = [];
      /** @type {number} */
      var i = 0;
      var length = elems.length;
      /** @type {boolean} */
      inv = !!inv;
      for (;i < length;i++) {
        /** @type {boolean} */
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
          ret.push(elems[i]);
        }
      }
      return ret;
    },
    /**
     * @param {Object} elems
     * @param {Function} callback
     * @param {string} arg
     * @return {?}
     */
    map : function(elems, callback, arg) {
      var value;
      /** @type {number} */
      var i = 0;
      var length = elems.length;
      /** @type {Array} */
      var ret = [];
      if (isArraylike(elems)) {
        for (;i < length;i++) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret[ret.length] = value;
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (null != value) {
            ret[ret.length] = value;
          }
        }
      }
      return core_concat.apply([], ret);
    },
    guid : 1,
    /**
     * @param {Object} fn
     * @param {string} context
     * @return {?}
     */
    proxy : function(fn, context) {
      var args;
      var proxy;
      if ("string" === typeof context) {
        proxy = fn[context];
        /** @type {Object} */
        context = fn;
        fn = proxy;
      }
      if (!jQuery.isFunction(fn)) {
        return ready;
      }
      /** @type {Array.<?>} */
      args = core_slice.call(arguments, 2);
      /**
       * @return {?}
       */
      proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(arguments)));
      };
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      return proxy;
    },
    /**
     * @param {Object} elems
     * @param {Function} fn
     * @param {string} key
     * @param {string} value
     * @param {boolean} chainable
     * @param {string} emptyGet
     * @param {boolean} raw
     * @return {?}
     */
    access : function(elems, fn, key, value, chainable, emptyGet, raw) {
      /** @type {number} */
      var i = 0;
      var length = elems.length;
      /** @type {boolean} */
      var bulk = null == key;
      if ("object" === jQuery.type(key)) {
        for (i in chainable = true, key) {
          jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
        }
      } else {
        if (value !== ready && (chainable = true, jQuery.isFunction(value) || (raw = true), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(scripts, event, value) {
          return bulk.call(jQuery(scripts), value);
        })), fn)) {
          for (;i < length;i++) {
            fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
          }
        }
      }
      return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    },
    /**
     * @return {?}
     */
    now : function() {
      return(new Date).getTime();
    },
    /**
     * @param {Element} element
     * @param {?} options
     * @param {Function} callback
     * @param {Array} args
     * @return {?}
     */
    swap : function(element, options, callback, args) {
      var name;
      var old = {};
      for (name in options) {
        old[name] = element.style[name];
        element.style[name] = options[name];
      }
      callback = callback.apply(element, args || []);
      for (name in options) {
        element.style[name] = old[name];
      }
      return callback;
    }
  });
  /**
   * @param {string} obj
   * @return {?}
   */
  jQuery.ready.promise = function(obj) {
    if (!readyList) {
      if (readyList = jQuery.Deferred(), "complete" === node.readyState) {
        setTimeout(jQuery.ready);
      } else {
        if (node.addEventListener) {
          node.addEventListener("DOMContentLoaded", contentLoaded, false);
          win.addEventListener("load", contentLoaded, false);
        } else {
          node.attachEvent("onreadystatechange", contentLoaded);
          win.attachEvent("onload", contentLoaded);
          /** @type {boolean} */
          var t = false;
          try {
            /** @type {(Element|boolean)} */
            t = null == win.frameElement && node.documentElement;
          } catch (f) {
          }
          if (t) {
            if (t.doScroll) {
              (function doScrollCheck() {
                if (!jQuery.isReady) {
                  try {
                    t.doScroll("left");
                  } catch (a) {
                    return setTimeout(doScrollCheck, 50);
                  }
                  domReady();
                  jQuery.ready();
                }
              })();
            }
          }
        }
      }
    }
    return readyList.promise(obj);
  };
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(dataAndEvents, m3) {
    class2type["[object " + m3 + "]"] = m3.toLowerCase();
  });
  element = jQuery(node);
  (function(win, inprogress) {
    /**
     * @param {string} selector
     * @param {Node} context
     * @param {Object} results
     * @param {?} seed
     * @return {?}
     */
    function Sizzle(selector, context, results, seed) {
      var tokens;
      var match;
      var m;
      var i;
      var newSelector;
      if ((context ? context.ownerDocument || context : preferredDoc) !== doc) {
        setDocument(context);
      }
      context = context || doc;
      results = results || [];
      if (!selector || "string" !== typeof selector) {
        return results;
      }
      if (1 !== (i = context.nodeType) && 9 !== i) {
        return[];
      }
      if (documentIsHTML && !seed) {
        if (tokens = rquickExpr.exec(selector)) {
          if (m = tokens[1]) {
            if (9 === i) {
              if ((match = context.getElementById(m)) && match.parentNode) {
                if (match.id === m) {
                  return results.push(match), results;
                }
              } else {
                return results;
              }
            } else {
              if (context.ownerDocument && ((match = context.ownerDocument.getElementById(m)) && (contains(context, match) && match.id === m))) {
                return results.push(match), results;
              }
            }
          } else {
            if (tokens[2]) {
              return push.apply(results, context.getElementsByTagName(selector)), results;
            }
            if ((m = tokens[3]) && (support.getElementsByClassName && context.getElementsByClassName)) {
              return push.apply(results, context.getElementsByClassName(m)), results;
            }
          }
        }
        if (support.qsa && (!css || !css.test(selector))) {
          /** @type {string} */
          match = tokens = expando;
          /** @type {Node} */
          m = context;
          /** @type {(boolean|string)} */
          newSelector = 9 === i && selector;
          if (1 === i && "object" !== context.nodeName.toLowerCase()) {
            i = tokenize(selector);
            if (tokens = context.getAttribute("id")) {
              match = tokens.replace(rreturn, "\\$&");
            } else {
              context.setAttribute("id", match);
            }
            /** @type {string} */
            match = "[id='" + match + "'] ";
            m = i.length;
            for (;m--;) {
              /** @type {string} */
              i[m] = match + toSelector(i[m]);
            }
            m = rsibling.test(selector) && context.parentNode || context;
            newSelector = i.join(",");
          }
          if (newSelector) {
            try {
              return push.apply(results, m.querySelectorAll(newSelector)), results;
            } catch (e) {
            } finally {
              if (!tokens) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }
      var token;
      a: {
        /** @type {string} */
        selector = selector.replace(r20, "$1");
        match = tokenize(selector);
        if (!seed && 1 === match.length) {
          tokens = match[0] = match[0].slice(0);
          if (2 < tokens.length && ("ID" === (token = tokens[0]).type && (support.getById && (9 === context.nodeType && (documentIsHTML && Expr.relative[tokens[1].type]))))) {
            context = (Expr.find.ID(token.matches[0].replace(s, funescape), context) || [])[0];
            if (!context) {
              /** @type {Object} */
              token = results;
              break a;
            }
            /** @type {string} */
            selector = selector.slice(tokens.shift().value.length);
          }
          i = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
          for (;i--;) {
            token = tokens[i];
            if (Expr.relative[m = token.type]) {
              break;
            }
            if (m = Expr.find[m]) {
              if (seed = m(token.matches[0].replace(s, funescape), rsibling.test(tokens[0].type) && context.parentNode || context)) {
                tokens.splice(i, 1);
                selector = seed.length && toSelector(tokens);
                if (!selector) {
                  push.apply(results, seed);
                  /** @type {Object} */
                  token = results;
                  break a;
                }
                break;
              }
            }
          }
        }
        compile(selector, match)(seed, context, !documentIsHTML, results, rsibling.test(selector));
        /** @type {Object} */
        token = results;
      }
      return token;
    }
    /**
     * @return {?}
     */
    function createCache() {
      /**
       * @param {string} key
       * @param {?} value
       * @return {?}
       */
      function cache(key, value) {
        if (keys.push(key += " ") > Expr.cacheLength) {
          delete cache[keys.shift()];
        }
        return cache[key] = value;
      }
      /** @type {Array} */
      var keys = [];
      return cache;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function markFunction(fn) {
      /** @type {boolean} */
      fn[expando] = true;
      return fn;
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function assert(fn) {
      var t = doc.createElement("div");
      try {
        return!!fn(t);
      } catch (c) {
        return false;
      } finally {
        if (t.parentNode) {
          t.parentNode.removeChild(t);
        }
      }
    }
    /**
     * @param {string} str
     * @param {Function} handler
     * @return {undefined}
     */
    function addHandle(str, handler) {
      var arr = str.split("|");
      var i = str.length;
      for (;i--;) {
        /** @type {Function} */
        Expr.attrHandle[arr[i]] = handler;
      }
    }
    /**
     * @param {Object} a
     * @param {Object} b
     * @return {?}
     */
    function siblingCheck(a, b) {
      var cur = b && a;
      var diff = cur && (1 === a.nodeType && (1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE)));
      if (diff) {
        return diff;
      }
      if (cur) {
        for (;cur = cur.nextSibling;) {
          if (cur === b) {
            return-1;
          }
        }
      }
      return a ? 1 : -1;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createInputPseudo(type) {
      return function(elem) {
        return "input" === elem.nodeName.toLowerCase() && elem.type === type;
      };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    function createButtonPseudo(type) {
      return function(elem) {
        var NULL = elem.nodeName.toLowerCase();
        return("input" === NULL || "button" === NULL) && elem.type === type;
      };
    }
    /**
     * @param {Function} fn
     * @return {?}
     */
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        /** @type {number} */
        argument = +argument;
        return markFunction(function(seed, matches) {
          var j;
          var matchIndexes = fn([], seed.length, argument);
          var i = matchIndexes.length;
          for (;i--;) {
            if (seed[j = matchIndexes[i]]) {
              /** @type {boolean} */
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }
    /**
     * @return {undefined}
     */
    function setFilters() {
    }
    /**
     * @param {string} fix
     * @param {boolean} parseOnly
     * @return {?}
     */
    function tokenize(fix, parseOnly) {
      var matched;
      var match;
      var tokens;
      var type;
      var soFar;
      var groups;
      var preFilters;
      if (soFar = tokenCache[fix + " "]) {
        return parseOnly ? 0 : soFar.slice(0);
      }
      /** @type {string} */
      soFar = fix;
      /** @type {Array} */
      groups = [];
      preFilters = Expr.preFilter;
      for (;soFar;) {
        if (!matched || (match = rcombinators.exec(soFar))) {
          if (match) {
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }
        /** @type {boolean} */
        matched = false;
        if (match = rcomma.exec(soFar)) {
          /** @type {string} */
          matched = match.shift();
          tokens.push({
            value : matched,
            type : match[0].replace(r20, " ")
          });
          soFar = soFar.slice(matched.length);
        }
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value : matched,
              type : type,
              matches : match
            });
            soFar = soFar.slice(matched.length);
          }
        }
        if (!matched) {
          break;
        }
      }
      return parseOnly ? soFar.length : soFar ? Sizzle.error(fix) : tokenCache(fix, groups).slice(0);
    }
    /**
     * @param {Array} tokens
     * @return {?}
     */
    function toSelector(tokens) {
      /** @type {number} */
      var ti = 0;
      var nTokens = tokens.length;
      /** @type {string} */
      var selector = "";
      for (;ti < nTokens;ti++) {
        selector += tokens[ti].value;
      }
      return selector;
    }
    /**
     * @param {Function} matcher
     * @param {Object} combinator
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    function addCombinator(matcher, combinator, dataAndEvents) {
      var dir = combinator.dir;
      var h = dataAndEvents && "parentNode" === dir;
      /** @type {number} */
      var doneName = done++;
      return combinator.first ? function(elem, context, xml) {
        for (;elem = elem[dir];) {
          if (1 === elem.nodeType || h) {
            return matcher(elem, context, xml);
          }
        }
      } : function(elem, context, xml) {
        var data;
        var cache;
        var outerCache;
        var dirkey = dirruns + " " + doneName;
        if (xml) {
          for (;elem = elem[dir];) {
            if ((1 === elem.nodeType || h) && matcher(elem, context, xml)) {
              return true;
            }
          }
        } else {
          for (;elem = elem[dir];) {
            if (1 === elem.nodeType || h) {
              if (outerCache = elem[expando] || (elem[expando] = {}), (cache = outerCache[dir]) && cache[0] === dirkey) {
                if (true === (data = cache[1]) || data === cachedruns) {
                  return true === data;
                }
              } else {
                if (cache = outerCache[dir] = [dirkey], cache[1] = matcher(elem, context, xml) || cachedruns, true === cache[1]) {
                  return true;
                }
              }
            }
          }
        }
      };
    }
    /**
     * @param {Object} matchers
     * @return {?}
     */
    function elementMatcher(matchers) {
      return 1 < matchers.length ? function(elem, context, xml) {
        var i = matchers.length;
        for (;i--;) {
          if (!matchers[i](elem, context, xml)) {
            return false;
          }
        }
        return true;
      } : matchers[0];
    }
    /**
     * @param {Array} unmatched
     * @param {Object} map
     * @param {Object} filter
     * @param {Object} context
     * @param {string} xml
     * @return {?}
     */
    function condense(unmatched, map, filter, context, xml) {
      var item;
      /** @type {Array} */
      var caseSensitive = [];
      /** @type {number} */
      var i = 0;
      var len = unmatched.length;
      /** @type {boolean} */
      var e = null != map;
      for (;i < len;i++) {
        if (item = unmatched[i]) {
          if (!filter || filter(item, context, xml)) {
            caseSensitive.push(item);
            if (e) {
              map.push(i);
            }
          }
        }
      }
      return caseSensitive;
    }
    /**
     * @param {Object} preFilter
     * @param {string} selector
     * @param {boolean} matcher
     * @param {string} postFilter
     * @param {(Object|string)} postFinder
     * @param {string} postSelector
     * @return {?}
     */
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
      if (postFilter) {
        if (!postFilter[expando]) {
          postFilter = setMatcher(postFilter);
        }
      }
      if (postFinder) {
        if (!postFinder[expando]) {
          postFinder = setMatcher(postFinder, postSelector);
        }
      }
      return markFunction(function(seed, results, context, xml) {
        var ready;
        var elem;
        /** @type {Array} */
        var preMap = [];
        /** @type {Array} */
        var postMap = [];
        var preexisting = results.length;
        var elems;
        if (!(elems = seed)) {
          elems = selector || "*";
          var matcherOut = context.nodeType ? [context] : context;
          /** @type {Array} */
          var tmpSet = [];
          /** @type {number} */
          var i = 0;
          var valuesLen = matcherOut.length;
          for (;i < valuesLen;i++) {
            Sizzle(elems, matcherOut[i], tmpSet);
          }
          /** @type {Array} */
          elems = tmpSet;
        }
        elems = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
        matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : elems;
        if (matcher) {
          matcher(elems, matcherOut, context, xml);
        }
        if (postFilter) {
          ready = condense(matcherOut, postMap);
          postFilter(ready, [], context, xml);
          context = ready.length;
          for (;context--;) {
            if (elem = ready[context]) {
              /** @type {boolean} */
              matcherOut[postMap[context]] = !(elems[postMap[context]] = elem);
            }
          }
        }
        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              /** @type {Array} */
              ready = [];
              context = matcherOut.length;
              for (;context--;) {
                if (elem = matcherOut[context]) {
                  ready.push(elems[context] = elem);
                }
              }
              postFinder(null, matcherOut = [], ready, xml);
            }
            context = matcherOut.length;
            for (;context--;) {
              if ((elem = matcherOut[context]) && -1 < (ready = postFinder ? indexOf.call(seed, elem) : preMap[context])) {
                /** @type {boolean} */
                seed[ready] = !(results[ready] = elem);
              }
            }
          }
        } else {
          matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }
    /**
     * @param {Object} tokens
     * @return {?}
     */
    function matcherFromTokens(tokens) {
      var checkContext;
      var matcher;
      var j;
      var len = tokens.length;
      var leadingRelative = Expr.relative[tokens[0].type];
      matcher = leadingRelative || Expr.relative[" "];
      /** @type {number} */
      var i = leadingRelative ? 1 : 0;
      var matchContext = addCombinator(function(dataAndEvents) {
        return dataAndEvents === checkContext;
      }, matcher, true);
      var matchAnyContext = addCombinator(function(elem) {
        return-1 < indexOf.call(checkContext, elem);
      }, matcher, true);
      /** @type {Array} */
      var matchers = [function(elem, context, xml) {
        return!leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
      }];
      for (;i < len;i++) {
        if (matcher = Expr.relative[tokens[i].type]) {
          /** @type {Array} */
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
          if (matcher[expando]) {
            /** @type {number} */
            j = ++i;
            for (;j < len && !Expr.relative[tokens[j].type];j++) {
            }
            return setMatcher(1 < i && elementMatcher(matchers), 1 < i && toSelector(tokens.slice(0, i - 1).concat({
              value : " " === tokens[i - 2].type ? "*" : ""
            })).replace(r20, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
          }
          matchers.push(matcher);
        }
      }
      return elementMatcher(matchers);
    }
    /**
     * @param {Array} elementMatchers
     * @param {Array} setMatchers
     * @return {?}
     */
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      /** @type {number} */
      var matcherCachedRuns = 0;
      /** @type {boolean} */
      var bySet = 0 < setMatchers.length;
      /** @type {boolean} */
      var byElement = 0 < elementMatchers.length;
      /**
       * @param {Object} seed
       * @param {string} context
       * @param {?} xml
       * @param {Array} results
       * @param {Object} elem
       * @return {?}
       */
      var superMatcher = function(seed, context, xml, results, elem) {
        var j;
        var matcher;
        /** @type {Array} */
        var setMatched = [];
        /** @type {number} */
        var matchedCount = 0;
        /** @type {string} */
        var i = "0";
        var unmatched = seed && [];
        /** @type {boolean} */
        var r = null != elem;
        var contextBackup = outermostContext;
        var elems = seed || byElement && Expr.find.TAG("*", elem && context.parentNode || context);
        var dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || 0.1;
        if (r) {
          outermostContext = context !== doc && context;
          cachedruns = matcherCachedRuns;
        }
        for (;null != (elem = elems[i]);i++) {
          if (byElement && elem) {
            /** @type {number} */
            j = 0;
            for (;matcher = elementMatchers[j++];) {
              if (matcher(elem, context, xml)) {
                results.push(elem);
                break;
              }
            }
            if (r) {
              dirruns = dirrunsUnique;
              /** @type {number} */
              cachedruns = ++matcherCachedRuns;
            }
          }
          if (bySet) {
            if (elem = !matcher && elem) {
              matchedCount--;
            }
            if (seed) {
              unmatched.push(elem);
            }
          }
        }
        matchedCount += i;
        if (bySet && i !== matchedCount) {
          /** @type {number} */
          j = 0;
          for (;matcher = setMatchers[j++];) {
            matcher(unmatched, setMatched, context, xml);
          }
          if (seed) {
            if (0 < matchedCount) {
              for (;i--;) {
                if (!unmatched[i]) {
                  if (!setMatched[i]) {
                    setMatched[i] = pop.call(results);
                  }
                }
              }
            }
            setMatched = condense(setMatched);
          }
          push.apply(results, setMatched);
          if (r) {
            if (!seed && (0 < setMatched.length && 1 < matchedCount + setMatchers.length)) {
              Sizzle.uniqueSort(results);
            }
          }
        }
        if (r) {
          dirruns = dirrunsUnique;
          outermostContext = contextBackup;
        }
        return unmatched;
      };
      return bySet ? markFunction(superMatcher) : superMatcher;
    }
    var i;
    var support;
    var cachedruns;
    var Expr;
    var getText;
    var proceed;
    var compile;
    var outermostContext;
    var sortInput;
    var setDocument;
    var doc;
    var docElem;
    var documentIsHTML;
    var css;
    var params;
    var matches;
    var contains;
    /** @type {string} */
    var expando = "sizzle" + -new Date;
    /** @type {Document} */
    var preferredDoc = win.document;
    /** @type {number} */
    var dirruns = 0;
    /** @type {number} */
    var done = 0;
    var classCache = createCache();
    var tokenCache = createCache();
    var compilerCache = createCache();
    /** @type {boolean} */
    var hasDuplicate = false;
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    var sortOrder = function(a, b) {
      if (a === b) {
        /** @type {boolean} */
        hasDuplicate = true;
      }
      return 0;
    };
    /** @type {string} */
    var strundefined = typeof inprogress;
    /** @type {number} */
    var MAX_NEGATIVE = -2147483648;
    /** @type {function (this:Object, *): boolean} */
    var hasOwn = {}.hasOwnProperty;
    /** @type {Array} */
    var arr = [];
    /** @type {function (this:(Array.<T>|{length: number})): T} */
    var pop = arr.pop;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push_native = arr.push;
    /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
    var push = arr.push;
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var slice = arr.slice;
    /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
    var indexOf = arr.indexOf || function(type) {
      /** @type {number} */
      var i = 0;
      var l = this.length;
      for (;i < l;i++) {
        if (this[i] === type) {
          return i;
        }
      }
      return-1;
    };
    /** @type {string} */
    var identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w#");
    /** @type {string} */
    var base = "\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)[\\x20\\t\\r\\n\\f]*\\]";
    /** @type {string} */
    var value = ":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + base.replace(3, 8) + ")*)|.*)\\)|)";
    /** @type {RegExp} */
    var r20 = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g;
    /** @type {RegExp} */
    var rcombinators = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/;
    /** @type {RegExp} */
    var rcomma = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/;
    /** @type {RegExp} */
    var rsibling = /[\x20\t\r\n\f]*[+~]/;
    /** @type {RegExp} */
    var normalizr = /=[\x20\t\r\n\f]*([^\]'"]*)[\x20\t\r\n\f]*\]/g;
    /** @type {RegExp} */
    var isFunction = RegExp(value);
    /** @type {RegExp} */
    var ridentifier = RegExp("^" + identifier + "$");
    var matchExpr = {
      ID : /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
      CLASS : /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,
      TAG : RegExp("^(" + "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w", "w*") + ")"),
      ATTR : RegExp("^" + base),
      PSEUDO : RegExp("^" + value),
      CHILD : RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)", "i"),
      bool : RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i"),
      needsContext : RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)", "i")
    };
    /** @type {RegExp} */
    var rnative = /^[^{]+\{\s*\[native \w/;
    /** @type {RegExp} */
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    /** @type {RegExp} */
    var rinputs = /^(?:input|select|textarea|button)$/i;
    /** @type {RegExp} */
    var rheader = /^h\d$/i;
    /** @type {RegExp} */
    var rreturn = /'|\\/g;
    /** @type {RegExp} */
    var s = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/ig;
    /**
     * @param {number} high
     * @param {(number|string)} escaped
     * @param {boolean} escapedWhitespace
     * @return {?}
     */
    var funescape = function(high, escaped, escapedWhitespace) {
      /** @type {number} */
      high = "0x" + escaped - 65536;
      return high !== high || escapedWhitespace ? escaped : 0 > high ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
    };
    try {
      push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (db) {
      push = {
        /** @type {function (?, Array): undefined} */
        apply : arr.length ? function(target, els) {
          push_native.apply(target, slice.call(els));
        } : function(target, els) {
          var j = target.length;
          /** @type {number} */
          var i = 0;
          for (;target[j++] = els[i++];) {
          }
          /** @type {number} */
          target.length = j - 1;
        }
      };
    }
    /** @type {function (Object): ?} */
    proceed = Sizzle.isXML = function(elem) {
      return(elem = elem && (elem.ownerDocument || elem).documentElement) ? "HTML" !== elem.nodeName : false;
    };
    support = Sizzle.support = {};
    /** @type {function (Object): ?} */
    setDocument = Sizzle.setDocument = function(parent) {
      var element = parent ? parent.ownerDocument || parent : preferredDoc;
      parent = element.defaultView;
      if (element === doc || (9 !== element.nodeType || !element.documentElement)) {
        return doc;
      }
      doc = element;
      docElem = element.documentElement;
      /** @type {boolean} */
      documentIsHTML = !proceed(element);
      if (parent) {
        if (parent.attachEvent && parent !== parent.top) {
          parent.attachEvent("onbeforeunload", function() {
            setDocument();
          });
        }
      }
      support.attributes = assert(function(div) {
        /** @type {string} */
        div.className = "i";
        return!div.getAttribute("className");
      });
      support.getElementsByTagName = assert(function(div) {
        div.appendChild(element.createComment(""));
        return!div.getElementsByTagName("*").length;
      });
      support.getElementsByClassName = assert(function(div) {
        /** @type {string} */
        div.innerHTML = "<div class='a'></div><div class='a i'></div>";
        /** @type {string} */
        div.firstChild.className = "i";
        return 2 === div.getElementsByClassName("i").length;
      });
      support.getById = assert(function(div) {
        /** @type {string} */
        docElem.appendChild(div).id = expando;
        return!element.getElementsByName || !element.getElementsByName(expando).length;
      });
      if (support.getById) {
        /**
         * @param {?} id
         * @param {HTMLElement} context
         * @return {?}
         */
        Expr.find.ID = function(id, context) {
          if (typeof context.getElementById !== strundefined && documentIsHTML) {
            var m = context.getElementById(id);
            return m && m.parentNode ? [m] : [];
          }
        };
        /**
         * @param {string} str
         * @return {?}
         */
        Expr.filter.ID = function(str) {
          var index = str.replace(s, funescape);
          return function(elem) {
            return elem.getAttribute("id") === index;
          };
        };
      } else {
        delete Expr.find.ID;
        /**
         * @param {string} str
         * @return {?}
         */
        Expr.filter.ID = function(str) {
          var match = str.replace(s, funescape);
          return function(elem) {
            return(elem = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id")) && elem.value === match;
          };
        };
      }
      /** @type {function (string, Node): ?} */
      Expr.find.TAG = support.getElementsByTagName ? function(tag, root) {
        if (typeof root.getElementsByTagName !== strundefined) {
          return root.getElementsByTagName(tag);
        }
      } : function(tagName, root) {
        var node;
        /** @type {Array} */
        var tmp = [];
        /** @type {number} */
        var i = 0;
        var elem = root.getElementsByTagName(tagName);
        if ("*" === tagName) {
          for (;node = elem[i++];) {
            if (1 === node.nodeType) {
              tmp.push(node);
            }
          }
          return tmp;
        }
        return elem;
      };
      Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
        if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };
      /** @type {Array} */
      params = [];
      /** @type {Array} */
      css = [];
      if (support.qsa = rnative.test(element.querySelectorAll)) {
        assert(function(div) {
          /** @type {string} */
          div.innerHTML = "<select><option selected=''></option></select>";
          if (!div.querySelectorAll("[selected]").length) {
            css.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");
          }
          if (!div.querySelectorAll(":checked").length) {
            css.push(":checked");
          }
        });
        assert(function(div) {
          var input = element.createElement("input");
          input.setAttribute("type", "hidden");
          div.appendChild(input).setAttribute("t", "");
          if (div.querySelectorAll("[t^='']").length) {
            css.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")");
          }
          if (!div.querySelectorAll(":enabled").length) {
            css.push(":enabled", ":disabled");
          }
          div.querySelectorAll("*,:x");
          css.push(",.*:");
        });
      }
      if (support.matchesSelector = rnative.test(matches = docElem.webkitMatchesSelector || (docElem.mozMatchesSelector || (docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
        assert(function(div) {
          support.disconnectedMatch = matches.call(div, "div");
          matches.call(div, "[s!='']:x");
          params.push("!=", value);
        });
      }
      /** @type {(RegExp|number)} */
      css = css.length && RegExp(css.join("|"));
      /** @type {(RegExp|number)} */
      params = params.length && RegExp(params.join("|"));
      /** @type {function (?, Object): ?} */
      contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
        var adown = 9 === a.nodeType ? a.documentElement : a;
        var bup = b && b.parentNode;
        return a === bup || !(!bup || !(1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16)));
      } : function(a, tag) {
        if (tag) {
          for (;tag = tag.parentNode;) {
            if (tag === a) {
              return true;
            }
          }
        }
        return false;
      };
      /** @type {function (HTMLElement, HTMLElement): ?} */
      sortOrder = docElem.compareDocumentPosition ? function(a, b) {
        if (a === b) {
          return hasDuplicate = true, 0;
        }
        var compare = b.compareDocumentPosition && (a.compareDocumentPosition && a.compareDocumentPosition(b));
        return compare ? compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === element || contains(preferredDoc, a) ? -1 : b === element || contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : compare & 4 ? -1 : 1 : a.compareDocumentPosition ? -1 : 1;
      } : function(a, b) {
        var cur;
        /** @type {number} */
        var i = 0;
        cur = a.parentNode;
        var bup = b.parentNode;
        /** @type {Array} */
        var ap = [a];
        /** @type {Array} */
        var bp = [b];
        if (a === b) {
          return hasDuplicate = true, 0;
        }
        if (!cur || !bup) {
          return a === element ? -1 : b === element ? 1 : cur ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
        }
        if (cur === bup) {
          return siblingCheck(a, b);
        }
        /** @type {string} */
        cur = a;
        for (;cur = cur.parentNode;) {
          ap.unshift(cur);
        }
        /** @type {string} */
        cur = b;
        for (;cur = cur.parentNode;) {
          bp.unshift(cur);
        }
        for (;ap[i] === bp[i];) {
          i++;
        }
        return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
      };
      return element;
    };
    /**
     * @param {string} expr
     * @param {?} elements
     * @return {?}
     */
    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };
    /**
     * @param {HTMLElement} elem
     * @param {string} selector
     * @return {?}
     */
    Sizzle.matchesSelector = function(elem, selector) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      selector = selector.replace(normalizr, "='$1']");
      if (support.matchesSelector && (documentIsHTML && ((!params || !params.test(selector)) && (!css || !css.test(selector))))) {
        try {
          var ret = matches.call(elem, selector);
          if (ret || (support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType)) {
            return ret;
          }
        } catch (h) {
        }
      }
      return 0 < Sizzle(selector, doc, null, [elem]).length;
    };
    /**
     * @param {Object} context
     * @param {Object} b
     * @return {?}
     */
    Sizzle.contains = function(context, b) {
      if ((context.ownerDocument || context) !== doc) {
        setDocument(context);
      }
      return contains(context, b);
    };
    /**
     * @param {string} elem
     * @param {string} name
     * @return {?}
     */
    Sizzle.attr = function(elem, name) {
      if ((elem.ownerDocument || elem) !== doc) {
        setDocument(elem);
      }
      var fn = Expr.attrHandle[name.toLowerCase()];
      fn = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : inprogress;
      return fn === inprogress ? support.attributes || !documentIsHTML ? elem.getAttribute(name) : (fn = elem.getAttributeNode(name)) && fn.specified ? fn.value : null : fn;
    };
    /**
     * @param {string} type
     * @return {?}
     */
    Sizzle.error = function(type) {
      throw Error("Syntax error, unrecognized expression: " + type);
    };
    /**
     * @param {Array} results
     * @return {?}
     */
    Sizzle.uniqueSort = function(results) {
      var elem;
      /** @type {Array} */
      var duplicates = [];
      /** @type {number} */
      var j = 0;
      /** @type {number} */
      var i = 0;
      /** @type {boolean} */
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);
      if (hasDuplicate) {
        for (;elem = results[i++];) {
          if (elem === results[i]) {
            /** @type {number} */
            j = duplicates.push(i);
          }
        }
        for (;j--;) {
          results.splice(duplicates[j], 1);
        }
      }
      return results;
    };
    /** @type {function (string): ?} */
    getText = Sizzle.getText = function(type) {
      var path;
      /** @type {string} */
      var result = "";
      /** @type {number} */
      var i = 0;
      if (path = type.nodeType) {
        if (1 === path || (9 === path || 11 === path)) {
          if ("string" === typeof type.textContent) {
            return type.textContent;
          }
          type = type.firstChild;
          for (;type;type = type.nextSibling) {
            result += getText(type);
          }
        } else {
          if (3 === path || 4 === path) {
            return type.nodeValue;
          }
        }
      } else {
        for (;path = type[i];i++) {
          result += getText(path);
        }
      }
      return result;
    };
    Expr = Sizzle.selectors = {
      cacheLength : 50,
      /** @type {function (Function): ?} */
      createPseudo : markFunction,
      match : matchExpr,
      attrHandle : {},
      find : {},
      relative : {
        ">" : {
          dir : "parentNode",
          first : true
        },
        " " : {
          dir : "parentNode"
        },
        "+" : {
          dir : "previousSibling",
          first : true
        },
        "~" : {
          dir : "previousSibling"
        }
      },
      preFilter : {
        /**
         * @param {Array} match
         * @return {?}
         */
        ATTR : function(match) {
          match[1] = match[1].replace(s, funescape);
          match[3] = (match[4] || (match[5] || "")).replace(s, funescape);
          if ("~=" === match[2]) {
            /** @type {string} */
            match[3] = " " + match[3] + " ";
          }
          return match.slice(0, 4);
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        CHILD : function(match) {
          match[1] = match[1].toLowerCase();
          if ("nth" === match[1].slice(0, 3)) {
            if (!match[3]) {
              Sizzle.error(match[0]);
            }
            /** @type {number} */
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3]));
            /** @type {number} */
            match[5] = +(match[7] + match[8] || "odd" === match[3]);
          } else {
            if (match[3]) {
              Sizzle.error(match[0]);
            }
          }
          return match;
        },
        /**
         * @param {Array} match
         * @return {?}
         */
        PSEUDO : function(match) {
          var excess;
          var unquoted = !match[5] && match[2];
          if (matchExpr.CHILD.test(match[0])) {
            return null;
          }
          if (match[3] && match[4] !== inprogress) {
            match[2] = match[4];
          } else {
            if (unquoted && (isFunction.test(unquoted) && ((excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)))) {
              match[0] = match[0].slice(0, excess);
              match[2] = unquoted.slice(0, excess);
            }
          }
          return match.slice(0, 3);
        }
      },
      filter : {
        /**
         * @param {string} str
         * @return {?}
         */
        TAG : function(str) {
          var nodeName = str.replace(s, funescape).toLowerCase();
          return "*" === str ? function() {
            return true;
          } : function(elem) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
          };
        },
        /**
         * @param {string} className
         * @return {?}
         */
        CLASS : function(className) {
          var pattern = classCache[className + " "];
          return pattern || (pattern = RegExp("(^|[\\x20\\t\\r\\n\\f])" + className + "([\\x20\\t\\r\\n\\f]|$)")) && classCache(className, function(elem) {
            return pattern.test("string" === typeof elem.className && elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || ""));
          });
        },
        /**
         * @param {string} name
         * @param {string} not
         * @param {string} b
         * @return {?}
         */
        ATTR : function(name, not, b) {
          return function(a) {
            a = Sizzle.attr(a, name);
            if (null == a) {
              return "!=" === not;
            }
            if (!not) {
              return true;
            }
            a += "";
            return "=" === not ? a === b : "!=" === not ? a !== b : "^=" === not ? b && 0 === a.indexOf(b) : "*=" === not ? b && -1 < a.indexOf(b) : "$=" === not ? b && a.slice(-b.length) === b : "~=" === not ? -1 < (" " + a + " ").indexOf(b) : "|=" === not ? a === b || a.slice(0, b.length + 1) === b + "-" : false;
          };
        },
        /**
         * @param {string} type
         * @param {string} argument
         * @param {?} dataAndEvents
         * @param {number} first
         * @param {number} last
         * @return {?}
         */
        CHILD : function(type, argument, dataAndEvents, first, last) {
          /** @type {boolean} */
          var simple = "nth" !== type.slice(0, 3);
          /** @type {boolean} */
          var forward = "last" !== type.slice(-4);
          /** @type {boolean} */
          var value = "of-type" === argument;
          return 1 === first && 0 === last ? function(contestant) {
            return!!contestant.parentNode;
          } : function(elem, next, outerCache) {
            var cache;
            var node;
            var diff;
            var nodeIndex;
            var cur;
            /** @type {string} */
            next = simple !== forward ? "nextSibling" : "previousSibling";
            var parent = elem.parentNode;
            var attrNames = value && elem.nodeName.toLowerCase();
            /** @type {boolean} */
            outerCache = !outerCache && !value;
            if (parent) {
              if (simple) {
                for (;next;) {
                  /** @type {Node} */
                  node = elem;
                  for (;node = node[next];) {
                    if (value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) {
                      return false;
                    }
                  }
                  /** @type {(boolean|string)} */
                  cur = next = "only" === type && (!cur && "nextSibling");
                }
                return true;
              }
              /** @type {Array} */
              cur = [forward ? parent.firstChild : parent.lastChild];
              if (forward && outerCache) {
                outerCache = parent[expando] || (parent[expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = cache[0] === dirruns && cache[2];
                node = nodeIndex && parent.childNodes[nodeIndex];
                for (;node = ++nodeIndex && (node && node[next]) || ((diff = nodeIndex = 0) || cur.pop());) {
                  if (1 === node.nodeType && (++diff && node === elem)) {
                    /** @type {Array} */
                    outerCache[type] = [dirruns, nodeIndex, diff];
                    break;
                  }
                }
              } else {
                if (outerCache && ((cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns)) {
                  diff = cache[1];
                } else {
                  for (;node = ++nodeIndex && (node && node[next]) || ((diff = nodeIndex = 0) || cur.pop());) {
                    if ((value ? node.nodeName.toLowerCase() === attrNames : 1 === node.nodeType) && ++diff) {
                      if (outerCache && ((node[expando] || (node[expando] = {}))[type] = [dirruns, diff]), node === elem) {
                        break;
                      }
                    }
                  }
                }
              }
              diff -= last;
              return diff === first || 0 === diff % first && 0 <= diff / first;
            }
          };
        },
        /**
         * @param {string} pseudo
         * @param {?} argument
         * @return {?}
         */
        PSEUDO : function(pseudo, argument) {
          var args;
          var fn = Expr.pseudos[pseudo] || (Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo));
          return fn[expando] ? fn(argument) : 1 < fn.length ? (args = [pseudo, pseudo, "", argument], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
            var idx;
            var matched = fn(seed, argument);
            var i = matched.length;
            for (;i--;) {
              /** @type {number} */
              idx = indexOf.call(seed, matched[i]);
              /** @type {boolean} */
              seed[idx] = !(matches[idx] = matched[i]);
            }
          }) : function(err) {
            return fn(err, 0, args);
          }) : fn;
        }
      },
      pseudos : {
        not : markFunction(function(termUri) {
          /** @type {Array} */
          var elem = [];
          /** @type {Array} */
          var memory = [];
          var matcher = compile(termUri.replace(r20, "$1"));
          return matcher[expando] ? markFunction(function(input, mat, c, res) {
            res = matcher(input, null, res, []);
            var i = input.length;
            for (;i--;) {
              if (c = res[i]) {
                /** @type {boolean} */
                input[i] = !(mat[i] = c);
              }
            }
          }) : function(value, dataAndEvents, xml) {
            elem[0] = value;
            matcher(elem, null, xml, memory);
            return!memory.pop();
          };
        }),
        has : markFunction(function(expr) {
          return function(elem) {
            return 0 < Sizzle(expr, elem).length;
          };
        }),
        contains : markFunction(function(other) {
          return function(elem) {
            return-1 < (elem.textContent || (elem.innerText || getText(elem))).indexOf(other);
          };
        }),
        lang : markFunction(function(lang) {
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }
          lang = lang.replace(s, funescape).toLowerCase();
          return function(elem) {
            var elemLang;
            do {
              if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
              }
            } while ((elem = elem.parentNode) && 1 === elem.nodeType);
            return false;
          };
        }),
        /**
         * @param {string} type
         * @return {?}
         */
        target : function(type) {
          /** @type {string} */
          var models = win.location && win.location.hash;
          return models && models.slice(1) === type.id;
        },
        /**
         * @param {string} elem
         * @return {?}
         */
        root : function(elem) {
          return elem === docElem;
        },
        /**
         * @param {string} type
         * @return {?}
         */
        focus : function(type) {
          return type === doc.activeElement && ((!doc.hasFocus || doc.hasFocus()) && !(!type.type && (!type.href && !~type.tabIndex)));
        },
        /**
         * @param {EventTarget} a
         * @return {?}
         */
        enabled : function(a) {
          return false === a.disabled;
        },
        /**
         * @param {EventTarget} elem
         * @return {?}
         */
        disabled : function(elem) {
          return true === elem.disabled;
        },
        /**
         * @param {Node} node
         * @return {?}
         */
        checked : function(node) {
          var b = node.nodeName.toLowerCase();
          return "input" === b && !!node.checked || "option" === b && !!node.selected;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        selected : function(elem) {
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
          return true === elem.selected;
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        empty : function(elem) {
          elem = elem.firstChild;
          for (;elem;elem = elem.nextSibling) {
            if ("@" < elem.nodeName || (3 === elem.nodeType || 4 === elem.nodeType)) {
              return false;
            }
          }
          return true;
        },
        /**
         * @param {string} elem
         * @return {?}
         */
        parent : function(elem) {
          return!Expr.pseudos.empty(elem);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        header : function(elem) {
          return rheader.test(elem.nodeName);
        },
        /**
         * @param {Node} elem
         * @return {?}
         */
        input : function(elem) {
          return rinputs.test(elem.nodeName);
        },
        /**
         * @param {Node} el
         * @return {?}
         */
        button : function(el) {
          var b = el.nodeName.toLowerCase();
          return "input" === b && "button" === el.type || "button" === b;
        },
        /**
         * @param {string} type
         * @return {?}
         */
        text : function(type) {
          var evt;
          return "input" === type.nodeName.toLowerCase() && ("text" === type.type && (null == (evt = type.getAttribute("type")) || evt.toLowerCase() === type.type));
        },
        first : createPositionalPseudo(function() {
          return[0];
        }),
        last : createPositionalPseudo(function(dataAndEvents, deepDataAndEvents) {
          return[deepDataAndEvents - 1];
        }),
        eq : createPositionalPseudo(function(dataAndEvents, length, index) {
          return[0 > index ? index + length : index];
        }),
        even : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 0;
          for (;vvar < dataAndEvents;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        odd : createPositionalPseudo(function(assigns, dataAndEvents) {
          /** @type {number} */
          var vvar = 1;
          for (;vvar < dataAndEvents;vvar += 2) {
            assigns.push(vvar);
          }
          return assigns;
        }),
        lt : createPositionalPseudo(function(date, min, max) {
          min = 0 > max ? max + min : max;
          for (;0 <= --min;) {
            date.push(min);
          }
          return date;
        }),
        gt : createPositionalPseudo(function(exclude, length, index) {
          index = 0 > index ? index + length : index;
          for (;++index < length;) {
            exclude.push(index);
          }
          return exclude;
        })
      }
    };
    Expr.pseudos.nth = Expr.pseudos.eq;
    for (i in{
      radio : true,
      checkbox : true,
      file : true,
      password : true,
      image : true
    }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in{
      submit : true,
      reset : true
    }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters;
    /** @type {function (string, Object): ?} */
    compile = Sizzle.compile = function(selector, group) {
      var i;
      /** @type {Array} */
      var setMatchers = [];
      /** @type {Array} */
      var elementMatchers = [];
      var cached = compilerCache[selector + " "];
      if (!cached) {
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        for (;i--;) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }
        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
      }
      return cached;
    };
    /** @type {boolean} */
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
    support.detectDuplicates = hasDuplicate;
    setDocument();
    support.sortDetached = assert(function(div1) {
      return div1.compareDocumentPosition(doc.createElement("div")) & 1;
    });
    if (!assert(function(div) {
      /** @type {string} */
      div.innerHTML = "<a href='#'></a>";
      return "#" === div.firstChild.getAttribute("href");
    })) {
      addHandle("type|href|height|width", function(elem, name, dataAndEvents) {
        if (!dataAndEvents) {
          return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2);
        }
      });
    }
    if (!support.attributes || !assert(function(div) {
      /** @type {string} */
      div.innerHTML = "<input/>";
      div.firstChild.setAttribute("value", "");
      return "" === div.firstChild.getAttribute("value");
    })) {
      addHandle("value", function(target, deepDataAndEvents, dataAndEvents) {
        if (!dataAndEvents && "input" === target.nodeName.toLowerCase()) {
          return target.defaultValue;
        }
      });
    }
    if (!assert(function(div) {
      return null == div.getAttribute("disabled");
    })) {
      addHandle("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", function(elem, name, dataAndEvents) {
        var val;
        if (!dataAndEvents) {
          return(val = elem.getAttributeNode(name)) && val.specified ? val.value : true === elem[name] ? name.toLowerCase() : null;
        }
      });
    }
    /** @type {function (string, Node, Object, ?): ?} */
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    /** @type {function (Array): ?} */
    jQuery.unique = Sizzle.uniqueSort;
    /** @type {function (string): ?} */
    jQuery.text = Sizzle.getText;
    /** @type {function (Object): ?} */
    jQuery.isXMLDoc = Sizzle.isXML;
    /** @type {function (Object, Object): ?} */
    jQuery.contains = Sizzle.contains;
  })(win);
  var optionsCache = {};
  /**
   * @param {Object} options
   * @return {?}
   */
  jQuery.Callbacks = function(options) {
    options = "string" === typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var b;
    var memory;
    var fired;
    var firingLength;
    var firingIndex;
    var firingStart;
    /** @type {Array} */
    var list = [];
    /** @type {(Array|boolean)} */
    var stack = !options.once && [];
    /**
     * @param {Array} data
     * @return {undefined}
     */
    var fire = function(data) {
      memory = options.memory && data;
      /** @type {boolean} */
      fired = true;
      firingIndex = firingStart || 0;
      /** @type {number} */
      firingStart = 0;
      firingLength = list.length;
      /** @type {boolean} */
      b = true;
      for (;list && firingIndex < firingLength;firingIndex++) {
        if (false === list[firingIndex].apply(data[0], data[1]) && options.stopOnFalse) {
          /** @type {boolean} */
          memory = false;
          break;
        }
      }
      /** @type {boolean} */
      b = false;
      if (list) {
        if (stack) {
          if (stack.length) {
            fire(stack.shift());
          }
        } else {
          if (memory) {
            /** @type {Array} */
            list = [];
          } else {
            self.disable();
          }
        }
      }
    };
    var self = {
      /**
       * @return {?}
       */
      add : function() {
        if (list) {
          var start = list.length;
          (function add(args) {
            jQuery.each(args, function(dataAndEvents, fix) {
              var type = jQuery.type(fix);
              if ("function" === type) {
                if (!options.unique || !self.has(fix)) {
                  list.push(fix);
                }
              } else {
                if (fix) {
                  if (fix.length && "string" !== type) {
                    add(fix);
                  }
                }
              }
            });
          })(arguments);
          if (b) {
            firingLength = list.length;
          } else {
            if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
        }
        return this;
      },
      /**
       * @return {?}
       */
      remove : function() {
        if (list) {
          jQuery.each(arguments, function(dataAndEvents, arg) {
            var index;
            for (;-1 < (index = jQuery.inArray(arg, list, index));) {
              list.splice(index, 1);
              if (b) {
                if (index <= firingLength) {
                  firingLength--;
                }
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      /**
       * @param {string} fn
       * @return {?}
       */
      has : function(fn) {
        return fn ? -1 < jQuery.inArray(fn, list) : !(!list || !list.length);
      },
      /**
       * @return {?}
       */
      empty : function() {
        /** @type {Array} */
        list = [];
        /** @type {number} */
        firingLength = 0;
        return this;
      },
      /**
       * @return {?}
       */
      disable : function() {
        list = stack = memory = ready;
        return this;
      },
      /**
       * @return {?}
       */
      disabled : function() {
        return!list;
      },
      /**
       * @return {?}
       */
      lock : function() {
        /** @type {string} */
        stack = ready;
        if (!memory) {
          self.disable();
        }
        return this;
      },
      /**
       * @return {?}
       */
      locked : function() {
        return!stack;
      },
      /**
       * @param {?} context
       * @param {Array} args
       * @return {?}
       */
      fireWith : function(context, args) {
        if (list && (!fired || stack)) {
          args = args || [];
          /** @type {Array} */
          args = [context, args.slice ? args.slice() : args];
          if (b) {
            stack.push(args);
          } else {
            fire(args);
          }
        }
        return this;
      },
      /**
       * @return {?}
       */
      fire : function() {
        self.fireWith(this, arguments);
        return this;
      },
      /**
       * @return {?}
       */
      fired : function() {
        return!!fired;
      }
    };
    return self;
  };
  jQuery.extend({
    /**
     * @param {Function} func
     * @return {?}
     */
    Deferred : function(func) {
      /** @type {Array} */
      var tuples = [["resolve", "done", jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory")]];
      /** @type {string} */
      var state = "pending";
      var promise = {
        /**
         * @return {?}
         */
        state : function() {
          return state;
        },
        /**
         * @return {?}
         */
        always : function() {
          deferred.done(arguments).fail(arguments);
          return this;
        },
        /**
         * @return {?}
         */
        then : function() {
          /** @type {Arguments} */
          var fns = arguments;
          return jQuery.Deferred(function(newDefer) {
            jQuery.each(tuples, function(i, tuple) {
              var action = tuple[0];
              var fn = jQuery.isFunction(fns[i]) && fns[i];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && jQuery.isFunction(returned.promise)) {
                  returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                } else {
                  newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                }
              });
            });
            /** @type {null} */
            fns = null;
          }).promise();
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        promise : function(obj) {
          return null != obj ? jQuery.extend(obj, promise) : promise;
        }
      };
      var deferred = {};
      /** @type {function (): ?} */
      promise.pipe = promise.then;
      jQuery.each(tuples, function(i, tuple) {
        var list = tuple[2];
        var stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function() {
            state = stateString;
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }
        /**
         * @return {?}
         */
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    /**
     * @param {Object} subordinate
     * @return {?}
     */
    when : function(subordinate) {
      /** @type {number} */
      var i = 0;
      /** @type {Array.<?>} */
      var resolveValues = core_slice.call(arguments);
      /** @type {number} */
      var length = resolveValues.length;
      /** @type {number} */
      var remaining = 1 !== length || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0;
      var deferred = 1 === remaining ? subordinate : jQuery.Deferred();
      /**
       * @param {number} i
       * @param {(Array|NodeList)} contexts
       * @param {Array} values
       * @return {?}
       */
      var updateFunc = function(i, contexts, values) {
        return function(value) {
          contexts[i] = this;
          values[i] = 1 < arguments.length ? core_slice.call(arguments) : value;
          if (values === progressValues) {
            deferred.notifyWith(contexts, values);
          } else {
            if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          }
        };
      };
      var progressValues;
      var progressContexts;
      var resolveContexts;
      if (1 < length) {
        /** @type {Array} */
        progressValues = Array(length);
        /** @type {Array} */
        progressContexts = Array(length);
        /** @type {Array} */
        resolveContexts = Array(length);
        for (;i < length;i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }
      return deferred.promise();
    }
  });
  jQuery.support = function(support) {
    var input;
    var a;
    var select;
    var opt;
    var isSupported;
    var i;
    /** @type {Element} */
    var div = node.createElement("div");
    div.setAttribute("className", "t");
    /** @type {string} */
    div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    input = div.getElementsByTagName("*") || [];
    a = div.getElementsByTagName("a")[0];
    if (!a || (!a.style || !input.length)) {
      return support;
    }
    /** @type {Element} */
    select = node.createElement("select");
    /** @type {(Node|null)} */
    opt = select.appendChild(node.createElement("option"));
    input = div.getElementsByTagName("input")[0];
    /** @type {string} */
    a.style.cssText = "top:1px;float:left;opacity:.5";
    /** @type {boolean} */
    support.getSetAttribute = "t" !== div.className;
    /** @type {boolean} */
    support.leadingWhitespace = 3 === div.firstChild.nodeType;
    /** @type {boolean} */
    support.tbody = !div.getElementsByTagName("tbody").length;
    /** @type {boolean} */
    support.htmlSerialize = !!div.getElementsByTagName("link").length;
    /** @type {boolean} */
    support.style = /top/.test(a.getAttribute("style"));
    /** @type {boolean} */
    support.hrefNormalized = "/a" === a.getAttribute("href");
    /** @type {boolean} */
    support.opacity = /^0.5/.test(a.style.opacity);
    /** @type {boolean} */
    support.cssFloat = !!a.style.cssFloat;
    /** @type {boolean} */
    support.checkOn = !!input.value;
    support.optSelected = opt.selected;
    /** @type {boolean} */
    support.enctype = !!node.createElement("form").enctype;
    /** @type {boolean} */
    support.html5Clone = "<:nav></:nav>" !== node.createElement("nav").cloneNode(true).outerHTML;
    /** @type {boolean} */
    support.inlineBlockNeedsLayout = false;
    /** @type {boolean} */
    support.shrinkWrapBlocks = false;
    /** @type {boolean} */
    support.pixelPosition = false;
    /** @type {boolean} */
    support.deleteExpando = true;
    /** @type {boolean} */
    support.noCloneEvent = true;
    /** @type {boolean} */
    support.reliableMarginRight = true;
    /** @type {boolean} */
    support.boxSizingReliable = true;
    /** @type {boolean} */
    input.checked = true;
    support.noCloneChecked = input.cloneNode(true).checked;
    /** @type {boolean} */
    select.disabled = true;
    /** @type {boolean} */
    support.optDisabled = !opt.disabled;
    try {
      delete div.test;
    } catch (k) {
      /** @type {boolean} */
      support.deleteExpando = false;
    }
    /** @type {Element} */
    input = node.createElement("input");
    input.setAttribute("value", "");
    /** @type {boolean} */
    support.input = "" === input.getAttribute("value");
    /** @type {string} */
    input.value = "t";
    input.setAttribute("type", "radio");
    /** @type {boolean} */
    support.radioValue = "t" === input.value;
    input.setAttribute("checked", "t");
    input.setAttribute("name", "t");
    /** @type {DocumentFragment} */
    a = node.createDocumentFragment();
    a.appendChild(input);
    /** @type {boolean} */
    support.appendChecked = input.checked;
    support.checkClone = a.cloneNode(true).cloneNode(true).lastChild.checked;
    if (div.attachEvent) {
      div.attachEvent("onclick", function() {
        /** @type {boolean} */
        support.noCloneEvent = false;
      });
      div.cloneNode(true).click();
    }
    for (i in{
      submit : true,
      change : true,
      focusin : true
    }) {
      div.setAttribute(a = "on" + i, "t");
      /** @type {boolean} */
      support[i + "Bubbles"] = a in win || false === div.attributes[a].expando;
    }
    /** @type {string} */
    div.style.backgroundClip = "content-box";
    /** @type {string} */
    div.cloneNode(true).style.backgroundClip = "";
    /** @type {boolean} */
    support.clearCloneStyle = "content-box" === div.style.backgroundClip;
    for (i in jQuery(support)) {
      break;
    }
    /** @type {boolean} */
    support.ownLast = "0" !== i;
    jQuery(function() {
      var container;
      var marginDiv;
      var body = node.getElementsByTagName("body")[0];
      if (body) {
        /** @type {Element} */
        container = node.createElement("div");
        /** @type {string} */
        container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        body.appendChild(container).appendChild(div);
        /** @type {string} */
        div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        marginDiv = div.getElementsByTagName("td");
        /** @type {string} */
        marginDiv[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        /** @type {boolean} */
        isSupported = 0 === marginDiv[0].offsetHeight;
        /** @type {string} */
        marginDiv[0].style.display = "";
        /** @type {string} */
        marginDiv[1].style.display = "none";
        /** @type {boolean} */
        support.reliableHiddenOffsets = isSupported && 0 === marginDiv[0].offsetHeight;
        /** @type {string} */
        div.innerHTML = "";
        /** @type {string} */
        div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        jQuery.swap(body, null != body.style.zoom ? {
          zoom : 1
        } : {}, function() {
          /** @type {boolean} */
          support.boxSizing = 4 === div.offsetWidth;
        });
        if (win.getComputedStyle) {
          /** @type {boolean} */
          support.pixelPosition = "1%" !== (win.getComputedStyle(div, null) || {}).top;
          /** @type {boolean} */
          support.boxSizingReliable = "4px" === (win.getComputedStyle(div, null) || {
            width : "4px"
          }).width;
          marginDiv = div.appendChild(node.createElement("div"));
          /** @type {string} */
          marginDiv.style.cssText = div.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;";
          /** @type {string} */
          marginDiv.style.marginRight = marginDiv.style.width = "0";
          /** @type {string} */
          div.style.width = "1px";
          /** @type {boolean} */
          support.reliableMarginRight = !parseFloat((win.getComputedStyle(marginDiv, null) || {}).marginRight);
        }
        if (typeof div.style.zoom !== core_strundefined) {
          /** @type {string} */
          div.innerHTML = "";
          /** @type {string} */
          div.style.cssText = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;width:1px;padding:1px;display:inline;zoom:1";
          /** @type {boolean} */
          support.inlineBlockNeedsLayout = 3 === div.offsetWidth;
          /** @type {string} */
          div.style.display = "block";
          /** @type {string} */
          div.innerHTML = "<div></div>";
          /** @type {string} */
          div.firstChild.style.width = "5px";
          /** @type {boolean} */
          support.shrinkWrapBlocks = 3 !== div.offsetWidth;
          if (support.inlineBlockNeedsLayout) {
            /** @type {number} */
            body.style.zoom = 1;
          }
        }
        body.removeChild(container);
        /** @type {null} */
        container = div = marginDiv = marginDiv = null;
      }
    });
    /** @type {null} */
    input = select = a = opt = a = input = null;
    return support;
  }({});
  /** @type {RegExp} */
  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;
  /** @type {RegExp} */
  var r20 = /([A-Z])/g;
  jQuery.extend({
    cache : {},
    noData : {
      applet : true,
      embed : true,
      object : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    hasData : function(elem) {
      elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
      return!!elem && !filter(elem);
    },
    /**
     * @param {string} type
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    data : function(type, name, value) {
      return compile(type, name, value);
    },
    /**
     * @param {string} key
     * @param {string} name
     * @return {?}
     */
    removeData : function(key, name) {
      return remove(key, name);
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @param {boolean} expectedNumberOfNonCommentArgs
     * @return {?}
     */
    _data : function(elem, name, expectedNumberOfNonCommentArgs) {
      return compile(elem, name, expectedNumberOfNonCommentArgs, true);
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @return {?}
     */
    _removeData : function(elem, name) {
      return remove(elem, name, true);
    },
    /**
     * @param {Node} elem
     * @return {?}
     */
    acceptData : function(elem) {
      if (elem.nodeType && (1 !== elem.nodeType && 9 !== elem.nodeType)) {
        return false;
      }
      var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
      return!noData || true !== noData && elem.getAttribute("classid") === noData;
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @param {?} name
     * @return {?}
     */
    data : function(type, name) {
      var attrs;
      var attrName;
      /** @type {null} */
      var data = null;
      /** @type {number} */
      var i = 0;
      var elem = this[0];
      if (type === ready) {
        if (this.length && (data = jQuery.data(elem), 1 === elem.nodeType && !jQuery._data(elem, "parsedAttrs"))) {
          attrs = elem.attributes;
          for (;i < attrs.length;i++) {
            attrName = attrs[i].name;
            if (0 === attrName.indexOf("data-")) {
              attrName = jQuery.camelCase(attrName.slice(5));
              dataAttr(elem, attrName, data[attrName]);
            }
          }
          jQuery._data(elem, "parsedAttrs", true);
        }
        return data;
      }
      return "object" === typeof type ? this.each(function() {
        jQuery.data(this, type);
      }) : 1 < arguments.length ? this.each(function() {
        jQuery.data(this, type, name);
      }) : elem ? dataAttr(elem, type, jQuery.data(elem, type)) : null;
    },
    /**
     * @param {string} key
     * @return {?}
     */
    removeData : function(key) {
      return this.each(function() {
        jQuery.removeData(this, key);
      });
    }
  });
  jQuery.extend({
    /**
     * @param {string} type
     * @param {string} name
     * @param {?} value
     * @return {?}
     */
    queue : function(type, name, value) {
      var result;
      if (type) {
        return name = (name || "fx") + "queue", result = jQuery._data(type, name), value && (!result || jQuery.isArray(value) ? result = jQuery._data(type, name, jQuery.makeArray(value)) : result.push(value)), result || [];
      }
    },
    /**
     * @param {string} elem
     * @param {string} type
     * @return {undefined}
     */
    dequeue : function(elem, type) {
      type = type || "fx";
      var queue = jQuery.queue(elem, type);
      var ln = queue.length;
      var fn = queue.shift();
      var hooks = jQuery._queueHooks(elem, type);
      /**
       * @return {undefined}
       */
      var next = function() {
        jQuery.dequeue(elem, type);
      };
      if ("inprogress" === fn) {
        fn = queue.shift();
        ln--;
      }
      if (fn) {
        if ("fx" === type) {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!ln) {
        if (hooks) {
          hooks.empty.fire();
        }
      }
    },
    /**
     * @param {string} elem
     * @param {string} type
     * @return {?}
     */
    _queueHooks : function(elem, type) {
      /** @type {string} */
      var key = type + "queueHooks";
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty : jQuery.Callbacks("once memory").add(function() {
          jQuery._removeData(elem, type + "queue");
          jQuery._removeData(elem, key);
        })
      });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @param {string} name
     * @return {?}
     */
    queue : function(type, name) {
      /** @type {number} */
      var setter = 2;
      if ("string" !== typeof type) {
        /** @type {string} */
        name = type;
        /** @type {string} */
        type = "fx";
        setter--;
      }
      return arguments.length < setter ? jQuery.queue(this[0], type) : name === ready ? this : this.each(function() {
        var n = jQuery.queue(this, type, name);
        jQuery._queueHooks(this, type);
        if ("fx" === type) {
          if ("inprogress" !== n[0]) {
            jQuery.dequeue(this, type);
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    dequeue : function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    /**
     * @param {HTMLElement} time
     * @param {string} type
     * @return {?}
     */
    delay : function(time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
      return this.queue(type || "fx", function(next, event) {
        /** @type {number} */
        var timeout = setTimeout(next, time);
        /**
         * @return {undefined}
         */
        event.stop = function() {
          clearTimeout(timeout);
        };
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    clearQueue : function(type) {
      return this.queue(type || "fx", []);
    },
    /**
     * @param {string} type
     * @param {string} obj
     * @return {?}
     */
    promise : function(type, obj) {
      var el;
      /** @type {number} */
      var h = 1;
      var defer = jQuery.Deferred();
      var elements = this;
      var i = this.length;
      /**
       * @return {undefined}
       */
      var resolve = function() {
        if (!--h) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if ("string" !== typeof type) {
        /** @type {string} */
        obj = type;
        /** @type {string} */
        type = ready;
      }
      type = type || "fx";
      for (;i--;) {
        if ((el = jQuery._data(elements[i], type + "queueHooks")) && el.empty) {
          h++;
          el.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var nodeHook;
  var boolHook;
  /** @type {RegExp} */
  var rclass = /[\t\r\n\f]/g;
  /** @type {RegExp} */
  var rreturn = /\r/g;
  /** @type {RegExp} */
  var rinputs = /^(?:input|select|textarea|button|object)$/i;
  /** @type {RegExp} */
  var rheader = /^(?:a|area)$/i;
  /** @type {RegExp} */
  var exclude = /^(?:checked|selected)$/i;
  var getSetAttribute = jQuery.support.getSetAttribute;
  var str = jQuery.support.input;
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    attr : function(name, value) {
      return jQuery.access(this, jQuery.attr, name, value, 1 < arguments.length);
    },
    /**
     * @param {string} name
     * @return {?}
     */
    removeAttr : function(name) {
      return this.each(function() {
        jQuery.removeAttr(this, name);
      });
    },
    /**
     * @param {string} name
     * @param {boolean} value
     * @return {?}
     */
    prop : function(name, value) {
      return jQuery.access(this, jQuery.prop, name, value, 1 < arguments.length);
    },
    /**
     * @param {Text} name
     * @return {?}
     */
    removeProp : function(name) {
      name = jQuery.propFix[name] || name;
      return this.each(function() {
        try {
          /** @type {string} */
          this[name] = ready;
          delete this[name];
        } catch (b) {
        }
      });
    },
    /**
     * @param {string} value
     * @return {?}
     */
    addClass : function(value) {
      var classes;
      var elem;
      var cur;
      var clazz;
      var j;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {(boolean|string)} */
      classes = "string" === typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (classes) {
        classes = (value || "").match(core_rnotwhite) || [];
        for (;i < l;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
            /** @type {number} */
            j = 0;
            for (;clazz = classes[j++];) {
              if (0 > cur.indexOf(" " + clazz + " ")) {
                cur += clazz + " ";
              }
            }
            elem.className = jQuery.trim(cur);
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @return {?}
     */
    removeClass : function(value) {
      var res;
      var elem;
      var cur;
      var apn;
      var resLength;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {(boolean|string)} */
      res = 0 === arguments.length || "string" === typeof value && value;
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (res) {
        res = (value || "").match(core_rnotwhite) || [];
        for (;i < l;i++) {
          if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
            /** @type {number} */
            resLength = 0;
            for (;apn = res[resLength++];) {
              for (;0 <= cur.indexOf(" " + apn + " ");) {
                /** @type {string} */
                cur = cur.replace(" " + apn + " ", " ");
              }
            }
            elem.className = value ? jQuery.trim(cur) : "";
          }
        }
      }
      return this;
    },
    /**
     * @param {string} value
     * @param {?} stateVal
     * @return {?}
     */
    toggleClass : function(value, stateVal) {
      /** @type {string} */
      var type = typeof value;
      return "boolean" === typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
      }) : this.each(function() {
        if ("string" === type) {
          var className;
          /** @type {number} */
          var i = 0;
          var self = jQuery(this);
          var classNames = value.match(core_rnotwhite) || [];
          for (;className = classNames[i++];) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else {
          if (type === core_strundefined || "boolean" === type) {
            if (this.className) {
              jQuery._data(this, "__className__", this.className);
            }
            this.className = this.className || false === value ? "" : jQuery._data(this, "__className__") || "";
          }
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    hasClass : function(type) {
      /** @type {string} */
      type = " " + type + " ";
      /** @type {number} */
      var i = 0;
      var l = this.length;
      for (;i < l;i++) {
        if (1 === this[i].nodeType && 0 <= (" " + this[i].className + " ").replace(rclass, " ").indexOf(type)) {
          return true;
        }
      }
      return false;
    },
    /**
     * @param {Function} value
     * @return {?}
     */
    val : function(value) {
      var ret;
      var hooks;
      var valid;
      var elem = this[0];
      if (arguments.length) {
        return valid = jQuery.isFunction(value), this.each(function(val) {
          if (1 === this.nodeType && (val = valid ? value.call(this, val, jQuery(this).val()) : value, null == val ? val = "" : "number" === typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(month) {
            return null == month ? "" : month + "";
          })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], !hooks || (!("set" in hooks) || hooks.set(this, val, "value") === ready))) {
            /** @type {string} */
            this.value = val;
          }
        });
      }
      if (elem) {
        if ((hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()]) && ("get" in hooks && (ret = hooks.get(elem, "value")) !== ready)) {
          return ret;
        }
        ret = elem.value;
        return "string" === typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret;
      }
    }
  });
  jQuery.extend({
    valHooks : {
      option : {
        /**
         * @param {string} elem
         * @return {?}
         */
        get : function(elem) {
          var text = jQuery.find.attr(elem, "value");
          return null != text ? text : elem.text;
        }
      },
      select : {
        /**
         * @param {Element} elem
         * @return {?}
         */
        get : function(elem) {
          var option;
          var options = elem.options;
          var index = elem.selectedIndex;
          /** @type {(Array|null)} */
          var data = (elem = "select-one" === elem.type || 0 > index) ? null : [];
          var j = elem ? index + 1 : options.length;
          var i = 0 > index ? j : elem ? index : 0;
          for (;i < j;i++) {
            if (option = options[i], (option.selected || i === index) && ((jQuery.support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup")))) {
              option = jQuery(option).val();
              if (elem) {
                return option;
              }
              data.push(option);
            }
          }
          return data;
        },
        /**
         * @param {Element} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          var f;
          var option;
          var options = elem.options;
          var values = jQuery.makeArray(value);
          var i = options.length;
          for (;i--;) {
            if (option = options[i], option.selected = 0 <= jQuery.inArray(jQuery(option).val(), values)) {
              /** @type {boolean} */
              f = true;
            }
          }
          if (!f) {
            /** @type {number} */
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    attr : function(elem, name, value) {
      var hooks;
      var ret;
      var nodeType = elem.nodeType;
      if (elem && !(3 === nodeType || (8 === nodeType || 2 === nodeType))) {
        if (typeof elem.getAttribute === core_strundefined) {
          return jQuery.prop(elem, name, value);
        }
        if (1 !== nodeType || !jQuery.isXMLDoc(elem)) {
          name = name.toLowerCase();
          hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
        }
        if (value !== ready) {
          if (null === value) {
            jQuery.removeAttr(elem, name);
          } else {
            if (hooks && ("set" in hooks && (ret = hooks.set(elem, value, name)) !== ready)) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
        } else {
          if (hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name)))) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return null == ret ? ready : ret;
        }
      }
    },
    /**
     * @param {Object} elem
     * @param {string} value
     * @return {undefined}
     */
    removeAttr : function(elem, value) {
      var name;
      var propName;
      /** @type {number} */
      var i = 0;
      var attrNames = value && value.match(core_rnotwhite);
      if (attrNames && 1 === elem.nodeType) {
        for (;name = attrNames[i++];) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            if (str && getSetAttribute || !exclude.test(name)) {
              /** @type {boolean} */
              elem[propName] = false;
            } else {
              /** @type {boolean} */
              elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
            }
          } else {
            jQuery.attr(elem, name, "");
          }
          elem.removeAttribute(getSetAttribute ? name : propName);
        }
      }
    },
    attrHooks : {
      type : {
        /**
         * @param {Element} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          if (!jQuery.support.radioValue && ("radio" === value && jQuery.nodeName(elem, "input"))) {
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }
      }
    },
    propFix : {
      "for" : "htmlFor",
      "class" : "className"
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    prop : function(elem, name, value) {
      var ret;
      var hooks;
      var type;
      type = elem.nodeType;
      if (elem && !(3 === type || (8 === type || 2 === type))) {
        if (type = 1 !== type || !jQuery.isXMLDoc(elem)) {
          name = jQuery.propFix[name] || name;
          hooks = jQuery.propHooks[name];
        }
        return value !== ready ? hooks && ("set" in hooks && (ret = hooks.set(elem, value, name)) !== ready) ? ret : elem[name] = value : hooks && ("get" in hooks && null !== (ret = hooks.get(elem, name))) ? ret : elem[name];
      }
    },
    propHooks : {
      tabIndex : {
        /**
         * @param {(Object|string)} elem
         * @return {?}
         */
        get : function(elem) {
          var tabindex = jQuery.find.attr(elem, "tabindex");
          return tabindex ? parseInt(tabindex, 10) : rinputs.test(elem.nodeName) || rheader.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    }
  });
  boolHook = {
    /**
     * @param {Object} elem
     * @param {?} arr2
     * @param {string} name
     * @return {?}
     */
    set : function(elem, arr2, name) {
      if (false === arr2) {
        jQuery.removeAttr(elem, name);
      } else {
        if (str && getSetAttribute || !exclude.test(name)) {
          elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
        } else {
          /** @type {boolean} */
          elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
        }
      }
      return name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(dataAndEvents, name) {
    var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;
    /** @type {function ((Object|string), string, boolean): ?} */
    jQuery.expr.attrHandle[name] = str && getSetAttribute || !exclude.test(name) ? function(elem, name, isXML) {
      var ref = jQuery.expr.attrHandle[name];
      elem = isXML ? ready : (jQuery.expr.attrHandle[name] = ready) != getter(elem, name, isXML) ? name.toLowerCase() : null;
      jQuery.expr.attrHandle[name] = ref;
      return elem;
    } : function(dataAndEvents, name, enabled) {
      return enabled ? ready : dataAndEvents[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
    };
  });
  if (!str || !getSetAttribute) {
    jQuery.attrHooks.value = {
      /**
       * @param {string} elem
       * @param {string} value
       * @param {string} name
       * @return {?}
       */
      set : function(elem, value, name) {
        if (jQuery.nodeName(elem, "input")) {
          /** @type {string} */
          elem.defaultValue = value;
        } else {
          return nodeHook && nodeHook.set(elem, value, name);
        }
      }
    };
  }
  if (!getSetAttribute) {
    nodeHook = {
      /**
       * @param {Object} elem
       * @param {string} value
       * @param {string} name
       * @return {?}
       */
      set : function(elem, value, name) {
        var ret = elem.getAttributeNode(name);
        if (!ret) {
          elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name));
        }
        /** @type {string} */
        ret.value = value += "";
        return "value" === name || value === elem.getAttribute(name) ? value : ready;
      }
    };
    /** @type {function (Object, ?, boolean): ?} */
    jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords = function(elem, name, isXML) {
      var weight;
      return isXML ? ready : (weight = elem.getAttributeNode(name)) && "" !== weight.value ? weight.value : null;
    };
    jQuery.valHooks.button = {
      /**
       * @param {string} elem
       * @param {string} name
       * @return {?}
       */
      get : function(elem, name) {
        var node = elem.getAttributeNode(name);
        return node && node.specified ? node.value : ready;
      },
      /** @type {function (Object, string, string): ?} */
      set : nodeHook.set
    };
    jQuery.attrHooks.contenteditable = {
      /**
       * @param {string} elem
       * @param {string} value
       * @param {string} name
       * @return {undefined}
       */
      set : function(elem, value, name) {
        nodeHook.set(elem, "" === value ? false : value, name);
      }
    };
    jQuery.each(["width", "height"], function(dataAndEvents, name) {
      jQuery.attrHooks[name] = {
        /**
         * @param {?} elem
         * @param {string} value
         * @return {?}
         */
        set : function(elem, value) {
          if ("" === value) {
            return elem.setAttribute(name, "auto"), value;
          }
        }
      };
    });
  }
  if (!jQuery.support.hrefNormalized) {
    jQuery.each(["href", "src"], function(dataAndEvents, name) {
      jQuery.propHooks[name] = {
        /**
         * @param {string} elem
         * @return {?}
         */
        get : function(elem) {
          return elem.getAttribute(name, 4);
        }
      };
    });
  }
  if (!jQuery.support.style) {
    jQuery.attrHooks.style = {
      /**
       * @param {string} elem
       * @return {?}
       */
      get : function(elem) {
        return elem.style.cssText || ready;
      },
      /**
       * @param {string} b
       * @param {string} value
       * @return {?}
       */
      set : function(b, value) {
        return b.style.cssText = value + "";
      }
    };
  }
  if (!jQuery.support.optSelected) {
    jQuery.propHooks.selected = {
      /**
       * @param {Object} elem
       * @return {?}
       */
      get : function(elem) {
        if (elem = elem.parentNode) {
          elem.selectedIndex;
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }
        }
        return null;
      }
    };
  }
  jQuery.each("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" "), function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  if (!jQuery.support.enctype) {
    /** @type {string} */
    jQuery.propFix.enctype = "encoding";
  }
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      /**
       * @param {string} elem
       * @param {string} values
       * @return {?}
       */
      set : function(elem, values) {
        if (jQuery.isArray(values)) {
          return elem.checked = 0 <= jQuery.inArray(jQuery(elem).val(), values);
        }
      }
    };
    if (!jQuery.support.checkOn) {
      /**
       * @param {Element} elem
       * @return {?}
       */
      jQuery.valHooks[this].get = function(elem) {
        return null === elem.getAttribute("value") ? "on" : elem.value;
      };
    }
  });
  /** @type {RegExp} */
  var rformElems = /^(?:input|select|textarea)$/i;
  /** @type {RegExp} */
  var rkeyEvent = /^key/;
  /** @type {RegExp} */
  var touchTypeRegex = /^(?:mouse|contextmenu)|click/;
  /** @type {RegExp} */
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
  /** @type {RegExp} */
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  jQuery.event = {
    global : {},
    /**
     * @param {Object} elem
     * @param {Object} types
     * @param {Function} handler
     * @param {Object} e
     * @param {Object} selector
     * @return {undefined}
     */
    add : function(elem, types, handler, e, selector) {
      var special;
      var events;
      var t;
      var handleObjIn;
      var eventHandle;
      var handleObj;
      var handlers;
      var type;
      var namespaces;
      if (t = jQuery._data(elem)) {
        if (handler.handler) {
          /** @type {Function} */
          handleObjIn = handler;
          handler = handleObjIn.handler;
          selector = handleObjIn.selector;
        }
        if (!handler.guid) {
          /** @type {number} */
          handler.guid = jQuery.guid++;
        }
        if (!(events = t.events)) {
          events = t.events = {};
        }
        if (!(eventHandle = t.handle)) {
          /** @type {function (Event): ?} */
          eventHandle = t.handle = function(e) {
            return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : ready;
          };
          /** @type {Object} */
          eventHandle.elem = elem;
        }
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (special = rtypenamespace.exec(types[t]) || [], type = handleObj = special[1], namespaces = (special[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type : type,
              origType : handleObj,
              data : e,
              /** @type {Function} */
              handler : handler,
              guid : handler.guid,
              selector : selector,
              needsContext : selector && jQuery.expr.match.needsContext.test(selector),
              namespace : namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              if (handlers = events[type] = [], handlers.delegateCount = 0, !special.setup || false === special.setup.call(elem, e, namespaces, eventHandle)) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle, false);
                } else {
                  if (elem.attachEvent) {
                    elem.attachEvent("on" + type, eventHandle);
                  }
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            /** @type {boolean} */
            jQuery.event.global[type] = true;
          }
        }
        /** @type {null} */
        elem = null;
      }
    },
    /**
     * @param {string} elem
     * @param {Object} types
     * @param {Object} handler
     * @param {string} selector
     * @param {boolean} keepData
     * @return {undefined}
     */
    remove : function(elem, types, handler, selector, keepData) {
      var j;
      var handleObj;
      var tmp;
      var origCount;
      var t;
      var events;
      var special;
      var handlers;
      var type;
      var namespaces;
      var origType;
      var elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (elemData && (events = elemData.events)) {
        types = (types || "").match(core_rnotwhite) || [""];
        t = types.length;
        for (;t--;) {
          if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            for (;j--;) {
              if (handleObj = handlers[j], (keepData || origType === handleObj.origType) && ((!handler || handler.guid === handleObj.guid) && ((!tmp || tmp.test(handleObj.namespace)) && (!selector || (selector === handleObj.selector || "**" === selector && handleObj.selector))))) {
                handlers.splice(j, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount) {
              if (!handlers.length) {
                if (!special.teardown || false === special.teardown.call(elem, namespaces, elemData.handle)) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
          } else {
            for (type in events) {
              jQuery.event.remove(elem, type + types[t], handler, selector, true);
            }
          }
        }
        if (jQuery.isEmptyObject(events)) {
          delete elemData.handle;
          jQuery._removeData(elem, "events");
        }
      }
    },
    /**
     * @param {Object} event
     * @param {?} obj
     * @param {Object} elem
     * @param {boolean} onlyHandlers
     * @return {?}
     */
    trigger : function(event, obj, elem, onlyHandlers) {
      var tmp;
      var ontype;
      var cur;
      var bubbleType;
      var special;
      var i;
      /** @type {Array} */
      var eventPath = [elem || node];
      var type = core_hasOwn.call(event, "type") ? event.type : event;
      special = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      cur = tmp = elem = elem || node;
      if (!(3 === elem.nodeType || 8 === elem.nodeType) && !rfocusMorph.test(type + jQuery.event.triggered)) {
        if (0 <= type.indexOf(".") && (special = type.split("."), type = special.shift(), special.sort()), ontype = 0 > type.indexOf(":") && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" === typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = special.join("."), event.namespace_re = event.namespace ? RegExp("(^|\\.)" + special.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = ready, event.target || (event.target = elem), 
        obj = null == obj ? [event] : jQuery.makeArray(obj, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || !(special.trigger && false === special.trigger.apply(elem, obj))) {
          if (!onlyHandlers && (!special.noBubble && !jQuery.isWindow(elem))) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (;cur;cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || node)) {
              eventPath.push(tmp.defaultView || (tmp.parentWindow || win));
            }
          }
          /** @type {number} */
          i = 0;
          for (;(cur = eventPath[i++]) && !event.isPropagationStopped();) {
            event.type = 1 < i ? bubbleType : special.bindType || type;
            if (tmp = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle")) {
              tmp.apply(cur, obj);
            }
            if (tmp = ontype && cur[ontype]) {
              if (jQuery.acceptData(cur) && (tmp.apply && false === tmp.apply(cur, obj))) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && (!event.isDefaultPrevented() && ((!special._default || false === special._default.apply(eventPath.pop(), obj)) && (jQuery.acceptData(elem) && (ontype && (elem[type] && !jQuery.isWindow(elem))))))) {
            if (tmp = elem[ontype]) {
              /** @type {null} */
              elem[ontype] = null;
            }
            jQuery.event.triggered = type;
            try {
              elem[type]();
            } catch (n) {
            }
            /** @type {string} */
            jQuery.event.triggered = ready;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
          return event.result;
        }
      }
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    dispatch : function(event) {
      event = jQuery.event.fix(event);
      var index;
      var handleObj;
      var matched;
      var j;
      /** @type {Array} */
      var result = [];
      /** @type {Array.<?>} */
      var args = core_slice.call(arguments);
      index = (jQuery._data(this, "events") || {})[event.type] || [];
      var special = jQuery.event.special[event.type] || {};
      /** @type {Object} */
      args[0] = event;
      event.delegateTarget = this;
      if (!(special.preDispatch && false === special.preDispatch.call(this, event))) {
        result = jQuery.event.handlers.call(this, event, index);
        /** @type {number} */
        index = 0;
        for (;(matched = result[index++]) && !event.isPropagationStopped();) {
          event.currentTarget = matched.elem;
          /** @type {number} */
          j = 0;
          for (;(handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) {
            if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
              if (event.handleObj = handleObj, event.data = handleObj.data, handleObj = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), handleObj !== ready && false === (event.result = handleObj)) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
        if (special.postDispatch) {
          special.postDispatch.call(this, event);
        }
        return event.result;
      }
    },
    /**
     * @param {Event} event
     * @param {Object} handlers
     * @return {?}
     */
    handlers : function(event, handlers) {
      var sel;
      var handleObj;
      var matches;
      var i;
      /** @type {Array} */
      var handlerQueue = [];
      var delegateCount = handlers.delegateCount;
      var cur = event.target;
      if (delegateCount && (cur.nodeType && (!event.button || "click" !== event.type))) {
        for (;cur != this;cur = cur.parentNode || this) {
          if (1 === cur.nodeType && (true !== cur.disabled || "click" !== event.type)) {
            /** @type {Array} */
            matches = [];
            /** @type {number} */
            i = 0;
            for (;i < delegateCount;i++) {
              handleObj = handlers[i];
              /** @type {string} */
              sel = handleObj.selector + " ";
              if (matches[sel] === ready) {
                matches[sel] = handleObj.needsContext ? 0 <= jQuery(sel, this).index(cur) : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem : cur,
                handlers : matches
              });
            }
          }
        }
      }
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem : this,
          handlers : handlers.slice(delegateCount)
        });
      }
      return handlerQueue;
    },
    /**
     * @param {Object} event
     * @return {?}
     */
    fix : function(event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var type;
      var prop;
      var copy;
      type = event.type;
      /** @type {Object} */
      var originalEvent = event;
      var fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = touchTypeRegex.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      type = copy.length;
      for (;type--;) {
        prop = copy[type];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = originalEvent.srcElement || node;
      }
      if (3 === event.target.nodeType) {
        event.target = event.target.parentNode;
      }
      /** @type {boolean} */
      event.metaKey = !!event.metaKey;
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    props : "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks : {},
    keyHooks : {
      props : ["char", "charCode", "key", "keyCode"],
      /**
       * @param {string} type
       * @param {Object} event
       * @return {?}
       */
      filter : function(type, event) {
        if (null == type.which) {
          type.which = null != event.charCode ? event.charCode : event.keyCode;
        }
        return type;
      }
    },
    mouseHooks : {
      props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      /**
       * @param {string} type
       * @param {Object} event
       * @return {?}
       */
      filter : function(type, event) {
        var d;
        var de;
        var old = event.button;
        var fromElement = event.fromElement;
        if (null == type.pageX) {
          if (null != event.clientX) {
            d = type.target.ownerDocument || node;
            de = d.documentElement;
            d = d.body;
            /** @type {number} */
            type.pageX = event.clientX + (de && de.scrollLeft || (d && d.scrollLeft || 0)) - (de && de.clientLeft || (d && d.clientLeft || 0));
            /** @type {number} */
            type.pageY = event.clientY + (de && de.scrollTop || (d && d.scrollTop || 0)) - (de && de.clientTop || (d && d.clientTop || 0));
          }
        }
        if (!type.relatedTarget) {
          if (fromElement) {
            type.relatedTarget = fromElement === type.target ? event.toElement : fromElement;
          }
        }
        if (!type.which) {
          if (old !== ready) {
            /** @type {number} */
            type.which = old & 1 ? 1 : old & 2 ? 3 : old & 4 ? 2 : 0;
          }
        }
        return type;
      }
    },
    special : {
      load : {
        noBubble : true
      },
      focus : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (this !== safeActiveElement() && this.focus) {
            try {
              return this.focus(), false;
            } catch (a) {
            }
          }
        },
        delegateType : "focusin"
      },
      blur : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (this === safeActiveElement() && this.blur) {
            return this.blur(), false;
          }
        },
        delegateType : "focusout"
      },
      click : {
        /**
         * @return {?}
         */
        trigger : function() {
          if (jQuery.nodeName(this, "input") && ("checkbox" === this.type && this.click)) {
            return this.click(), false;
          }
        },
        /**
         * @param {Function} elem
         * @return {?}
         */
        _default : function(elem) {
          return jQuery.nodeName(elem.target, "a");
        }
      },
      beforeunload : {
        /**
         * @param {Object} event
         * @return {undefined}
         */
        postDispatch : function(event) {
          if (event.result !== ready) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },
    /**
     * @param {Object} type
     * @param {?} elem
     * @param {Event} event
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    simulate : function(type, elem, event, dataAndEvents) {
      type = jQuery.extend(new jQuery.Event, event, {
        type : type,
        isSimulated : true,
        originalEvent : {}
      });
      if (dataAndEvents) {
        jQuery.event.trigger(type, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, type);
      }
      if (type.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  /** @type {function (?, ?, ?): undefined} */
  jQuery.removeEvent = node.removeEventListener ? function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  } : function(elem, type, listener) {
    /** @type {string} */
    type = "on" + type;
    if (elem.detachEvent) {
      if (typeof elem[type] === core_strundefined) {
        /** @type {null} */
        elem[type] = null;
      }
      elem.detachEvent(type, listener);
    }
  };
  /**
   * @param {Object} src
   * @param {Array} props
   * @return {?}
   */
  jQuery.Event = function(src, props) {
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    if (src && src.type) {
      /** @type {Object} */
      this.originalEvent = src;
      this.type = src.type;
      /** @type {function (): ?} */
      this.isDefaultPrevented = src.defaultPrevented || (false === src.returnValue || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;
    } else {
      /** @type {Object} */
      this.type = src;
    }
    if (props) {
      jQuery.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || jQuery.now();
    /** @type {boolean} */
    this[jQuery.expando] = true;
  };
  jQuery.Event.prototype = {
    /** @type {function (): ?} */
    isDefaultPrevented : returnFalse,
    /** @type {function (): ?} */
    isPropagationStopped : returnFalse,
    /** @type {function (): ?} */
    isImmediatePropagationStopped : returnFalse,
    /**
     * @return {undefined}
     */
    preventDefault : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isDefaultPrevented = returnTrue;
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          /** @type {boolean} */
          e.returnValue = false;
        }
      }
    },
    /**
     * @return {undefined}
     */
    stopPropagation : function() {
      var e = this.originalEvent;
      /** @type {function (): ?} */
      this.isPropagationStopped = returnTrue;
      if (e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        /** @type {boolean} */
        e.cancelBubble = true;
      }
    },
    /**
     * @return {undefined}
     */
    stopImmediatePropagation : function() {
      /** @type {function (): ?} */
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter : "mouseover",
    mouseleave : "mouseout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType : fix,
      bindType : fix,
      /**
       * @param {Object} event
       * @return {?}
       */
      handle : function(event) {
        var ret;
        var related = event.relatedTarget;
        var handleObj = event.handleObj;
        if (!related || related !== this && !jQuery.contains(this, related)) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  if (!jQuery.support.submitBubbles) {
    jQuery.event.special.submit = {
      /**
       * @return {?}
       */
      setup : function() {
        if (jQuery.nodeName(this, "form")) {
          return false;
        }
        jQuery.event.add(this, "click._submit keypress._submit", function(elem) {
          elem = elem.target;
          if ((elem = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : ready) && !jQuery._data(elem, "submitBubbles")) {
            jQuery.event.add(elem, "submit._submit", function(event) {
              /** @type {boolean} */
              event._submit_bubble = true;
            });
            jQuery._data(elem, "submitBubbles", true);
          }
        });
      },
      /**
       * @param {Event} event
       * @return {undefined}
       */
      postDispatch : function(event) {
        if (event._submit_bubble) {
          delete event._submit_bubble;
          if (this.parentNode) {
            if (!event.isTrigger) {
              jQuery.event.simulate("submit", this.parentNode, event, true);
            }
          }
        }
      },
      /**
       * @return {?}
       */
      teardown : function() {
        if (jQuery.nodeName(this, "form")) {
          return false;
        }
        jQuery.event.remove(this, "._submit");
      }
    };
  }
  if (!jQuery.support.changeBubbles) {
    jQuery.event.special.change = {
      /**
       * @return {?}
       */
      setup : function() {
        if (rformElems.test(this.nodeName)) {
          if ("checkbox" === this.type || "radio" === this.type) {
            jQuery.event.add(this, "propertychange._change", function(event) {
              if ("checked" === event.originalEvent.propertyName) {
                /** @type {boolean} */
                this._just_changed = true;
              }
            });
            jQuery.event.add(this, "click._change", function(event) {
              if (this._just_changed) {
                if (!event.isTrigger) {
                  /** @type {boolean} */
                  this._just_changed = false;
                }
              }
              jQuery.event.simulate("change", this, event, true);
            });
          }
          return false;
        }
        jQuery.event.add(this, "beforeactivate._change", function(dest) {
          dest = dest.target;
          if (rformElems.test(dest.nodeName)) {
            if (!jQuery._data(dest, "changeBubbles")) {
              jQuery.event.add(dest, "change._change", function(event) {
                if (this.parentNode) {
                  if (!event.isSimulated && !event.isTrigger) {
                    jQuery.event.simulate("change", this.parentNode, event, true);
                  }
                }
              });
              jQuery._data(dest, "changeBubbles", true);
            }
          }
        });
      },
      /**
       * @param {Event} event
       * @return {?}
       */
      handle : function(event) {
        var current = event.target;
        if (this !== current || (event.isSimulated || (event.isTrigger || "radio" !== current.type && "checkbox" !== current.type))) {
          return event.handleObj.handler.apply(this, arguments);
        }
      },
      /**
       * @return {?}
       */
      teardown : function() {
        jQuery.event.remove(this, "._change");
        return!rformElems.test(this.nodeName);
      }
    };
  }
  if (!jQuery.support.focusinBubbles) {
    jQuery.each({
      focus : "focusin",
      blur : "focusout"
    }, function(orig, fix) {
      /** @type {number} */
      var f = 0;
      /**
       * @param {Object} event
       * @return {undefined}
       */
      var handler = function(event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
      };
      jQuery.event.special[fix] = {
        /**
         * @return {undefined}
         */
        setup : function() {
          if (0 === f++) {
            node.addEventListener(orig, handler, true);
          }
        },
        /**
         * @return {undefined}
         */
        teardown : function() {
          if (0 === --f) {
            node.removeEventListener(orig, handler, true);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @param {Object} selector
     * @param {Object} data
     * @param {Object} fn
     * @param {(number|string)} one
     * @return {?}
     */
    on : function(type, selector, data, fn, one) {
      var event;
      var origFn;
      if ("object" === typeof type) {
        if ("string" !== typeof selector) {
          data = data || selector;
          /** @type {string} */
          selector = ready;
        }
        for (event in type) {
          this.on(event, selector, data, type[event], one);
        }
        return this;
      }
      if (null == data && null == fn) {
        /** @type {Object} */
        fn = selector;
        data = selector = ready;
      } else {
        if (null == fn) {
          if ("string" === typeof selector) {
            /** @type {Object} */
            fn = data;
            /** @type {string} */
            data = ready;
          } else {
            /** @type {Object} */
            fn = data;
            /** @type {Object} */
            data = selector;
            /** @type {string} */
            selector = ready;
          }
        }
      }
      if (false === fn) {
        /** @type {function (): ?} */
        fn = returnFalse;
      } else {
        if (!fn) {
          return this;
        }
      }
      if (1 === one) {
        /** @type {Object} */
        origFn = fn;
        /**
         * @param {string} type
         * @return {?}
         */
        fn = function(type) {
          jQuery().off(type);
          return origFn.apply(this, arguments);
        };
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function() {
        jQuery.event.add(this, type, fn, data, selector);
      });
    },
    /**
     * @param {?} type
     * @param {Function} callback
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    one : function(type, callback, data, fn) {
      return this.on(type, callback, data, fn, 1);
    },
    /**
     * @param {Object} types
     * @param {Object} selector
     * @param {Object} fn
     * @return {?}
     */
    off : function(types, selector, fn) {
      var handleObj;
      if (types && (types.preventDefault && types.handleObj)) {
        return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
      }
      if ("object" === typeof types) {
        for (handleObj in types) {
          this.off(handleObj, selector, types[handleObj]);
        }
        return this;
      }
      if (false === selector || "function" === typeof selector) {
        /** @type {Object} */
        fn = selector;
        /** @type {string} */
        selector = ready;
      }
      if (false === fn) {
        /** @type {function (): ?} */
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    trigger : function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    /**
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    triggerHandler : function(type, data) {
      var parent = this[0];
      if (parent) {
        return jQuery.event.trigger(type, data, parent, true);
      }
    }
  });
  /** @type {RegExp} */
  var rmouseEvent = /^.[^:#\[\.,]*$/;
  /** @type {RegExp} */
  var eventSplitter = /^(?:parents|prev(?:Until|All))/;
  var rneedsContext = jQuery.expr.match.needsContext;
  var guaranteedUnique = {
    children : true,
    contents : true,
    next : true,
    prev : true
  };
  jQuery.fn.extend({
    /**
     * @param {string} selector
     * @return {?}
     */
    find : function(selector) {
      var i;
      /** @type {Array} */
      var ret = [];
      var self = this;
      var len = self.length;
      if ("string" !== typeof selector) {
        return this.pushStack(jQuery(selector).filter(function() {
          /** @type {number} */
          i = 0;
          for (;i < len;i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      /** @type {number} */
      i = 0;
      for (;i < len;i++) {
        jQuery.find(selector, self[i], ret);
      }
      ret = this.pushStack(1 < len ? jQuery.unique(ret) : ret);
      /** @type {string} */
      ret.selector = this.selector ? this.selector + " " + selector : selector;
      return ret;
    },
    /**
     * @param {string} scripts
     * @return {?}
     */
    has : function(scripts) {
      var i;
      var targets = jQuery(scripts, this);
      var l = targets.length;
      return this.filter(function() {
        /** @type {number} */
        i = 0;
        for (;i < l;i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    /**
     * @param {Array} selector
     * @return {?}
     */
    not : function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    /**
     * @param {string} type
     * @return {?}
     */
    filter : function(type) {
      return this.pushStack(winnow(this, type || [], false));
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    is : function(selector) {
      return!!winnow(this, "string" === typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    },
    /**
     * @param {string} selectors
     * @param {Node} context
     * @return {?}
     */
    closest : function(selectors, context) {
      var cur;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      /** @type {Array} */
      var matched = [];
      var pos = rneedsContext.test(selectors) || "string" !== typeof selectors ? jQuery(selectors, context || this.context) : 0;
      for (;i < l;i++) {
        cur = this[i];
        for (;cur && cur !== context;cur = cur.parentNode) {
          if (11 > cur.nodeType && (pos ? -1 < pos.index(cur) : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(1 < matched.length ? jQuery.unique(matched) : matched);
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    index : function(elem) {
      return!elem ? this[0] && this[0].parentNode ? this.first().prevAll().length : -1 : "string" === typeof elem ? jQuery.inArray(this[0], jQuery(elem)) : jQuery.inArray(elem.jquery ? elem[0] : elem, this);
    },
    /**
     * @param {Object} selector
     * @param {string} options
     * @return {?}
     */
    add : function(selector, options) {
      var ret = "string" === typeof selector ? jQuery(selector, options) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector);
      ret = jQuery.merge(this.get(), ret);
      return this.pushStack(jQuery.unique(ret));
    },
    /**
     * @param {string} fix
     * @return {?}
     */
    addBack : function(fix) {
      return this.add(null == fix ? this.prevObject : this.prevObject.filter(fix));
    }
  });
  jQuery.each({
    /**
     * @param {Object} n
     * @return {?}
     */
    parent : function(n) {
      return(n = n.parentNode) && 11 !== n.nodeType ? n : null;
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    parents : function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    /**
     * @param {string} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    parentsUntil : function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    next : function(elem) {
      return sibling(elem, "nextSibling");
    },
    /**
     * @param {Object} elem
     * @return {?}
     */
    prev : function(elem) {
      return sibling(elem, "previousSibling");
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    nextAll : function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    /**
     * @param {string} elem
     * @return {?}
     */
    prevAll : function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    /**
     * @param {string} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    nextUntil : function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    /**
     * @param {string} elem
     * @param {?} i
     * @param {string} until
     * @return {?}
     */
    prevUntil : function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    /**
     * @param {HTMLElement} elem
     * @return {?}
     */
    siblings : function(elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    children : function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    /**
     * @param {Element} elem
     * @return {?}
     */
    contents : function(elem) {
      return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function(name, restoreScript) {
    /**
     * @param {string} until
     * @param {string} fix
     * @return {?}
     */
    jQuery.fn[name] = function(until, fix) {
      var elements = jQuery.map(this, restoreScript, until);
      if ("Until" !== name.slice(-5)) {
        /** @type {string} */
        fix = until;
      }
      if (fix) {
        if ("string" === typeof fix) {
          elements = jQuery.filter(fix, elements);
        }
      }
      if (1 < this.length) {
        if (!guaranteedUnique[name]) {
          elements = jQuery.unique(elements);
        }
        if (eventSplitter.test(name)) {
          elements = elements.reverse();
        }
      }
      return this.pushStack(elements);
    };
  });
  jQuery.extend({
    /**
     * @param {string} type
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    filter : function(type, name, value) {
      var elem = name[0];
      if (value) {
        /** @type {string} */
        type = ":not(" + type + ")";
      }
      return 1 === name.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, type) ? [elem] : [] : jQuery.find.matches(type, jQuery.grep(name, function(dest) {
        return 1 === dest.nodeType;
      }));
    },
    /**
     * @param {string} elem
     * @param {string} dir
     * @param {string} until
     * @return {?}
     */
    dir : function(elem, dir, until) {
      /** @type {Array} */
      var matched = [];
      elem = elem[dir];
      for (;elem && (9 !== elem.nodeType && (until === ready || (1 !== elem.nodeType || !jQuery(elem).is(until))));) {
        if (1 === elem.nodeType) {
          matched.push(elem);
        }
        elem = elem[dir];
      }
      return matched;
    },
    /**
     * @param {Object} n
     * @param {Object} elem
     * @return {?}
     */
    sibling : function(n, elem) {
      /** @type {Array} */
      var r = [];
      for (;n;n = n.nextSibling) {
        if (1 === n.nodeType) {
          if (n !== elem) {
            r.push(n);
          }
        }
      }
      return r;
    }
  });
  /** @type {string} */
  var uHostName = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";
  /** @type {RegExp} */
  var newlineRe = / jQuery\d+="(?:null|\d+)"/g;
  /** @type {RegExp} */
  var rchecked = RegExp("<(?:" + uHostName + ")[\\s/>]", "i");
  /** @type {RegExp} */
  var rtagName = /^\s+/;
  /** @type {RegExp} */
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
  /** @type {RegExp} */
  var matches = /<([\w:]+)/;
  /** @type {RegExp} */
  var rhtml = /<tbody/i;
  /** @type {RegExp} */
  var selector = /<|&#?\w+;/;
  /** @type {RegExp} */
  var rRadial = /<(?:script|style|link)/i;
  /** @type {RegExp} */
  var manipulation_rcheckableType = /^(?:checkbox|radio)$/i;
  /** @type {RegExp} */
  var rLinear = /checked\s*(?:[^=]|=\s*.checked.)/i;
  /** @type {RegExp} */
  var stopParent = /^$|\/(?:java|ecma)script/i;
  /** @type {RegExp} */
  var rscriptTypeMasked = /^true\/(.*)/;
  /** @type {RegExp} */
  var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  var wrapMap = {
    option : [1, "<select multiple='multiple'>", "</select>"],
    legend : [1, "<fieldset>", "</fieldset>"],
    area : [1, "<map>", "</map>"],
    param : [1, "<object>", "</object>"],
    thead : [1, "<table>", "</table>"],
    tr : [2, "<table><tbody>", "</tbody></table>"],
    col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default : jQuery.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
  };
  var fragmentDiv = get(node).appendChild(node.createElement("div"));
  /** @type {Array} */
  wrapMap.optgroup = wrapMap.option;
  /** @type {Array} */
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  /** @type {Array} */
  wrapMap.th = wrapMap.td;
  jQuery.fn.extend({
    /**
     * @param {string} type
     * @return {?}
     */
    text : function(type) {
      return jQuery.access(this, function(msg) {
        return msg === ready ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || node).createTextNode(msg));
      }, null, type, arguments.length);
    },
    /**
     * @return {?}
     */
    append : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          manipulationTarget(this, elem).appendChild(elem);
        }
      });
    },
    /**
     * @return {?}
     */
    prepend : function() {
      return this.domManip(arguments, function(elem) {
        if (1 === this.nodeType || (11 === this.nodeType || 9 === this.nodeType)) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    /**
     * @return {?}
     */
    before : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    /**
     * @return {?}
     */
    after : function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    /**
     * @param {string} fix
     * @param {string} keepData
     * @return {?}
     */
    remove : function(fix, keepData) {
      var elem;
      var curLoop = fix ? jQuery.filter(fix, this) : this;
      /** @type {number} */
      var i = 0;
      for (;null != (elem = curLoop[i]);i++) {
        if (!keepData) {
          if (1 === elem.nodeType) {
            jQuery.cleanData(getAll(elem));
          }
        }
        if (elem.parentNode) {
          if (keepData) {
            if (jQuery.contains(elem.ownerDocument, elem)) {
              setGlobalEval(getAll(elem, "script"));
            }
          }
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    },
    /**
     * @return {?}
     */
    empty : function() {
      var elem;
      /** @type {number} */
      var unlock = 0;
      for (;null != (elem = this[unlock]);unlock++) {
        if (1 === elem.nodeType) {
          jQuery.cleanData(getAll(elem, false));
        }
        for (;elem.firstChild;) {
          elem.removeChild(elem.firstChild);
        }
        if (elem.options) {
          if (jQuery.nodeName(elem, "select")) {
            /** @type {number} */
            elem.options.length = 0;
          }
        }
      }
      return this;
    },
    /**
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(dataAndEvents, deepDataAndEvents) {
      dataAndEvents = null == dataAndEvents ? false : dataAndEvents;
      deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents;
      return this.map(function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    /**
     * @param {string} value
     * @return {?}
     */
    html : function(value) {
      return jQuery.access(this, function(value) {
        var elem = this[0] || {};
        /** @type {number} */
        var i = 0;
        var l = this.length;
        if (value === ready) {
          return 1 === elem.nodeType ? elem.innerHTML.replace(newlineRe, "") : ready;
        }
        if ("string" === typeof value && (!rRadial.test(value) && ((jQuery.support.htmlSerialize || !rchecked.test(value)) && ((jQuery.support.leadingWhitespace || !rtagName.test(value)) && !wrapMap[(matches.exec(value) || ["", ""])[1].toLowerCase()])))) {
          /** @type {string} */
          value = value.replace(rxhtmlTag, "<$1></$2>");
          try {
            for (;i < l;i++) {
              elem = this[i] || {};
              if (1 === elem.nodeType) {
                jQuery.cleanData(getAll(elem, false));
                /** @type {string} */
                elem.innerHTML = value;
              }
            }
            /** @type {number} */
            elem = 0;
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    /**
     * @return {?}
     */
    replaceWith : function() {
      var args = jQuery.map(this, function(lineEndNode) {
        return[lineEndNode.nextSibling, lineEndNode.parentNode];
      });
      /** @type {number} */
      var i = 0;
      this.domManip(arguments, function(child) {
        var next = args[i++];
        var parent = args[i++];
        if (parent) {
          if (next) {
            if (next.parentNode !== parent) {
              next = this.nextSibling;
            }
          }
          jQuery(this).remove();
          parent.insertBefore(child, next);
        }
      }, true);
      return i ? this : this.remove();
    },
    /**
     * @param {string} selector
     * @return {?}
     */
    detach : function(selector) {
      return this.remove(selector, true);
    },
    /**
     * @param {Object} args
     * @param {Function} callback
     * @param {boolean} allowIntersection
     * @return {?}
     */
    domManip : function(args, callback, allowIntersection) {
      /** @type {Array} */
      args = core_concat.apply([], args);
      var node;
      var hasScripts;
      var scripts;
      var fragment;
      /** @type {number} */
      var i = 0;
      var l = this.length;
      var set = this;
      /** @type {number} */
      var iNoClone = l - 1;
      var value = args[0];
      var isFunction = jQuery.isFunction(value);
      if (isFunction || !(1 >= l || ("string" !== typeof value || (jQuery.support.checkClone || !rLinear.test(value))))) {
        return this.each(function(index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback, allowIntersection);
        });
      }
      if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, !allowIntersection && this), node = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = node), node)) {
        scripts = jQuery.map(getAll(fragment, "script"), restoreScript);
        hasScripts = scripts.length;
        for (;i < l;i++) {
          node = fragment;
          if (i !== iNoClone) {
            node = jQuery.clone(node, true, true);
            if (hasScripts) {
              jQuery.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(this[i], node, i);
        }
        if (hasScripts) {
          fragment = scripts[scripts.length - 1].ownerDocument;
          jQuery.map(scripts, fn);
          /** @type {number} */
          i = 0;
          for (;i < hasScripts;i++) {
            if (node = scripts[i], stopParent.test(node.type || "") && (!jQuery._data(node, "globalEval") && jQuery.contains(fragment, node))) {
              if (node.src) {
                jQuery._evalUrl(node.src);
              } else {
                jQuery.globalEval((node.text || (node.textContent || (node.innerHTML || ""))).replace(rcleanScript, ""));
              }
            }
          }
        }
        /** @type {null} */
        fragment = node = null;
      }
      return this;
    }
  });
  jQuery.each({
    appendTo : "append",
    prependTo : "prepend",
    insertBefore : "before",
    insertAfter : "after",
    replaceAll : "replaceWith"
  }, function(original, n) {
    /**
     * @param {(Object|string)} scripts
     * @return {?}
     */
    jQuery.fn[original] = function(scripts) {
      /** @type {number} */
      var i = 0;
      /** @type {Array} */
      var ret = [];
      var insert = jQuery(scripts);
      /** @type {number} */
      var last = insert.length - 1;
      for (;i <= last;i++) {
        scripts = i === last ? this : this.clone(true);
        jQuery(insert[i])[n](scripts);
        core_push.apply(ret, scripts.get());
      }
      return this.pushStack(ret);
    };
  });
  jQuery.extend({
    /**
     * @param {Object} elem
     * @param {boolean} dataAndEvents
     * @param {boolean} deepDataAndEvents
     * @return {?}
     */
    clone : function(elem, dataAndEvents, deepDataAndEvents) {
      var destElements;
      var src;
      var clone;
      var i;
      var srcElements;
      var inPage = jQuery.contains(elem.ownerDocument, elem);
      if (jQuery.support.html5Clone || (jQuery.isXMLDoc(elem) || !rchecked.test("<" + elem.nodeName + ">"))) {
        clone = elem.cloneNode(true);
      } else {
        fragmentDiv.innerHTML = elem.outerHTML;
        fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
      }
      if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && ((1 === elem.nodeType || 11 === elem.nodeType) && !jQuery.isXMLDoc(elem))) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        /** @type {number} */
        i = 0;
        for (;null != (src = srcElements[i]);++i) {
          if (destElements[i]) {
            var dest = destElements[i];
            var name = void 0;
            var type = void 0;
            var pdataCur = void 0;
            if (1 === dest.nodeType) {
              name = dest.nodeName.toLowerCase();
              if (!jQuery.support.noCloneEvent && dest[jQuery.expando]) {
                pdataCur = jQuery._data(dest);
                for (type in pdataCur.events) {
                  jQuery.removeEvent(dest, type, pdataCur.handle);
                }
                dest.removeAttribute(jQuery.expando);
              }
              if ("script" === name && dest.text !== src.text) {
                restoreScript(dest).text = src.text;
                fn(dest);
              } else {
                if ("object" === name) {
                  if (dest.parentNode) {
                    dest.outerHTML = src.outerHTML;
                  }
                  if (jQuery.support.html5Clone) {
                    if (src.innerHTML && !jQuery.trim(dest.innerHTML)) {
                      dest.innerHTML = src.innerHTML;
                    }
                  }
                } else {
                  if ("input" === name && manipulation_rcheckableType.test(src.type)) {
                    dest.defaultChecked = dest.checked = src.checked;
                    if (dest.value !== src.value) {
                      dest.value = src.value;
                    }
                  } else {
                    if ("option" === name) {
                      dest.defaultSelected = dest.selected = src.defaultSelected;
                    } else {
                      if ("input" === name || "textarea" === name) {
                        dest.defaultValue = src.defaultValue;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          /** @type {number} */
          i = 0;
          for (;null != (src = srcElements[i]);i++) {
            cloneCopyEvent(src, destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, "script");
      if (0 < destElements.length) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }
      return clone;
    },
    /**
     * @param {(Array|string)} elems
     * @param {Document} context
     * @param {boolean} scripts
     * @param {Function} selection
     * @return {?}
     */
    buildFragment : function(elems, context, scripts, selection) {
      var j;
      var elem;
      var tmp;
      var tag;
      var tbody;
      var wrap;
      var length = elems.length;
      var safe = get(context);
      /** @type {Array} */
      var nodes = [];
      /** @type {number} */
      var i = 0;
      for (;i < length;i++) {
        if ((elem = elems[i]) || 0 === elem) {
          if ("object" === jQuery.type(elem)) {
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
          } else {
            if (selector.test(elem)) {
              tmp = tmp || safe.appendChild(context.createElement("div"));
              tag = (matches.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
              j = wrap[0];
              for (;j--;) {
                tmp = tmp.lastChild;
              }
              if (!jQuery.support.leadingWhitespace) {
                if (rtagName.test(elem)) {
                  nodes.push(context.createTextNode(rtagName.exec(elem)[0]));
                }
              }
              if (!jQuery.support.tbody) {
                j = (elem = "table" === tag && !rhtml.test(elem) ? tmp.firstChild : "<table>" === wrap[1] && !rhtml.test(elem) ? tmp : 0) && elem.childNodes.length;
                for (;j--;) {
                  if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody")) {
                    if (!tbody.childNodes.length) {
                      elem.removeChild(tbody);
                    }
                  }
                }
              }
              jQuery.merge(nodes, tmp.childNodes);
              /** @type {string} */
              tmp.textContent = "";
              for (;tmp.firstChild;) {
                tmp.removeChild(tmp.firstChild);
              }
              tmp = safe.lastChild;
            } else {
              nodes.push(context.createTextNode(elem));
            }
          }
        }
      }
      if (tmp) {
        safe.removeChild(tmp);
      }
      if (!jQuery.support.appendChecked) {
        jQuery.grep(getAll(nodes, "input"), callback);
      }
      /** @type {number} */
      i = 0;
      for (;elem = nodes[i++];) {
        if (!(selection && -1 !== jQuery.inArray(elem, selection)) && (elems = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(safe.appendChild(elem), "script"), elems && setGlobalEval(tmp), scripts)) {
          /** @type {number} */
          j = 0;
          for (;elem = tmp[j++];) {
            if (stopParent.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }
      return safe;
    },
    /**
     * @param {Array} elems
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    cleanData : function(elems, dataAndEvents) {
      var elem;
      var type;
      var id;
      var data;
      /** @type {number} */
      var i = 0;
      var expando = jQuery.expando;
      var cache = jQuery.cache;
      var deleteExpando = jQuery.support.deleteExpando;
      var special = jQuery.event.special;
      for (;null != (elem = elems[i]);i++) {
        if (dataAndEvents || jQuery.acceptData(elem)) {
          if (data = (id = elem[expando]) && cache[id]) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            if (cache[id]) {
              delete cache[id];
              if (deleteExpando) {
                delete elem[expando];
              } else {
                if (typeof elem.removeAttribute !== core_strundefined) {
                  elem.removeAttribute(expando);
                } else {
                  /** @type {null} */
                  elem[expando] = null;
                }
              }
              core_deletedIds.push(id);
            }
          }
        }
      }
    },
    /**
     * @param {string} url
     * @return {?}
     */
    _evalUrl : function(url) {
      return jQuery.ajax({
        url : url,
        type : "GET",
        dataType : "script",
        async : false,
        global : false,
        "throws" : true
      });
    }
  });
  jQuery.fn.extend({
    /**
     * @param {string} qualifier
     * @return {?}
     */
    wrapAll : function(qualifier) {
      if (jQuery.isFunction(qualifier)) {
        return this.each(function(i) {
          jQuery(this).wrapAll(qualifier.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(qualifier, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var sandbox = this;
          for (;sandbox.firstChild && 1 === sandbox.firstChild.nodeType;) {
            sandbox = sandbox.firstChild;
          }
          return sandbox;
        }).append(this);
      }
      return this;
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrapInner : function(html) {
      return jQuery.isFunction(html) ? this.each(function(i) {
        jQuery(this).wrapInner(html.call(this, i));
      }) : this.each(function() {
        var self = jQuery(this);
        var contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    /**
     * @param {Function} html
     * @return {?}
     */
    wrap : function(html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function(i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    /**
     * @return {?}
     */
    unwrap : function() {
      return this.parent().each(function() {
        if (!jQuery.nodeName(this, "body")) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  var iframe;
  var getStyles;
  var css;
  /** @type {RegExp} */
  var ralpha = /alpha\([^)]*\)/i;
  /** @type {RegExp} */
  var emptyType = /opacity\s*=\s*([^)]*)/;
  /** @type {RegExp} */
  var IDENTIFIER = /^(top|right|bottom|left)$/;
  /** @type {RegExp} */
  var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
  /** @type {RegExp} */
  var rparentsprev = /^margin/;
  /** @type {RegExp} */
  var r = RegExp("^(" + core_pnum + ")(.*)$", "i");
  /** @type {RegExp} */
  var res = RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
  /** @type {RegExp} */
  var rplusequals = RegExp("^([+-])=(" + core_pnum + ")", "i");
  var elemdisplay = {
    BODY : "block"
  };
  var props = {
    position : "absolute",
    visibility : "hidden",
    display : "block"
  };
  var cssNormalTransform = {
    letterSpacing : 0,
    fontWeight : 400
  };
  /** @type {Array} */
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  /** @type {Array} */
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"];
  jQuery.fn.extend({
    /**
     * @param {string} name
     * @param {string} value
     * @return {?}
     */
    css : function(name, value) {
      return jQuery.access(this, function(cycle, name, value) {
        var styles;
        var map = {};
        /** @type {number} */
        var i = 0;
        if (jQuery.isArray(name)) {
          styles = getStyles(cycle);
          value = name.length;
          for (;i < value;i++) {
            map[name[i]] = jQuery.css(cycle, name[i], false, styles);
          }
          return map;
        }
        return value !== ready ? jQuery.style(cycle, name, value) : jQuery.css(cycle, name);
      }, name, value, 1 < arguments.length);
    },
    /**
     * @return {?}
     */
    show : function() {
      return showHide(this, true);
    },
    /**
     * @return {?}
     */
    hide : function() {
      return showHide(this);
    },
    /**
     * @param {?} state
     * @return {?}
     */
    toggle : function(state) {
      return "boolean" === typeof state ? state ? this.show() : this.hide() : this.each(function() {
        if (cycle(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  jQuery.extend({
    cssHooks : {
      opacity : {
        /**
         * @param {string} elem
         * @param {string} keepData
         * @return {?}
         */
        get : function(elem, keepData) {
          if (keepData) {
            var buffer = css(elem, "opacity");
            return "" === buffer ? "1" : buffer;
          }
        }
      }
    },
    cssNumber : {
      columnCount : true,
      fillOpacity : true,
      fontWeight : true,
      lineHeight : true,
      opacity : true,
      order : true,
      orphans : true,
      widows : true,
      zIndex : true,
      zoom : true
    },
    cssProps : {
      "float" : jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @param {string} value
     * @param {string} extra
     * @return {?}
     */
    style : function(elem, name, value, extra) {
      if (elem && !(3 === elem.nodeType || (8 === elem.nodeType || !elem.style))) {
        var ret;
        var type;
        var hooks;
        var origName = jQuery.camelCase(name);
        var style = elem.style;
        name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
        if (value !== ready) {
          /** @type {string} */
          type = typeof value;
          if ("string" === type && (ret = rplusequals.exec(value))) {
            /** @type {number} */
            value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
            /** @type {string} */
            type = "number";
          }
          if (!(null == value || "number" === type && isNaN(value))) {
            if ("number" === type && (!jQuery.cssNumber[origName] && (value += "px")), !jQuery.support.clearCloneStyle && ("" === value && 0 === name.indexOf("background") && (style[name] = "inherit")), !hooks || (!("set" in hooks) || (value = hooks.set(elem, value, extra)) !== ready)) {
              try {
                /** @type {string} */
                style[name] = value;
              } catch (s) {
              }
            }
          }
        } else {
          return hooks && ("get" in hooks && (ret = hooks.get(elem, false, extra)) !== ready) ? ret : style[name];
        }
      }
    },
    /**
     * @param {string} elem
     * @param {string} name
     * @param {boolean} recurring
     * @param {string} val
     * @return {?}
     */
    css : function(elem, name, recurring, val) {
      var ret;
      var origName;
      origName = jQuery.camelCase(name);
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
      if (origName = jQuery.cssHooks[name] || jQuery.cssHooks[origName]) {
        if ("get" in origName) {
          ret = origName.get(elem, true, recurring);
        }
      }
      if (ret === ready) {
        ret = css(elem, name, val);
      }
      if ("normal" === ret) {
        if (name in cssNormalTransform) {
          ret = cssNormalTransform[name];
        }
      }
      return "" === recurring || recurring ? (elem = parseFloat(ret), true === recurring || jQuery.isNumeric(elem) ? elem || 0 : ret) : ret;
    }
  });
  if (win.getComputedStyle) {
    /**
     * @param {(Node|string)} elem
     * @return {?}
     */
    getStyles = function(elem) {
      return win.getComputedStyle(elem, null);
    };
    /**
     * @param {string} elem
     * @param {string} name
     * @param {Object} computed
     * @return {?}
     */
    css = function(elem, name, computed) {
      var maxWidth;
      var ret = (computed = computed || getStyles(elem)) ? computed.getPropertyValue(name) || computed[name] : ready;
      var style = elem.style;
      if (computed) {
        if ("" === ret) {
          if (!jQuery.contains(elem.ownerDocument, elem)) {
            ret = jQuery.style(elem, name);
          }
        }
        if (res.test(ret)) {
          if (rparentsprev.test(name)) {
            elem = style.width;
            name = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            /** @type {string} */
            style.width = elem;
            /** @type {string} */
            style.minWidth = name;
            style.maxWidth = maxWidth;
          }
        }
      }
      return ret;
    };
  } else {
    if (node.documentElement.currentStyle) {
      /**
       * @param {Node} type
       * @return {?}
       */
      getStyles = function(type) {
        return type.currentStyle;
      };
      /**
       * @param {Node} elem
       * @param {string} name
       * @param {Node} value
       * @return {?}
       */
      css = function(elem, name, value) {
        var s;
        var avalue;
        var ret = (value = value || getStyles(elem)) ? value[name] : ready;
        var style = elem.style;
        if (null == ret) {
          if (style && style[name]) {
            ret = style[name];
          }
        }
        if (res.test(ret) && !IDENTIFIER.test(name)) {
          value = style.left;
          if (avalue = (s = elem.runtimeStyle) && s.left) {
            s.left = elem.currentStyle.left;
          }
          style.left = "fontSize" === name ? "1em" : ret;
          /** @type {string} */
          ret = style.pixelLeft + "px";
          /** @type {Node} */
          style.left = value;
          if (avalue) {
            s.left = avalue;
          }
        }
        return "" === ret ? "auto" : ret;
      };
    }
  }
  jQuery.each(["height", "width"], function(dataAndEvents, name) {
    jQuery.cssHooks[name] = {
      /**
       * @param {string} elem
       * @param {string} keepData
       * @param {string} extra
       * @return {?}
       */
      get : function(elem, keepData, extra) {
        if (keepData) {
          return 0 === elem.offsetWidth && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, props, function() {
            return getWidthOrHeight(elem, name, extra);
          }) : getWidthOrHeight(elem, name, extra);
        }
      },
      /**
       * @param {string} elem
       * @param {string} value
       * @param {(Object|string)} extra
       * @return {?}
       */
      set : function(elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && "border-box" === jQuery.css(elem, "boxSizing", false, styles), styles) : 0);
      }
    };
  });
  if (!jQuery.support.opacity) {
    jQuery.cssHooks.opacity = {
      /**
       * @param {Node} elem
       * @param {boolean} computed
       * @return {?}
       */
      get : function(elem, computed) {
        return emptyType.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
      },
      /**
       * @param {Node} elem
       * @param {string} value
       * @return {undefined}
       */
      set : function(elem, value) {
        var elemStyle = elem.style;
        var currentStyle = elem.currentStyle;
        /** @type {string} */
        var opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "";
        var filter = currentStyle && currentStyle.filter || (elemStyle.filter || "");
        /** @type {number} */
        elemStyle.zoom = 1;
        if ((1 <= value || "" === value) && ("" === jQuery.trim(filter.replace(ralpha, "")) && elemStyle.removeAttribute)) {
          if (elemStyle.removeAttribute("filter"), "" === value || currentStyle && !currentStyle.filter) {
            return;
          }
        }
        elemStyle.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
      }
    };
  }
  jQuery(function() {
    if (!jQuery.support.reliableMarginRight) {
      jQuery.cssHooks.marginRight = {
        /**
         * @param {string} elem
         * @param {string} keepData
         * @return {?}
         */
        get : function(elem, keepData) {
          if (keepData) {
            return jQuery.swap(elem, {
              display : "inline-block"
            }, css, [elem, "marginRight"]);
          }
        }
      };
    }
    if (!jQuery.support.pixelPosition) {
      if (jQuery.fn.position) {
        jQuery.each(["top", "left"], function(dataAndEvents, name) {
          jQuery.cssHooks[name] = {
            /**
             * @param {string} elem
             * @param {string} type
             * @return {?}
             */
            get : function(elem, type) {
              if (type) {
                return type = css(elem, name), res.test(type) ? jQuery(elem).position()[name] + "px" : type;
              }
            }
          };
        });
      }
    }
  });
  if (jQuery.expr) {
    if (jQuery.expr.filters) {
      /**
       * @param {string} type
       * @return {?}
       */
      jQuery.expr.filters.hidden = function(type) {
        return 0 >= type.offsetWidth && 0 >= type.offsetHeight || !jQuery.support.reliableHiddenOffsets && "none" === (type.style && type.style.display || jQuery.css(type, "display"));
      };
      /**
       * @param {string} fix
       * @return {?}
       */
      jQuery.expr.filters.visible = function(fix) {
        return!jQuery.expr.filters.hidden(fix);
      };
    }
  }
  jQuery.each({
    margin : "",
    padding : "",
    border : "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      /**
       * @param {Object} a
       * @return {?}
       */
      expand : function(a) {
        /** @type {number} */
        var i = 0;
        var expanded = {};
        /** @type {Array} */
        a = "string" === typeof a ? a.split(" ") : [a];
        for (;4 > i;i++) {
          expanded[prefix + cssExpand[i] + suffix] = a[i] || (a[i - 2] || a[0]);
        }
        return expanded;
      }
    };
    if (!rparentsprev.test(prefix)) {
      /** @type {function (string, string, string): ?} */
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  /** @type {RegExp} */
  var rQuot = /%20/g;
  /** @type {RegExp} */
  var rbracket = /\[\]$/;
  /** @type {RegExp} */
  var rCRLF = /\r?\n/g;
  /** @type {RegExp} */
  var mouseTypeRegex = /^(?:submit|button|image|reset|file)$/i;
  /** @type {RegExp} */
  var rsubmittable = /^(?:input|select|textarea|keygen)/i;
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    serialize : function() {
      return jQuery.param(this.serializeArray());
    },
    /**
     * @return {?}
     */
    serializeArray : function() {
      return this.map(function() {
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && (!jQuery(this).is(":disabled") && (rsubmittable.test(this.nodeName) && (!mouseTypeRegex.test(type) && (this.checked || !manipulation_rcheckableType.test(type)))));
      }).map(function(dataAndEvents, elem) {
        var val = jQuery(this).val();
        return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
          return{
            name : elem.name,
            value : val.replace(rCRLF, "\r\n")
          };
        }) : {
          name : elem.name,
          value : val.replace(rCRLF, "\r\n")
        };
      }).get();
    }
  });
  /**
   * @param {Object} a
   * @param {string} traditional
   * @return {?}
   */
  jQuery.param = function(a, traditional) {
    var prefix;
    /** @type {Array} */
    var klass = [];
    /**
     * @param {?} key
     * @param {string} value
     * @return {undefined}
     */
    var add = function(key, value) {
      value = jQuery.isFunction(value) ? value() : null == value ? "" : value;
      /** @type {string} */
      klass[klass.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (traditional === ready) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }
    if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return klass.join("&").replace(rQuot, "+");
  };
  jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(dataAndEvents, name) {
    /**
     * @param {Object} data
     * @param {Object} fn
     * @return {?}
     */
    jQuery.fn[name] = function(data, fn) {
      return 0 < arguments.length ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {undefined} fnOver
     * @param {Object} fnOut
     * @return {?}
     */
    hover : function(fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    /**
     * @param {string} action
     * @param {Function} data
     * @param {Object} fn
     * @return {?}
     */
    bind : function(action, data, fn) {
      return this.on(action, null, data, fn);
    },
    /**
     * @param {string} types
     * @param {Object} fn
     * @return {?}
     */
    unbind : function(types, fn) {
      return this.off(types, null, fn);
    },
    /**
     * @param {string} selector
     * @param {string} action
     * @param {Function} data
     * @param {Object} fn
     * @return {?}
     */
    delegate : function(selector, action, data, fn) {
      return this.on(action, selector, data, fn);
    },
    /**
     * @param {string} selector
     * @param {Object} types
     * @param {Object} fn
     * @return {?}
     */
    undelegate : function(selector, types, fn) {
      return 1 === arguments.length ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    }
  });
  var ajaxLocParts;
  var ajaxLocation;
  var iIdCounter = jQuery.now();
  /** @type {RegExp} */
  var rquery = /\?/;
  /** @type {RegExp} */
  var currDirRegExp = /#.*$/;
  /** @type {RegExp} */
  var rts = /([?&])_=[^&]*/;
  /** @type {RegExp} */
  var rmozilla = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;
  /** @type {RegExp} */
  var getOrPostRegEx = /^(?:GET|HEAD)$/;
  /** @type {RegExp} */
  var url = /^\/\//;
  /** @type {RegExp} */
  var quickExpr = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
  /** @type {function ((Function|string), Object, Object): ?} */
  var matcherFunction = jQuery.fn.load;
  var prefilters = {};
  var transports = {};
  /** @type {string} */
  var Bb = "*/".concat("*");
  try {
    /** @type {string} */
    ajaxLocation = location.href;
  } catch (yc) {
    /** @type {Element} */
    ajaxLocation = node.createElement("a");
    /** @type {string} */
    ajaxLocation.href = "";
    /** @type {string} */
    ajaxLocation = ajaxLocation.href;
  }
  /** @type {Array} */
  ajaxLocParts = quickExpr.exec(ajaxLocation.toLowerCase()) || [];
  /**
   * @param {(Function|string)} url
   * @param {Object} data
   * @param {Object} attributes
   * @return {?}
   */
  jQuery.fn.load = function(url, data, attributes) {
    if ("string" !== typeof url && matcherFunction) {
      return matcherFunction.apply(this, arguments);
    }
    var selector;
    var response;
    var type;
    var self = this;
    var off = url.indexOf(" ");
    if (0 <= off) {
      selector = url.slice(off, url.length);
      url = url.slice(0, off);
    }
    if (jQuery.isFunction(data)) {
      /** @type {Object} */
      attributes = data;
      /** @type {string} */
      data = ready;
    } else {
      if (data) {
        if ("object" === typeof data) {
          /** @type {string} */
          type = "POST";
        }
      }
    }
    if (0 < self.length) {
      jQuery.ajax({
        url : url,
        type : type,
        dataType : "html",
        data : data
      }).done(function(responseText) {
        /** @type {Arguments} */
        response = arguments;
        self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
      }).complete(attributes && function(type, name) {
        self.each(attributes, response || [type.responseText, name, type]);
      });
    }
    return this;
  };
  jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(dataAndEvents, name) {
    /**
     * @param {Object} selector
     * @return {?}
     */
    jQuery.fn[name] = function(selector) {
      return this.on(name, selector);
    };
  });
  jQuery.extend({
    active : 0,
    lastModified : {},
    etag : {},
    ajaxSettings : {
      url : ajaxLocation,
      type : "GET",
      isLocal : /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ajaxLocParts[1]),
      global : true,
      processData : true,
      async : true,
      contentType : "application/x-www-form-urlencoded; charset=UTF-8",
      accepts : {
        "*" : Bb,
        text : "text/plain",
        html : "text/html",
        xml : "application/xml, text/xml",
        json : "application/json, text/javascript"
      },
      contents : {
        xml : /xml/,
        html : /html/,
        json : /json/
      },
      responseFields : {
        xml : "responseXML",
        text : "responseText",
        json : "responseJSON"
      },
      converters : {
        /** @type {function (new:String, *=): string} */
        "* text" : String,
        "text html" : true,
        "text json" : jQuery.parseJSON,
        "text xml" : jQuery.parseXML
      },
      flatOptions : {
        url : true,
        context : true
      }
    },
    /**
     * @param {(Object|string)} target
     * @param {Object} settings
     * @return {?}
     */
    ajaxSetup : function(target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
    ajaxTransport : addToPrefiltersOrTransports(transports),
    /**
     * @param {string} name
     * @param {Object} settings
     * @return {?}
     */
    ajax : function(name, settings) {
      /**
       * @param {number} status
       * @param {Node} nativeStatusText
       * @param {string} s
       * @param {boolean} isSuccess
       * @return {undefined}
       */
      function done(status, nativeStatusText, s, isSuccess) {
        var result;
        var error;
        var data;
        var statusText;
        /** @type {Node} */
        statusText = nativeStatusText;
        if (2 !== z) {
          /** @type {number} */
          z = 2;
          if (tref) {
            clearTimeout(tref);
          }
          /** @type {string} */
          transport = ready;
          ua = isSuccess || "";
          /** @type {number} */
          jqXHR.readyState = 0 < status ? 4 : 0;
          /** @type {boolean} */
          isSuccess = 200 <= status && 300 > status || 304 === status;
          if (s) {
            data = options;
            var a = jqXHR;
            var fix;
            var value;
            var item;
            var key;
            var p = data.contents;
            var items = data.dataTypes;
            for (;"*" === items[0];) {
              items.shift();
              if (value === ready) {
                value = data.mimeType || a.getResponseHeader("Content-Type");
              }
            }
            if (value) {
              for (key in p) {
                if (p[key] && p[key].test(value)) {
                  items.unshift(key);
                  break;
                }
              }
            }
            if (items[0] in s) {
              item = items[0];
            } else {
              for (key in s) {
                if (!items[0] || data.converters[key + " " + items[0]]) {
                  /** @type {string} */
                  item = key;
                  break;
                }
                if (!fix) {
                  /** @type {string} */
                  fix = key;
                }
              }
              /** @type {(string|undefined)} */
              item = item || fix;
            }
            if (item) {
              if (item !== items[0]) {
                items.unshift(item);
              }
              data = s[item];
            } else {
              data = void 0;
            }
          }
          a: {
            s = options;
            fix = data;
            value = jqXHR;
            /** @type {boolean} */
            item = isSuccess;
            var prefix;
            var conv;
            var name;
            a = {};
            p = s.dataTypes.slice();
            if (p[1]) {
              for (conv in s.converters) {
                a[conv.toLowerCase()] = s.converters[conv];
              }
            }
            key = p.shift();
            for (;key;) {
              if (s.responseFields[key] && (value[s.responseFields[key]] = fix), !name && (item && s.dataFilter && (fix = s.dataFilter(fix, s.dataType))), name = key, key = p.shift()) {
                if ("*" === key) {
                  key = name;
                } else {
                  if ("*" !== name && name !== key) {
                    conv = a[name + " " + key] || a["* " + key];
                    if (!conv) {
                      for (prefix in a) {
                        if (data = prefix.split(" "), data[1] === key && (conv = a[name + " " + data[0]] || a["* " + data[0]])) {
                          if (true === conv) {
                            conv = a[prefix];
                          } else {
                            if (true !== a[prefix]) {
                              /** @type {string} */
                              key = data[0];
                              p.unshift(data[1]);
                            }
                          }
                          break;
                        }
                      }
                    }
                    if (true !== conv) {
                      if (conv && s["throws"]) {
                        fix = conv(fix);
                      } else {
                        try {
                          fix = conv(fix);
                        } catch (e) {
                          data = {
                            state : "parsererror",
                            error : conv ? e : "No conversion from " + name + " to " + key
                          };
                          break a;
                        }
                      }
                    }
                  }
                }
              }
            }
            data = {
              state : "success",
              data : fix
            };
          }
          if (isSuccess) {
            if (options.ifModified) {
              if (statusText = jqXHR.getResponseHeader("Last-Modified")) {
                jQuery.lastModified[cacheURL] = statusText;
              }
              if (statusText = jqXHR.getResponseHeader("etag")) {
                jQuery.etag[cacheURL] = statusText;
              }
            }
            if (204 === status || "HEAD" === options.type) {
              /** @type {string} */
              statusText = "nocontent";
            } else {
              if (304 === status) {
                /** @type {string} */
                statusText = "notmodified";
              } else {
                /** @type {string} */
                statusText = data.state;
                result = data.data;
                error = data.error;
                /** @type {boolean} */
                isSuccess = !error;
              }
            }
          } else {
            if (error = statusText, status || !statusText) {
              /** @type {string} */
              statusText = "error";
              if (0 > status) {
                /** @type {number} */
                status = 0;
              }
            }
          }
          /** @type {number} */
          jqXHR.status = status;
          /** @type {string} */
          jqXHR.statusText = (nativeStatusText || statusText) + "";
          if (isSuccess) {
            deferred.resolveWith(scripts, [result, statusText, jqXHR]);
          } else {
            deferred.rejectWith(scripts, [jqXHR, statusText, error]);
          }
          jqXHR.statusCode(cycle);
          /** @type {string} */
          cycle = ready;
          if (root) {
            globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, options, isSuccess ? result : error]);
          }
          completeDeferred.fireWith(scripts, [jqXHR, statusText]);
          if (root) {
            globalEventContext.trigger("ajaxComplete", [jqXHR, options]);
            if (!--jQuery.active) {
              jQuery.event.trigger("ajaxStop");
            }
          }
        }
      }
      if ("object" === typeof name) {
        /** @type {string} */
        settings = name;
        /** @type {string} */
        name = ready;
      }
      settings = settings || {};
      var parts;
      var i;
      var cacheURL;
      var ua;
      var tref;
      var root;
      var transport;
      var cache;
      var options = jQuery.ajaxSetup({}, settings);
      var scripts = options.context || options;
      var globalEventContext = options.context && (scripts.nodeType || scripts.jquery) ? jQuery(scripts) : jQuery.event;
      var deferred = jQuery.Deferred();
      var completeDeferred = jQuery.Callbacks("once memory");
      var cycle = options.statusCode || {};
      var requestHeaders = {};
      var requestHeadersNames = {};
      /** @type {number} */
      var z = 0;
      /** @type {string} */
      var strAbort = "canceled";
      var jqXHR = {
        readyState : 0,
        /**
         * @param {string} key
         * @return {?}
         */
        getResponseHeader : function(key) {
          var data;
          if (2 === z) {
            if (!cache) {
              cache = {};
              for (;data = rmozilla.exec(ua);) {
                /** @type {string} */
                cache[data[1].toLowerCase()] = data[2];
              }
            }
            data = cache[key.toLowerCase()];
          }
          return null == data ? null : data;
        },
        /**
         * @return {?}
         */
        getAllResponseHeaders : function() {
          return 2 === z ? ua : null;
        },
        /**
         * @param {string} name
         * @param {string} value
         * @return {?}
         */
        setRequestHeader : function(name, value) {
          var lname = name.toLowerCase();
          if (!z) {
            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
            /** @type {string} */
            requestHeaders[name] = value;
          }
          return this;
        },
        /**
         * @param {Object} type
         * @return {?}
         */
        overrideMimeType : function(type) {
          if (!z) {
            /** @type {Object} */
            options.mimeType = type;
          }
          return this;
        },
        /**
         * @param {string} type
         * @return {?}
         */
        statusCode : function(type) {
          var n1;
          if (type) {
            if (2 > z) {
              for (n1 in type) {
                /** @type {Array} */
                cycle[n1] = [cycle[n1], type[n1]];
              }
            } else {
              jqXHR.always(type[jqXHR.status]);
            }
          }
          return this;
        },
        /**
         * @param {string} statusText
         * @return {?}
         */
        abort : function(statusText) {
          statusText = statusText || strAbort;
          if (transport) {
            transport.abort(statusText);
          }
          done(0, statusText);
          return this;
        }
      };
      deferred.promise(jqXHR).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      options.url = ((name || (options.url || ajaxLocation)) + "").replace(currDirRegExp, "").replace(url, ajaxLocParts[1] + "//");
      options.type = settings.method || (settings.type || (options.method || options.type));
      options.dataTypes = jQuery.trim(options.dataType || "*").toLowerCase().match(core_rnotwhite) || [""];
      if (null == options.crossDomain) {
        /** @type {(Array.<string>|null)} */
        parts = quickExpr.exec(options.url.toLowerCase());
        /** @type {boolean} */
        options.crossDomain = !(!parts || !(parts[1] !== ajaxLocParts[1] || (parts[2] !== ajaxLocParts[2] || (parts[3] || ("http:" === parts[1] ? "80" : "443")) !== (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? "80" : "443")))));
      }
      if (options.data) {
        if (options.processData && "string" !== typeof options.data) {
          options.data = jQuery.param(options.data, options.traditional);
        }
      }
      inspectPrefiltersOrTransports(prefilters, options, settings, jqXHR);
      if (2 === z) {
        return jqXHR;
      }
      if (root = options.global) {
        if (0 === jQuery.active++) {
          jQuery.event.trigger("ajaxStart");
        }
      }
      options.type = options.type.toUpperCase();
      /** @type {boolean} */
      options.hasContent = !getOrPostRegEx.test(options.type);
      cacheURL = options.url;
      if (!options.hasContent) {
        if (options.data) {
          /** @type {string} */
          cacheURL = options.url += (rquery.test(cacheURL) ? "&" : "?") + options.data;
          delete options.data;
        }
        if (false === options.cache) {
          options.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + iIdCounter++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + iIdCounter++;
        }
      }
      if (options.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }
      if (options.data && (options.hasContent && false !== options.contentType) || settings.contentType) {
        jqXHR.setRequestHeader("Content-Type", options.contentType);
      }
      jqXHR.setRequestHeader("Accept", options.dataTypes[0] && options.accepts[options.dataTypes[0]] ? options.accepts[options.dataTypes[0]] + ("*" !== options.dataTypes[0] ? ", " + Bb + "; q=0.01" : "") : options.accepts["*"]);
      for (i in options.headers) {
        jqXHR.setRequestHeader(i, options.headers[i]);
      }
      if (options.beforeSend && (false === options.beforeSend.call(scripts, jqXHR, options) || 2 === z)) {
        return jqXHR.abort();
      }
      /** @type {string} */
      strAbort = "abort";
      for (i in{
        success : 1,
        error : 1,
        complete : 1
      }) {
        jqXHR[i](options[i]);
      }
      if (transport = inspectPrefiltersOrTransports(transports, options, settings, jqXHR)) {
        /** @type {number} */
        jqXHR.readyState = 1;
        if (root) {
          globalEventContext.trigger("ajaxSend", [jqXHR, options]);
        }
        if (options.async) {
          if (0 < options.timeout) {
            /** @type {number} */
            tref = setTimeout(function() {
              jqXHR.abort("timeout");
            }, options.timeout);
          }
        }
        try {
          /** @type {number} */
          z = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (2 > z) {
            done(-1, e);
          } else {
            throw e;
          }
        }
      } else {
        done(-1, "No Transport");
      }
      return jqXHR;
    },
    /**
     * @param {string} cur
     * @param {string} name
     * @param {string} callback
     * @return {?}
     */
    getJSON : function(cur, name, callback) {
      return jQuery.get(cur, name, callback, "json");
    },
    /**
     * @param {string} cur
     * @param {string} callback
     * @return {?}
     */
    getScript : function(cur, callback) {
      return jQuery.get(cur, ready, callback, "script");
    }
  });
  jQuery.each(["get", "post"], function(dataAndEvents, method) {
    /**
     * @param {string} requestUrl
     * @param {Object} html
     * @param {Object} success
     * @param {boolean} dataType
     * @return {?}
     */
    jQuery[method] = function(requestUrl, html, success, dataType) {
      if (jQuery.isFunction(html)) {
        dataType = dataType || success;
        /** @type {Object} */
        success = html;
        /** @type {string} */
        html = ready;
      }
      return jQuery.ajax({
        url : requestUrl,
        type : method,
        dataType : dataType,
        data : html,
        success : success
      });
    };
  });
  jQuery.ajaxSetup({
    accepts : {
      script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents : {
      script : /(?:java|ecma)script/
    },
    converters : {
      /**
       * @param {string} data
       * @return {?}
       */
      "text script" : function(data) {
        jQuery.globalEval(data);
        return data;
      }
    }
  });
  jQuery.ajaxPrefilter("script", function(s) {
    if (s.cache === ready) {
      /** @type {boolean} */
      s.cache = false;
    }
    if (s.crossDomain) {
      /** @type {string} */
      s.type = "GET";
      /** @type {boolean} */
      s.global = false;
    }
  });
  jQuery.ajaxTransport("script", function(s) {
    if (s.crossDomain) {
      var script;
      var head = node.head || (jQuery("head")[0] || node.documentElement);
      return{
        /**
         * @param {?} _
         * @param {Function} callback
         * @return {undefined}
         */
        send : function(_, callback) {
          /** @type {Element} */
          script = node.createElement("script");
          /** @type {boolean} */
          script.async = true;
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          /** @type {function (string, ?): undefined} */
          script.onload = script.onreadystatechange = function(type, event) {
            if (event || (!script.readyState || /loaded|complete/.test(script.readyState))) {
              /** @type {null} */
              script.onload = script.onreadystatechange = null;
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              /** @type {null} */
              script = null;
              if (!event) {
                callback(200, "success");
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        /**
         * @return {undefined}
         */
        abort : function() {
          if (script) {
            script.onload(ready, true);
          }
        }
      };
    }
  });
  /** @type {Array} */
  var eventPath = [];
  /** @type {RegExp} */
  var rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp : "callback",
    /**
     * @return {?}
     */
    jsonpCallback : function() {
      var unlock = eventPath.pop() || jQuery.expando + "_" + iIdCounter++;
      /** @type {boolean} */
      this[unlock] = true;
      return unlock;
    }
  });
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
    var callbackName;
    var fn;
    var elems;
    /** @type {(boolean|string)} */
    var jsonProp = false !== s.jsonp && (rjsonp.test(s.url) ? "url" : "string" === typeof s.data && (!(s.contentType || "").indexOf("application/x-www-form-urlencoded") && (rjsonp.test(s.data) && "data")));
    if (jsonProp || "jsonp" === s.dataTypes[0]) {
      return callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, jsonProp ? s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName) : false !== s.jsonp && (s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName), s.converters["script json"] = function() {
        if (!elems) {
          jQuery.error(callbackName + " was not called");
        }
        return elems[0];
      }, s.dataTypes[0] = "json", fn = win[callbackName], win[callbackName] = function() {
        /** @type {Arguments} */
        elems = arguments;
      }, jqXHR.always(function() {
        win[callbackName] = fn;
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          eventPath.push(callbackName);
        }
        if (elems) {
          if (jQuery.isFunction(fn)) {
            fn(elems[0]);
          }
        }
        elems = fn = ready;
      }), "script";
    }
  });
  var map;
  var nativeXHR;
  /** @type {number} */
  var counter = 0;
  /** @type {function (): undefined} */
  var xhrOnUnloadAbort = win.ActiveXObject && function() {
    var letter;
    for (letter in map) {
      map[letter](ready, true);
    }
  };
  /** @type {function (): ?} */
  jQuery.ajaxSettings.xhr = win.ActiveXObject ? function() {
    var a;
    if (!(a = !this.isLocal && createStandardXHR())) {
      a: {
        try {
          /** @type {ActiveXObject} */
          a = new win.ActiveXObject("Microsoft.XMLHTTP");
          break a;
        } catch (b) {
        }
        a = void 0;
      }
    }
    return a;
  } : createStandardXHR;
  nativeXHR = jQuery.ajaxSettings.xhr();
  /** @type {boolean} */
  jQuery.support.cors = !!nativeXHR && "withCredentials" in nativeXHR;
  if (nativeXHR = jQuery.support.ajax = !!nativeXHR) {
    jQuery.ajaxTransport(function(options) {
      if (!options.crossDomain || jQuery.support.cors) {
        var callback;
        return{
          /**
           * @param {Object} headers
           * @param {Function} complete
           * @return {undefined}
           */
          send : function(headers, complete) {
            var id;
            var i;
            var xhr = options.xhr();
            if (options.username) {
              xhr.open(options.type, options.url, options.async, options.username, options.password);
            } else {
              xhr.open(options.type, options.url, options.async);
            }
            if (options.xhrFields) {
              for (i in options.xhrFields) {
                xhr[i] = options.xhrFields[i];
              }
            }
            if (options.mimeType) {
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
            }
            if (!options.crossDomain) {
              if (!headers["X-Requested-With"]) {
                /** @type {string} */
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
            }
            try {
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
            } catch (s) {
            }
            xhr.send(options.hasContent && options.data || null);
            /**
             * @param {string} type
             * @param {string} name
             * @return {undefined}
             */
            callback = function(type, name) {
              var e;
              var responseHeaders;
              var statusText;
              var responses;
              try {
                if (callback && (name || 4 === xhr.readyState)) {
                  if (callback = ready, id && (xhr.onreadystatechange = jQuery.noop, xhrOnUnloadAbort && delete map[id]), name) {
                    if (4 !== xhr.readyState) {
                      xhr.abort();
                    }
                  } else {
                    responses = {};
                    e = xhr.status;
                    responseHeaders = xhr.getAllResponseHeaders();
                    if ("string" === typeof xhr.responseText) {
                      /** @type {string} */
                      responses.text = xhr.responseText;
                    }
                    try {
                      statusText = xhr.statusText;
                    } catch (u) {
                      /** @type {string} */
                      statusText = "";
                    }
                    if (!e && (options.isLocal && !options.crossDomain)) {
                      /** @type {number} */
                      e = responses.text ? 200 : 404;
                    } else {
                      if (1223 === e) {
                        /** @type {number} */
                        e = 204;
                      }
                    }
                  }
                }
              } catch (ex) {
                if (!name) {
                  complete(-1, ex);
                }
              }
              if (responses) {
                complete(e, statusText, responses, responseHeaders);
              }
            };
            if (options.async) {
              if (4 === xhr.readyState) {
                setTimeout(callback);
              } else {
                /** @type {number} */
                id = ++counter;
                if (xhrOnUnloadAbort) {
                  if (!map) {
                    map = {};
                    jQuery(win).unload(xhrOnUnloadAbort);
                  }
                  /** @type {function (string, string): undefined} */
                  map[id] = callback;
                }
                /** @type {function (string, string): undefined} */
                xhr.onreadystatechange = callback;
              }
            } else {
              callback();
            }
          },
          /**
           * @return {undefined}
           */
          abort : function() {
            if (callback) {
              callback(ready, true);
            }
          }
        };
      }
    });
  }
  var fxNow;
  var scrollIntervalId;
  /** @type {RegExp} */
  var pos = /^(?:toggle|show|hide)$/;
  /** @type {RegExp} */
  var re = RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i");
  /** @type {RegExp} */
  var rrun = /queueHooks$/;
  /** @type {Array} */
  var listeners = [function(elem, props, item) {
    var prop;
    var cur;
    var thisp;
    var hooks;
    var oldfire;
    var result = this;
    var cache = {};
    var style = elem.style;
    var hidden = elem.nodeType && cycle(elem);
    var dataShow = jQuery._data(elem, "fxshow");
    if (!item.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (null == hooks.unqueued) {
        /** @type {number} */
        hooks.unqueued = 0;
        /** @type {function (): undefined} */
        oldfire = hooks.empty.fire;
        /**
         * @return {undefined}
         */
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      result.always(function() {
        result.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (1 === elem.nodeType && ("height" in props || "width" in props)) {
      /** @type {Array} */
      item.overflow = [style.overflow, style.overflowX, style.overflowY];
      if ("inline" === jQuery.css(elem, "display")) {
        if ("none" === jQuery.css(elem, "float")) {
          if (!jQuery.support.inlineBlockNeedsLayout || "inline" === defaultDisplay(elem.nodeName)) {
            /** @type {string} */
            style.display = "inline-block";
          } else {
            /** @type {number} */
            style.zoom = 1;
          }
        }
      }
    }
    if (item.overflow) {
      /** @type {string} */
      style.overflow = "hidden";
      if (!jQuery.support.shrinkWrapBlocks) {
        result.always(function() {
          style.overflow = item.overflow[0];
          style.overflowX = item.overflow[1];
          style.overflowY = item.overflow[2];
        });
      }
    }
    for (prop in props) {
      if (cur = props[prop], pos.exec(cur) && (delete props[prop], thisp = thisp || "toggle" === cur, cur !== (hidden ? "hide" : "show"))) {
        cache[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      }
    }
    if (!jQuery.isEmptyObject(cache)) {
      for (prop in dataShow ? "hidden" in dataShow && (hidden = dataShow.hidden) : dataShow = jQuery._data(elem, "fxshow", {}), thisp && (dataShow.hidden = !hidden), hidden ? jQuery(elem).show() : result.done(function() {
        jQuery(elem).hide();
      }), result.done(function() {
        var name;
        jQuery._removeData(elem, "fxshow");
        for (name in cache) {
          jQuery.style(elem, name, cache[name]);
        }
      }), cache) {
        props = clone(hidden ? dataShow[prop] : 0, prop, result);
        if (!(prop in dataShow)) {
          dataShow[prop] = props.start;
          if (hidden) {
            props.end = props.start;
            /** @type {number} */
            props.start = "width" === prop || "height" === prop ? 1 : 0;
          }
        }
      }
    }
  }];
  var cache = {
    "*" : [function(prop, value) {
      var tween = this.createTween(prop, value);
      var l0 = tween.cur();
      /** @type {(Array.<string>|null)} */
      var parts = re.exec(value);
      /** @type {string} */
      var unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px");
      var start = (jQuery.cssNumber[prop] || "px" !== unit && +l0) && re.exec(jQuery.css(tween.elem, prop));
      /** @type {number} */
      var scale = 1;
      /** @type {number} */
      var l = 20;
      if (start && start[3] !== unit) {
        unit = unit || start[3];
        /** @type {Array} */
        parts = parts || [];
        /** @type {number} */
        start = +l0 || 1;
        do {
          /** @type {(number|string)} */
          scale = scale || ".5";
          start /= scale;
          jQuery.style(tween.elem, prop, start + unit);
        } while (scale !== (scale = tween.cur() / l0) && (1 !== scale && --l));
      }
      if (parts) {
        /** @type {number} */
        start = tween.start = +start || (+l0 || 0);
        tween.unit = unit;
        /** @type {number} */
        tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2];
      }
      return tween;
    }]
  };
  jQuery.Animation = jQuery.extend(Animation, {
    /**
     * @param {Object} html
     * @param {Function} callback
     * @return {undefined}
     */
    tweener : function(html, callback) {
      if (jQuery.isFunction(html)) {
        /** @type {Object} */
        callback = html;
        /** @type {Array} */
        html = ["*"];
      } else {
        html = html.split(" ");
      }
      var c;
      /** @type {number} */
      var i = 0;
      var valuesLen = html.length;
      for (;i < valuesLen;i++) {
        c = html[i];
        cache[c] = cache[c] || [];
        cache[c].unshift(callback);
      }
    },
    /**
     * @param {?} callback
     * @param {?} prepend
     * @return {undefined}
     */
    prefilter : function(callback, prepend) {
      if (prepend) {
        listeners.unshift(callback);
      } else {
        listeners.push(callback);
      }
    }
  });
  /** @type {function (string, string, string, string, string): ?} */
  jQuery.Tween = Tween;
  Tween.prototype = {
    /** @type {function (string, string, string, string, string): ?} */
    constructor : Tween,
    /**
     * @param {string} type
     * @param {Object} options
     * @param {string} prop
     * @param {?} to
     * @param {string} easing
     * @param {string} unit
     * @return {undefined}
     */
    init : function(type, options, prop, to, easing, unit) {
      /** @type {string} */
      this.elem = type;
      /** @type {string} */
      this.prop = prop;
      this.easing = easing || "swing";
      /** @type {Object} */
      this.options = options;
      this.start = this.now = this.cur();
      this.end = to;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    /**
     * @return {?}
     */
    cur : function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    /**
     * @param {number} percent
     * @return {?}
     */
    run : function(percent) {
      var eased;
      var hooks = Tween.propHooks[this.prop];
      this.pos = this.options.duration ? eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration) : eased = percent;
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default : {
      /**
       * @param {Object} tween
       * @return {?}
       */
      get : function(tween) {
        if (null != tween.elem[tween.prop] && (!tween.elem.style || null == tween.elem.style[tween.prop])) {
          return tween.elem[tween.prop];
        }
        tween = jQuery.css(tween.elem, tween.prop, "");
        return!tween || "auto" === tween ? 0 : tween;
      },
      /**
       * @param {Object} tween
       * @return {undefined}
       */
      set : function(tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else {
          if (tween.elem.style && (null != tween.elem.style[jQuery.cssProps[tween.prop]] || jQuery.cssHooks[tween.prop])) {
            jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
          } else {
            tween.elem[tween.prop] = tween.now;
          }
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    /**
     * @param {Object} tween
     * @return {undefined}
     */
    set : function(tween) {
      if (tween.elem.nodeType) {
        if (tween.elem.parentNode) {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  jQuery.each(["toggle", "show", "hide"], function(dataAndEvents, name) {
    var matcherFunction = jQuery.fn[name];
    /**
     * @param {Object} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[name] = function(speed, callback, next_callback) {
      return null == speed || "boolean" === typeof speed ? matcherFunction.apply(this, arguments) : this.animate(genFx(name, true), speed, callback, next_callback);
    };
  });
  jQuery.fn.extend({
    /**
     * @param {Object} speed
     * @param {string} to
     * @param {Object} callback
     * @param {Object} _callback
     * @return {?}
     */
    fadeTo : function(speed, to, callback, _callback) {
      return this.filter(cycle).css("opacity", 0).show().end().animate({
        opacity : to
      }, speed, callback, _callback);
    },
    /**
     * @param {?} prop
     * @param {Object} obj
     * @param {Object} easing
     * @param {Object} callback
     * @return {?}
     */
    animate : function(prop, obj, easing, callback) {
      var empty = jQuery.isEmptyObject(prop);
      var optall = jQuery.speed(obj, easing, callback);
      /**
       * @return {undefined}
       */
      obj = function() {
        var anim = Animation(this, jQuery.extend({}, prop), optall);
        if (empty || jQuery._data(this, "finish")) {
          anim.stop(true);
        }
      };
      /** @type {Object} */
      obj.finish = obj;
      return empty || false === optall.queue ? this.each(obj) : this.queue(optall.queue, obj);
    },
    /**
     * @param {string} type
     * @param {(Function|string)} clearQueue
     * @param {(Function|string)} gotoEnd
     * @return {?}
     */
    stop : function(type, clearQueue, gotoEnd) {
      /**
       * @param {Object} e
       * @return {undefined}
       */
      var stop = function(e) {
        var stop = e.stop;
        delete e.stop;
        stop(gotoEnd);
      };
      if ("string" !== typeof type) {
        /** @type {(Function|string)} */
        gotoEnd = clearQueue;
        /** @type {string} */
        clearQueue = type;
        /** @type {string} */
        type = ready;
      }
      if (clearQueue) {
        if (false !== type) {
          this.queue(type || "fx", []);
        }
      }
      return this.each(function() {
        /** @type {boolean} */
        var dequeue = true;
        var index = null != type && type + "queueHooks";
        /** @type {Array} */
        var timers = jQuery.timers;
        var iteratee = jQuery._data(this);
        if (index) {
          if (iteratee[index]) {
            if (iteratee[index].stop) {
              stop(iteratee[index]);
            }
          }
        } else {
          for (index in iteratee) {
            if (iteratee[index]) {
              if (iteratee[index].stop && rrun.test(index)) {
                stop(iteratee[index]);
              }
            }
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this && (null == type || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            /** @type {boolean} */
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    /**
     * @param {string} type
     * @return {?}
     */
    finish : function(type) {
      if (false !== type) {
        type = type || "fx";
      }
      return this.each(function() {
        var index;
        var data = jQuery._data(this);
        var array = data[type + "queue"];
        index = data[type + "queueHooks"];
        /** @type {Array} */
        var timers = jQuery.timers;
        var length = array ? array.length : 0;
        /** @type {boolean} */
        data.finish = true;
        jQuery.queue(this, type, []);
        if (index) {
          if (index.stop) {
            index.stop.call(this, true);
          }
        }
        /** @type {number} */
        index = timers.length;
        for (;index--;) {
          if (timers[index].elem === this) {
            if (timers[index].queue === type) {
              timers[index].anim.stop(true);
              timers.splice(index, 1);
            }
          }
        }
        /** @type {number} */
        index = 0;
        for (;index < length;index++) {
          if (array[index]) {
            if (array[index].finish) {
              array[index].finish.call(this);
            }
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each({
    slideDown : genFx("show"),
    slideUp : genFx("hide"),
    slideToggle : genFx("toggle"),
    fadeIn : {
      opacity : "show"
    },
    fadeOut : {
      opacity : "hide"
    },
    fadeToggle : {
      opacity : "toggle"
    }
  }, function(original, props) {
    /**
     * @param {Object} speed
     * @param {Object} callback
     * @param {Object} next_callback
     * @return {?}
     */
    jQuery.fn[original] = function(speed, callback, next_callback) {
      return this.animate(props, speed, callback, next_callback);
    };
  });
  /**
   * @param {Object} speed
   * @param {Object} easing
   * @param {Object} fn
   * @return {?}
   */
  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && "object" === typeof speed ? jQuery.extend({}, speed) : {
      complete : fn || (!fn && easing || jQuery.isFunction(speed) && speed),
      duration : speed,
      easing : fn && easing || easing && (!jQuery.isFunction(easing) && easing)
    };
    opt.duration = jQuery.fx.off ? 0 : "number" === typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
    if (null == opt.queue || true === opt.queue) {
      /** @type {string} */
      opt.queue = "fx";
    }
    opt.old = opt.complete;
    /**
     * @return {undefined}
     */
    opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery.easing = {
    /**
     * @param {?} t
     * @return {?}
     */
    linear : function(t) {
      return t;
    },
    /**
     * @param {number} p
     * @return {?}
     */
    swing : function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  /** @type {Array} */
  jQuery.timers = [];
  /** @type {function (string, Object, string, ?, string, string): undefined} */
  jQuery.fx = Tween.prototype.init;
  /**
   * @return {undefined}
   */
  jQuery.fx.tick = function() {
    var timer;
    /** @type {Array} */
    var timers = jQuery.timers;
    /** @type {number} */
    var i = 0;
    fxNow = jQuery.now();
    for (;i < timers.length;i++) {
      timer = timers[i];
      if (!timer()) {
        if (timers[i] === timer) {
          timers.splice(i--, 1);
        }
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    /** @type {string} */
    fxNow = ready;
  };
  /**
   * @param {?} timer
   * @return {undefined}
   */
  jQuery.fx.timer = function(timer) {
    if (timer()) {
      if (jQuery.timers.push(timer)) {
        jQuery.fx.start();
      }
    }
  };
  /** @type {number} */
  jQuery.fx.interval = 13;
  /**
   * @return {undefined}
   */
  jQuery.fx.start = function() {
    if (!scrollIntervalId) {
      /** @type {number} */
      scrollIntervalId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  /**
   * @return {undefined}
   */
  jQuery.fx.stop = function() {
    clearInterval(scrollIntervalId);
    /** @type {null} */
    scrollIntervalId = null;
  };
  jQuery.fx.speeds = {
    slow : 600,
    fast : 200,
    _default : 400
  };
  jQuery.fx.step = {};
  if (jQuery.expr) {
    if (jQuery.expr.filters) {
      /**
       * @param {string} elem
       * @return {?}
       */
      jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
    }
  }
  /**
   * @param {string} x
   * @return {?}
   */
  jQuery.fn.offset = function(x) {
    if (arguments.length) {
      return x === ready ? this : this.each(function(dataName) {
        jQuery.offset.setOffset(this, x, dataName);
      });
    }
    var doc;
    var b;
    var box = {
      top : 0,
      left : 0
    };
    var element = (b = this[0]) && b.ownerDocument;
    if (element) {
      doc = element.documentElement;
      if (!jQuery.contains(doc, b)) {
        return box;
      }
      if (typeof b.getBoundingClientRect !== core_strundefined) {
        box = b.getBoundingClientRect();
      }
      b = getWindow(element);
      return{
        top : box.top + (b.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
        left : box.left + (b.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      };
    }
  };
  jQuery.offset = {
    /**
     * @param {string} elem
     * @param {Object} options
     * @param {?} i
     * @return {undefined}
     */
    setOffset : function(elem, options, i) {
      var position = jQuery.css(elem, "position");
      if ("static" === position) {
        /** @type {string} */
        elem.style.position = "relative";
      }
      var curElem = jQuery(elem);
      var curOffset = curElem.offset();
      var curCSSTop = jQuery.css(elem, "top");
      var curCSSLeft = jQuery.css(elem, "left");
      var props = {};
      var from = {};
      if (("absolute" === position || "fixed" === position) && -1 < jQuery.inArray("auto", [curCSSTop, curCSSLeft])) {
        from = curElem.position();
        position = from.top;
        curCSSLeft = from.left;
      } else {
        /** @type {number} */
        position = parseFloat(curCSSTop) || 0;
        /** @type {number} */
        curCSSLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (null != options.top) {
        props.top = options.top - curOffset.top + position;
      }
      if (null != options.left) {
        props.left = options.left - curOffset.left + curCSSLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    /**
     * @return {?}
     */
    position : function() {
      if (this[0]) {
        var offsetParent;
        var offset;
        var parentOffset = {
          top : 0,
          left : 0
        };
        var body = this[0];
        if ("fixed" === jQuery.css(body, "position")) {
          offset = body.getBoundingClientRect();
        } else {
          offsetParent = this.offsetParent();
          offset = this.offset();
          if (!jQuery.nodeName(offsetParent[0], "html")) {
            parentOffset = offsetParent.offset();
          }
          parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
          parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
        }
        return{
          top : offset.top - parentOffset.top - jQuery.css(body, "marginTop", true),
          left : offset.left - parentOffset.left - jQuery.css(body, "marginLeft", true)
        };
      }
    },
    /**
     * @return {?}
     */
    offsetParent : function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;
        for (;offsetParent && (!jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position"));) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft : "pageXOffset",
    scrollTop : "pageYOffset"
  }, function(name, key) {
    /** @type {boolean} */
    var i = /Y/.test(key);
    /**
     * @param {string} value
     * @return {?}
     */
    jQuery.fn[name] = function(value) {
      return jQuery.access(this, function(element, name, val) {
        var scripts = getWindow(element);
        if (val === ready) {
          return scripts ? key in scripts ? scripts[key] : scripts.document.documentElement[name] : element[name];
        }
        if (scripts) {
          scripts.scrollTo(!i ? val : jQuery(scripts).scrollLeft(), i ? val : jQuery(scripts).scrollTop());
        } else {
          /** @type {string} */
          element[name] = val;
        }
      }, name, value, arguments.length, null);
    };
  });
  jQuery.each({
    Height : "height",
    Width : "width"
  }, function(name, i) {
    jQuery.each({
      padding : "inner" + name,
      content : i,
      "" : "outer" + name
    }, function(defaultExtra, original) {
      /**
       * @param {boolean} margin
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      jQuery.fn[original] = function(margin, dataAndEvents) {
        var chainable = arguments.length && (defaultExtra || "boolean" !== typeof margin);
        var extra = defaultExtra || (true === margin || true === dataAndEvents ? "margin" : "border");
        return jQuery.access(this, function(elem, node, value) {
          return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (node = elem.documentElement, Math.max(elem.body["scroll" + name], node["scroll" + name], elem.body["offset" + name], node["offset" + name], node["client" + name])) : value === ready ? jQuery.css(elem, node, extra) : jQuery.style(elem, node, value, extra);
        }, i, chainable ? margin : ready, chainable, null);
      };
    });
  });
  /**
   * @return {?}
   */
  jQuery.fn.size = function() {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if ("object" === typeof module && (module && "object" === typeof module.exports)) {
    /** @type {function (string, string): ?} */
    module.exports = jQuery;
  } else {
    /** @type {function (string, string): ?} */
    win.jQuery = win.$ = jQuery;
    if ("function" === typeof define) {
      if (define.amd) {
        define("jquery", [], function() {
          return jQuery;
        });
      }
    }
  }
})(window);
(function($, target) {
  if ($.rails !== target) {
    $.error("jquery-ujs has already been loaded!");
  }
  var rails;
  var $document = $(document);
  $.rails = rails = {
    linkClickSelector : "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]",
    buttonClickSelector : "button[data-remote]",
    inputChangeSelector : "select[data-remote], input[data-remote], textarea[data-remote]",
    formSubmitSelector : "form",
    formInputClickSelector : "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])",
    disableSelector : "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",
    enableSelector : "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",
    requiredInputSelector : "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
    fileInputSelector : "input[type=file]",
    linkDisableSelector : "a[data-disable-with]",
    /**
     * @param {Object} xhr
     * @return {undefined}
     */
    CSRFProtection : function(xhr) {
      var token = $('meta[name="csrf-token"]').attr("content");
      if (token) {
        xhr.setRequestHeader("X-CSRF-Token", token);
      }
    },
    /**
     * @param {Object} obj
     * @param {string} type
     * @param {?} data
     * @return {?}
     */
    fire : function(obj, type, data) {
      type = $.Event(type);
      obj.trigger(type, data);
      return false !== type.result;
    },
    /**
     * @param {?} message
     * @return {?}
     */
    confirm : function(message) {
      return confirm(message);
    },
    /**
     * @param {string} options
     * @return {?}
     */
    ajax : function(options) {
      return $.ajax(options);
    },
    /**
     * @param {string} type
     * @return {?}
     */
    href : function(type) {
      return type.attr("href");
    },
    /**
     * @param {string} t
     * @return {?}
     */
    handleRemote : function(t) {
      var options;
      var value;
      var data;
      var crossDomain;
      var cors_creds;
      var type;
      if (rails.fire(t, "ajax:before")) {
        value = t.data("cross-domain");
        crossDomain = value === target ? null : value;
        cors_creds = t.data("with-credentials") || null;
        type = t.data("type") || $.ajaxSettings && $.ajaxSettings.dataType;
        if (t.is("form")) {
          options = t.attr("method");
          value = t.attr("action");
          data = t.serializeArray();
          var seg = t.data("ujs:submit-button");
          if (seg) {
            data.push(seg);
            t.data("ujs:submit-button", null);
          }
        } else {
          if (t.is(rails.inputChangeSelector)) {
            options = t.data("method");
            value = t.data("url");
            data = t.serialize();
            if (t.data("params")) {
              data = data + "&" + t.data("params");
            }
          } else {
            if (t.is(rails.buttonClickSelector)) {
              options = t.data("method") || "get";
              value = t.data("url");
              data = t.serialize();
              if (t.data("params")) {
                data = data + "&" + t.data("params");
              }
            } else {
              options = t.data("method");
              value = rails.href(t);
              data = t.data("params") || null;
            }
          }
        }
        options = {
          type : options || "GET",
          data : data,
          dataType : type,
          /**
           * @param {Object} xhr
           * @param {Object} settings
           * @return {?}
           */
          beforeSend : function(xhr, settings) {
            if (settings.dataType === target) {
              xhr.setRequestHeader("accept", "*/*;q=0.5, " + settings.accepts.script);
            }
            return rails.fire(t, "ajax:beforeSend", [xhr, settings]);
          },
          /**
           * @param {string} type
           * @param {?} name
           * @param {?} value
           * @return {undefined}
           */
          success : function(type, name, value) {
            t.trigger("ajax:success", [type, name, value]);
          },
          /**
           * @param {Function} elem
           * @param {string} type
           * @return {undefined}
           */
          complete : function(elem, type) {
            t.trigger("ajax:complete", [elem, type]);
          },
          /**
           * @param {string} type
           * @param {?} name
           * @param {?} value
           * @return {undefined}
           */
          error : function(type, name, value) {
            t.trigger("ajax:error", [type, name, value]);
          },
          crossDomain : crossDomain
        };
        if (cors_creds) {
          options.xhrFields = {
            withCredentials : cors_creds
          };
        }
        if (value) {
          options.url = value;
        }
        value = rails.ajax(options);
        t.trigger("ajax:send", value);
        return value;
      }
      return false;
    },
    /**
     * @param {string} cycle
     * @return {undefined}
     */
    handleMethod : function(cycle) {
      var form = rails.href(cycle);
      var value = cycle.data("method");
      cycle = cycle.attr("target");
      var token = $("meta[name=csrf-token]").attr("content");
      var related = $("meta[name=csrf-param]").attr("content");
      form = $('<form method="post" action="' + form + '"></form>');
      /** @type {string} */
      value = '<input name="_method" value="' + value + '" type="hidden" />';
      if (related !== target) {
        if (token !== target) {
          value += '<input name="' + related + '" value="' + token + '" type="hidden" />';
        }
      }
      if (cycle) {
        form.attr("target", cycle);
      }
      form.hide().append(value).appendTo("body");
      form.submit();
    },
    /**
     * @param {Object} form
     * @return {undefined}
     */
    disableFormElements : function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this);
        /** @type {string} */
        var method = element.is("button") ? "html" : "val";
        element.data("ujs:enable-with", element[method]());
        element[method](element.data("disable-with"));
        element.prop("disabled", true);
      });
    },
    /**
     * @param {Object} form
     * @return {undefined}
     */
    enableFormElements : function(form) {
      form.find(rails.enableSelector).each(function() {
        var target = $(this);
        /** @type {string} */
        var method = target.is("button") ? "html" : "val";
        if (target.data("ujs:enable-with")) {
          target[method](target.data("ujs:enable-with"));
        }
        target.prop("disabled", false);
      });
    },
    /**
     * @param {?} element
     * @return {?}
     */
    allowAction : function(element) {
      var message = element.data("confirm");
      /** @type {boolean} */
      var answer = false;
      var callback;
      if (!message) {
        return true;
      }
      if (rails.fire(element, "confirm")) {
        answer = rails.confirm(message);
        callback = rails.fire(element, "confirm:complete", [answer]);
      }
      return answer && callback;
    },
    /**
     * @param {Object} form
     * @param {string} specifiedSelector
     * @param {boolean} nonBlank
     * @return {?}
     */
    blankInputs : function(form, specifiedSelector, nonBlank) {
      var ret = $();
      var elem;
      var valueToCheck;
      var buttons = form.find(specifiedSelector || "input,textarea");
      buttons.each(function() {
        elem = $(this);
        valueToCheck = elem.is("input[type=checkbox],input[type=radio]") ? elem.is(":checked") : elem.val();
        if (!valueToCheck === !nonBlank) {
          if (elem.is("input[type=radio]") && buttons.filter('input[type=radio]:checked[name="' + elem.attr("name") + '"]').length) {
            return true;
          }
          ret = ret.add(elem);
        }
      });
      return ret.length ? ret : false;
    },
    /**
     * @param {Object} form
     * @param {string} specifiedSelector
     * @return {?}
     */
    nonBlankInputs : function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true);
    },
    /**
     * @param {Object} e
     * @return {?}
     */
    stopEverything : function(e) {
      $(e.target).trigger("ujs:everythingStopped");
      e.stopImmediatePropagation();
      return false;
    },
    /**
     * @param {Object} element
     * @return {undefined}
     */
    disableElement : function(element) {
      element.data("ujs:enable-with", element.html());
      element.html(element.data("disable-with"));
      element.bind("click.railsDisable", function(e) {
        return rails.stopEverything(e);
      });
    },
    /**
     * @param {Object} element
     * @return {undefined}
     */
    enableElement : function(element) {
      if (element.data("ujs:enable-with") !== target) {
        element.html(element.data("ujs:enable-with"));
        element.removeData("ujs:enable-with");
      }
      element.unbind("click.railsDisable");
    }
  };
  if (rails.fire($document, "rails:attachBindings")) {
    $.ajaxPrefilter(function(s, dataAndEvents, xhr) {
      if (!s.crossDomain) {
        rails.CSRFProtection(xhr);
      }
    });
    $document.delegate(rails.linkDisableSelector, "ajax:complete", function() {
      rails.enableElement($(this));
    });
    $document.delegate(rails.linkClickSelector, "click.rails", function(e) {
      var link = $(this);
      var method = link.data("method");
      var queryString = link.data("params");
      if (!rails.allowAction(link)) {
        return rails.stopEverything(e);
      }
      if (link.is(rails.linkDisableSelector)) {
        rails.disableElement(link);
      }
      if (link.data("remote") !== target) {
        if ((e.metaKey || e.ctrlKey) && ((!method || "GET" === method) && !queryString)) {
          return true;
        }
        e = rails.handleRemote(link);
        if (false === e) {
          rails.enableElement(link);
        } else {
          e.error(function() {
            rails.enableElement(link);
          });
        }
        return false;
      }
      if (link.data("method")) {
        return rails.handleMethod(link), false;
      }
    });
    $document.delegate(rails.buttonClickSelector, "click.rails", function(e) {
      var form = $(this);
      if (!rails.allowAction(form)) {
        return rails.stopEverything(e);
      }
      rails.handleRemote(form);
      return false;
    });
    $document.delegate(rails.inputChangeSelector, "change.rails", function(e) {
      var form = $(this);
      if (!rails.allowAction(form)) {
        return rails.stopEverything(e);
      }
      rails.handleRemote(form);
      return false;
    });
    $document.delegate(rails.formSubmitSelector, "submit.rails", function(e) {
      var form = $(this);
      /** @type {boolean} */
      var s = form.data("remote") !== target;
      var nonBlankFileInputs = rails.blankInputs(form, rails.requiredInputSelector);
      var blankRequiredInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
      if (!rails.allowAction(form) || nonBlankFileInputs && (form.attr("novalidate") == target && rails.fire(form, "ajax:aborted:required", [nonBlankFileInputs]))) {
        return rails.stopEverything(e);
      }
      if (s) {
        if (blankRequiredInputs) {
          return setTimeout(function() {
            rails.disableFormElements(form);
          }, 13), (e = rails.fire(form, "ajax:aborted:file", [blankRequiredInputs])) || setTimeout(function() {
            rails.enableFormElements(form);
          }, 13), e;
        }
        rails.handleRemote(form);
        return false;
      }
      setTimeout(function() {
        rails.disableFormElements(form);
      }, 13);
    });
    $document.delegate(rails.formInputClickSelector, "click.rails", function(name) {
      var button = $(this);
      if (!rails.allowAction(button)) {
        return rails.stopEverything(name);
      }
      /** @type {(null|{name: ??, value: ?})} */
      name = (name = button.attr("name")) ? {
        name : name,
        value : button.val()
      } : null;
      button.closest("form").data("ujs:submit-button", name);
    });
    $document.delegate(rails.formSubmitSelector, "ajax:beforeSend.rails", function(opt_e) {
      if (this == opt_e.target) {
        rails.disableFormElements($(this));
      }
    });
    $document.delegate(rails.formSubmitSelector, "ajax:complete.rails", function(opt_e) {
      if (this == opt_e.target) {
        rails.enableFormElements($(this));
      }
    });
    $(function() {
      var json = $("meta[name=csrf-token]").attr("content");
      var outputReCompress = $("meta[name=csrf-param]").attr("content");
      $('form input[name="' + outputReCompress + '"]').val(json);
    });
  }
})(jQuery);
+function($) {
  /**
   * @param {number} opt_attributes
   * @return {?}
   */
  $.fn.emulateTransitionEnd = function(opt_attributes) {
    /** @type {boolean} */
    var n = false;
    var $el = this;
    $(this).one($.support.transition.end, function() {
      /** @type {boolean} */
      n = true;
    });
    setTimeout(function() {
      if (!n) {
        $($el).trigger($.support.transition.end);
      }
    }, opt_attributes);
    return this;
  };
  $(function() {
    var event = $.support;
    var elem;
    a: {
      /** @type {Element} */
      elem = document.createElement("bootstrap");
      var transEndEventNames = {
        WebkitTransition : "webkitTransitionEnd",
        MozTransition : "transitionend",
        OTransition : "oTransitionEnd otransitionend",
        transition : "transitionend"
      };
      var name;
      for (name in transEndEventNames) {
        if (void 0 !== elem.style[name]) {
          elem = {
            end : transEndEventNames[name]
          };
          break a;
        }
      }
      elem = void 0;
    }
    /** @type {(undefined|{end: ?})} */
    event.transition = elem;
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Alert = function(selector) {
    $(selector).on("click", '[data-dismiss="alert"]', this.close);
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  Alert.prototype.close = function(e) {
    /**
     * @return {undefined}
     */
    function removeElement() {
      $parent.trigger("closed.bs.alert").remove();
    }
    var $this = $(this);
    var selector = $this.attr("data-target");
    if (!selector) {
      selector = (selector = $this.attr("href")) && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    var $parent = $(selector);
    if (e) {
      e.preventDefault();
    }
    if (!$parent.length) {
      $parent = $this.hasClass("alert") ? $this : $this.parent();
    }
    $parent.trigger(e = $.Event("close.bs.alert"));
    if (!e.isDefaultPrevented()) {
      $parent.removeClass("in");
      if ($.support.transition && $parent.hasClass("fade")) {
        $parent.one($.support.transition.end, removeElement).emulateTransitionEnd(150);
      } else {
        removeElement();
      }
    }
  };
  var old = $.fn.alert;
  /**
   * @param {?} type
   * @return {?}
   */
  $.fn.alert = function(type) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.alert");
      if (!data) {
        $this.data("bs.alert", data = new Alert(this));
      }
      if ("string" == typeof type) {
        data[type].call($this);
      }
    });
  };
  /** @type {function (string): undefined} */
  $.fn.alert.Constructor = Alert;
  /**
   * @return {?}
   */
  $.fn.alert.noConflict = function() {
    $.fn.alert = old;
    return this;
  };
  $(document).on("click.bs.alert.data-api", '[data-dismiss="alert"]', Alert.prototype.close);
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Button = function(selector, options) {
    this.$element = $(selector);
    this.options = $.extend({}, Button.DEFAULTS, options);
  };
  Button.DEFAULTS = {
    loadingText : "loading..."
  };
  /**
   * @param {string} state
   * @return {undefined}
   */
  Button.prototype.setState = function(state) {
    var $el = this.$element;
    /** @type {string} */
    var val = $el.is("input") ? "val" : "html";
    var data = $el.data();
    state += "Text";
    if (!data.resetText) {
      $el.data("resetText", $el[val]());
    }
    $el[val](data[state] || this.options[state]);
    setTimeout(function() {
      if ("loadingText" == state) {
        $el.addClass("disabled").attr("disabled", "disabled");
      } else {
        $el.removeClass("disabled").removeAttr("disabled");
      }
    }, 0);
  };
  /**
   * @return {undefined}
   */
  Button.prototype.toggle = function() {
    var $shcell = this.$element.closest('[data-toggle="buttons"]');
    if ($shcell.length) {
      if ("radio" === this.$element.find("input").prop("checked", !this.$element.hasClass("active")).prop("type")) {
        $shcell.find(".active").removeClass("active");
      }
    }
    this.$element.toggleClass("active");
  };
  var old = $.fn.button;
  /**
   * @param {string} option
   * @return {?}
   */
  $.fn.button = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.button");
      var options = "object" == typeof option && option;
      if (!data) {
        $this.data("bs.button", data = new Button(this, options));
      }
      if ("toggle" == option) {
        data.toggle();
      } else {
        if (option) {
          data.setState(option);
        }
      }
    });
  };
  /** @type {function (string, ?): undefined} */
  $.fn.button.Constructor = Button;
  /**
   * @return {?}
   */
  $.fn.button.noConflict = function() {
    $.fn.button = old;
    return this;
  };
  $(document).on("click.bs.button.data-api", "[data-toggle^=button]", function(evt) {
    var $btn = $(evt.target);
    if (!$btn.hasClass("btn")) {
      $btn = $btn.closest(".btn");
    }
    $btn.button("toggle");
    evt.preventDefault();
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {Object} options
   * @return {undefined}
   */
  var Carousel = function(selector, options) {
    this.$element = $(selector);
    this.$indicators = this.$element.find(".carousel-indicators");
    /** @type {Object} */
    this.options = options;
    /** @type {null} */
    this.paused = this.sliding = this.interval = this.$active = this.$items = null;
    if ("hover" == this.options.pause) {
      this.$element.on("mouseenter", $.proxy(this.pause, this)).on("mouseleave", $.proxy(this.cycle, this));
    }
  };
  Carousel.DEFAULTS = {
    interval : 5E3,
    pause : "hover"
  };
  /**
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  Carousel.prototype.cycle = function(dataAndEvents) {
    if (!dataAndEvents) {
      /** @type {boolean} */
      this.paused = false;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.options.interval) {
      if (!this.paused) {
        /** @type {number} */
        this.interval = setInterval($.proxy(this.next, this), this.options.interval);
      }
    }
    return this;
  };
  /**
   * @return {?}
   */
  Carousel.prototype.getActiveIndex = function() {
    this.$active = this.$element.find(".item.active");
    this.$items = this.$active.parent().children();
    return this.$items.index(this.$active);
  };
  /**
   * @param {number} pos
   * @return {?}
   */
  Carousel.prototype.to = function(pos) {
    var that = this;
    var activeIndex = this.getActiveIndex();
    if (!(pos > this.$items.length - 1 || 0 > pos)) {
      return this.sliding ? this.$element.one("slid", function() {
        that.to(pos);
      }) : activeIndex == pos ? this.pause().cycle() : this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]));
    }
  };
  /**
   * @param {?} $vid
   * @return {?}
   */
  Carousel.prototype.pause = function($vid) {
    if (!$vid) {
      /** @type {boolean} */
      this.paused = true;
    }
    if (this.$element.find(".next, .prev").length) {
      if ($.support.transition.end) {
        this.$element.trigger($.support.transition.end);
        this.cycle(true);
      }
    }
    this.interval = clearInterval(this.interval);
    return this;
  };
  /**
   * @return {?}
   */
  Carousel.prototype.next = function() {
    if (!this.sliding) {
      return this.slide("next");
    }
  };
  /**
   * @return {?}
   */
  Carousel.prototype.prev = function() {
    if (!this.sliding) {
      return this.slide("prev");
    }
  };
  /**
   * @param {string} type
   * @param {string} next
   * @return {?}
   */
  Carousel.prototype.slide = function(type, next) {
    var $active = this.$element.find(".item.active");
    var $next = next || $active[type]();
    var isCycling = this.interval;
    /** @type {string} */
    var direction = "next" == type ? "left" : "right";
    /** @type {string} */
    var e = "next" == type ? "first" : "last";
    var that = this;
    /** @type {boolean} */
    this.sliding = true;
    if (isCycling) {
      this.pause();
    }
    $next = $next.length ? $next : this.$element.find(".item")[e]();
    e = $.Event("slide.bs.carousel", {
      relatedTarget : $next[0],
      direction : direction
    });
    if (!$next.hasClass("active")) {
      if (this.$indicators.length) {
        this.$indicators.find(".active").removeClass("active");
        this.$element.one("slid", function() {
          var $listing = $(that.$indicators.children()[that.getActiveIndex()]);
          if ($listing) {
            $listing.addClass("active");
          }
        });
      }
      if ($.support.transition && this.$element.hasClass("slide")) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) {
          return;
        }
        $next.addClass(type);
        $next[0].offsetWidth;
        $active.addClass(direction);
        $next.addClass(direction);
        $active.one($.support.transition.end, function() {
          $next.removeClass([type, direction].join(" ")).addClass("active");
          $active.removeClass(["active", direction].join(" "));
          /** @type {boolean} */
          that.sliding = false;
          setTimeout(function() {
            that.$element.trigger("slid");
          }, 0);
        }).emulateTransitionEnd(600);
      } else {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) {
          return;
        }
        $active.removeClass("active");
        $next.addClass("active");
        /** @type {boolean} */
        this.sliding = false;
        this.$element.trigger("slid");
      }
      if (isCycling) {
        this.cycle();
      }
      return this;
    }
  };
  var old = $.fn.carousel;
  /**
   * @param {number} option
   * @return {?}
   */
  $.fn.carousel = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.carousel");
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), "object" == typeof option && option);
      var action = "string" == typeof option ? option : options.slide;
      if (!data) {
        $this.data("bs.carousel", data = new Carousel(this, options));
      }
      if ("number" == typeof option) {
        data.to(option);
      } else {
        if (action) {
          data[action]();
        } else {
          if (options.interval) {
            data.pause().cycle();
          }
        }
      }
    });
  };
  /** @type {function (string, Object): undefined} */
  $.fn.carousel.Constructor = Carousel;
  /**
   * @return {?}
   */
  $.fn.carousel.noConflict = function() {
    $.fn.carousel = old;
    return this;
  };
  $(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(types) {
    var $this = $(this);
    var options;
    var $target = $($this.attr("data-target") || (options = $this.attr("href")) && options.replace(/.*(?=#[^\s]+$)/, ""));
    options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr("data-slide-to");
    if (slideIndex) {
      /** @type {boolean} */
      options.interval = false;
    }
    $target.carousel(options);
    if (slideIndex = $this.attr("data-slide-to")) {
      $target.data("bs.carousel").to(slideIndex);
    }
    types.preventDefault();
  });
  $(window).on("load", function() {
    $('[data-ride="carousel"]').each(function() {
      var $carousel = $(this);
      $carousel.carousel($carousel.data());
    });
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Collapse = function(selector, options) {
    this.$element = $(selector);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    /** @type {null} */
    this.transitioning = null;
    if (this.options.parent) {
      this.$parent = $(this.options.parent);
    }
    if (this.options.toggle) {
      this.toggle();
    }
  };
  Collapse.DEFAULTS = {
    toggle : true
  };
  /**
   * @return {?}
   */
  Collapse.prototype.dimension = function() {
    return this.$element.hasClass("width") ? "width" : "height";
  };
  /**
   * @return {?}
   */
  Collapse.prototype.show = function() {
    if (!this.transitioning && !this.$element.hasClass("in")) {
      var complete = $.Event("show.bs.collapse");
      this.$element.trigger(complete);
      if (!complete.isDefaultPrevented()) {
        if ((complete = this.$parent && this.$parent.find("> .accordion-group > .in")) && complete.length) {
          var scrollSize = complete.data("bs.collapse");
          if (scrollSize && scrollSize.transitioning) {
            return;
          }
          complete.collapse("hide");
          if (!scrollSize) {
            complete.data("bs.collapse", null);
          }
        }
        var dimension = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[dimension](0);
        /** @type {number} */
        this.transitioning = 1;
        /**
         * @return {undefined}
         */
        complete = function() {
          this.$element.removeClass("collapsing").addClass("in")[dimension]("auto");
          /** @type {number} */
          this.transitioning = 0;
          this.$element.trigger("shown.bs.collapse");
        };
        if (!$.support.transition) {
          return complete.call(this);
        }
        scrollSize = $.camelCase(["scroll", dimension].join("-"));
        this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize]);
      }
    }
  };
  /**
   * @return {?}
   */
  Collapse.prototype.hide = function() {
    if (!this.transitioning && this.$element.hasClass("in")) {
      var e = $.Event("hide.bs.collapse");
      this.$element.trigger(e);
      if (!e.isDefaultPrevented()) {
        e = this.dimension();
        this.$element[e](this.$element[e]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse").removeClass("in");
        /** @type {number} */
        this.transitioning = 1;
        /**
         * @return {undefined}
         */
        var complete = function() {
          /** @type {number} */
          this.transitioning = 0;
          this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse");
        };
        if (!$.support.transition) {
          return complete.call(this);
        }
        this.$element[e](0).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350);
      }
    }
  };
  /**
   * @return {undefined}
   */
  Collapse.prototype.toggle = function() {
    this[this.$element.hasClass("in") ? "hide" : "show"]();
  };
  var old = $.fn.collapse;
  /**
   * @param {?} option
   * @return {?}
   */
  $.fn.collapse = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.collapse");
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), "object" == typeof option && option);
      if (!data) {
        $this.data("bs.collapse", data = new Collapse(this, options));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string, ?): undefined} */
  $.fn.collapse.Constructor = Collapse;
  /**
   * @return {?}
   */
  $.fn.collapse.noConflict = function() {
    $.fn.collapse = old;
    return this;
  };
  $(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]", function(that) {
    var $this = $(this);
    var $target;
    that = $this.attr("data-target") || (that.preventDefault() || ($target = $this.attr("href")) && $target.replace(/.*(?=#[^\s]+$)/, ""));
    $target = $(that);
    var option = (that = $target.data("bs.collapse")) ? "toggle" : $this.data();
    var parent = $this.attr("data-parent");
    var $parent = parent && $(parent);
    if (!that || !that.transitioning) {
      if ($parent) {
        $parent.find("[data-toggle=collapse][data-parent=" + parent + "]").not($this).addClass("collapsed");
      }
      $this[$target.hasClass("in") ? "addClass" : "removeClass"]("collapsed");
    }
    $target.collapse(option);
  });
}(window.jQuery);
+function($) {
  /**
   * @return {undefined}
   */
  function clearMenus() {
    $(backdrop).remove();
    $(selector).each(function(e) {
      var $parent = getParent($(this));
      if ($parent.hasClass("open")) {
        $parent.trigger(e = $.Event("hide.bs.dropdown"));
        if (!e.isDefaultPrevented()) {
          $parent.removeClass("open").trigger("hidden.bs.dropdown");
        }
      }
    });
  }
  /**
   * @param {Element} $this
   * @return {?}
   */
  function getParent($this) {
    var selector = $this.attr("data-target");
    if (!selector) {
      selector = (selector = $this.attr("href")) && (/#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ""));
    }
    return(selector = selector && $(selector)) && selector.length ? selector : $this.parent();
  }
  /** @type {string} */
  var backdrop = ".dropdown-backdrop";
  /** @type {string} */
  var selector = "[data-toggle=dropdown]";
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Dropdown = function(selector) {
    $(selector).on("click.bs.dropdown", this.toggle);
  };
  /**
   * @param {Object} e
   * @return {?}
   */
  Dropdown.prototype.toggle = function(e) {
    var $this = $(this);
    if (!$this.is(".disabled, :disabled")) {
      var $parent = getParent($this);
      e = $parent.hasClass("open");
      clearMenus();
      if (!e) {
        if ("ontouchstart" in document.documentElement) {
          $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click", clearMenus);
        }
        $parent.trigger(e = $.Event("show.bs.dropdown"));
        if (e.isDefaultPrevented()) {
          return;
        }
        $parent.toggleClass("open").trigger("shown.bs.dropdown");
      }
      $this.focus();
      return false;
    }
  };
  /**
   * @param {Event} e
   * @return {?}
   */
  Dropdown.prototype.keydown = function(e) {
    if (/(38|40|27)/.test(e.keyCode)) {
      var $this = $(this);
      e.preventDefault();
      e.stopPropagation();
      if (!$this.is(".disabled, :disabled")) {
        var target = getParent($this);
        var isActive = target.hasClass("open");
        if (!isActive || isActive && 27 == e.keyCode) {
          return 27 == e.which && target.find(selector).focus(), $this.click();
        }
        $this = $("[role=menu] li:not(.divider):visible a", target);
        if ($this.length) {
          target = $this.index($this.filter(":focus"));
          if (38 == e.keyCode) {
            if (0 < target) {
              target--;
            }
          }
          if (40 == e.keyCode) {
            if (target < $this.length - 1) {
              target++;
            }
          }
          if (!~target) {
            /** @type {number} */
            target = 0;
          }
          $this.eq(target).focus();
        }
      }
    }
  };
  var old = $.fn.dropdown;
  /**
   * @param {?} option
   * @return {?}
   */
  $.fn.dropdown = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("dropdown");
      if (!data) {
        $this.data("dropdown", data = new Dropdown(this));
      }
      if ("string" == typeof option) {
        data[option].call($this);
      }
    });
  };
  /** @type {function (string): undefined} */
  $.fn.dropdown.Constructor = Dropdown;
  /**
   * @return {?}
   */
  $.fn.dropdown.noConflict = function() {
    $.fn.dropdown = old;
    return this;
  };
  $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(event) {
    event.stopPropagation();
  }).on("click.bs.dropdown.data-api", selector, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", selector + ", [role=menu]", Dropdown.prototype.keydown);
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {Object} options
   * @return {undefined}
   */
  var Modal = function(selector, options) {
    /** @type {Object} */
    this.options = options;
    this.$element = $(selector).on("click.dismiss.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
    /** @type {null} */
    this.$backdrop = this.isShown = null;
    if (this.options.remote) {
      this.$element.find(".modal-body").load(this.options.remote);
    }
  };
  Modal.DEFAULTS = {
    backdrop : true,
    keyboard : true,
    show : true
  };
  /**
   * @return {?}
   */
  Modal.prototype.toggle = function() {
    return this[!this.isShown ? "show" : "hide"]();
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.show = function() {
    var that = this;
    var e = $.Event("show.bs.modal");
    this.$element.trigger(e);
    if (!this.isShown) {
      if (!e.isDefaultPrevented()) {
        /** @type {boolean} */
        this.isShown = true;
        this.escape();
        this.backdrop(function() {
          var e = $.support.transition && that.$element.hasClass("fade");
          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body);
          }
          that.$element.show();
          if (e) {
            that.$element[0].offsetWidth;
          }
          that.$element.addClass("in").attr("aria-hidden", false);
          that.enforceFocus();
          if (e) {
            that.$element.one($.support.transition.end, function() {
              that.$element.focus().trigger("shown.bs.modal");
            }).emulateTransitionEnd(300);
          } else {
            that.$element.focus().trigger("shown.bs.modal");
          }
        });
      }
    }
  };
  /**
   * @param {Object} e
   * @return {undefined}
   */
  Modal.prototype.hide = function(e) {
    if (e) {
      e.preventDefault();
    }
    e = $.Event("hide.bs.modal");
    this.$element.trigger(e);
    if (this.isShown) {
      if (!e.isDefaultPrevented()) {
        /** @type {boolean} */
        this.isShown = false;
        this.escape();
        $(document).off("focusin.bs.modal");
        this.$element.removeClass("in").attr("aria-hidden", true);
        if ($.support.transition && this.$element.hasClass("fade")) {
          this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300);
        } else {
          this.hideModal();
        }
      }
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.enforceFocus = function() {
    $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function(e) {
      if (this.$element[0] !== e.target) {
        if (!this.$element.has(e.target).length) {
          this.$element.focus();
        }
      }
    }, this));
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.escape = function() {
    if (this.isShown && this.options.keyboard) {
      this.$element.on("keyup.dismiss.bs.modal", $.proxy(function(event) {
        if (27 == event.which) {
          this.hide();
        }
      }, this));
    } else {
      if (!this.isShown) {
        this.$element.off("keyup.dismiss.bs.modal");
      }
    }
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.hideModal = function() {
    var that = this;
    this.$element.hide();
    this.backdrop(function() {
      that.removeBackdrop();
      that.$element.trigger("hidden.bs.modal");
    });
  };
  /**
   * @return {undefined}
   */
  Modal.prototype.removeBackdrop = function() {
    if (this.$backdrop) {
      this.$backdrop.remove();
    }
    /** @type {null} */
    this.$backdrop = null;
  };
  /**
   * @param {Function} callback
   * @return {undefined}
   */
  Modal.prototype.backdrop = function(callback) {
    /** @type {string} */
    var animate = this.$element.hasClass("fade") ? "fade" : "";
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);
      this.$element.on("click", $.proxy(function(e) {
        if (e.target === e.currentTarget) {
          if ("static" == this.options.backdrop) {
            this.$element[0].focus.call(this.$element[0]);
          } else {
            this.hide.call(this);
          }
        }
      }, this));
      if (doAnimate) {
        this.$backdrop[0].offsetWidth;
      }
      this.$backdrop.addClass("in");
      if (callback) {
        if (doAnimate) {
          this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150);
        } else {
          callback();
        }
      }
    } else {
      if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");
        if ($.support.transition && this.$element.hasClass("fade")) {
          this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150);
        } else {
          callback();
        }
      } else {
        if (callback) {
          callback();
        }
      }
    }
  };
  var old = $.fn.modal;
  /**
   * @param {boolean} options
   * @return {?}
   */
  $.fn.modal = function(options) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.modal");
      var about = $.extend({}, Modal.DEFAULTS, $this.data(), "object" == typeof options && options);
      if (!data) {
        $this.data("bs.modal", data = new Modal(this, about));
      }
      if ("string" == typeof options) {
        data[options]();
      } else {
        if (about.show) {
          data.show();
        }
      }
    });
  };
  /** @type {function (string, Object): undefined} */
  $.fn.modal.Constructor = Modal;
  /**
   * @return {?}
   */
  $.fn.modal.noConflict = function() {
    $.fn.modal = old;
    return this;
  };
  $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(types) {
    var $this = $(this);
    var href = $this.attr("href");
    var $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, ""));
    href = $target.data("modal") ? "toggle" : $.extend({
      remote : !/#/.test(href) && href
    }, $target.data(), $this.data());
    types.preventDefault();
    $target.modal(href).one("hide", function() {
      if ($this.is(":visible")) {
        $this.focus();
      }
    });
  });
  $(function() {
    var $body = $(document.body).on("shown.bs.modal", ".modal", function() {
      $body.addClass("modal-open");
    }).on("hidden.bs.modal", ".modal", function() {
      $body.removeClass("modal-open");
    });
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {string} options
   * @return {undefined}
   */
  var Tooltip = function(selector, options) {
    /** @type {null} */
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
    this.init("tooltip", selector, options);
  };
  Tooltip.DEFAULTS = {
    animation : true,
    placement : "top",
    selector : false,
    template : '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger : "hover focus",
    title : "",
    delay : 0,
    html : false,
    container : false
  };
  /**
   * @param {Object} type
   * @param {(Function|string)} pos
   * @param {string} options
   * @return {undefined}
   */
  Tooltip.prototype.init = function(type, pos, options) {
    /** @type {boolean} */
    this.enabled = true;
    /** @type {Object} */
    this.type = type;
    this.$element = $(pos);
    this.options = this.getOptions(options);
    type = this.options.trigger.split(" ");
    pos = type.length;
    for (;pos--;) {
      if (options = type[pos], "click" == options) {
        this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else {
        if ("manual" != options) {
          /** @type {string} */
          var eventOut = "hover" == options ? "mouseleave" : "blur";
          this.$element.on(("hover" == options ? "mouseenter" : "focus") + "." + this.type, this.options.selector, $.proxy(this.enter, this));
          this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
        }
      }
    }
    if (this.options.selector) {
      this._options = $.extend({}, this.options, {
        trigger : "manual",
        selector : ""
      });
    } else {
      this.fixTitle();
    }
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getDefaults = function() {
    return Tooltip.DEFAULTS;
  };
  /**
   * @param {Object} options
   * @return {?}
   */
  Tooltip.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);
    if (options.delay) {
      if ("number" == typeof options.delay) {
        options.delay = {
          show : options.delay,
          hide : options.delay
        };
      }
    }
    return options;
  };
  /**
   * @param {Object} obj
   * @return {?}
   */
  Tooltip.prototype.enter = function(obj) {
    var defaults = this.getDefaults();
    var options = {};
    if (this._options) {
      $.each(this._options, function(key, value) {
        if (defaults[key] != value) {
          options[key] = value;
        }
      });
    }
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](options).data("bs." + this.type);
    clearTimeout(self.timeout);
    if (!self.options.delay || !self.options.delay.show) {
      return self.show();
    }
    /** @type {string} */
    self.hoverState = "in";
    /** @type {number} */
    self.timeout = setTimeout(function() {
      if ("in" == self.hoverState) {
        self.show();
      }
    }, self.options.delay.show);
  };
  /**
   * @param {Object} obj
   * @return {?}
   */
  Tooltip.prototype.leave = function(obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this._options).data("bs." + this.type);
    clearTimeout(self.timeout);
    if (!self.options.delay || !self.options.delay.hide) {
      return self.hide();
    }
    /** @type {string} */
    self.hoverState = "out";
    /** @type {number} */
    self.timeout = setTimeout(function() {
      if ("out" == self.hoverState) {
        self.hide();
      }
    }, self.options.delay.hide);
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.show = function() {
    var $tip = $.Event("show.bs." + this.type);
    if (this.hasContent() && (this.enabled && (this.$element.trigger($tip), !$tip.isDefaultPrevented()))) {
      $tip = this.tip();
      this.setContent();
      if (this.options.animation) {
        $tip.addClass("fade");
      }
      var r = "function" == typeof this.options.placement ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
      /** @type {RegExp} */
      var pos = /\s?auto?\s?/i;
      /** @type {boolean} */
      var d = pos.test(r);
      if (d) {
        r = r.replace(pos, "") || "top";
      }
      $tip.detach().css({
        top : 0,
        left : 0,
        display : "block"
      }).addClass(r);
      if (this.options.container) {
        $tip.appendTo(this.options.container);
      } else {
        $tip.insertAfter(this.$element);
      }
      pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      if (d) {
        var iframe = this.$element.parent();
        d = r;
        /** @type {number} */
        var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
        var parentWidth = "body" == this.options.container ? window.innerWidth : iframe.outerWidth();
        var parentHeight = "body" == this.options.container ? window.innerHeight : iframe.outerHeight();
        iframe = "body" == this.options.container ? 0 : iframe.offset().left;
        r = "bottom" == r && pos.top + pos.height + actualHeight - docScroll > parentHeight ? "top" : "top" == r && 0 > pos.top - docScroll - actualHeight ? "bottom" : "right" == r && pos.right + actualWidth > parentWidth ? "left" : "left" == r && pos.left - actualWidth < iframe ? "right" : r;
        $tip.removeClass(d).addClass(r);
      }
      this.applyPlacement("bottom" == r ? {
        top : pos.top + pos.height,
        left : pos.left + pos.width / 2 - actualWidth / 2
      } : "top" == r ? {
        top : pos.top - actualHeight,
        left : pos.left + pos.width / 2 - actualWidth / 2
      } : "left" == r ? {
        top : pos.top + pos.height / 2 - actualHeight / 2,
        left : pos.left - actualWidth
      } : {
        top : pos.top + pos.height / 2 - actualHeight / 2,
        left : pos.left + pos.width
      }, r);
      this.$element.trigger("shown.bs." + this.type);
    }
  };
  /**
   * @param {Object} offset
   * @param {string} r
   * @return {undefined}
   */
  Tooltip.prototype.applyPlacement = function(offset, r) {
    var g;
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;
    offset.top += parseInt($tip.css("margin-top"), 10);
    offset.left += parseInt($tip.css("margin-left"), 10);
    $tip.offset(offset).addClass("in");
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;
    if ("top" == r) {
      if (actualHeight != height) {
        /** @type {boolean} */
        g = true;
        /** @type {number} */
        offset.top = offset.top + height - actualHeight;
      }
    }
    if ("bottom" == r || "top" == r) {
      /** @type {number} */
      height = 0;
      if (0 > offset.left) {
        /** @type {number} */
        height = -2 * offset.left;
        /** @type {number} */
        offset.left = 0;
        $tip.offset(offset);
        actualWidth = $tip[0].offsetWidth;
      }
      this.replaceArrow(height - width + actualWidth, actualWidth, "left");
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, "top");
    }
    if (g) {
      $tip.offset(offset);
    }
  };
  /**
   * @param {boolean} delta
   * @param {boolean} dimension
   * @param {string} position
   * @return {undefined}
   */
  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? 50 * (1 - delta / dimension) + "%" : "");
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.setContent = function() {
    var $tip = this.tip();
    var title = this.getTitle();
    $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
    $tip.removeClass("fade in top bottom left right");
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.hide = function() {
    var $tip = this.tip();
    var e = $.Event("hide.bs." + this.type);
    this.$element.trigger(e);
    if (!e.isDefaultPrevented()) {
      return $tip.removeClass("in"), $.support.transition && this.$tip.hasClass("fade") ? $tip.one($.support.transition.end, $tip.detach).emulateTransitionEnd(150) : $tip.detach(), this.$element.trigger("hidden.bs." + this.type), this;
    }
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.fixTitle = function() {
    var $e = this.$element;
    if ($e.attr("title") || "string" != typeof $e.attr("data-original-title")) {
      $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
    }
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.hasContent = function() {
    return this.getTitle();
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getPosition = function() {
    var el = this.$element[0];
    return $.extend({}, "function" == typeof el.getBoundingClientRect ? el.getBoundingClientRect() : {
      width : el.offsetWidth,
      height : el.offsetHeight
    }, this.$element.offset());
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.getTitle = function() {
    var $e = this.$element;
    var o = this.options;
    return $e.attr("data-original-title") || ("function" == typeof o.title ? o.title.call($e[0]) : o.title);
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.tip = function() {
    return this.$tip = this.$tip || $(this.options.template);
  };
  /**
   * @return {?}
   */
  Tooltip.prototype.arrow = function() {
    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.validate = function() {
    if (!this.$element[0].parentNode) {
      this.hide();
      /** @type {null} */
      this.options = this.$element = null;
    }
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.enable = function() {
    /** @type {boolean} */
    this.enabled = true;
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.disable = function() {
    /** @type {boolean} */
    this.enabled = false;
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.toggleEnabled = function() {
    /** @type {boolean} */
    this.enabled = !this.enabled;
  };
  /**
   * @param {Object} self
   * @return {undefined}
   */
  Tooltip.prototype.toggle = function(self) {
    self = self ? $(self.currentTarget)[this.type](this._options).data("bs." + this.type) : this;
    if (self.tip().hasClass("in")) {
      self.leave(self);
    } else {
      self.enter(self);
    }
  };
  /**
   * @return {undefined}
   */
  Tooltip.prototype.destroy = function() {
    this.hide().$element.off("." + this.type).removeData("bs." + this.type);
  };
  var old = $.fn.tooltip;
  /**
   * @param {number} option
   * @return {?}
   */
  $.fn.tooltip = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.tooltip");
      var options = "object" == typeof option && option;
      if (!data) {
        $this.data("bs.tooltip", data = new Tooltip(this, options));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string, string): undefined} */
  $.fn.tooltip.Constructor = Tooltip;
  /**
   * @return {?}
   */
  $.fn.tooltip.noConflict = function() {
    $.fn.tooltip = old;
    return this;
  };
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {string} options
   * @return {undefined}
   */
  var Popover = function(selector, options) {
    this.init("popover", selector, options);
  };
  if (!$.fn.tooltip) {
    throw Error("Popover requires tooltip.js");
  }
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement : "right",
    trigger : "click",
    content : "",
    template : '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
  /** @type {function (string, string): undefined} */
  Popover.prototype.constructor = Popover;
  /**
   * @return {?}
   */
  Popover.prototype.getDefaults = function() {
    return Popover.DEFAULTS;
  };
  /**
   * @return {undefined}
   */
  Popover.prototype.setContent = function() {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();
    $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
    $tip.find(".popover-content")[this.options.html ? "html" : "text"](content);
    $tip.removeClass("fade top bottom left right in");
    $tip.find(".popover-title:empty").hide();
  };
  /**
   * @return {?}
   */
  Popover.prototype.hasContent = function() {
    return this.getTitle() || this.getContent();
  };
  /**
   * @return {?}
   */
  Popover.prototype.getContent = function() {
    var $e = this.$element;
    var o = this.options;
    return $e.attr("data-content") || ("function" == typeof o.content ? o.content.call($e[0]) : o.content);
  };
  /**
   * @return {?}
   */
  Popover.prototype.tip = function() {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
    }
    return this.$tip;
  };
  var old = $.fn.popover;
  /**
   * @param {number} option
   * @return {?}
   */
  $.fn.popover = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.popover");
      var options = "object" == typeof option && option;
      if (!data) {
        $this.data("bs.popover", data = new Popover(this, options));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string, string): undefined} */
  $.fn.popover.Constructor = Popover;
  /**
   * @return {?}
   */
  $.fn.popover.noConflict = function() {
    $.fn.popover = old;
    return this;
  };
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  function ScrollSpy(selector, options) {
    var href;
    var process = $.proxy(this.process, this);
    this.$element = $(selector).is("body") ? $(window) : $(selector);
    this.$body = $("body");
    this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", process);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    /** @type {string} */
    this.selector = (this.options.target || ((href = $(selector).attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "") || "")) + " .nav li > a";
    this.offsets = $([]);
    this.targets = $([]);
    /** @type {null} */
    this.activeTarget = null;
    this.refresh();
    this.process();
  }
  ScrollSpy.DEFAULTS = {
    offset : 10
  };
  /**
   * @return {undefined}
   */
  ScrollSpy.prototype.refresh = function() {
    /** @type {string} */
    var i = this.$element[0] == window ? "offset" : "position";
    this.offsets = $([]);
    this.targets = $([]);
    var self = this;
    this.$body.find(this.selector).map(function() {
      var handle = $(this);
      handle = handle.data("target") || handle.attr("href");
      var codeSegments = /^#\w/.test(handle) && $(handle);
      return codeSegments && (codeSegments.length && [[codeSegments[i]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), handle]]) || null;
    }).sort(function(mat0, mat1) {
      return mat0[0] - mat1[0];
    }).each(function() {
      self.offsets.push(this[0]);
      self.targets.push(this[1]);
    });
  };
  /**
   * @return {?}
   */
  ScrollSpy.prototype.process = function() {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    /** @type {number} */
    var maxScroll = (this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight) - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;
    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i);
    }
    i = offsets.length;
    for (;i--;) {
      if (activeTarget != targets[i]) {
        if (scrollTop >= offsets[i]) {
          if (!offsets[i + 1] || scrollTop <= offsets[i + 1]) {
            this.activate(targets[i]);
          }
        }
      }
    }
  };
  /**
   * @param {Object} target
   * @return {undefined}
   */
  ScrollSpy.prototype.activate = function(target) {
    /** @type {Object} */
    this.activeTarget = target;
    $(this.selector).parents(".active").removeClass("active");
    target = $(this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]').parents("li").addClass("active");
    if (target.parent(".dropdown-menu").length) {
      target = target.closest("li.dropdown").addClass("active");
    }
    target.trigger("activate");
  };
  var old = $.fn.scrollspy;
  /**
   * @param {number} option
   * @return {?}
   */
  $.fn.scrollspy = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.scrollspy");
      var options = "object" == typeof option && option;
      if (!data) {
        $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string, ?): undefined} */
  $.fn.scrollspy.Constructor = ScrollSpy;
  /**
   * @return {?}
   */
  $.fn.scrollspy.noConflict = function() {
    $.fn.scrollspy = old;
    return this;
  };
  $(window).on("load", function() {
    $('[data-spy="scroll"]').each(function() {
      var $spy = $(this);
      $spy.scrollspy($spy.data());
    });
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @return {undefined}
   */
  var Tab = function(selector) {
    this.element = $(selector);
  };
  /**
   * @return {undefined}
   */
  Tab.prototype.show = function() {
    var $this = this.element;
    var $ul = $this.closest("ul:not(.dropdown-menu)");
    var $target = $this.attr("data-target");
    if (!$target) {
      $target = ($target = $this.attr("href")) && $target.replace(/.*(?=#[^\s]*$)/, "");
    }
    if (!$this.parent("li").hasClass("active")) {
      var previous = $ul.find(".active:last a")[0];
      var e = $.Event("show.bs.tab", {
        relatedTarget : previous
      });
      $this.trigger(e);
      if (!e.isDefaultPrevented()) {
        $target = $($target);
        this.activate($this.parent("li"), $ul);
        this.activate($target, $target.parent(), function() {
          $this.trigger({
            type : "shown.bs.tab",
            relatedTarget : previous
          });
        });
      }
    }
  };
  /**
   * @param {Object} element
   * @param {Object} container
   * @param {?} value
   * @return {undefined}
   */
  Tab.prototype.activate = function(element, container, value) {
    /**
     * @return {undefined}
     */
    function next() {
      $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
      element.addClass("active");
      if (attrNames) {
        element[0].offsetWidth;
        element.addClass("in");
      } else {
        element.removeClass("fade");
      }
      if (element.parent(".dropdown-menu")) {
        element.closest("li.dropdown").addClass("active");
      }
      if (value) {
        value();
      }
    }
    var $active = container.find("> .active");
    var attrNames = value && ($.support.transition && $active.hasClass("fade"));
    if (attrNames) {
      $active.one($.support.transition.end, next).emulateTransitionEnd(150);
    } else {
      next();
    }
    $active.removeClass("in");
  };
  var old = $.fn.tab;
  /**
   * @param {string} option
   * @return {?}
   */
  $.fn.tab = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.tab");
      if (!data) {
        $this.data("bs.tab", data = new Tab(this));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string): undefined} */
  $.fn.tab.Constructor = Tab;
  /**
   * @return {?}
   */
  $.fn.tab.noConflict = function() {
    $.fn.tab = old;
    return this;
  };
  $(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(types) {
    types.preventDefault();
    $(this).tab("show");
  });
}(window.jQuery);
+function($) {
  /**
   * @param {string} selector
   * @param {?} options
   * @return {undefined}
   */
  var Affix = function(selector, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);
    this.$window = $(window).on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
    this.$element = $(selector);
    /** @type {null} */
    this.affixed = this.unpin = null;
    this.checkPosition();
  };
  /** @type {string} */
  Affix.RESET = "affix affix-top affix-bottom";
  Affix.DEFAULTS = {
    offset : 0
  };
  /**
   * @return {undefined}
   */
  Affix.prototype.checkPositionWithEventLoop = function() {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };
  /**
   * @return {undefined}
   */
  Affix.prototype.checkPosition = function() {
    if (this.$element.is(":visible")) {
      var affix = $(document).height();
      var scrollTop = this.$window.scrollTop();
      var position = this.$element.offset();
      var n = this.options.offset;
      var i = n.top;
      var c = n.bottom;
      if ("object" != typeof n) {
        c = i = n;
      }
      if ("function" == typeof i) {
        i = n.top();
      }
      if ("function" == typeof c) {
        c = n.bottom();
      }
      /** @type {(boolean|string)} */
      affix = null != this.unpin && scrollTop + this.unpin <= position.top ? false : null != c && position.top + this.$element.height() >= affix - c ? "bottom" : null != i && scrollTop <= i ? "top" : false;
      if (this.affixed !== affix) {
        if (this.unpin) {
          this.$element.css("top", "");
        }
        /** @type {(boolean|string)} */
        this.affixed = affix;
        /** @type {(null|number)} */
        this.unpin = "bottom" == affix ? position.top - scrollTop : null;
        this.$element.removeClass(Affix.RESET).addClass("affix" + (affix ? "-" + affix : ""));
        if ("bottom" == affix) {
          this.$element.offset({
            top : document.body.offsetHeight - c - this.$element.height()
          });
        }
      }
    }
  };
  var old = $.fn.affix;
  /**
   * @param {number} option
   * @return {?}
   */
  $.fn.affix = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.affix");
      var options = "object" == typeof option && option;
      if (!data) {
        $this.data("bs.affix", data = new Affix(this, options));
      }
      if ("string" == typeof option) {
        data[option]();
      }
    });
  };
  /** @type {function (string, ?): undefined} */
  $.fn.affix.Constructor = Affix;
  /**
   * @return {?}
   */
  $.fn.affix.noConflict = function() {
    $.fn.affix = old;
    return this;
  };
  $(window).on("load", function() {
    $('[data-spy="affix"]').each(function() {
      var $spy = $(this);
      var data = $spy.data();
      data.offset = data.offset || {};
      if (data.offsetBottom) {
        data.offset.bottom = data.offsetBottom;
      }
      if (data.offsetTop) {
        data.offset.top = data.offsetTop;
      }
      $spy.affix(data);
    });
  });
}(window.jQuery);
if ("object" !== typeof JSON) {
  JSON = {};
}
(function() {
  /**
   * @param {number} n
   * @return {?}
   */
  function f(n) {
    return 10 > n ? "0" + n : n;
  }
  /**
   * @param {string} string
   * @return {?}
   */
  function quote(string) {
    /** @type {number} */
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(m) {
      var handler = handlers[m];
      return "string" === typeof handler ? handler : "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }
  /**
   * @param {string} fix
   * @param {Object} holder
   * @return {?}
   */
  function str(fix, holder) {
    var i;
    var k;
    var v;
    var length;
    var mind = gap;
    var partial;
    var value = holder[fix];
    if (value) {
      if ("object" === typeof value && "function" === typeof value.toJSON) {
        value = value.toJSON(fix);
      }
    }
    if ("function" === typeof rep) {
      value = rep.call(holder, fix, value);
    }
    switch(typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      ;
      case "null":
        return String(value);
      case "object":
        if (!value) {
          return "null";
        }
        gap += indent;
        /** @type {Array} */
        partial = [];
        if ("[object Array]" === Object.prototype.toString.apply(value)) {
          length = value.length;
          /** @type {number} */
          i = 0;
          for (;i < length;i += 1) {
            partial[i] = str(i, value) || "null";
          }
          /** @type {string} */
          v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }
        if (rep && "object" === typeof rep) {
          length = rep.length;
          /** @type {number} */
          i = 0;
          for (;i < length;i += 1) {
            if ("string" === typeof rep[i]) {
              k = rep[i];
              if (v = str(k, value)) {
                partial.push(quote(k) + (gap ? ": " : ":") + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              if (v = str(k, value)) {
                partial.push(quote(k) + (gap ? ": " : ":") + v);
              }
            }
          }
        }
        /** @type {string} */
        v = 0 === partial.length ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }
  if ("function" !== typeof Date.prototype.toJSON) {
    /**
     * @return {string}
     */
    Date.prototype.toJSON = function() {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
    };
    /** @type {function (this:Boolean, string=): *} */
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
      return this.valueOf();
    };
  }
  /** @type {RegExp} */
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  /** @type {RegExp} */
  var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var gap;
  var indent;
  var handlers = {
    "\b" : "\\b",
    "\t" : "\\t",
    "\n" : "\\n",
    "\f" : "\\f",
    "\r" : "\\r",
    '"' : '\\"',
    "\\" : "\\\\"
  };
  var rep;
  if ("function" !== typeof JSON.stringify) {
    /**
     * @param {*} value
     * @param {(Array.<string>|function (string, *): *|null)=} obj
     * @param {(number|string)=} f
     * @return {string}
     */
    JSON.stringify = function(value, obj, f) {
      var indexf;
      /** @type {string} */
      indent = gap = "";
      if ("number" === typeof f) {
        /** @type {number} */
        indexf = 0;
        for (;indexf < f;indexf += 1) {
          indent += " ";
        }
      } else {
        if ("string" === typeof f) {
          /** @type {string} */
          indent = f;
        }
      }
      if ((rep = obj) && ("function" !== typeof obj && ("object" !== typeof obj || "number" !== typeof obj.length))) {
        throw Error("JSON.stringify");
      }
      return str("", {
        "" : value
      });
    };
  }
  if ("function" !== typeof JSON.parse) {
    /**
     * @param {string} text
     * @param {function (string, *): *=} reviver
     * @return {*}
     */
    JSON.parse = function(text, reviver) {
      /**
       * @param {Object} holder
       * @param {string} key
       * @return {?}
       */
      function walk(holder, key) {
        var k;
        var v;
        var value = holder[key];
        if (value && "object" === typeof value) {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (void 0 !== v) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }
      var a;
      /** @type {string} */
      text = String(text);
      /** @type {number} */
      cx.lastIndex = 0;
      if (cx.test(text)) {
        /** @type {string} */
        text = text.replace(cx, function(a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        return a = eval("(" + text + ")"), "function" === typeof reviver ? walk({
          "" : a
        }, "") : a;
      }
      throw new SyntaxError("JSON.parse");
    };
  }
})();
(function() {
  var execute;
  var bind;
  var iterable;
  var parse;
  var e;
  var key;
  /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
  var __slice = [].slice;
  e = {};
  /**
   * @param {string} step
   * @param {Array} e
   * @param {Object} callback
   * @return {?}
   */
  bind = function(step, e, callback) {
    var self;
    var u;
    var o;
    var stack;
    var memory;
    if (null == callback) {
      /** @type {null} */
      callback = null;
    }
    if ("." === step) {
      return e[e.length - 1];
    }
    o = step.split(/\./);
    step = o[0];
    /** @type {Array.<?>} */
    o = 2 <= o.length ? __slice.call(o, 1) : [];
    /** @type {number} */
    u = stack = memory = e.length - 1;
    for (;-1 >= memory ? -1 > stack : -1 < stack;u = -1 >= memory ? ++stack : --stack) {
      if (null != e[u] && ("object" === typeof e[u] && step in (self = e[u]))) {
        callback = self[step];
        break;
      }
    }
    /** @type {number} */
    e = 0;
    /** @type {number} */
    u = o.length;
    for (;e < u;e++) {
      step = o[e];
      callback = bind(step, [callback]);
    }
    if (callback instanceof Function) {
      callback = function(func) {
        return function() {
          var fn;
          fn = func.apply(self, arguments);
          return fn instanceof Function && fn.apply(null, arguments) || fn;
        };
      }(callback);
    }
    return callback;
  };
  /**
   * @return {?}
   */
  execute = function() {
    var args;
    var value;
    var context;
    var iteratee;
    context = arguments[0];
    iteratee = arguments[1];
    /** @type {Array.<?>} */
    args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    var index;
    var quantity;
    var tagNameArr;
    /** @type {Array} */
    tagNameArr = [];
    /** @type {number} */
    index = 0;
    quantity = iteratee.length;
    for (;index < quantity;index++) {
      value = iteratee[index];
      tagNameArr.push(value.call.apply(value, [context].concat(__slice.call(args))));
    }
    return tagNameArr.join("");
  };
  /**
   * @param {string} str
   * @param {Object} parts
   * @param {Object} opts
   * @return {?}
   */
  parse = function(str, parts, opts) {
    var promote;
    var output;
    var resolve;
    var fn;
    var cache;
    var offset;
    var part;
    var stat;
    var expr;
    var obj;
    var val;
    var data;
    var next;
    var start;
    var self;
    var base;
    var value;
    if (null == parts) {
      /** @type {Array} */
      parts = ["{{", "}}"];
    }
    if (null == opts) {
      /** @type {null} */
      opts = null;
    }
    cache = e[output = parts.join(" ")] || (e[output] = {});
    if (str in cache) {
      return cache[str];
    }
    /** @type {Array} */
    output = [];
    /**
     * @return {?}
     */
    promote = function() {
      return RegExp("([\\s\\S]*?)([ \\t]*)(?:" + parts[0] + "\\s*(?:(!)\\s*([\\s\\S]+?)|(=)\\s*([\\s\\S]+?)\\s*=|({)\\s*(\\w[\\S]*?)\\s*}|([^0-9a-zA-Z._!={]?)\\s*([\\w.][\\S]*?))\\s*" + parts[1] + ")", "gm");
    };
    self = promote();
    self.lastIndex = start = (opts || {
      start : 0
    }).start;
    /**
     * @param {number} end
     * @param {string} err
     * @return {?}
     */
    next = function(end, err) {
      var index;
      var p;
      var r;
      var letter;
      var k;
      var b;
      var a;
      /** @type {number} */
      (r = /$/gm).lastIndex = end;
      r.exec(str);
      b = str.substr(0, end).split("\n");
      p = b.length;
      b = b[p - 1];
      index = offset + value.length;
      a = str.substr(index + 1, end - index - 1);
      /** @type {string} */
      letter = Array(b.length - a.length + 1).join(" ");
      /** @type {string} */
      index = Array(a.length + 1).join("^");
      b += str.substr(end, r.lastIndex - end);
      /** @type {Error} */
      r = Error();
      for (k in p = {
        message : "" + err + "\n\nLine " + p + ":\n" + b + "\n" + letter + index,
        error : err,
        line : p,
        "char" : letter.length,
        tag : a
      }) {
        r[k] = p[k];
      }
      return r;
    };
    for (;val = self.exec(str);) {
      fn = val.slice(1, 3);
      resolve = fn[0];
      value = fn[1];
      fn = val[3] || (val[5] || (val[7] || val[9]));
      val = val[4] || (val[6] || (val[8] || val[10]));
      /** @type {number} */
      offset = start + resolve.length - 1;
      start = self.lastIndex;
      /** @type {boolean} */
      obj = (-1 === offset || "\n" === str.charAt(offset)) && (void 0 === (data = str.charAt(start)) || ("" === data || ("\r" === data || "\n" === data)));
      if (resolve) {
        output.push(function(elem) {
          return function() {
            return elem;
          };
        }(resolve));
      }
      if (obj && ("" !== fn && ("&" !== fn && "{" !== fn))) {
        if ("\r" === str.charAt(start)) {
          start += 1;
        }
        if ("\n" === str.charAt(start)) {
          start += 1;
        }
      } else {
        if (value) {
          output.push(function(putativeSpy) {
            return function() {
              return putativeSpy;
            };
          }(value));
          offset += value.length;
          /** @type {string} */
          value = "";
        }
      }
      switch(fn) {
        case "!":
          break;
        case "":
        ;
        case "&":
        ;
        case "{":
          /**
           * @param {string} val
           * @param {?} doc
           * @return {?}
           */
          resolve = function(val, doc) {
            return function(data) {
              var r;
              var v;
              if ((r = null != (v = bind(val, data)) ? v : "") instanceof Function) {
                r = execute.apply(null, [this, parse("" + r())].concat(__slice.call(arguments)));
              }
              if (!doc) {
                r = this.escape("" + r);
              }
              return "" + r;
            };
          };
          output.push(resolve(val, fn));
          break;
        case ">":
          /**
           * @param {?} item
           * @param {?} n
           * @return {?}
           */
          fn = function(item, n) {
            return function(dataAndEvents, fn) {
              var source;
              source = fn(item).toString();
              if (n) {
                source = source.replace(/^(?=.)/gm, n);
              }
              return execute.apply(null, [this, parse(source)].concat(__slice.call(arguments)));
            };
          };
          output.push(fn(val, value));
          break;
        case "#":
        ;
        case "^":
          resolve = {
            name : val,
            start : start,
            error : next(self.lastIndex, "Unclosed section '" + val + "'!")
          };
          obj = parse(str, parts, resolve);
          base = obj[0];
          start = obj[1];
          /**
           * @param {string} step
           * @param {Object} parts
           * @param {?} me
           * @return {?}
           */
          resolve["#"] = function(step, parts, me) {
            return function(stack) {
              var obj;
              var ret;
              var i;
              var current;
              current = bind(step, stack) || [];
              base = current instanceof Function ? current(me) : me;
              if (!(current instanceof Array)) {
                /** @type {Array} */
                current = [current];
              }
              obj = parse(base || "", parts);
              stack.push(current);
              ret = function() {
                var k;
                var ll;
                var eventPath;
                /** @type {Array} */
                eventPath = [];
                /** @type {number} */
                k = 0;
                ll = current.length;
                for (;k < ll;k++) {
                  i = current[k];
                  stack[stack.length - 1] = i;
                  eventPath.push(execute.apply(null, [this, obj].concat(__slice.call(arguments))));
                }
                return eventPath;
              }.apply(this, arguments);
              stack.pop();
              return ret.join("");
            };
          };
          /**
           * @param {string} step
           * @param {Object} parts
           * @param {string} ms
           * @return {?}
           */
          resolve["^"] = function(step, parts, ms) {
            return function(data) {
              var c;
              c = bind(step, data) || [];
              if (!(c instanceof Array)) {
                /** @type {Array} */
                c = [1];
              }
              c = 0 === c.length ? parse(ms, parts) : [];
              return execute.apply(null, [this, c].concat(__slice.call(arguments)));
            };
          };
          output.push(resolve[fn](val, parts, base));
          break;
        case "/":
          if (null == opts) {
            /** @type {string} */
            stat = "End Section tag '" + val + "' found, but not in section!";
          } else {
            if (val !== (data = opts.name)) {
              /** @type {string} */
              stat = "End Section tag closes '" + val + "'; expected '" + data + "'!";
            }
          }
          if (stat) {
            throw next(self.lastIndex, stat);
          }
          str = str.slice(opts.start, +offset + 1 || 9E9);
          /** @type {Array} */
          cache[str] = output;
          return[str, start];
        case "=":
          if (2 !== (parts = val.split(/\s+/)).length) {
            /** @type {string} */
            stat = "Set Delimiters tags should have two and only two values!";
          }
          if (stat) {
            throw next(self.lastIndex, stat);
          }
          /** @type {RegExp} */
          expr = /[-[\]{}()*+?.,\\^$|#]/g;
          parts = function() {
            var j;
            var subLn;
            var out;
            /** @type {Array} */
            out = [];
            /** @type {number} */
            j = 0;
            subLn = parts.length;
            for (;j < subLn;j++) {
              part = parts[j];
              out.push(part.replace(expr, "\\$&"));
            }
            return out;
          }();
          self = promote();
          break;
        default:
          throw next(self.lastIndex, "Unknown tag type -- " + fn);;
      }
      self.lastIndex = null != start ? start : str.length;
    }
    if (null != opts) {
      throw opts.error;
    }
    if (str.length !== start) {
      output.push(function() {
        return str.slice(start);
      });
    }
    return cache[str] = output;
  };
  iterable = {
    VERSION : "1.2.0",
    helpers : [],
    partials : null,
    /**
     * @param {string} str
     * @return {?}
     */
    escape : function(str) {
      var buf;
      buf = {
        "&" : "amp",
        '"' : "quot",
        "<" : "lt",
        ">" : "gt"
      };
      return str.replace(/[&"<>]/g, function(off) {
        return "&" + buf[off] + ";";
      });
    },
    /**
     * @param {string} req
     * @param {?} callback
     * @param {Object} partials
     * @return {?}
     */
    render : function(req, callback, partials) {
      var list;
      if (null == partials) {
        /** @type {null} */
        partials = null;
      }
      if (!((partials || (partials = this.partials || {})) instanceof Function)) {
        partials = function(partials) {
          return function(step) {
            if (!(step in partials)) {
              throw "Unknown partial '" + step + "'!";
            }
            return bind(step, [partials]);
          };
        }(partials);
      }
      /** @type {Array} */
      list = this.helpers instanceof Array ? this.helpers : [this.helpers];
      return execute(this, parse(req), list.concat([callback]), partials);
    }
  };
  if ("undefined" !== typeof exports && null !== exports) {
    for (key in iterable) {
      exports[key] = iterable[key];
    }
  } else {
    this.Milk = iterable;
  }
}).call(this);
(function() {
  var ApplicationUI;
  ApplicationUI = function() {
    /**
     * @return {undefined}
     */
    function Text() {
      /** @type {string} */
      this.html_template = '<script type="text/javascript" src="{{script_url}}">\x3c/script>\n<script type="text/javascript">\n  VLWidget.init({\n    publisher_id: {{publisher_id}},\n    element_ids: {{element_ids}},\n    title: {{title}},\n    color_scheme: {{color_scheme}}\n  })\n\x3c/script>\n';
      this.textarea = $("#widget-code");
    }
    /**
     * @return {?}
     */
    Text.prototype.render = function() {
      console.log("we be rendering!");
      return this.textarea.val(this.html_template);
    };
    return Text;
  }();
  $(function() {
    window.code_renderer = new ApplicationUI;
    $(".new-widget input").on("change", function() {
      return code_renderer.render();
    });
    if ($("#bookmarklet-link")[0]) {
      return $("#get-link").submit(function(error) {
        error.preventDefault();
        /** @type {string} */
        error = "javascript:(function(){window.vglnkbkmklt_key = '" + $("#api-key").val() + "'; if(window.myBookmarklet!==undefined){myBookmarklet();}else{document.body.appendChild(document.createElement('script')).src= '//infinite-depths-8370.herokuapp.com/assets/bookmarklet.js'; }})();";
        return $("#bookmarklet-link").attr("href", error).parent().show();
      });
    }
  });
}).call(this);