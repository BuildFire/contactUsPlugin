'use strict';

(function (angular) {
    angular
        .module('contactUsPluginContent')
        .controller('ContentHomeCtrl', ['$scope', 'Buildfire', 'LAYOUTS', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'ADDRESS_TYPE', 'Utils', '$timeout',
            function ($scope, Buildfire, LAYOUTS, DataStore, TAG_NAMES, STATUS_CODE, ADDRESS_TYPE, Utils, $timeout) {
                var _data = {
                    "content": {
                        "carouselImages": [],
                        "description": '<p>&nbsp;<br></p>',
                        "addressTitle": "",
                        "address": {
                            type:"",
                            location:"",
                            location_coordinates:[]
                        },
                        "links": [],
                        "showMap": false
                    },
                    "design": {
                        "listLayout": LAYOUTS.listLayouts[0].name,
                        "backgroundImage": ""
                    }
                };

               // var initDummyFlag=true;

                //init dummy data
                var _dummyData= {
                    content: {
                        showMap:true,
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
                        description : "<p>With the wysiwyg, you can include text and lists, embed images, embed videos, and link to webpages, emails, phone numbers and more. Check out the tutorial on the wysiwyg for detailed information.</p>",
                        addressTitle:"",
                        address:{
                            type:"Location",
                            location:"501 Pacific Hwy, San Diego, CA 92101, USA",
                            location_coordinates:[-117.17096400000003,32.7100444]
                        },
                        links:[{"title":"Call","action":"callNumber","phoneNumber":"6195551234"},{"title":"Email","action":"sendEmail"}]
                    },
                    design:{
                        listLayout:"Layout_1",
                        backgroundImage:""
                    },
                    default : true
                };
                var ContentHome = this;
                ContentHome.masterData = _dummyData;
//                ContentHome.data = angular.copy(_data);
                ContentHome.validCoordinatesFailure = false;

                // create a new instance of the buildfire carousel editor
                var editor = new Buildfire.components.carousel.editor("#carousel");

                // this method will be called when a new item added to the list
                editor.onAddItems = function (items) {
                    if (!ContentHome.data.content)
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
                  var items = ContentHome.data.content.carouselImages;

                  var tmp = items[oldIndex];

                  if (oldIndex < newIndex) {
                    for (var i = oldIndex + 1; i <= newIndex; i++) {
                      items[i - 1] = items[i];
                    }
                  } else {
                    for (var i = oldIndex - 1; i >= newIndex; i--) {
                      items[i + 1] = items[i];
                    }
                  }
                  items[newIndex] = tmp;

                  ContentHome.data.content.carouselImages = items;
                    $scope.$digest();
                };

                updateMasterItem(_dummyData);

                ContentHome.bodyWYSIWYGOptions = {
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
                        if (result && result.id && result.data) {
                          //  initDummyFlag=false;
                            console.info('init success result:', result);
                            ContentHome.data = result.data;
                            if(!ContentHome.data) {
                                ContentHome.data = angular.copy(_data);
                                $scope.$apply();
                            } else {
                                if (angular.isUndefined(ContentHome.data.content)) {
                                    ContentHome.data = {
                                        "content": {
                                            showMap: true
                                        }
                                    }
                                }
                                if (ContentHome.data.content) {
                                    if (!ContentHome.data.content.carouselImages)
                                        editor.loadItems([]);
                                    else
                                        editor.loadItems(ContentHome.data.content.carouselImages);
                                    if (ContentHome.data.content.address && ContentHome.data.content.address.location) {
                                        ContentHome.currentAddress = ContentHome.data.content.address.location;
                                        ContentHome.currentCoordinates = ContentHome.data.content.address.location_coordinates;
                                    }
                                }
                            }

                            updateMasterItem(ContentHome.data);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        }else{
                            //initDummyFlag=true;
                            ContentHome.data=_dummyData;
                         //   $scope.$digest();
                            if (ContentHome.data.content) {
                                if (!ContentHome.data.content.carouselImages)
                                    editor.loadItems([]);
                                else
                                    editor.loadItems(ContentHome.data.content.carouselImages);
                                if (ContentHome.data.content.address && ContentHome.data.content.address.location) {
                                    ContentHome.currentAddress = ContentHome.data.content.address.location;
                                    ContentHome.currentCoordinates = ContentHome.data.content.address.location_coordinates;
                                }
                            }
                        }
                        }
                        , error = function (err) {
                            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                                console.error('Error while getting data', err);
                                if (tmrDelay)clearTimeout(tmrDelay);
                            }
                        };
                    DataStore.get(TAG_NAMES.CONTACT_INFO).then(success, error);
                };
                init();


                /**
                 * link and sortable options
                 */
                var linkOptions = {"icon": "true"};
                ContentHome.linksSortableOptions = {
                    handle: '> .cursor-grab'
                };

                /**
                 * add dynamic link
                 */
                ContentHome.openAddLinkPopup = function () {
                    Buildfire.actionItems.showDialog(null, linkOptions, function addLinkCallback(error, result) {
                        if (error) {
                            return console.error('Error:', error);
                        }
                        if (!ContentHome.data.content.links) {
                            ContentHome.data.content.links = [];
                        }
                        if (result === null) {
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
                        if (result === null) {
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
                        if(newObj.default){
                            newObj= _data;
                            ContentHome.data=newObj;
                            editor.loadItems([]);
                            ContentHome.currentAddress="";
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

                ContentHome.setLocation = function (data) {
                    console.log('<<<data>>>', data);
                    if (!ContentHome.data.content)
                        ContentHome.data.content = {};
                    ContentHome.data.content.address = {
                        type: ADDRESS_TYPE.LOCATION,
                        location: data.location,
                        location_coordinates: data.coordinates
                    };

                    ContentHome.currentAddress = ContentHome.data.content.address.location;
                    ContentHome.currentCoordinates = ContentHome.data.content.address.location_coordinates;
                    if (!$scope.$$phase)$scope.$digest();
                };
                ContentHome.setDraggedLocation = function (data) {
                    if (!ContentHome.data.content)
                        ContentHome.data.content = {};
                    ContentHome.data.content.address = {
                        type: ADDRESS_TYPE.LOCATION,
                        location: data.location,
                        location_coordinates: data.coordinates
                    };
                    ContentHome.currentAddress = ContentHome.data.content.address.location;
                    ContentHome.currentCoordinates = ContentHome.data.content.address.location_coordinates;
                    if (!$scope.$$phase)$scope.$digest();
                };
                ContentHome.setCoordinates = function () {
                    var latlng = '';
                    console.log('ng-enter---------------------called------------------', ContentHome.currentAddress);
                    function successCallback(resp) {
                        console.log('Successfully validated coordinates-----------', resp);
                        if (resp) {


                            var lat = parseFloat(ContentHome.currentAddress.split(",")[0].trim()),
                                lng = parseFloat(ContentHome.currentAddress.split(",")[1].trim());

                            ContentHome.data.address = {
                                lng: lng,
                                lat: lat,
                                aName: ContentHome.currentAddress
                            };

                            ContentHome.currentAddress = ContentHome.currentAddress;
                            ContentHome.currentCoordinates = [lng, lat];
                            ContentHome.setLocation({location: ContentHome.currentAddress, coordinates: ContentHome.currentCoordinates});
                            if (!$scope.$$phase)$scope.$digest();
                        } else {
                            //errorCallback();
                        }
                    }

                    function errorCallback(err) {
                        console.error('Error while validating coordinates------------', err);
                        ContentHome.validCoordinatesFailure = true;
                        $timeout(function () {
                            ContentHome.validCoordinatesFailure = false;
                        }, 5000);
                    }

                    if (ContentHome.currentAddress) {
                        latlng = ContentHome.currentAddress.split(',')[1] + "," + ContentHome.currentAddress.split(',')[0]
                    }

                    Utils.validLongLats(latlng).then(successCallback, errorCallback);
                };
                ContentHome.clearData = function () {
                    if (!ContentHome.currentAddress) {
                        ContentHome.data.content.address = null;
                        ContentHome.currentCoordinates = null;
                    }
                };

                ContentHome.locationAutocompletePaste = function () {
                    function error() {
                        ContentHome.validCopyAddressFailure = true;
                        $timeout(function () {
                            ContentHome.validCopyAddressFailure = false;
                        }, 5000);

                    }

                    $timeout(function () {
                        if ($(".pac-container .pac-item").length) {
                            console.log('firstResult 1',$(".pac-container .pac-item:first").html());
                            var firstResult = $(".pac-container .pac-item:first").find('.pac-matched').map(function(){
                                    return $(this).text();
                                }).get().join(); // + ', ' + $(".pac-container .pac-item:first").find('span:last').text();
                            console.log('firstResult', firstResult);
                            var geocoder = new google.maps.Geocoder();
                            geocoder.geocode({"address": firstResult}, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    var lat = results[0].geometry.location.lat(),
                                        lng = results[0].geometry.location.lng();
                                    ContentHome.setLocation({location: firstResult, coordinates: [lng, lat]});
                                    $("#googleMapAutocomplete").blur();
                                }
                                else {
                                    error();
                                }
                            });
                        }  else if (ContentHome.currentAddress && ContentHome.currentAddress.split(',').length) {
                            console.log('Location found---------------------', ContentHome.currentAddress.split(',').length, ContentHome.currentAddress.split(','));
                            ContentHome.setCoordinates();
                        }
                        else {
                            error();
                        }
                    }, 500);

                };

            }]);
})(window.angular);
