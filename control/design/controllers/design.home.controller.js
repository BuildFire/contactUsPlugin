'use strict';

(function (angular, window) {
  angular
    .module('contactUsPluginDesign')
    .controller('DesignHomeCtrl', ['$scope','Buildfire','LAYOUTS','DataStore','TAG_NAMES',
      function ($scope, Buildfire, LAYOUTS,DataStore,TAG_NAMES) {
        var DesignHome = this;
        var DesignHomeMaster;
        DesignHome.layouts = {
          listLayouts: [{
            name: "Layout_1"
          }, {
            name: "Layout_2"
          }]
        };
        /*On layout click event*/
        DesignHome.changeListLayout = function (layoutName) {
          if (layoutName && DesignHome.contactUsDesignData.design) {
            DesignHome.contactUsDesignData.design.listLayout = layoutName;

            saveData(function (err, data) {
                  if (err) {
                    return DesignHome.contactUsDesignData = angular.copy(DesignHomeMaster);
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
          Buildfire.datastore.save(DesignHome.contactUsDesignData, TAG_NAMES.CONTACT_INFO, callback);
        }

        /* background image add <start>*/
        var options = {showIcons: false, multiSelection: false};
        var callback = function (error, result) {
          if (error) {
            console.error('Error:', error);
          } else {
            DesignHome.contactUsDesignData.design.backgroundImage = result.selectedFiles && result.selectedFiles[0] || null;
            $scope.$digest();

          }
        };
        DesignHome.addBackgroundImage = function () {
          Buildfire.imageLib.showDialog(options, callback);
        };
        DesignHome.removeBackgroundImage = function () {
          DesignHome.contactUsDesignData.design.backgroundImage = null;
        };
        /* background image add </end>*/

        /*Initialize initial data and objects*/
        function init() {
          var contactUsDesignData = {
            design: {
              listLayout: "",
              itemLayout: "",
              backgroundImage: ""
            },
            content: {
              images: [],
              description: ""
            }
          };
          Buildfire.datastore.get(TAG_NAMES.CONTACT_INFO, function (err, data) {
            if (err) {
              Console.log('------------Error in Design of People Plugin------------', err);
            }
            else if (data && data.data) {
              DesignHome.contactUsDesignData = angular.copy(data.data);
              if (!DesignHome.contactUsDesignData.design)
                DesignHome.contactUsDesignData.design = {};
              if (!DesignHome.contactUsDesignData.design.listLayout)
                DesignHome.contactUsDesignData.design.listLayout = DesignHome.layouts.listLayouts[0].name;
              DesignHomeMaster = angular.copy(data.data);
              $scope.$digest();
            }
            else {
              DesignHome.contactUsDesignData = contactUsDesignData;
              console.info('------------------unable to load data---------------');
            }
          });
        }

        /*Initialize Method Call*/
        init();

        /*watch the change event and update in database*/
        $scope.$watch(function () {
          return DesignHome.contactUsDesignData;
        }, function (newObj) {
          console.log("Updated Object:",newObj)
          if (newObj)
            Buildfire.datastore.save(DesignHome.contactUsDesignData, TAG_NAMES.CONTACT_INFO, function (err, data) {
              if (err) {
                return DesignHome.contactUsDesignData = angular.copy(DesignHomeMaster);
              }
              else if (data && data.obj) {
                return DesignHomeMaster = data.obj;

              }
              $scope.$digest();
            });
        }, true);

      }]);
})(window.angular);
