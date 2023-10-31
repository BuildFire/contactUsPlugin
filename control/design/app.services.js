'use strict';

(function (angular, buildfire) {
  angular.module('contactUsPluginDesign')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        save: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        }
      }
    }])
    .factory('DefaultInfo', ['LAYOUTS', function(LAYOUTS) {
      return {
        content: {
          carouselImages: [],
          description: '<p>&nbsp;<br></p>',
          addressTitle: '',
          address: {
            type:'',
            location:'',
            location_coordinates: [],
          },
          links: [],
          showMap: false
        },
        design: {
          listLayout: LAYOUTS.listLayouts[0].name,
          backgroundImage: ''
        }
      }
    }])
})(window.angular, window.buildfire);