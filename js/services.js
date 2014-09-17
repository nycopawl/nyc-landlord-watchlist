'use strict';

/* Services */

angular.module('map.services', ['ngResource'])
  .factory('Building', ['$resource',
    function($resource){
      return $resource('json/:borough.json', {}, {
        query: {method:'GET', params:{borough:'all'}, isArray:true}
      });  
    }
  ]);