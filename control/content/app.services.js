'use strict';

(function (angular, buildfire) {
  angular.module('contactUsPluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        getById: function (_id, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        insert: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          if (Array.isArray(_item)) {
            return deferred.reject(new Error({
              code: STATUS_CODE.ITEM_ARRAY_FOUND,
              message: STATUS_MESSAGES.ITEM_ARRAY_FOUND
            }));
          } else {
            Buildfire.datastore.insert(_item, _tagName, false, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
          }
          return deferred.promise;
        },
        update: function (_id, _item, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.update(_id, _item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        save: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        deleteById: function (_id, _tagName) {
          var deferred = $q.defer();
          if (typeof _id == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_ID,
              message: STATUS_MESSAGES.UNDEFINED_ID
            }));
          }
          Buildfire.datastore.delete(_id, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        }
      }
    }])
    .factory("Utils", ['$http', 'GOOGLE_KEYS', '$q', function ($http, GOOGLE_KEYS, $q) {
      function inRange(min, number, max) {
        return ( !isNaN(number) && (number >= min) && (number <= max) );
      }

      return {
        validLongLats: function (longLats) {
          var deferred = $q.defer();
          var longitude = longLats.split(",")[0];
          var latitude = longLats.split(",")[1];
          console.log(longitude, latitude);
          var valid = (inRange(-90, latitude, 90) && inRange(-180, longitude, 180));
          if (valid) {
            $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_KEYS.API_KEY)
              .then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                if(response.data && response.data.results && response.data.results.length) {
                  deferred.resolve(response);
                } else {
                  deferred.resolve(true);
                }
              }, function (error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(error);
              });
          }
          else {
            deferred.resolve(null);
          }
          return deferred.promise;
        }
      }
    }])
    .factory('DefaultInfo', ['LAYOUTS', function(LAYOUTS) {
      return {
        content: {
          carouselImages: [],
          description: '<p>&nbsp;<br></p>',
          addressTitle: '',
          address: {
            type:'',
            location:'',
            location_coordinates: [],
          },
          links: [],
          showMap: false
        },
        design: {
          listLayout: LAYOUTS.listLayouts[0].name,
          backgroundImage: ''
        }
      }
    }])
    .factory('AIStateSeeder', ['DefaultInfo', 'DataStore', 'TAG_NAMES', '$rootScope', function(DefaultInfo, DataStore, TAG_NAMES, $rootScope ) {
      let stateSeederInstance;
      let ContactInfo = DefaultInfo;
      const jsonTemplate = {
        imagesURLs: [],
        description: '',
        phoneNumber: '',
        email: '',
        location: '',
      }

      const getAddress = function(location) {
        return new Promise((resolve) => {
          if (location) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': location}, function(result, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                resolve(
                  {
                    type: 'Location',
                    location: result[0].formatted_address || location,
                    location_coordinates: [result[0].geometry.location.lng(), result[0].geometry.location.lat()] 
                  });
              } else {
                resolve({
                  type: 'Location',
                  location: location,
                  location_coordinates: [] 
                });
              };
            });
          } else {
            resolve(null);
          };
        });
      };

      const parseImageURL = function(url) {
        const optimizedURL = url.replace('1080x720', '100x100'); 
        return new Promise((resolve) => {
          if (url.includes("http")){
            const xhr = new XMLHttpRequest();
            xhr.open("GET", optimizedURL);
            xhr.onerror = (error) => {
              console.warn('provided URL is not a valid image', error);
              resolve('');
            }
            xhr.onload = () => {
              if (xhr.responseURL.includes('source-404') || xhr.status == 404) {
                return resolve('');
              } else {
                return resolve(xhr.responseURL.replace('h=100', 'h=720').replace('w=100', 'w=1080'));
              }
            };
            xhr.send();
          } else resolve('');
        });
      }

      const getCurrentUser = function () {
        return new Promise((resolve, reject) => {
          buildfire.auth.getCurrentUser((err, currentUser) => {
              if (err) reject(err);
              resolve(currentUser);
          });
        });
      }

      const _applyDefaults = function (data) {
        // create HTML div element for the description, to avoid breaking the WYSIWYG
        const descriptionElement = document.createElement('div');
        descriptionElement.innerHTML = data.description || '';
        // default address in case there was no address provided
        let address = {
          type: 'Location',
          location: '501 Pacific Hwy, San Diego, CA 92101, USA',
          location_coordinates: [-117.17096400000003,32.7100444]
        }
        if (data.address) {
          address = data.address;
        }
        if (data.imagesURLs && data.imagesURLs.length) {
          for (let i = 0; i < data.imagesURLs.length; i++) {
            data.imagesURLs[i] = {
              action: 'noAction',
              iconUrl: data.imagesURLs[i],
              title: 'image'
            }
          }
        } else {
          data.imagesURLs = [];
        }

        // add links based on the contact info provided 
        let links = [];
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (data.email && data.email.match(emailRegex)) {
          links.push({
            title: 'Email',
            action:'sendEmail',
            email: data.email,
            subject: 'Contact US',
          });
        }
        if (data.phoneNumber) {
          links.push({
            title:'Call',
            action:'callNumber',
            phoneNumber: data.phoneNumber
          });
        }
        return {
          showMap: true,
          carouselImages: data.imagesURLs,
          description : descriptionElement.outerHTML,
          addressTitle: 'Navigate to Location',
          address: address,
          links: links,
        }
      }

      const handleAIReq = function(err, response) {
        if (
          err ||
          !response ||
          typeof response !== 'object' ||
          !Object.keys(response).length || !response.data
        ) {
          return buildfire.dialog.toast({
            message: 'Bad AI request, please try changing your request.',
            type: 'danger',
          });
        }
        
        let optimizedURLs = [];
        let promises = response.data.imagesURLs.map(url => {
          return parseImageURL(url)
        });

        Promise.allSettled(promises).then(parsingResults => {
          parsingResults.forEach(parsingResult => {
            if (parsingResult.status == 'fulfilled' && parsingResult.value) {
              optimizedURLs.push(parsingResult.value);
            }
          })
          response.data.imagesURLs = optimizedURLs;
          DataStore.get(TAG_NAMES.CONTACT_INFO).then(info => {
            if (info && info.data && Object.keys(info.data).length) {
              ContactInfo = info.data;
            }
            getAddress(response.data.location).then(locationResult => {
              response.data.address = locationResult;
              ContactInfo.content = _applyDefaults(response.data);
              DataStore.save(ContactInfo, TAG_NAMES.CONTACT_INFO).then(() => {
                stateSeederInstance?.requestResult?.complete();
                $rootScope.initContentHome();
              }).catch(err => {
                stateSeederInstance?.requestResult?.complete();
                console.warn('error saving data to datastore', err);
                return buildfire.dialog.toast({
                  message: 'Something went wrong, try again later.',
                  type: 'danger',
                });
              });
            });
          }).catch(err => {
            stateSeederInstance?.requestResult?.complete();
            console.warn('error getting data from datastore', err);
            return buildfire.dialog.toast({
              message: 'Something went wrong, try again later.',
              type: 'danger',
            });
          });
        });
      };

      return {
        initStateSeeder: function() {
          getCurrentUser().then(user => {
            stateSeederInstance = new buildfire.components.aiStateSeeder({
              generateOptions: {
              userMessage: `Generate a contact us information related to [business-type] located in [target-region].\nFor phone number use [+1 555 555-1234].\nFor email use [${user?.email || ''}].`,
              maxRecords: 5,
              systemMessage:
                  'images are two 1080x720 images URLs related to location, use source.unsplash.com for images, URL should not have premium_photo or source.unsplash.com/random. return description as HTML',
              jsonTemplate: jsonTemplate,
              callback: handleAIReq.bind(this),
              hintText: 'Replace values between brackets to match your requirements.',
              },
          }).smartShowEmptyState();
          });
        return true;
        },
      }
    }])
})(window.angular, window.buildfire);