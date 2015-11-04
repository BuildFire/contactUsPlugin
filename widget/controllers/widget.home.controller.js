'use strict';

(function (angular, buildfire) {
  angular.module('contactUsPluginWidget')
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
        };

        WidgetHome.onAddressClick = function (long, lat) {
          if (buildfire.context.device && buildfire.context.device.platform == 'ios')
            window.open("maps://maps.google.com/maps?daddr=" + lat + "," + long);
          else
            window.open("http://maps.google.com/maps?daddr=" + lat + "," + long);
        }

      }])
})(window.angular, window.buildfire);
