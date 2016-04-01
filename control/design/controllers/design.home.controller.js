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

        //init dummy data
        var _dummyData= {
          content: {
            showMap:true,
            carouselImages: [{
              action: "noAction",
              iconUrl: "http://fortunednagroup.com/wp-content/uploads/employee1.jpg",
              title: "image"
            },
              {
                action: "noAction",
                iconUrl: "http://smslaw.com.au/wp-content/uploads/2014/07/employee.jpg",
                title: "image"
              },
              {
                action: "noAction",
                iconUrl: "http://cdn2.hubspot.net/hub/105358/file-486221503-png/images/winter-blues-how-to-keep-your-employees-motivated-and-productive.png?t=1458850411530",
                title: "image"
              }],
            description : "<p>World IT technology</p>",
            addressTitle:"London",
            address:{
              type:"Location",
              location:"London, UK",
              location_coordinates:[-0.12775829999998223, 51.5073509]
            },
            links:[]
          },
          design:{
            listLayout:"Layout_1",
            backgroundImage:"http://buildfire.imgix.net/b55ee984-a8e8-11e5-88d3-124798dea82d/d3a73620-f7f4-11e5-a9d8-55461c8fe352.jpg?w=88"
          }
        };

        DesignHomeMaster=_dummyData;


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
          var _data = _dummyData;

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
