'use strict';

(function (angular, buildfire) {
    angular.module('contactUsPluginWidget', ['ngRoute', 'ngTouch','utils'])
      .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

          /**
           * To make href urls safe on mobile
           */
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);
          $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html',
                controllerAs: 'WidgetHome',
                controller: 'WidgetHomeCtrl',
                resolve: {
                    ScriptLoaderService: function (ScriptLoaderService) {
                        return ScriptLoaderService.loadScript();
                    }
                }
            })
            .otherwise('/');
      }])
      /*  .filter('getImageUrl', ['Buildfire', function (Buildfire) {
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
        }])*/
      .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
          return {
              restrict: 'A',
              link: function (scope, elem, attrs) {
                  $rootScope.$broadcast("Carousel:LOADED");
              }
          };
      }])
      .directive("googleMap",  ['VersionCheckService', function (VersionCheckService) {
          return {
              template: "<div></div>",
              replace: true,
              scope: {coordinates: '='},
              link: function (scope, elem, attrs) {
                  scope.$watch('coordinates', function (newValue, oldValue) {
                      if (newValue){
                          scope.coordinates = newValue;
                          if (scope.coordinates.length) {
                              const options = {
                                  center: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                                  streetViewControl: false,
                                  mapTypeControl: false,
                                  zoom: 15,
                                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                                  mapId: buildfire.getContext().apiKeys.mapId || 'bfMainPageMap'
                              }

                              if (VersionCheckService.isCameraControlVersion()) {
                                  options.cameraControl = false;
                              } else {
                                  options.zoomControl = false;
                              }
                              var map = new google.maps.Map(elem[0], options);

                              var marker = new google.maps.marker.AdvancedMarkerElement
                              ({
                                  position: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                                  map: map
                              });

                              marker.addListener('click', function () {
                                  if (buildfire.getContext().device && buildfire.getContext().device.platform.toLowerCase() === 'ios')
                                      buildfire.navigation.openWindow("maps://maps.apple.com?q=" + scope.coordinates[1] + "," + scope.coordinates[0], '_system');
                                  else
                                      buildfire.navigation.openWindow("http://maps.google.com/maps?daddr=" + scope.coordinates[1] + "," + scope.coordinates[0], '_system');
                              });
                          }
                      }
                  }, true);
              }
          };
      }])
      /*   .directive("backgroundImage", ['$filter', function ($filter) {
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
         }])*/// Directive for adding  Image carousel on widget layout 2
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
      .service('ScriptLoaderService', ['$q', function ($q) {
          this.loadScript = function () {
              const { apiKeys } = buildfire.getContext();
              const { googleMapKey } = apiKeys;
              const url = `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=places,marker&key=${googleMapKey}`;
              const deferred = $q.defer();
              // Check if script is already loaded
              if (document.querySelector(`script[src="${url}"]`)) {
                  console.info('Google Maps script is already loaded.');
                  deferred.resolve();
                  return deferred.promise;
              }

              // If not loaded, create and load the script
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = url;

              script.onload = function () {
                  console.info(`Successfully loaded script: ${url}`);
                  deferred.resolve();
              };

              script.onerror = function () {
                  console.error(`Failed to load script: ${url}`);
                  deferred.reject('Failed to load script.');
              };

              window.gm_authFailure = () => {
                  buildfire.dialog.alert({
                      title: 'Error',
                      message: 'Failed to load Google Maps API.',
                  });
                  deferred.reject('Failed to load Google Maps API.');
              };

              document.head.appendChild(script);
              return deferred.promise;
          };
      }])

      .run([function () {
          buildfire.navigation.onBackButtonClick = function () {
              buildfire.navigation._goBackOne();
          };
      }]).filter('cropImage', [function () {
        return function (url, width, height, noDefault) {
            if(noDefault)
            {
                if(!url)
                    return '';
            }
            return buildfire.imageLib.cropImage(url, {
                width: width,
                height: height
            });
        };
    }]).directive('backImg', ["$rootScope", function ($rootScope) {
        return function (scope, element, attrs) {
            attrs.$observe('backImg', function (value) {
                var img = '';
                if (value) {
                    buildfire.imageLib.local.cropImage(value, {
                        width: $rootScope.deviceWidth,
                        height: $rootScope.deviceHeight
                    }, function (err, imgUrl) {
                        if (imgUrl) {
                            img = imgUrl;
                            element.attr("style", 'background:url(' + img + ') !important ; background-size: cover !important;');
                        } else {
                            img = '';
                            element.attr("style", 'background-color:white');
                        }
                        element.css({
                            'background-size': 'cover !important'
                        });
                    });
                    // img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
                }
                else {
                    img = "";
                    element.attr("style", 'background-color:white');
                    element.css({
                        'background-size': 'cover !important'
                    });
                }
            });
        };
    }]) .directive("loadImage", ['Buildfire', function (Buildfire) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

                var _img = attrs.finalSrc;
                if (attrs.cropType == 'resize') {
                    Buildfire.imageLib.local.resizeImage(_img, {
                        width: attrs.cropWidth,
                        height: attrs.cropHeight
                    }, function (err, imgUrl) {
                        _img = imgUrl;
                        replaceImg(_img);
                    });
                } else {
                    Buildfire.imageLib.local.cropImage(_img, {
                        width: attrs.cropWidth,
                        height: attrs.cropHeight
                    }, function (err, imgUrl) {
                        _img = imgUrl;
                        replaceImg(_img);
                    });
                }

                function replaceImg(finalSrc) {
                    var elem = $("<img>");
                    elem[0].onload = function () {
                        element.attr("src", finalSrc);
                        elem.remove();
                    };
                    elem.attr("src", finalSrc);
                }
            }
        };
    }]);

})(window.angular, window.buildfire);
