'use strict';

(function (angular) {
  angular.module('contactUsPluginContent', ['ngRoute', 'ui.tinymce', 'ui.bootstrap'])
    //injected ngRoute for routing
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'ContentHome',
          controller: 'ContentHomeCtrl'
        })
        .otherwise('/');
    }])
    .filter('getImageUrl', ['Buildfire', function (Buildfire) {
      return function (url, width, height, type) {
        if (type == 'resize')
          return Buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        else
          return Buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
      }
    }])
    .directive('googleLocationSearch', function () {
      return {
        restrict: 'A',
        scope: { setLocationInController: '&callbackFn' },
        link: function (scope, element, attributes) {
          var options = {
            types: ['geocode']
          };
          var autocomplete = new google.maps.places.Autocomplete(element[0], options);
          google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var location = autocomplete.getPlace().formatted_address;
            var coordinates = [autocomplete.getPlace().geometry.location.lng(), autocomplete.getPlace().geometry.location.lat()];
            scope.setLocationInController({data:{location:location, coordinates:coordinates}});
          });
        }
      };
    })
})(window.angular);