<<<<<<< HEAD
/**
 * Created by ttnd on 2/9/15.
 */
=======
'use strict';
(function (angular, buildfire) {
  angular
    .module('contactUsPluginDesign', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'DesignHome',
          controller: 'DesignHomeCtrl'
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
    }]);
})(window.angular, window.buildfire);
>>>>>>> 721c3ae3d81bb45e91f0b98c9f7b98da5c5a0a0d
