'use strict';

(function (angular, window) {
  angular
    .module('contactUsPluginDesign')
    .controller('DesignHomeCtrl', ['$scope','Buildfire','LAYOUTS','DataStore','TAG_NAMES',
      function ($scope, Buildfire, LAYOUTS,DataStore,TAG_NAMES) {
        var DesignHome = this;
        var DesignHomeMaster;
        DesignHome.layouts = {
          listLayouts: [
            {name: "Layout_1"},
            {name: "Layout_2"}
          ]
        };
        /*On layout click event*/
        DesignHome.changeItemLayout = function (layoutName) {
          if (layoutName && DesignHome.data.design) {
            DesignHome.data.design.listLayout = layoutName;

            saveData(function (err, data) {
                  if (err) {
                    return DesignHome.data = angular.copy(DesignHomeMaster);
                  }
                  else if (data && data.obj) {
                    return DesignHomeMaster = data.obj;

                  }
                  $scope.$digest();
                }
            )
          }
        };

        /*save method*/
        function saveData(callback) {
          callback = callback || function () {
              };
          Buildfire.datastore.save(DesignHome.data, TAG_NAMES.CONTACT_INFO, callback);
        }

        /* background image add <start>*/
        var background = new Buildfire.components.images.thumbnail("#background");
        background.onChange = function (url) {
          DesignHome.data.design.backgroundImage = url;
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        background.onDelete = function (url) {
          DesignHome.data.design.backgroundImage = "";
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        function init() {
          var _data = {
            design: {
              listLayout: "",
              backgroundImage: ""
            },
            content: {
              images: [],
              description: ""
            }
          };

          /* background image add </end>*/
          Buildfire.datastore.get(TAG_NAMES.CONTACT_INFO, function (err, data) {
            if (err) {
              Console.log('------------Error in Design of People Plugin------------', err);
            }
            else if (data && data.data) {
              DesignHome.data = angular.copy(data.data);
              if (!DesignHome.data.design)
                DesignHome.data.design = {};
              if (!DesignHome.data.design.listLayout)
                DesignHome.data.design.listLayout = DesignHome.layouts.listLayouts[0].name;
              DesignHomeMaster = angular.copy(data.data);
              if (DesignHome.data.design.backgroundImage) {
                background.loadbackground(DesignHome.data.design.backgroundImage);
              }
              $scope.$digest();
            }
            else {
              DesignHome.data = angular.copy(_data);
              console.info('------------------unable to load data---------------');
            }
          });
        }

        /*Initialize Method Call*/
        init();

        /*watch the change event and update in database*/
        $scope.$watch(function () {
          return DesignHome.data;
        }, function (newObj, oldObj) {
          //console.log("Updated Object:",newObj);
          if (newObj!= oldObj&& oldObj){
            console.log("Updated Object:",newObj);
            Buildfire.datastore.save(DesignHome.data, TAG_NAMES.CONTACT_INFO, function (err, data) {
              if (err) {
                return DesignHome.data = angular.copy(DesignHomeMaster);
              }
              else if (data && data.obj) {
                return DesignHomeMaster = data.obj;

              }
              $scope.$digest();
            });
          }
        }, true);

      }]);
})(window.angular);
