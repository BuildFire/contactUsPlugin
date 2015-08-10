var WidgetsApp = angular.module('widgetsapp',['ngRoute','widgetappmod','widgetsermod','mapModule']);


WidgetsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider

   /*     .when('/try', {
        templateUrl: 'try.html',
        controller : ''
    })   */

        .when('/layout1', {
        	 controller : 'layout1Ctrl',
        	templateUrl: 'templates/layout1.html',
           
            cache :false,
            directive :'mapdirective'
        })

        .when('/layout2', {
        	controller : 'layout2ctrl',
        	templateUrl: 'templates/layout2.html',
            cache :false,
            directive :'mapdirective'
        })

        .otherwise({redirectTo: '/layout1'});
}]);

