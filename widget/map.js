// This file will hold all logic and data related to map. 

var contactusPluginMap = angular.module('mapModule',[]);

/* Map Service */

contactusPluginMap.factory('mapService',function(){
	 var geocoder = new google.maps.Geocoder();
	var getAddress = function(latlng,callback){
		 geocoder.geocode({'location': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    console.log(results[0].geometry.location);
                    console.log('Address '+results[1].formatted_address);
                    callback(results[1].formatted_address);
                } else {
                    // window.alert('No results found');
                    alert('Address was not successful for the following reason: ' + status);
                }
            } else {
                //window.alert('Geocoder failed due to: ' + status);
                alert('Address was not successful for the following reason: ' + status);
            }
        });
	  }
	
	var getLatLong = function(address,callback){
		
		geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results[0].geometry.location);
                var latLng = {
                		"lat":results[0].geometry.location.lat(),
                		"long":results[0].geometry.location.lng()
                }
                callback(latLng);  
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
              
            }
        });
    }
		
	
	
	return {
		"getAddressByLatLng":getAddress,
		"getLatLngByAddress":getLatLong
	}
	
});

/* directive for map */
contactusPluginMap.directive('mapdirective',function(mapService){
    var link = function(scope,element,attrs){
        
        var map;
        var marker;
        var address;
        var infoWindow;
        var lati = "";
        var long = "";
        var latlng = new google.maps.LatLng(lati,long);
        
        mapService.getLatLngByAddress(scope.query,function(response){
        	
        	lati = response.lat;
        	long = response.long;
        	 latlng = new google.maps.LatLng(lati,long);
        	 marker.setPosition(latlng);
        	map.setCenter(latlng);
        });
       
        scope.$watch("query",function(){
        	mapService.getLatLngByAddress(scope.query,function(response){
            	lati = response.lat;
            	long = response.long;
            	 latlng = new google.maps.LatLng(lati,long);
            	 marker.setPosition(latlng);
            	map.setCenter(latlng);
            });
        });
        
        var mapOptions = {
            center : latlng,
            // center: ll,
            zoom : 16,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(element[0],mapOptions);
        
        marker = new google.maps.Marker({
            position: latlng,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        marker.setMap(map);
        
        scope.markerobj = marker;
        
        var draglat,draglng, dragEndlat, dragEndlong;

        google.maps.event.addListener(marker,'drag',function(event) {
            draglat = event.latLng.lat();
            draglng = event.latLng.lng();
            console.log('draglat '+draglat+', draglng '+draglng);
        });

      var getAddress = function(option){
    	  mapService.getAddressByLatLng(option,function(response){
    		  scope.query = response;
    		  scope.dataForView.content.address = response;
    		  scope.$emit("dataChangedFromMap");
          });
      }
        google.maps.event.addListener(marker,'dragend',function(event) {
            dragEndlat = event.latLng.lat();
            dragEndlong = event.latLng.lng();
            console.log('dragEndlat '+dragEndlat+', dragEndlong '+dragEndlong);
            var latlng = new google.maps.LatLng(dragEndlat, dragEndlong);
            map.setCenter(latlng);
            getAddress(latlng);
        });
    }

    return {
        restrict : 'AEC',
        template : '<div id="lmap"></div>',
        replace : true,
        link : link

    }

});