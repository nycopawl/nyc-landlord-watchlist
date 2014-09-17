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
        L.control.locate().addTo(map);
        var geocoder = L.mapbox.geocoderControl('mapbox.places-address-v1');
        //http://maps.googleapis.com/maps/api/geocode/json?address={query}
        //geocoder.setID('map');
        map.addControl(geocoder);

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
              if (window.map.getZoom() < 14 && window.map.getZoom() > 11) {
                window.map.setView(e.latLng, 14, {animate: true});
              }
              else {
                window.map.panTo(e.latLng, {animate: true});
              }
            }
        });

        console.log(window.gridLayer);


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
  /*.directive('chartClass', [function() {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) { 
        var values= [{"age":"One","population":5},{"age":"Two","population":2},{"age":"Three","population":9},{"age":"Four","population":7},{"age":"Five","population":4},{"age":"Six","population":3},{"age":"Seven","population":9}];
    console.log('values from directive: ', values); 
            
      }
    };
  }])*/

