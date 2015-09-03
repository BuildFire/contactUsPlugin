'use strict';

(function (angular, window) {
  angular
    .module('contactUsPluginDesign')
    .controller('DesignHomeCtrl', ['$scope','Buildfire','LAYOUTS','DataStore','TAG_NAMES','STATUS_CODE',
      function ($scope, Buildfire, LAYOUTS,DataStore,TAG_NAMES,STATUS_CODE) {
        var _data = {
          "content": {
            "carouselImages": [],
            "description": '<p>&nbsp;<br></p>',
            "addressTitle": "",
            "address": {},
            "links" : []
          },
          "design": {
            "listLayout": LAYOUTS.listLayouts[0].name,
            "itemBgImage": ""
          }
        };
        var DesignHome = this;
        DesignHome.masterData = null;
        DesignHome.data = angular.copy(_data);

        updateMasterItem(_data);

        function updateMasterItem(data) {
          DesignHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, DesignHome.masterData);
        }

        /*
         * Go pull any previously saved data
         * */
        var init = function () {
          var success = function (result) {
              console.info('init success result:', result);
              DesignHome.data = result.data;
              updateMasterItem(DesignHome.data);
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
                if (tmrDelay)clearTimeout(tmrDelay);
              }
              else if (err && err.code === STATUS_CODE.NOT_FOUND) {
                saveData(JSON.parse(angular.toJson(DesignHome.data)), TAG_NAMES.CONTACT_INFO);
              }
            };
          DataStore.get(TAG_NAMES.CONTACT_INFO).then(success, error);
        };
        init();

        /*
         * Call the datastore to save the data object
         */
        var saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          var success = function (result) {
              console.info('Saved data result: ', result);
              updateMasterItem(newObj);
            }
            , error = function (err) {
              console.error('Error while saving data : ', err);
            };
          DataStore.save(newObj, tag).then(success, error);
        };

        /*
         * create an artificial delay so api isnt called on every character entered
         * */
        var tmrDelay = null;
        var saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (isUnchanged(newObj)) {
              return;
            }
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.CONTACT_INFO);
            }, 500);
          }
        };
        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return DesignHome.data;
        }, saveDataWithDelay, true);

      }]);
})(window.angular, window);