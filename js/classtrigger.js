
/*
ClassTrigger.js JavaScript Library Ver. 1.0 pre-alpha
https://github.com/akayado/classtriggerjs
Author: akayado
Released under the MIT license
 */

(function() {
  window.tr = {};

  (function(tr) {
    var addEvent, classList, options, parseAttribute, prefix, setOffTrigger, setOnTrigger, setupTrigger, updateDOMcalled;
    prefix = "tr";
    classList = function(node) {
      if (node.classList != null) {
        return node.classList;
      }
      return console.log("No support for old browsers right now!");
    };
    tr.updateWindowSize = function(ev) {
      var attr, i, k, len, n, nodelist, query, ref, v, val;
      ref = options.media;
      for (k in ref) {
        v = ref[k];
        attr = "data-" + prefix + "-" + k;
        query = "[" + attr + "]";
        nodelist = document.querySelectorAll(query);
        for (i = 0, len = nodelist.length; i < len; i++) {
          n = nodelist[i];
          val = n.getAttribute(attr);
          if ((window.matchMedia(v)).matches) {
            if (!classList(n).contains(val)) {
              classList(n).add(val);
            }
          } else {
            if (classList(n).contains(val)) {
              classList(n).remove(val);
            }
          }
        }
      }
    };
    parseAttribute = function(node, attr) {
      var e, error, i, j, k, len, len1, obj, ref, result, v, val, val_splitted, vals;
      vals = (node.getAttribute(attr)).split(/[ \t]*\|[ \t]*/);
      result = {
        selfvals: [],
        other: {}
      };
      for (i = 0, len = vals.length; i < len; i++) {
        val = vals[i];
        try {
          obj = JSON.parse(val.replace(/'/g, '"'));
          result.other = obj;
          ref = result.other;
          for (k in ref) {
            v = ref[k];
            result.other[k] = v.split(/[ \t]+/);
          }
        } catch (error) {
          e = error;
          val_splitted = val.split(/[ \t]+/);
          for (j = 0, len1 = val_splitted.length; j < len1; j++) {
            v = val_splitted[j];
            result.selfvals.push(v);
          }
        }
      }
      return result;
    };
    updateDOMcalled = false;
    tr.updateDOM = function(ev) {
      var attr, i, j, k, l, len, len1, len2, len3, m, n, n2, nodelist, nodelist2, parsed, query, ref, ref1, v;
      if (updateDOMcalled) {
        return;
      }
      updateDOMcalled = true;
      attr = "data-" + prefix + "-hover";
      query = "[" + attr + "]";
      nodelist = document.querySelectorAll(query);
      for (i = 0, len = nodelist.length; i < len; i++) {
        n = nodelist[i];
        parsed = parseAttribute(n, attr);
        setOnTrigger(n, n, parsed.selfvals, "mouseenter");
        setOffTrigger(n, n, parsed.selfvals, "mouseleave");
        ref = parsed.other;
        for (k in ref) {
          v = ref[k];
          nodelist2 = document.querySelectorAll(k);
          for (j = 0, len1 = nodelist2.length; j < len1; j++) {
            n2 = nodelist2[j];
            setOnTrigger(n, n2, v, "mouseenter");
            setOffTrigger(n, n2, v, "mouseleave");
          }
        }
      }
      attr = "data-" + prefix + "-press";
      query = "[" + attr + "]";
      nodelist = document.querySelectorAll(query);
      for (l = 0, len2 = nodelist.length; l < len2; l++) {
        n = nodelist[l];
        parsed = parseAttribute(n, attr);
        setOnTrigger(n, n, parsed.selfvals, "mousedown");
        setOffTrigger(n, n, parsed.selfvals, "mouseup");
        setOffTrigger(n, n, parsed.selfvals, "mouseleave");
        ref1 = parsed.other;
        for (k in ref1) {
          v = ref1[k];
          nodelist2 = document.querySelectorAll(k);
          for (m = 0, len3 = nodelist2.length; m < len3; m++) {
            n2 = nodelist2[m];
            setOnTrigger(n, n2, v, "mousedown");
            setOffTrigger(n, n2, v, "mouseup");
            setOffTrigger(n, n2, v, "mouseleave");
          }
        }
      }
      setupTrigger("mouseenter");
      setupTrigger("mouseleave");
      setupTrigger("mouseover");
      setupTrigger("mouseout");
      setupTrigger("mouseup");
      setupTrigger("mousedown");
      setupTrigger("click");
      setupTrigger("dblclick");
    };
    setupTrigger = function(type) {
      var attr, i, k, len, n, n2, nodelist, nodelist2, parsed, query, results, v;
      attr = "data-" + prefix + "-" + type;
      query = "[" + attr + "]";
      nodelist = document.querySelectorAll(query);
      results = [];
      for (i = 0, len = nodelist.length; i < len; i++) {
        n = nodelist[i];
        parsed = parseAttribute(n, attr);
        setOnTrigger(n, n, parsed.selfvals, type);
        results.push((function() {
          var ref, results1;
          ref = parsed.other;
          results1 = [];
          for (k in ref) {
            v = ref[k];
            nodelist2 = document.querySelectorAll(k);
            results1.push((function() {
              var j, len1, results2;
              results2 = [];
              for (j = 0, len1 = nodelist2.length; j < len1; j++) {
                n2 = nodelist2[j];
                results2.push(setOnTrigger(n, n2, v, type));
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    };
    setOnTrigger = function(src, target, classes, type) {
      return addEvent(src, type, function(en) {
        var i, len, results, v;
        results = [];
        for (i = 0, len = classes.length; i < len; i++) {
          v = classes[i];
          if (v.match(/^-/)) {
            v = v.replace(/^-/, "");
            if (classList(target).contains(v)) {
              results.push(classList(target).remove(v));
            } else {
              results.push(void 0);
            }
          } else {
            v = v.replace(/^\+/, "");
            if (!classList(target).contains(v)) {
              results.push(classList(target).add(v));
            } else {
              results.push(void 0);
            }
          }
        }
        return results;
      });
    };
    setOffTrigger = function(src, target, classes, type) {
      return addEvent(src, type, function(en) {
        var i, len, results, v;
        results = [];
        for (i = 0, len = classes.length; i < len; i++) {
          v = classes[i];
          if (v.match(/^-/)) {
            v = v.replace(/^-/, "");
            if (!classList(target).contains(v)) {
              results.push(classList(target).add(v));
            } else {
              results.push(void 0);
            }
          } else {
            v = v.replace(/^\+/, "");
            if (classList(target).contains(v)) {
              results.push(classList(target).remove(v));
            } else {
              results.push(void 0);
            }
          }
        }
        return results;
      });
    };
    addEvent = function(target, type, fun) {
      if (target.addEventListener != null) {
        return target.addEventListener(type, fun);
      } else if (target.attachEvent != null) {
        return target.attachEvent("on" + type, fun);
      } else {
        return target["on" + type] = fun;
      }
    };
    options = {};
    tr.init = function(opt) {
      var k, k2, ref, v, v2;
      options = {
        media: {
          small: 'screen and (max-width: 360px)',
          medium: 'screen and (min-width: 361px) and (max-width: 800px)',
          large: 'screen and (min-width: 801px)',
          print: 'print'
        },
        prefix: "tr"
      };
      if (opt != null) {
        for (k in options) {
          v = options[k];
          if (k === "media") {
            ref = options[k];
            for (k2 in ref) {
              v2 = ref[k2];
              options[k][k2] = opt[k][k2] || options[k][k2];
            }
          } else {
            options[k] = opt[k] || options[k];
          }
        }
      }
      prefix = options.prefix;
      addEvent(window, 'resize', tr.updateWindowSize);
      addEvent(document, 'DOMContentLoaded', tr.updateWindowSize);
      addEvent(window, 'load', tr.updateWindowSize);
      addEvent(document, 'DOMContentLoaded', tr.updateDOM);
      addEvent(window, 'load', tr.updateDOM);
    };
  })(tr);

}).call(this);
