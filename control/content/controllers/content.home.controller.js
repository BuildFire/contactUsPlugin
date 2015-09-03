'use strict';

(function (angular) {
  angular
    .module('contactUsPluginContent')
    .controller('ContentHomeCtrl', ['$scope','Buildfire','LAYOUTS','DataStore','TAG_NAMES','STATUS_CODE','ADDRESS_TYPE',
      function ($scope, Buildfire, LAYOUTS,DataStore,TAG_NAMES,STATUS_CODE,ADDRESS_TYPE) {
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
        var ContentHome = this;
        ContentHome.masterData = null;
        ContentHome.data = angular.copy(_data);

        // create a new instance of the buildfire carousel editor
        var editor = new Buildfire.components.carousel.editor("#carousel");

        // this method will be called when a new item added to the list
        editor.onAddItems = function (items) {
          if(!ContentHome.data.content)
            ContentHome.data.content = {};
          if (!ContentHome.data.content.carouselImages)
            ContentHome.data.content.carouselImages = [];
          ContentHome.data.content.carouselImages.push.apply(ContentHome.data.content.carouselImages, items);
          $scope.$digest();
        };
        // this method will be called when an item deleted from the list
        editor.onDeleteItem = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1);
          $scope.$digest();
        };
        // this method will be called when you edit item details
        editor.onItemChange = function (item, index) {
          ContentHome.data.content.carouselImages.splice(index, 1, item);
          $scope.$digest();
        };
        // this method will be called when you change the order of items
        editor.onOrderChange = function (item, oldIndex, newIndex) {
          var temp = ContentHome.data.content.carouselImages[oldIndex];
          ContentHome.data.content.carouselImages[oldIndex] = ContentHome.data.content.carouselImages[newIndex];
          ContentHome.data.content.carouselImages[newIndex] = temp;
          $scope.$digest();
        };

        updateMasterItem(_data);

        ContentHome.bodyWYSIWYGOptions={
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          trusted: true,
          theme: 'modern'
        };

        function updateMasterItem(data) {
          ContentHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, ContentHome.masterData);
        }

        /*
         * Go pull any previously saved data
         * */
        var init = function () {
          var success = function (result) {
              console.info('init success result:', result);
              ContentHome.data = result.data;
              if (!ContentHome.data.content.carouselImages)
                editor.loadItems([]);
              else
                editor.loadItems(ContentHome.data.content.carouselImages);
              updateMasterItem(ContentHome.data);
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
                if (tmrDelay)clearTimeout(tmrDelay);
              }
              else if (err && err.code === STATUS_CODE.NOT_FOUND) {
                saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.CONTACT_INFO);
              }
            };
          DataStore.get(TAG_NAMES.CONTACT_INFO).then(success, error);
        };
        init();


        /**
         * link and sortable options
         */
        var linkOptions = {"icon":"true"};
        ContentHome.linksSortableOptions = {
          handle: '> .handle'
        };

        /**
         * add dynamic link
         */
        ContentHome.openAddLinkPopup = function()
        {
          Buildfire.actionItems.showDialog(null, linkOptions, function addLinkCallback(error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (!ContentHome.data.content.links) {
              ContentHome.data.content.links = [];
            }
           if(result===null){
             return console.error('Error:Can not save data, Null record found.');
           }
            ContentHome.data.content.links.push(result);
            $scope.$digest();
          });
        };
        /**
         * open dynamic link popup in edit mode
         */
        ContentHome.openEditLinkPopup = function (link, index) {
          Buildfire.actionItems.showDialog(link, linkOptions, function editLinkCallback(error, result) {
            if (error) {
              return console.error('Error:', error);
            }
            if (!ContentHome.data.content.links) {
              ContentHome.data.content.links = [];
            }
            if(result===null){
              return console.error('Error:Can not save data, Null record found.');
            }
            ContentHome.data.content.links.splice(index, 1, result);
            $scope.$digest();
          });
        };

        /**
         * remove dynamic link
         */
        ContentHome.removeLink = function (index) {
          if (ContentHome.data.content && ContentHome.data.content.links) {
            ContentHome.data.content.links.splice(index, 1);
          }
        };
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
          return ContentHome.data;
        }, saveDataWithDelay, true);

        ContentHome.setLocation = function(data){
          if(!ContentHome.data.content)
            ContentHome.data.content = {};
          ContentHome.data.content.address = {
            type :ADDRESS_TYPE.LOCATION,
            location : data.location,
            location_coordinates : data.coordinates
          };
          $scope.$digest();
        }

      }]);
})(window.angular);
