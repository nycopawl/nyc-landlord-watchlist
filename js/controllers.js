'use strict';

/* Controllers */

angular.module('map.controllers', [])
  
  .controller('landlords', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state, $rootScope) {
    $http.get('json/landlords.json').success(function(data) {
      $scope.landlords = data;
      console.log($scope.landlords);
      $scope.$broadcast("landlordsLoaded", {});
    });

    $scope.goLandlord = function(landlordId) {
      $state.go('landlords.landlord', {landlordId: landlordId});
    }

    $scope.search = function() {
      $('.leaflet-control-mapbox-geocoder').addClass('active');
      $('.leaflet-control-mapbox-geocoder input').focus();
    }

    $scope.locate = function() {
      $('.leaflet-control-locate').trigger('click');
    }

    $rootScope.class = 'page-landlords';
  }])



  .controller('landlord', ['$scope', '$http', '$stateParams', '$rootScope', 'filterFilter', function($scope, $http, $stateParams, $rootScope, filterFilter) {
    $http.get('json/landlords/landlord-'+ $stateParams.landlordId +'.json').success(function(data) {
      $scope.buildings = data;
      $scope.landlord = filterFilter($scope.landlords, {LandlordId: $stateParams.landlordId})[0];
    });

    $rootScope.class = 'page-landlord';
  }])
  


  .controller('buildings', ['$scope', '$http', '$stateParams', '$rootScope', '$compile', '$timeout', 'filterFilter', function($scope, $http, $stateParams, $rootScope, $compile, $timeout, filterFilter) {
    $scope.borough = config.boroughs[$stateParams.boroughId];
    $scope.borough.id = $stateParams.boroughId;

    $http.get('json/buildings-'+ $stateParams.boroughId +'.json').success(function(data) {
      $scope.buildings = data;
    });
    

    // ng-click callbacks
    $scope.selectTab = function(tab) {
      $scope.activeTab = tab;
    }

    $scope.mouseoverBuilding = function(id) {
      console.log(id);
      $scope.hoverBuilding = $scope.getBuilding(id);
      $timeout(function (){
        var template = angular.element('#popup-building-teaser').html();
        var popup = L.popup()
          .setLatLng(new L.LatLng($scope.building.lat, $scope.building.lng))
          .setContent(template)
          .openOn(window.map);
      });
    }

    $scope.mouseoutBuilding = function(id) {
      if ($scope.hoverBuilding!= undefined) {
        window.map.closePopup();
        $scope.hoverBuilding = undefined;
      }
    }

    $scope.clickBuilding = function(id) {
      $scope.building = $scope.getBuilding(id);
      $timeout(function (){
        var template = angular.element('#popup-building-teaser').html();
        var popup = L.popup()
          .setLatLng(new L.LatLng($scope.building.lat, $scope.building.lng))
          .setContent(template)
          .openOn(window.map);
      });
    }
    
    $scope.getBuilding = function(id) {
      return filterFilter($scope.buildings, {id: id})[0];
    }

  }])



  .controller('building', ['$scope', '$http', '$stateParams', '$rootScope', 'filterFilter', function($scope, $http, $stateParams, $rootScope, filterFilter) {
    $http.get('json/buildings/building-'+ $stateParams.buildingId +'.json').success(function(data) {
      $scope.building = data;
      console.log(data);
    });

    $rootScope.class = 'page-building right-enabled';
  }])
