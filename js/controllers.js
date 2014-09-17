'use strict';

/* Controllers */

angular.module('map.controllers', [])
  .controller('landlords', ['$scope', '$http', function($scope, $http) {
    $http.get('json/landlords.json').success(function(data) {
      $scope.landlords = data;
      $scope.$broadcast("landlordsLoaded", {});
    });


    console.log($scope);

  }])
  .controller('buildings', ['$scope', '$http', '$routeParams', '$rootScope', '$compile', '$timeout', 'filterFilter', function($scope, $http, $routeParams, $rootScope, $compile, $timeout, filterFilter) {
    var borough = config.boroughs[$routeParams.borough];
    borough.id = $routeParams.borough;

    if (borough != undefined) {
      $http.get('json/'+ $routeParams.borough +'.json').success(function(data) {
        $scope.buildings = data;

      });

      // Open up the building sidebar
      if ($routeParams.building != undefined) {
        $rootScope.class = 'move-left';
        //$('body').addClass('move-left');
        
        $http.get('json/building-example.json').success(function(data) {
          $scope.building = data;
          //$scope.building.active = true;

          /*$scope.charts = {};
          $scope.charts.typeConfig = {
            "labels": false,
            "title": "2014 Violation Breakdown",
            "legend": {
              "display": true,
              "position": "bottom"
            },
            "colors": ['#ddd', '#aaa', '#bbb', '#ccc'],
            "innerRadius": 0,
            "lineLegend": "lineEnd"
          };
          $scope.charts.typeData = {
            data: [
              {"x": "A violations", "y": [$scope.building.a]},
              {"x": "B violations", "y": [$scope.building.b]},
              {"x": "C violations", "y": [$scope.building.c]},
              {"x": "I violations", "y": [$scope.building.i]},
            ]
          };
          
          $scope.charts.yearConfig = {
            "labels": false,
            "title": "Total Violation By Year",
            "legend": {
              "display": false,
            },
            "colors": ['#fff', '#aaa', '#bbb', '#ccc'],
            "lineLegend": "lineEnd"
          };*/
          $scope.charts.yearData1 = {
            data: [
              {"x": "2013 ", "y": [parseFloat($scope.building.num_2013)]},
              {"x": "2014 ", "y": [parseFloat($scope.building.num)]}
            ]
          }

          //console.log($scope.yearData1);

          $scope.activeTab = 'charts';
          if (window.map != undefined) {
            window.map.setView(new L.LatLng($scope.building.lat, $scope.building.lng), 16, {animate: true});
          }
        });
      }
      else {
        $rootScope.class = '';
        if (window.map != undefined) {
          window.map.setView(borough, borough.zoom, {animate: true});
        }
      }
    
      $scope.borough = borough;
    }

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
  .controller('OffCanvasDemoCtrl', ['$scope', function($scope) {

    console.log($scope);

  }]);
