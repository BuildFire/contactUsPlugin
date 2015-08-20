// This file will hold all logic and data related to map. 

var contactusPluginMap = angular.module('mapModule', []);

/* Map Service */

contactusPluginMap.factory('mapService', function() {
	var geocoder = new google.maps.Geocoder();
	var getAddress = function(latlng, callback) {
		geocoder.geocode({
			'location' : latlng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					console.log(results[0].geometry.location);
					console.log('Address ' + results[1].formatted_address);
					callback(results[1].formatted_address);
				} else {
					// window.alert('No results found');
					// alert('Address was not successful for the following
					// reason: ' + status);
				}
			} else {
				// window.alert('Geocoder failed due to: ' + status);
				// alert('Address was not successful for the following reason: '
				// + status);
			}
		});
	}

	var getLatLong = function(address, callback) {

		geocoder.geocode({
			'address' : address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				console.log(results[0].geometry.location);
				var latLng = {
					"lat" : results[0].geometry.location.lat(),
					"long" : results[0].geometry.location.lng()
				}
				callback(latLng);
			} else {
				// alert('Geocode was not successful for the following reason: '
				// + status);

			}
		});
	}

	return {
		"getAddressByLatLng" : getAddress,
		"getLatLngByAddress" : getLatLong
	}

});

contactusPluginMap
		.directive(
				'mapdirective',
				function(strength, mapService) {

					var link = function(scope, element, attrs) {
						var map, infoWindow;
						var markers = [];
						var latlongobj;
						var title_place;
						var address_place;
						var latlongarray_length;
						var marker;

						var res = strength.get().split(",");
						var infowindow = new google.maps.InfoWindow({
							content : ""
						});

						var lati = res[0];
						var long = res[1];

						var mapOptions = {
							center : new google.maps.LatLng(lati, long),
							zoomControl : false,
							streetViewControl : false,
							mapTypeControl : false,
							zoom : 15,
							mapTypeId : google.maps.MapTypeId.ROADMAP,
							styles : [ {
								featureType : "poi",
								elementType : "all",
								stylers : [ {
									visibility : "off"
								} ]
							} ]

						};

						var getAddress = function(option) {
							mapService
									.getAddressByLatLng(option,
											function(response) {
												if (scope.data && scope.data.content && scope.data.content.address) {
													scope.data.content.address = response;
													infowindow.setContent(scope.data.content.address);
												} else if(scope.data) {
													scope.data.content = {
															"address":response
													};
                                                          
												}else{
													scope.data ={
														"content":{
															"address":response
														}
													}
												}
												scope.$apply();
											});
						}

						function initMap() {
							if (map === void 0) {
								map = new google.maps.Map(element[0],
										mapOptions);

								var flag = new google.maps.MarkerImage(
										"../currentlocation.png");

								marker = new google.maps.Marker({
									position : new google.maps.LatLng(lati,
											long),
									clickable : true,
									// icon:flag,
									draggable : true,
									animation : google.maps.Animation.DROP
								});
								marker.setMap(map);
								google.maps.event.addListener(marker, 'click',
										function() {
											infowindow.open(map, marker);
										});

								google.maps.event
										.addListener(
												marker,
												'dragend',
												function(event) {
													dragEndlat = event.latLng.lat();
													dragEndlong = event.latLng.lng();
													if(!scope.data){
														scope.data = {
																"content":{
																	"locationLat":event.latLng.lat(),
																	 "locationLong": event.latLng.lng()
																}
														}
													}else if(!scope.data.content){
														scope.data.content ={
																	locationLat:event.latLng.lat(),
																	locationLong:event.latLng.lng()
																}	
													}else{
														scope.data.content.locationLat = event.latLng.lat();
														scope.data.content.locationLong = event.latLng.lng();	
													}
													
													// console.log('dragEndlat
													// '+dragEndlat+',
													// dragEndlong
													// '+dragEndlong);
													var latlng = new google.maps.LatLng(dragEndlat,dragEndlong);
													map.setCenter(latlng);
//													map.setZoom(15);
													getAddress(latlng);
													// scope.$dijest();
												});

							}
						}

						function setMarker(title, content) {

							var markerOptions = {
								position : new google.maps.LatLng(lati, long),
								map : map,
								clickable : true,
								draggable : true
							};

							marker = new google.maps.Marker(markerOptions);

							google.maps.event
									.addListener(
											marker,
											'click',
											function() {

												var infoWindowOptions = {
													content : content
												};

												infoWindow = new google.maps.InfoWindow(
														infoWindowOptions);
												infoWindow.open(map, marker);

											});

						}

						scope.$watch(
										'location',
										function() {
											if (scope.location) {
												var res = scope.location
														.split(",");
												var lati = res[0];
												var long = res[1];

												map
														.setCenter(new google.maps.LatLng(
																lati, long));
//												map.setZoom(15);
												marker
														.setPosition(new google.maps.LatLng(
																lati, long));
												if (scope.data
														&& scope.data.content
														&& scope.data.content.address) {
													infowindow
															.setContent(scope.data.content.address);
												}
											}

										});

						initMap();

					}

					return {
						restrict : 'AEC',
						template : '<div id="gmaps"></div>',
						// scope : {location:'='},
						replace : true,

						controller : function($scope) {
							this.setlocation = function(loc) {
								// alert("true");
								$scope.location_map = loc

							}
						},

						link : link

					}

				});

contactusPluginMap
		.directive(
				'googlePlaces',
				function(strength) {
	
	var loc;
	
	return {
						// require : 'mapdirective',
						restrict : 'AEC',
						replace : true,
						// scope : {location:'='},
						template : '<input id="google_place" type ="text" class="form-control" ng-model="data.content.address">',

						// controller :function ($scope){
						//			
						// $scope.ability = [];
						//			
						//			
						// this.getlocation = function(){
						//				
						// return loc;
						// }
						//			
						// },

						link : function($scope, element, attrs) {

							var autocomplete = new google.maps.places.Autocomplete(
									$("#google_place")[0], {});
							google.maps.event
									.addListener(
											autocomplete,
											'place_changed',
											function() {
												var place = autocomplete
														.getPlace();

												$scope.location = place.geometry.location
														.lat()
														+ ','
														+ place.geometry.location
																.lng();
												var address = '';
												if (place.address_components) {
													address = [
															(place.address_components[0]
																	&& place.address_components[0].short_name || ''),
															(place.address_components[1]
																	&& place.address_components[1].short_name || ''),
															(place.address_components[2]
																	&& place.address_components[2].short_name || '') ]
															.join(' ');
												}

												if ($scope.data.content
														&& $scope.data.content.address) {
													$scope.data.content.address = place.name
															+ ',' + address;
													$scope.data.content.locationLat = place.geometry.location
															.lat();
													$scope.data.content.locationLong = place.geometry.location
															.lng();

												} else {
													$scope.data.content = {
														address : place.name
																+ ',' + address
													}
												}

												$scope.$apply();
											});
						}
					}

				});



contactusPluginMap.service('strength', function() {
	var loc = "0,0";
	this.get = function() {
		return loc;
	}
	this.set = function(location) {
		loc = location;
	}
});
