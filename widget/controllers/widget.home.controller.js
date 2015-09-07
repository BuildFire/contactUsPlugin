'use strict';

(function (angular) {
  angular.module('contactUsPluginWidget')
    .controller('WidgetHomeCtrl', ['$routeParams', 'Buildfire', 'DataStore', '$scope', 'TAG_NAMES', 'Location', 'LAYOUTS', '$rootScope',
      function ($routeParams, Buildfire, DataStore, $scope, TAG_NAMES, Location, LAYOUTS, $rootScope) {
        var WidgetHome = this;
        var currentListLayout = null;
        WidgetHome.data = null;
        //create new instance of buildfire carousel viewer
        var view = null;

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
          if (!view) {
            view = new buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetHome.data.content && WidgetHome.data.content.carouselImages) {
            view.loadItems(WidgetHome.data.content.carouselImages);
          } else {
            view.loadItems([]);
          }
        });

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.CONTACT_INFO) {
            WidgetHome.data = event.data;
            if (!WidgetHome.data.design)
              WidgetHome.data.design = {};
          }
          if (currentListLayout != WidgetHome.data.design.listLayout && view && WidgetHome.data.content.carouselImages) {
            view._destroySlider();
            view = null;
          }
          else {
            if (view) {
              view.loadItems(WidgetHome.data.content.carouselImages);
            }
          }
          currentListLayout = WidgetHome.data.design.listLayout;
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

      }])
})(window.angular);
