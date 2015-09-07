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
    .directive("googleMap", function() {
      return {
        template: "<div></div>",
        replace: true,
        link: function(scope, elem, attrs) {
          var map = new google.maps.Map(elem[0], {
            center : new google.maps.LatLng(28.541966, 77.340883),
            zoomControl : false,
            streetViewControl : false,
            mapTypeControl : false,
            zoom : 15,
            mapTypeId : google.maps.MapTypeId.ROADMAP
          });
        }
      }
    })
    .directive('ngEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if(event.which === 13) {
            var val = $(element).val(),
              regex = /^[0-9\-\., ]+$/g;
            if(regex.test(val)) {
              scope.$apply(function (){
                scope.$eval(attrs.ngEnter);
              });

              event.preventDefault();
            }
          }
        });
      };
    });
})(window.angular);