# * L.Control.GeoSearch - search for an address and zoom to its location
# * https://github.com/smeijer/leaflet.control.geosearch

L.GeoSearch = {}
L.GeoSearch.Provider = {}

# MSIE needs cors support
jQuery.support.cors = true
L.GeoSearch.Result = (x, y, label) ->
  @X = x
  @Y = y
  @Label = label

class L.Control.GeoSearch extends L.Control
  options:
    position: "topleft"
    provider: null
    searchLabel: "Enter address"
    notFoundMessage: "Sorry, that address could not be found."
    zoomLevel: 17
    showMarker: true
    enableAutocomplete: true
    autocompleteMinQueryLen: 3
    autocompleteQueryDelay_ms: 800
    maxResultCount: 10
    visible: false
    clearValue: true

  constructor: (options) ->
    L.Util.extend @options, options
    @options.onMakeSuggestionHTML = (geosearchResult) =>
      @_htmlEscape geosearchResult.Label

  onAdd: (map) ->

    # create the container - search_box
    @_container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-geosearch")

    # create the link - this will contain one of the icons
    @_btnSearch = L.DomUtil.create("a", "", @_container)
    @_btnSearch.href = "#"
    @_btnSearch.title = @options.searchLabel

    # set the link's icon to magnifying glass
    @_changeIcon "glass"

    # create the form that will contain the input
    formclass = unless @options.visible then "displayNone" else ""
    form = L.DomUtil.create("form", formclass, @_container)
    form.setAttribute( "autocomplete", "off" )

    # create the input, and set its placeholder ("Enter address") text
    input = L.DomUtil.create("input", null, form)
    input.placeholder = @options.searchLabel
    input.setAttribute "id", "inputGeosearch"
    input.setAttribute "autocomplete", "off"
    @_searchInput = input

    #add events form the link(_btnSearch)
    if @options.visible then clickElement = @_container else clickElement = @_btnSearch
    L.DomEvent
      .on(clickElement, "click", L.DomEvent.stop)
      .on clickElement, "click", =>
        if L.DomUtil.hasClass(form, "displayNone") or @options.visible
          L.DomUtil.removeClass form, "displayNone" # unhide form
          $(input).select() if @options.clearValue
          $(input).focus() if not L.Browser.touch
          $(input).trigger "click"
        else
          if not @options.visible then @_hide()

    #create events for the input
    L.DomEvent
      .on(input, "keyup", @_onKeyUp, this)
      .on(input, "keypress", @_onKeyPress, this)
      .on(input, "input", @_onInput, this)

    if L.Browser.touch
      L.DomEvent.on @_container, "click", L.DomEvent.stop
    else
      L.DomEvent.disableClickPropagation @_container
      L.DomEvent.on @_container, "mousewheel", L.DomEvent.stop

    #create the suggestionBox
    if @options.enableAutocomplete
      @_createSuggestionBox @container, "leaflet-geosearch-autocomplete"
      @_recordLastUserInput ""
      $(@_container).append @_suggestionBox

    # create the error @_message div
    @_message = L.DomUtil.create("div", "leaflet-bar leaflet-geosearch-message displayNone", @_container)

    # hide form when click on map
    L.DomEvent
      #add onclick event to the map
      .on @_map, "click", ( =>
        @_hide()
      )

    return @_container

  _createSuggestionBox: (container, className) ->
    @_suggestionBox = L.DomUtil.create("div", className, container)
    L.DomUtil.addClass @_suggestionBox, "displayNone"

    # consider whether to make delayed hide onBlur.
    # If so, consider canceling timer on mousewheel and mouseover.
    L.DomEvent.disableClickPropagation(@_suggestionBox)
      .on(@_suggestionBox, "blur", @_hide, this)
      .on @_suggestionBox, "mousewheel", (e) =>
        L.DomEvent.stopPropagation e # to prevent map zoom
        if e.axis is e.VERTICAL_AXIS
          if e.detail > 0
            @_moveDown()
          else
            @_moveUp()

    return @_suggestionBox

  _changeIcon: (icon) ->
    @_btnSearch = @_container.querySelector("a")
    @_btnSearch.className = "leaflet-bar-part leaflet-bar-part-single" + " leaflet-geosearch-" + icon

  _geosearch: (qry) ->
    try
      provider = @options.provider
      if typeof provider.GetLocations is "function"
        results = provider.GetLocations(qry , (results) =>
          @_processResults results
        )
      else
        url = provider.GetServiceUrl(qry)
        $.getJSON url, (data) =>
          try
            results = provider.ParseJSON(data)
            @_processResults results
          catch error
            @_printError error
    catch error
      @_printError error

  _geosearchAutocomplete: (qry, requestDelay_ms) ->
    return unless @options.enableAutocomplete

    clearTimeout @_autocompleteRequestTimer
    @_autocompleteRequestTimer = setTimeout =>
      q = qry
      q = qry() if typeof qry is "function"
      if q.length >= @options.autocompleteMinQueryLen
        @_geosearch q
      else
        @_hide()
    , requestDelay_ms

  _processResults: (results) ->
    if results.length is 0
      @_printError @options.notFoundMessage
    else
      @_show results
      @_map.fireEvent 'geosearch_foundlocations', {Location: location}

    return results

  _showLocation: (location) =>
    location = location[0]
    if @options.showMarker
      if typeof @_positionMarker is "undefined"
        @_positionMarker = L.marker([location.Y, location.X]).addTo(@_map)
      else
        @_positionMarker.setLatLng [location.Y, location.X]
    @_map.setView [location.Y, location.X], @options.zoomLevel, false
    @_map.fireEvent 'geosearch_showlocation', {Location: location}
    @_cancelSearch()

  _isShowingError: false

  _printError: (error) ->
    @_message.innerHTML = error
    L.DomUtil.removeClass @_message, "displayNone"

    # show alert icon
    @_changeIcon "alert"
    @_isShowingError = true

    @_hideAutocomplete()

  _cancelSearch: ->
    #clear the input value of the search
    input = @_container.querySelector("input")
    input.value = "" if @options.clearValue

    # show glass icon
    @_changeIcon "glass"
    #hide de autocomplete structures
    @_hide()

  #suggestionBox
  _startSearch: ->
    # show spinner icon
    @_changeIcon "spinner"
    input = @_container.querySelector("input")
    location = @options.provider.GetLocations input.value, @_showLocation
    @_hide()

  _recordLastUserInput: (str) ->
    @_lastUserInput = str

  #suggestionBox
  _show: (results) =>
    @_changeIcon "glass"

    @_suggestionBox.innerHTML = ""
    @_suggestionBox.currentSelection = -1
    count = 0

    while count < results.length and count < @options.maxResultCount
      entry = @_newSuggestion(results[count])
      @_suggestionBox.appendChild entry
      ++count
    if count > 0
      L.DomUtil.removeClass @_suggestionBox, "displayNone"
    else
      @_hide()

    return count

  _hideAutocomplete: ->
    L.DomUtil.addClass @_suggestionBox, "displayNone" unless L.DomUtil.hasClass(@_suggestionBox, "displayNone") # hide form
    clearTimeout(@_autocompleteRequestTimer)

  _hide: ->
    @_hideAutocomplete if @options.enableAutocomplete
    form = @_container.querySelector("form")
    L.DomUtil.addClass form, "displayNone" unless L.DomUtil.hasClass(form, "displayNone") or @options.visible # hide form
    L.DomUtil.addClass @_message, "displayNone" unless L.DomUtil.hasClass(@_message, "displayNone") # hide form
    @_suggestionBox.innerHTML = ""

  _isVisible: ->
    not L.DomUtil.hasClass(@_suggestionBox, "displayNone")

  _htmlEscape: (str) ->
    # implementation courtesy of http://stackoverflow.com/a/7124052
    String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace />/g, "&gt;"

  _newSuggestion: (result) ->
    tip = L.DomUtil.create("li", "leaflet-geosearch-suggestion")
    tip.innerHTML = '<i class="leaflet-control-geosearch leaflet-geosearch-marker"></i>' + @options.onMakeSuggestionHTML(result)
    tip._text = result.Label
    L.DomEvent.disableClickPropagation(tip)
      .on tip, "click", (e) =>
        @_onSelection tip._text
        @_startSearch()

    return tip

  _onSelection: (suggestionText) ->
    @_searchInput.value = suggestionText

  _onSelectedUpdate: ->
    entries = (
      if @_suggestionBox.hasChildNodes()
        @_suggestionBox.childNodes
      else
        []
    )
    i = 0

    while i < entries.length
      L.DomUtil.removeClass entries[i], "leaflet-geosearch-suggestion-selected"
      ++i

    # if selection is -1, then show last user typed text
    if @_suggestionBox.currentSelection >= 0
      L.DomUtil.addClass entries[@_suggestionBox.currentSelection], "leaflet-geosearch-suggestion-selected"

      # scroll:
      tipOffsetTop = entries[@_suggestionBox.currentSelection].offsetTop
      if tipOffsetTop + entries[@_suggestionBox.currentSelection].clientHeight >= @_suggestionBox.scrollTop + @_suggestionBox.clientHeight
        @_suggestionBox.scrollTop = tipOffsetTop - @_suggestionBox.clientHeight + entries[@_suggestionBox.currentSelection].clientHeight
      else @_suggestionBox.scrollTop = tipOffsetTop  if tipOffsetTop <= @_suggestionBox.scrollTop
      @_onSelection entries[@_suggestionBox.currentSelection]._text
    else
      @_onSelection @_lastUserInput

  _moveUp: ->
    # permit selection to decrement down to -1 (none selected)
    if @_isVisible() and @_suggestionBox.currentSelection >= 0
      --@_suggestionBox.currentSelection
      @_onSelectedUpdate()

  _moveDown: ->
    if @_isVisible()
      @_suggestionBox.currentSelection = (@_suggestionBox.currentSelection + 1) % @_suggestionCount()
      @_onSelectedUpdate()

  _suggestionCount: ->
    (if @_suggestionBox.hasChildNodes() then @_suggestionBox.childNodes.length else 0)

  _onInput: ->
    if @_isShowingError
      # show glass icon
      @_changeIcon "glass"
      L.DomUtil.addClass @_message, "displayNone" # hide @_message
      @_isShowingError = false

  _clearUserSearchInput: ->
    if @options.clearValue then @_searchInput.value = ""
    @_hideAutocomplete()

  _onChange: ->
    if @options.enableAutocomplete
      input = @_container.querySelector("input")
      qry = input.value
      @_recordLastUserInput qry
      if qry.length >= @options.autocompleteMinQueryLen
        @_changeIcon "spinner"
        @_geosearchAutocomplete qry, @options.autocompleteQueryDelay_ms
      else
        @_changeIcon "glass"
        @_hideAutocomplete()

  _onKeyPress: (e) ->
    enterKey = 13
    if e.keyCode is enterKey
      L.DomEvent.preventDefault e
      @_startSearch()

  _onKeyUp: (e) ->
    upArrow = 38
    downArrow = 40
    escapeKey = 27
    switch e.keyCode
      when upArrow
        @_moveUp() if @options.enableAutocomplete and @_isVisible()
      when downArrow
        @_moveDown() if @options.enableAutocomplete and @_isVisible()
      when escapeKey
        input = @_container.querySelector("input")
        if @_isVisible()
          @_hideAutocomplete()
        else
          form = @_container.querySelector("form")
          L.DomUtil.addClass form, "displayNone" unless L.DomUtil.hasClass(form, "displayNone") # hide form
          @_onInput()
          @_hide()
      else
        @_onChange()
