var WidgetsApp = angular.module('widgetsapp',['ngRoute','widgetappmod','widgetsermod','mapModule']);


WidgetsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider

   /*     .when('/try', {
        templateUrl: 'try.html',
        controller : ''
    })   */

        .when('/layout1', {
            templateUrl: 'templates/layout1.html',
            controller : 'layout1Ctrl',
            cache :false,
            directive :'mapdirective'
        })

        .when('/layout2', {
            templateUrl: 'templates/layout2.html',
            controller : 'layout2ctrl',
            cache :false,
            directive :'mapdirective'
        })

        .otherwise({redirectTo: '/layout1'});
}]);

