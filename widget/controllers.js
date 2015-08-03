/**
 * Created by abhay on 31/7/15.
 */

var textPluginApp = angular.module('widgetappmod', ['ui.bootstrap']);

textPluginApp.controller('contactusPluginCtrl', ['$rootScope','$scope','$location','widgetservice' ,function ($rootScope,$scope,$location,widgetservice) {
	var dataDefault = {

		array:[

			{
				image_linkstatus:null,
				image_src:null,
				image_title:null,
				imageurl:null,
				openinapp:false
			}
		],

		content:{
			address:null,
			addresstitle:null,
			bgUrl:null,
			bodyclass:null,
			checkboxMode:true
		},

		design:{
			bgUrl:null,
			layout : "layout1"
		},

	};

	$scope.changeLocation = function(data){
      var path = window.location.href;
      path = path.split("#");
      window.location.href = path[0] +"#/"+ data;
  }

// Getting all data from buildfire API	
  $scope.getData = function(){
	  buildfire.datastore.get(function (err, result) {
          if(result) {

	            widgetservice  = result.data;
	            $scope.query = widgetservice.content.address;
	            $scope.changeLocation(widgetservice.design.layout);
	            $scope.codeAddress();
	            $scope.$broadcast("dataUpdated",result.data);
	            $scope.$digest();
	        }else{
			  $scope.saveData(dataDefault);
		  }
	    });  
  } 
  
  $scope.getData();
  /* Listen in if an update occurred on the control panel  */
  $scope.updatedData = function(){
	 buildfire.datastore.onUpdate(function (newObj) {
	     console.log(newObj);
		 $scope.data = newObj.obj;
	      $scope.query = $scope.data.content.address;
	      
	      $scope.codeAddress();
	      if( newObj.obj.design){
	      	$scope.changeLocation(newObj.obj.design.layout);
	      }
	      $scope.$broadcast("dataUpdated",newObj.obj);
	      $scope.$digest();
	  }); 
 }
  
 $scope.updatedData();
    /*here geocding  */
   
    $scope.codeAddress = function() {
      $scope.query;
    }
    
    // save data
    
    $scope.saveData = function(newObj){
       
        if(newObj == undefined)return;


        buildfire.datastore.save(newObj, function (err, result) {
            if (err || !result)
                alert(err);
            else
                console.log('data saved');
        });
    };
    
    
	
    
    buildfire.analytics.trackAction('widget loaded',{userid:2});
}]);



textPluginApp.controller('layout1Ctrl', ['$scope','$location','widgetservice' ,function ($scope,$location,widgetservice) {

	$scope.setData = function(option){
		$scope.dataForView  = option;	
	}
	
	if(widgetservice){
		$scope.setData(widgetservice);
	}else{
		$scope.getData();
	}
	
	$scope.$on("dataUpdated",function(e,data){
	//	alert("data updated");
		$scope.setData(data);
	});
	
	$scope.$on("dataChangedFromMap",function(){
		    var dataToBeSave = angular.copy($scope.dataForView); 
			$scope.saveData(dataToBeSave);
    });
	
}]);




textPluginApp.controller('layout2ctrl',function($scope,widgetservice){


		$scope.setData = function(option){
				$scope.dataForView  = option;
			    var length = $scope.dataForView.array.length;
			    var tempThumbnailList = $scope.dataForView.array;
			    $scope.thumbnailList = [];
			    var y ;
			    while(tempThumbnailList.length > 0){
			        y =  tempThumbnailList.splice(0,3);
			        $scope.thumbnailList.push(y);
			    }
		}
		
		if(widgetservice){
			$scope.setData(widgetservice);
		}else{
			$scope.getData();
		}
		
		$scope.$on("dataUpdated",function(e,data){
					$scope.setData(data);
		});
		
		$scope.$on("dataChangedFromMap",function(){
		    var dataToBeSave = angular.copy($scope.dataForView); 
			$scope.saveData(dataToBeSave);
		});
		
});

textPluginApp.directive("openLink",function(){
	//app.newsFeed
	return {
		restrict:"AE",
		link: function(scope,element,attrs){
		  
		  element.on("click",function(){
			  var  ref = window.open(attrs.openLink,"_blank");
//			 var  ref = window.open(attrs.openLink, '_blank', 'location=yes');
		  });	
		}	
	};
	
})
