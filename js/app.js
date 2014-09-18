'use strict';

var config = {
  navbarHeight: 45,
  boroughs: {
    'all': {label: 'All', lat: 40.74829735476797, lng: -73.80134582519531, zoom: 11},
    'manhattan': {label: 'Manhattan', lat: 40.76806170936614, lng: -73.94536972045898, zoom: 12},
    'brooklyn': {label: 'Brooklyn', lat: 40.676732504671655, lng: -73.89867782592773, zoom: 12},
    'queens': {label: 'Queens', lat: 40.69755930345006, lng: -73.7647819519043, zoom: 12},
    'bronx': {label: 'The Bronx', lat: 40.84615136735404, lng: -73.86305809020996, zoom: 13},
    'staten-island': {label: 'Staten Island', lat: 40.6101733341382, lng: -74.07196998596191, zoom: 13},
  }
}


// Declare app level module which depends on filters, and services
angular.module('map', [
  'map.filters',
  'map.services',
  'map.directives',
  'map.controllers',
  'ngSanitize',
  'ui.router',
  'angularCharts'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  

  // For any unmatched url, send to /route1
  $urlRouterProvider.otherwise("/landlords")
  
  $stateProvider
    .state('landlords', {
        //abstract: true,
        url: "/landlords",
        templateUrl: "partials/landlords.html",
        controller: 'landlords'
    })
      .state('landlords.landlord', {
          url: "/:landlordId",
          templateUrl: "partials/landlord.html",
          controller: 'landlord'
      })
        .state('landlords.landlord.building', {
          url: "/:buildingId",
          templateUrl: "partials/building.html",
          controller: 'building'
        })

    .state('buildings', {
        url: "/buildings/:boroughId",
        templateUrl: "partials/buildings.html",
        controller: 'buildings'
    })
      .state('buildings.building', {
          url: "/:buildingId",
          templateUrl: "partials/building.html",
          controller: 'building'
      })

  /*
  $routeSegmentProvider.options.autoLoadTemplates = true;

  $routeSegmentProvider
    
    .when('/landlords', 'landlords')
    .when('/landlords/:landlord', 'landlords.landlord')
    .when('/landlords/:landlord/:building', 'landlords.landlord.building')

    .when('/buildings', 'buildings')
    .when('/buildings/:borough', 'buildings.borough')
    .when('/buildings/:borough/:building', 'buildings.borough.building')


    .segment('landlords', {
      default: true,
      templateUrl: 'partials/landlords.html',
      controller: 'landlords'
    })

    .within()
          
      .segment('landlord', {
        default: true,
        templateUrl: 'partials/landlord.html',
        controller: 'landlord'
      })

      .within()
          
        .segment('building', {
          default: true,
          templateUrl: 'partials/building.html',
          controller: 'building'
        })

      .up()

    .up()


    .segment('buildings', {
      templateUrl: 'partials/buildings.html',
      controller: 'buildings'
    })

    .within()
          
      .segment('borough', {
        default: true,
        templateUrl: 'partials/buildings.html',
        controller: 'buildings'
      })

      .within()
          
        .segment('building', {
          default: true,
          templateUrl: 'partials/building.html',
          controller: 'building'
        })

      .up()

    .up();


  $routeProvider.otherwise({redirectTo: '/landlords'}); 

  */
}]);

