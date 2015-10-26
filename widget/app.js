'use strict';

(function (angular, buildfire) {
  angular.module('contactUsPluginWidget', ['ngRoute'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


      $routeProvider
        .when('/', {
          templateUrl: 'home.html',
          controllerAs: 'WidgetHome',
          controller: 'WidgetHomeCtrl'
        })
        .otherwise('/');
    }])
    .controller('WidgetHomeCtrl', ['$routeParams', 'Buildfire', 'DataStore', '$scope', 'TAG_NAMES', 'Location', 'LAYOUTS', '$rootScope', '$sce',
      function ($routeParams, Buildfire, DataStore, $scope, TAG_NAMES, Location, LAYOUTS, $rootScope, $sce) {
        var WidgetHome = this;
        var currentListLayout = null;
        WidgetHome.data = {};
        //create new instance of buildfire carousel viewer
        WidgetHome.view = null;
        /*declare the device width heights*/
        WidgetHome.deviceHeight = window.innerHeight;
        WidgetHome.deviceWidth = window.innerWidth;

        /*initialize the device width heights*/
        function initDeviceSize(callback) {
          WidgetHome.deviceHeight = window.innerHeight;
          WidgetHome.deviceWidth = window.innerWidth;
          if (callback) {
            if (WidgetHome.deviceWidth == 0 || WidgetHome.deviceHeight == 0) {
              setTimeout(function () {
                initDeviceSize(callback);
              }, 500);
            } else {
              callback();
              if (!$scope.$$phase && !$scope.$root.$$phase) {
                $scope.$apply();
              }
            }
          }
        }

        /*crop image on the basis of width heights*/
        WidgetHome.cropImage = function (url, settings) {
          var options = {};
          if (!url) {
            return "";
          }
          else {
            if (settings.height) {
              options.height = settings.height;
            }
            if (settings.width) {
              options.width = settings.width;
            }
            return Buildfire.imageLib.cropImage(url, options);
          }
        };

        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.design)
                WidgetHome.data.design = {};
              if (!WidgetHome.data.design.listLayout) {
                WidgetHome.data.design.listLayout = LAYOUTS.listLayouts[0].name;
              }
              currentListLayout = WidgetHome.data.design.listLayout;
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.CONTACT_INFO).then(success, error);
        };
        init();
        $rootScope.$on("Carousel:LOADED", function () {
          if (!WidgetHome.view) {
            WidgetHome.view = new Buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetHome.data.content && WidgetHome.data.content.carouselImages) {
            WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages);
          } else {
            WidgetHome.view.loadItems([]);
          }
        });

        var onUpdateCallback = function (event) {
          setTimeout(function () {
            $scope.imagesUpdated = false;
            $scope.$digest();
            if (event && event.tag === TAG_NAMES.CONTACT_INFO) {
              WidgetHome.data = event.data;
              if (!WidgetHome.data.design)
                WidgetHome.data.design = {};
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
            }
            if (!WidgetHome.data.design.listLayout) {
              WidgetHome.data.design.listLayout = LAYOUTS.listLayouts[0].name;
            }
            if (currentListLayout != WidgetHome.data.design.listLayout && WidgetHome.view && WidgetHome.data.content.carouselImages) {
              WidgetHome.view._destroySlider();
              WidgetHome.view = null;
            }
            else {
              if (WidgetHome.view) {
                WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages);
              }
            }
            currentListLayout = WidgetHome.data.design.listLayout;
            $scope.imagesUpdated = !!event.data.content;
            $scope.$digest();
          }, 0);
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
        WidgetHome.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetHome.openLinks = function (actionItems) {
          if (actionItems && actionItems.length) {
            var options = {};
            var callback = function (error, result) {
              if (error) {
                console.error('Error:', error);
              }
            };
            Buildfire.actionItems.list(actionItems, options, callback);
          }
        }

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
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
        }
      };
    }])
    .directive("googleMap", function () {
      return {
        template: "<div></div>",
        replace: true,
        scope: {coordinates: '='},
        link: function (scope, elem, attrs) {
          scope.$watch('coordinates', function (newValue, oldValue) {
            if (newValue) {
              scope.coordinates = newValue;
              if (scope.coordinates.length) {
                var map = new google.maps.Map(elem[0], {
                  center: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                  map: map
                });
                var styleOptions = {
                  name: "Report Error Hide Style"
                };
                var MAP_STYLE = [
                  {
                    stylers: [
                      {visibility: "on"}
                    ]
                  }];
                var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
                map.mapTypes.set("Report Error Hide Style", mapType);
                map.setMapTypeId("Report Error Hide Style");
                marker.addListener('click', function () {
                  if (buildfire.context.device && buildfire.context.device.platform == 'ios')
                    window.open("maps://maps.google.com/maps?daddr=" + scope.coordinates[1] + "," + scope.coordinates[0]);
                  else
                    window.open("http://maps.google.com/maps?daddr=" + scope.coordinates[1] + "," + scope.coordinates[0]);
                });

              }
            }
          }, true);
        }
      }
    })
    .directive("backgroundImage", ['$filter', function ($filter) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var getImageUrlFilter = $filter("getImageUrl");
          var setBackgroundImage = function (backgroundImage) {
            if (backgroundImage) {
              element.css(
                'background', '#010101 url('
                + getImageUrlFilter(backgroundImage, 342, 770, 'resize')
                + ') repeat fixed top center');
            } else {
              element.css('background', 'none');
            }
          };
          attrs.$observe('backgroundImage', function (newValue) {
            setBackgroundImage(newValue);
          });
        }
      };
    }])// Directive for adding  Image carousel on widget layout 2
    .directive('imageCarousel', function () {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          scope.carousel = null;
          scope.isCarouselInitiated = false;
          function initCarousel() {
            scope.carousel = null;
            setTimeout(function () {
              var obj = {
                'slideSpeed': 300,
                'dots': false,
                'autoplay': true,
                'margin': 10
              };

              var totalImages = parseInt(attrs.imageCarousel, 10);
              if (totalImages) {
                if (totalImages > 1) {
                  obj['loop'] = true;
                }
                scope.carousel = $(elem).owlCarousel(obj);
                scope.isCarouselInitiated = true;
              }
              scope.$apply();
            }, 100);
          }

          initCarousel();

          scope.$watch("imagesUpdated", function (newVal, oldVal) {
            if (newVal) {
              if (scope.isCarouselInitiated) {
                scope.carousel.trigger("destroy.owl.carousel");
                scope.isCarouselInitiated = false;
              }
              $(elem).find(".owl-stage-outer").remove();
              initCarousel();
            }
          });
        }
      }
    })
    .run([function () {
      buildfire.navigation.onBackButtonClick = function () {
        buildfire.navigation.navigateHome();
      };
    }]);
})(window.angular, window.buildfire);
