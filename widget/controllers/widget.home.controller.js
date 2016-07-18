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

        //Refresh data on pulling the tile bar

        buildfire.datastore.onRefresh(function () {
          init(function (err) {
            if (!err) {
              if (!WidgetHome.view) {
                WidgetHome.view = new Buildfire.components.carousel.view("#carousel", []);
              }
              if (WidgetHome.data.content && WidgetHome.data.content.carouselImages) {
                WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages);
              } else {
                WidgetHome.view.loadItems([]);
              }
            }
          });
        });

        var _dummyData = {
          content: {
            showMap: true,
            carouselImages: [{
              action: "noAction",
              iconUrl: "http://buildfire.imgix.net/1462345835888-04866688400506973/6ac49110-11c7-11e6-92ea-27ed66023d52.jpeg?fit=crop&w=342&h=193",
              title: "image"
            },
              {
                action: "noAction",
                iconUrl: "http://buildfire.imgix.net/1462345835888-04866688400506973/6bf3c240-11c7-11e6-ad08-375cc71b6ca7.jpg?fit=crop&w=342&h=193",
                title: "image"
              }],
            description: "<p>With the wysiwyg, you can include text and lists, embed images, embed videos, and link to webpages, emails, phone numbers and more. Check out the tutorial on the wysiwyg for detailed information.</p>",
            addressTitle: "",
            address: {
              type: "Location",
              location: "501 Pacific Hwy, San Diego, CA 92101, USA",
              location_coordinates: [-117.17096400000003, 32.7100444]
            },
            links: [{
              "title": "Call",
              "action": "callNumber",
              "phoneNumber": "6195551234"
            }, {"title": "Email", "action": "sendEmail"}]
          },
          design: {
            listLayout: "Layout_1",
            backgroundImage: ""
          }
        };

        /*declare the device width heights*/
        $rootScope.deviceHeight = window.innerHeight;
        $rootScope.deviceWidth = window.innerWidth || 320;
        $rootScope.backgroundImage = "";
        WidgetHome.device = null;
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
        var init = function (cb) {
          var success = function (result) {
              if (!result.id) {
                console.log('NO DATA AVAILABLE');
                WidgetHome.data = _dummyData;
              } else {
                WidgetHome.data = result.data;
              }
              if (!WidgetHome.data.design) {
                WidgetHome.data.design = {};
              }
              if (!WidgetHome.data.design.listLayout) {
                WidgetHome.data.design.listLayout = LAYOUTS.listLayouts[0].name;
              }
              currentListLayout = WidgetHome.data.design.listLayout;
              if (WidgetHome.data.design.backgroundImage) {
                $rootScope.backgroundImage = WidgetHome.data.design.backgroundImage;
              }
              else {
                $rootScope.backgroundImage = "";
              }
              var getDevice = function (error, data) {
                if (data)
                  WidgetHome.device = data.device;
                else
                  console.log("Error while getting the device context data", error)
              };
              buildfire.getContext(getDevice);
              cb();

            }
            , error = function (err) {
              console.error('Error while getting data', err);
              cb(err);
            };
          DataStore.get(TAG_NAMES.CONTACT_INFO).then(success, error);
        };
        init(function(){});
        $scope.$on('$viewContentLoaded', function () {
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
            if (WidgetHome.data.design.backgroundImage) {
              $rootScope.backgroundImage = WidgetHome.data.design.backgroundImage;
            } else {
              $rootScope.backgroundImage = "";
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
            $rootScope.$digest();
          }, 0);
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
        WidgetHome.safeHtml = function (html) {
          if (html) {
            var $html = $('<div />', {html: html});
            $html.find('iframe').each(function (index, element) {
              var src = element.src;
              console.log('element is: ', src, src.indexOf('http'));
              src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
              element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
            });
            return $sce.trustAsHtml($html.html());
          }
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
          if (WidgetHome.device && WidgetHome.device.platform == 'ios')
            buildfire.navigation.openWindow("maps://maps.google.com/maps?daddr=" + lat + "," + long, '_system');
          else
            buildfire.navigation.openWindow("http://maps.google.com/maps?daddr=" + lat + "," + long, '_system');
        };

        WidgetHome.executeOperation = function(item){
          buildfire.actionItems.execute(item, function (err, result) {
            if (err) {
              console.warn('Error opening slider action: ', err);
            }
          });
        }

      }])
})(window.angular, window.buildfire);
