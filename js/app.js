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
        url: "/buildings",
        templateUrl: "partials/buildings-empty.html",
        //controller: 'buildings'
    })
      .state('buildings.borough', {
          url: "/:boroughId",
          templateUrl: "partials/buildings.html",
          controller: 'buildings'
      })
        .state('buildings.borough.building', {
            abstract: true,
            url: "/:buildingId",
            templateUrl: "partials/building.html",
            controller: 'building'
        })
          .state('buildings.borough.building.history', {
              url: "/history",
              templateUrl: "partials/building-history.html",
              controller: 'buildingHistory'
          })

}]);

