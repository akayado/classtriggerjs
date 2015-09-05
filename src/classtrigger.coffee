###
ClassTrigger.js JavaScript Library Ver. 1.0 pre-alpha
https://github.com/akayado/classtriggerjs
Author: akayado
Released under the MIT license
###

window.tr = {}
((tr) ->
  prefix = "tr" #the prefix for data-* attributes used by this code

  classList = (node) ->
    return node.classList if node.classList?
    console.log "No support for old browsers right now!"

  #called whenever window size changes
  tr.updateWindowSize = (ev) ->
    for k,v of options.media
      attr = "data-"+prefix+"-"+k
      query = "["+attr+"]"
      nodelist = document.querySelectorAll query
      for n in nodelist
        val = n.getAttribute attr
        if (window.matchMedia v).matches
          classList(n).add val if !classList(n).contains val
        else
          classList(n).remove val if classList(n).contains val
    return

  parseAttribute = (node, attr) ->
    vals = (node.getAttribute attr).split(/[ \t]*\|[ \t]*/)
    result = {selfvals:[], other:{}}
    for val in vals
      try
        obj = JSON.parse val.replace(/'/g, '"')
        result.other = obj
        for k,v of result.other
          result.other[k] = v.split(/[ \t]+/)
      catch e
        val_splitted = val.split(/[ \t]+/)
        for v in val_splitted
          result.selfvals.push v
    return result
      

  #Scans the DOM and adds event listeners
  #Currently, updateDOM is called only once; on load.
  #In future, updateDOM can be called any time to adapt to DOM changes.
  updateDOMcalled = false
  tr.updateDOM = (ev) ->
    return if updateDOMcalled
    updateDOMcalled = true

    #hover
    attr = "data-"+prefix+"-hover"
    query = "["+attr+"]"
    nodelist = document.querySelectorAll query
    for n in nodelist
      parsed = parseAttribute(n, attr)
      setOnTrigger n, n, parsed.selfvals, "mouseenter"
      setOffTrigger n, n, parsed.selfvals, "mouseleave"
      for k,v of parsed.other
        nodelist2 = document.querySelectorAll k
        for n2 in nodelist2
          setOnTrigger n, n2, v, "mouseenter"
          setOffTrigger n, n2, v, "mouseleave"

    #press
    attr = "data-"+prefix+"-press"
    query = "["+attr+"]"
    nodelist = document.querySelectorAll query
    for n in nodelist
      parsed = parseAttribute(n, attr)
      setOnTrigger n, n, parsed.selfvals, "mousedown"
      setOffTrigger n, n, parsed.selfvals, "mouseup"
      setOffTrigger n, n, parsed.selfvals, "mouseleave"
      for k,v of parsed.other
        nodelist2 = document.querySelectorAll k
        for n2 in nodelist2
          setOnTrigger n, n2, v, "mousedown"
          setOffTrigger n, n2, v, "mouseup"
          setOffTrigger n, n2, v, "mouseleave"



    #other mouse events
    setupTrigger "mouseenter"
    setupTrigger "mouseleave"
    setupTrigger "mouseover"
    setupTrigger "mouseout"
    setupTrigger "mouseup"
    setupTrigger "mousedown"
    setupTrigger "click"
    setupTrigger "dblclick"

    return

  setupTrigger = (type) ->
    attr = "data-"+prefix+"-"+type
    query = "["+attr+"]"
    nodelist = document.querySelectorAll query
    for n in nodelist
      parsed = parseAttribute(n, attr)
      setOnTrigger n, n, parsed.selfvals, type
      for k,v of parsed.other
        nodelist2 = document.querySelectorAll k
        for n2 in nodelist2
          setOnTrigger n, n2, v, type


  #setOnTrigger and setOffTrigger do the opposite thing.
  setOnTrigger = (src, target, classes, type) ->
    addEvent(src, type, (en) ->
      for v in classes
        if v.match(/^-/)
          v = v.replace(/^-/, "")
          classList(target).remove v if classList(target).contains v
        else
          v = v.replace(/^\+/, "")
          classList(target).add v if !classList(target).contains v
    )
  setOffTrigger = (src, target, classes, type) ->
    addEvent(src, type, (en) ->
      for v in classes
        if v.match(/^-/)
          v = v.replace(/^-/, "")
          classList(target).add v if !classList(target).contains v
        else
          v = v.replace(/^\+/, "")
          classList(target).remove v if classList(target).contains v
    )

  #for browsers that don't support addEventListener
  addEvent = (target, type, fun) ->
    if target.addEventListener?
      target.addEventListener type, fun
    else if target.attachEvent?
      target.attachEvent "on"+type, fun
    else
      target["on"+type] = fun

  #initialization
  #Must be called when DOM is ready.
  #First, set up options
  options = {}
  tr.init = (opt) ->
    options = {
      media: {
        small: 'screen and (max-width: 360px)',
        medium: 'screen and (min-width: 361px) and (max-width: 800px)',
        large: 'screen and (min-width: 801px)',
        print: 'print'
      },
      prefix: "tr"
    }

    if opt?
      for k, v of options
        if k == "media"
          for k2, v2 of options[k]
            options[k][k2] = opt[k][k2] || options[k][k2]
        else
          options[k] = opt[k] || options[k]

    prefix = options.prefix

    addEvent window, 'resize', tr.updateWindowSize #So that we can adapt to new window sizes on resize
    addEvent document, 'DOMContentLoaded', tr.updateWindowSize #Adapt to current window size on load
    addEvent window, 'load', tr.updateWindowSize #Just in case DOMContentLoaded doesn't work

    addEvent document, 'DOMContentLoaded', tr.updateDOM #Scan the dom on load
    addEvent window, 'load', tr.updateDOM #Again, just in case...

    return
  return
)(tr)

tr.init()
