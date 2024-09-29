'use strict';

(function (angular) {
  angular.module('contactUsPluginContent', ['ngRoute', 'ui.tinymce', 'ui.bootstrap', 'ui.sortable'])
    //injected ngRoute for routing
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'ContentHome',
          controller: 'ContentHomeCtrl',
          resolve: {
            ScriptLoaderService: function (ScriptLoaderService) {
              return ScriptLoaderService.loadScript();
            }
          }

        })
        .otherwise('/');
    }])
    .service('ScriptLoaderService', ['$q', function ($q) {
      this.loadScript = function () {
        const deferred = $q.defer();
        const {apiKeys} = buildfire.getContext();
        const {googleMapKey} = apiKeys;
        const url = `https://maps.googleapis.com/maps/api/js?v=weekly&libraries=places,marker&key=${googleMapKey}`;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        script.onload = function () {
          console.info(`Successfully loaded script: ${url}`);
          deferred.resolve();
        };

        script.onerror = function () {
          console.error(`Failed to load script: ${url}`);
          deferred.reject('Failed to load script.');
        };
        window.gm_authFailure = () => {
          buildfire.dialog.alert({
            title: 'Error',
            message: 'Failed to load Google Maps API.',
          });
          deferred.reject('Failed to load Google Maps API.');
        };

        document.head.appendChild(script);
        return deferred.promise;
      };
    }])
    .filter('getImageUrl', ['Buildfire', function (Buildfire) {
      return function (url, width, height, type) {
        if (type == 'resize')
          return Buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        else
          return Buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
      }
    }])
    .service('VersionCheckService', function() {
      this.parseVersion = function(versionString) {
        const parts = versionString.split('.');
        return parts.map(part => {
          // Separate numeric part and suffix
          const numericPart = part.replace(/\D/g, ''); // Extract the number
          const suffix = part.replace(/\d/g, ''); // Extract non-numeric suffix (e.g., 'beta')

          return {
            number: parseInt(numericPart, 10) || 0,
            suffix: suffix || null
          };
        });
      };

      this.compareVersions = function(currentVersion, requiredVersion) {
        const length = Math.max(currentVersion.length, requiredVersion.length);

        for (let i = 0; i < length; i++) {
          const curr = currentVersion[i] || { number: 0, suffix: null };
          const req = requiredVersion[i] || { number: 0, suffix: null };

          if (curr.number > req.number) return 1;
          if (curr.number < req.number) return -1;

          // Compare suffixes: absence of suffix > presence of suffix (e.g., 3.58.6 > 3.58.6-beta)
          if (curr.suffix && !req.suffix) return -1; // beta is considered lower than stable
          if (!curr.suffix && req.suffix) return 1;
          if (curr.suffix && req.suffix && curr.suffix > req.suffix) return 1;
          if (curr.suffix && req.suffix && curr.suffix < req.suffix) return -1;
        }

        return 0;
      };

      this.isVersionGreaterOrEqual = function() {
        const currentVersionString = google.maps.version;
        const currentVersion = this.parseVersion(currentVersionString);
        const requiredVersion = this.parseVersion('3.60');
        return this.compareVersions(currentVersion, requiredVersion) >= 0;
      };
    })
    .directive('googleLocationSearch', function () {
      return {
        restrict: 'A',
        scope: {setLocationInController: '&callbackFn'},
        link: function (scope, element, attributes) {
          var options = {
            types: ['geocode', 'establishment']
          };
          var autocomplete = new google.maps.places.Autocomplete(element[0], options);
          autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            var location = place.formatted_address;
            if (place.geometry) {
              var coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];
              scope.setLocationInController({
                data: {
                  location: location,
                  coordinates: coordinates
                }
              });
            }
          });
          // fix google places autocomplete dropdown position
          setTimeout(() => {
            const target = document.querySelector('.pac-container');
            if (target) {
              const observer = new MutationObserver(() => {
                document.querySelectorAll('.pac-item span, .pac-item')
                  .forEach((n) => n.classList.add('needsclick'));
                const autocompleteBoundaries = document.getElementById('googleMapAutocomplete').getBoundingClientRect();
                target.style.top = (autocompleteBoundaries.top + autocompleteBoundaries.height )+ 'px';
              });
              observer.observe(target, { childList: true,     attributes: true,
                characterData: true,
              });
            }
            console.log('observer target :', target);
          }, 2000);
        }
      };
    })
    .directive("googleMap", ['VersionCheckService',function (VersionCheckService) {
      return {
        template: "<div></div>",
        replace: true,
        scope: {coordinates: '=',draggedGeoData: '&draggedFn'},
        link: function (scope, elem, attrs) {
          var geocoder = new google.maps.Geocoder();
          var location;
          scope.$watch('coordinates', function (newValue, oldValue) {
            if (newValue) {
              scope.coordinates = newValue;
              if (scope.coordinates.length) {
                const options = {
                  center: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                  streetViewControl: false,
                  mapTypeControl: false,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  mapId:'contentPageMap'
                }
                if (VersionCheckService.isVersionGreaterOrEqual()) {
                  options.cameraControl = false;
                } else {
                  options.zoomControl = false;
                }
                var map = new google.maps.Map(elem[0], options);
                var marker = new google.maps.marker.AdvancedMarkerElement
                ({
                  position: new google.maps.LatLng(scope.coordinates[1], scope.coordinates[0]),
                  map: map,
                  gmpDraggable:true
                });

                var styleOptions = {
                  name: "Report Error Hide Style"
                };
                var MAP_STYLE = [
                  {
                    stylers: [
                      { visibility: "on" }
                    ]
                  }];
                var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
                map.mapTypes.set("Report Error Hide Style", mapType);
                map.setMapTypeId("Report Error Hide Style");
              }
              google.maps.event.addListener(marker, 'dragend', function (event) {
                scope.coordinates = [event.latLng.lng(), event.latLng.lat()];
                geocoder.geocode({
                  latLng: marker.position
                }, function(responses) {
                  if (responses && responses.length > 0) {
                    scope.location  = responses[0].formatted_address;
                    scope.draggedGeoData({
                      data: {
                        location: scope.location,
                        coordinates: scope.coordinates
                      }
                    });
                  } else {
                    location = 'Cannot determine address at this location.';
                  }

                });
             });
            }

          }, true);
        }
      }
    }])
    .directive('ngEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
            var val = $(element).val(),
              regex = /^[0-9\-\., ]+$/g;
            if (regex.test(val)) {
              scope.$apply(function () {
                scope.$eval(attrs.ngEnter);
              });

              event.preventDefault();
            }
          }
        });
      };
    });
})(window.angular);
