'use strict';

/* Directives */


angular.module('map.directives', [])
  .directive('mapDiv', [function() {

    return {
      restrict: 'A',
      template: '<div id="map"></div>',
      link: function(scope, elm, attrs) {

        $('#map').css('height',($(window).height() - config.navbarHeight) +'px');
    
        L.mapbox.accessToken = 'pk.eyJ1IjoiYWxiYXRyb3NzZGlnaXRhbCIsImEiOiI1cVUxbUxVIn0.SqKOVeohLfY0vfShalVDUw';
        var map = L.mapbox.map('map', 'albatrossdigital.map-yaq188c8')
          .setView(config.boroughs.all, 10);
        //L.control.fullscreen().addTo(map);
        window.locate = L.control.locate().addTo(map);
        window.geocoder = L.mapbox.geocoderControl('mapbox.places-address-v1');
        //http://maps.googleapis.com/maps/api/geocode/json?address={query}
        //geocoder.setID('map');
        map.addControl(geocoder);
        var geocoded = function(e) {
          document.location.hash = '/buildings';
        }
        geocoder.on('select', geocoded);
        geocoder.on('autoselect', geocoded);

        // The visible tile layer
        L.mapbox.tileLayer('http://maps.albatrossdigital.com:8888/v2/watchlist2014.json').addTo(map);

        // Load interactivity data into the map with a gridLayer
        var gridLayer = L.mapbox.gridLayer('http://maps2.albatrossdigital.com:8888/v2/watchlist2014_7179e9.json');
        gridLayer.addTo(map);

        // And use that interactivity to drive a control the user can see.
        var gridControl = L.mapbox.gridControl(gridLayer, {
          follow: true
        }).addTo(map);

        gridLayer.on('click', function(e) {
          console.log(e);
            if (e.data != undefined && e.data) {
              if (window.map.getZoom() < 14 && window.map.getZoom() > 1) {
                window.map.setView(e.latLng, 14, {animate: true});
              }
              else {
                window.map.panTo(e.latLng, {animate: true});
              }
            }
        });

        window.markerGroup = L.layerGroup().addTo(map);

        window.map = map;
        window.gridLayer = gridLayer;

      }
    };
  }])
  .directive('landlordCarousel', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {       
        scope.$watch(attrs.landlordsLoaded, function() {
          $timeout(function () {
            $('.rs-carousel').carousel({
              touch: true,
              pagination: false,
            });
            $('.landlords .rs-carousel-mask').css({
              'width': $(window).width() - 100 + 'px',
              'margin-left': '50px'
            });
          }, 200, false);
        });
      }
    };
  }])
  .directive('leftSidebar', [function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) { 
        $('.left').css('height',($(window).height() - config.navbarHeight) +'px');
      }
    };
  }])
  
  // @todo: doesnt work
  /*.directive('change', [function() {
    return {
      restrict: 'C',
      template: '<div class="change arrow {{color}}">{{num}}</div>',
      link: function(scope, elm, attrs) { 
        console.log(scope);
        scope.color = 'red';
      }
    };
  }])
  // @todo: doesnt work
  /*
  .directive("streetview", function() {
    var linkFunction = function(scope, element, attributes) {
      scope.src = scope.filename != undefined && scope.filename != '' ? scope.filename : 'http://maps.googleapis.com/maps/api/streetview?size='+ scope.width +'x'+ scope.height +'&location='+ scope.address +'&sensor=false';
      scope.title = "Google StreetView Image @copy Google";
      console.log(scope);
    };
    return {
      restrict: "C",
      template: '<div>jhkjhkjhkjhkjhkjhkjhkjhkjhkjhkjhkjhkjhkj<img src="{{src}}" width="{{width}}" width="{{width}}" alt="{{title}}" title="{{title}}" /></div>',
      link: linkFunction,
      scope: {
        width: "@width",
        height: "@height",
        street:'=street'
      }
    };
  });
  */
  /*.directive('chartClass', [function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) { 
        var values= [{"age":"One","population":5},{"age":"Two","population":2},{"age":"Three","population":9},{"age":"Four","population":7},{"age":"Five","population":4},{"age":"Six","population":3},{"age":"Seven","population":9}];
    console.log('values from directive: ', values); 
            
      }
    };
  }])*/
