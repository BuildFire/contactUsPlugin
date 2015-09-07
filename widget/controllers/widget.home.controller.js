'use strict';

(function (angular) {
  angular.module('contactUsPluginWidget')
    .controller('WidgetHomeCtrl', ['$routeParams', 'Buildfire', 'DataStore','$scope', 'TAG_NAMES', 'Location', 'LAYOUTS', function ($routeParams,Buildfire, DataStore, $scope, TAG_NAMES, Location, LAYOUTS) {
        var WidgetHome = this;
        var DesignHomeMaster;
        function widgetInit() {
          WidgetHome.data = {};
          Buildfire.datastore.get(TAG_NAMES.CONTACT_INFO, function (err, data) {
            if (err) {
              Console.log('------------Error in Design of People Plugin------------', err);
            }

            else if (data && data.data) {
              console.log("Widget:",data)
              WidgetHome.contactUsDesignData = angular.copy(data.data);
              if (!WidgetHome.contactUsDesignData.design)
                WidgetHome.contactUsDesignData.design = {};
              if (!WidgetHome.contactUsDesignData.design.listLayout)
                WidgetHome.contactUsDesignData.design.listLayout = WidgetHome.layouts.listLayouts[0].name;
              DesignHomeMaster = angular.copy(data.data);

            }
            else {
              WidgetHome.contactUsDesignData = contactUsDesignData;
              console.info('------------------unable to load data---------------');
            }
          });
        }
        widgetInit();
        Buildfire.datastore.onUpdate(function (event) {
          widgetInit();
          $scope.$apply();
        });

    }])
})(window.angular);
