'use strict';

(function (angular) {
  angular.module('contactUsPluginContent', ['ngRoute', 'ui.tinymce', 'ui.bootstrap', 'ui.sortable'])
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
            if(autocomplete.getPlace().geometry){
              var coordinates = [autocomplete.getPlace().geometry.location.lng(), autocomplete.getPlace().geometry.location.lat()];
              scope.setLocationInController({data:{location:location, coordinates:coordinates}});
            }
          });
        }
      };
    })
    .directive('ngEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if(event.which === 13) {
            scope.$apply(function (){
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
        });
      };
    });
})(window.angular);